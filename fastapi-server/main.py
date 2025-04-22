from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from chainlit.utils import mount_chainlit
from dotenv import load_dotenv
from loguru import logger
from typing import Optional
from datetime import datetime
import tempfile
import os
import base64
import json
from mistralai import Mistral, ImageURLChunk
from pathlib import Path


load_dotenv()


logger.add(
    "app.log",
    rotation="10 MB",
    retention="7 days",
    level="DEBUG",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.mediscribe.in",
        "https://mediscribe.in",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranscriptRequest(BaseModel):
    transcript: str


@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down")


@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    try:
        logger.info(f"Received audio file: {audio.filename}")

        valid_extensions = {'.mp3', '.wav', '.m4a', '.ogg'}
        file_ext = os.path.splitext(audio.filename or '')[1].lower()
        if file_ext not in valid_extensions:
            logger.warning(f"Invalid file type: {file_ext}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Supported types: {', '.join(valid_extensions)}"
            )

        max_size = 25 * 1024 * 1024
        file_size = 0
        temp_path = None
        
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_audio:
                while content := await audio.read(1024 * 1024):
                    file_size += len(content)
                    if file_size > max_size:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="File too large. Max size: 25MB"
                        )
                    temp_audio.write(content)
                temp_path = temp_audio.name
                
            logger.debug(f"Saved temp file: {temp_path}")

            client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            logger.debug("Groq client initialized successfully")

            with open(temp_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    file=audio_file,
                    model="whisper-large-v3-turbo",
                    response_format="verbose_json",
                    language="en",
                    temperature=0.0
                )
                
            return {"transcription": transcription.text}

        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Transcription failed: {str(e)}"
            )
            
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                    logger.debug(f"Deleted temp file: {temp_path}")
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.critical(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@app.post("/ocr-prescription")
async def ocr_prescription(image: UploadFile = File(...)):
    try:
        logger.info(f"Received image file for OCR: {image.filename}")

        # Validate file type
        valid_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        file_ext = os.path.splitext(image.filename or '')[1].lower()
        if file_ext not in valid_extensions:
            logger.warning(f"Invalid image file type: {file_ext}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Supported types: {', '.join(valid_extensions)}"
            )

        # Check file size
        max_size = 10 * 1024 * 1024  # 10MB limit
        file_size = 0
        temp_path = None
        
        try:
            # Save uploaded file to temp location
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_img:
                while content := await image.read(1024 * 1024):
                    file_size += len(content)
                    if file_size > max_size:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="File too large. Max size: 10MB"
                        )
                    temp_img.write(content)
                temp_path = temp_img.name
                
            logger.debug(f"Saved temp image file: {temp_path}")

            # Create Path object for image file
            image_file = Path(temp_path)
            assert image_file.is_file()

            # Encode image as base64
            image_data = base64.b64encode(image_file.read_bytes()).decode()
            
            # Initialize Gemini model (removed JSON mode)
            gemini = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                api_key=os.getenv("GOOGLE_API_KEY"),
                temperature=0.3
            )
            
            # Send to Gemini with prompt to describe the prescription
            response = gemini.invoke([
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe in detail what the prescription says. Include all medications, dosages, and instructions."
                        },
                        {
                            "type": "image_url",
                            "image_url": f"data:image/jpeg;base64,{image_data}"
                        }
                    ]
                }
            ])

            # Print the raw response content to console
            print("Model Response:")
            print(response.content)
            
            # Return the raw response content to the client
            return {"response": response.content}

        except Exception as e:
            logger.error(f"OCR processing error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"OCR processing failed: {str(e)}"
            )
            
        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                    logger.debug(f"Deleted temp file: {temp_path}")
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {str(e)}")

    except HTTPException:
        raise
    except Exception as e:
        logger.critical(f"Unexpected error in OCR processing: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@app.get("/")
def read_root():
    return {"message": "Hello from Medscribe backend!"}


@app.post("/generate-prescription")
async def generate_prescription_endpoint(request: TranscriptRequest):
    try:
        logger.info("Received prescription generation request")

        if not request.transcript.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Transcript cannot be empty")

        prescription = generate_prescription(request.transcript)
        logger.debug(f"Prescription snippet: {prescription[:100]}...")
        return {"prescription": prescription}

    except RuntimeError as e:
        logger.error(f"Prescription generation error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=str(e))
    except Exception as e:
        logger.critical(f"Unexpected prescription error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Unexpected error: {str(e)}")


def generate_prescription(transcript: str) -> str:
    try:
        logger.info("Generating prescription...")

        llama_4 = ChatGroq(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.7,
            max_tokens=512,
        )

        SYSTEM_PROMPT = """
You are an AI assistant for medical professionals. Based on the doctor-patient conversation below, generate a structured clinical prescription.

--- CLINICAL PRESCRIPTION ---

Patient Name: [Extracted Name or "Unknown Patient"]

UHID: ___________________
Age/Sex: [Extracted Age/Gender or "Adult/Unknown"]
Bill Date: [Today's Date]
Doctor Name: [Doctor's Name or "Attending Physician"]
Facility Name: [Facility Name or "Medical Clinic"]

### Chief Complaints
{{EXTRACTED_SYMPTOMS}}

### Past Medical History
{{EXTRACTED_MEDICAL_HISTORY}}

### Allergies
{{EXTRACTED_ALLERGIES}}

### Vitals
- Heart Rate: {{EXTRACTED_HEART_RATE}}
- Blood Pressure:...
"""
        return llama_4.invoke(transcript, system=SYSTEM_PROMPT)

    except Exception as e:
        logger.error(f"Error generating prescription: {str(e)}")
        raise RuntimeError("Prescription generation failed.")


@app.get("/app")
def read_main():
    return {"message": "Hello World from main app"}
mount_chainlit(app=app, target="chat_interface.py", path="/chat")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
