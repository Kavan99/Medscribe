from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
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
                "text": """You are an AI assistant specialized in medical‐record analysis. A handwritten prescription image (provided separately) is attached. Your job is to extract every possible detail and present it in a clear, structured format. Follow these instructions exactly:

1. Patient & Visit Details
   - Patient Name: _______
   - Age/Sex: _______
   - Date (DD Month YYYY): _______
   - Doctor Name: _______
   - Clinic/Hospital: _______
   - UHID or Medical Record No. (if present): _______
   - Chief Complaint (as written by doctor): _______

2. Diagnosis / Clinical Notes
   - Transcribe any diagnosis, ICD codes, or clinical impressions.
   - Expand all abbreviations (e.g., “HTN” → “Hypertension,” “T2DM” → “Type 2 Diabetes Mellitus”).
   - If any shorthand or “doctor lingo” appears (for example, “SOB,” “PRN,” “TID”), put the original term in quotes and immediately follow with a brief explanation in parentheses.
   - Example:
     - Diagnosed Condition: “HTN” (Hypertension)

3. Medications
   Create a Markdown table listing each medication exactly as written (but correct obvious spelling mistakes using known drug database conventions). The table columns should be:

   | Medication Name (Generic) | Dosage (mg/mL) | Form (tablet, syrup, etc.) | Frequency | Duration |
   |:-------------------------:|:--------------:|:--------------------------:|:---------:|:--------:|
   |                           |                |                            |           |          |
   |                           |                |                            |           |          |

   - Medication Name (Generic):
     - If the prescription uses a brand name, include the brand name in brackets after the generic name.
     - Correct any spelling mistakes by referencing standard pharmacopeia spelling (e.g., “Metphormin” → “Metformin”).
   - Dosage: always in mg or mL. If only shorthand appears (e.g., “500 mg” or “½ tab”), normalize to “500 mg” or “250 mg,” etc.
   - Form: tablet, capsule, syrup, injection, ointment, etc.
   - Frequency: e.g., “TID” (three times a day), “BD” (twice daily). Write both shorthand and full form in parentheses.
   - Duration: “5 days,” “7 days,” “30 days,” etc.

4. Non-Medication Instructions
   - Note any lab tests ordered (e.g., “HbA1c in 3 months”).
   - Lifestyle or diet advice (e.g., “Low-sodium diet,” “Exercise 30 minutes daily”).
   - Follow-up instructions (e.g., “Review in 2 weeks,” “Call if symptoms worsen”).

5. Allergies
   - If the prescription notes any allergies (“NKDA” or “Penicillin allergy”), state them.
   - Expand “NKDA” as “No Known Drug Allergies.”

6. Vitals & Measurements
   - If any vitals are scribbled (e.g., “BP 140/90,” “HR 82 bpm”), list them here.
   - Example:
     - Blood Pressure: 140/90 mm Hg
     - Heart Rate: 82 bpm

7. Abbreviations & Technical Terms Explained
   - At the end of your output, include a section titled “Abbreviations & Technical Terms Explained.”
   - List every abbreviation or piece of doctor shorthand you saw (e.g., “PRN,” “q4h,” “qHS,” “OTC,” “↑,” “↓”).
   - Explain each in parentheses.
   - Example:
     - PRN (“pro re nata,” meaning “as needed”)
     - qHS (“quaque hora somni,” meaning “every bedtime”)

8. Error & Safety Flags
   After you finish the structured extraction, review the following for potential issues. If any are found, put a “⚠️ Flag” marker before the line. If none are present, write “No obvious errors detected.” Possible issues include:
   - ⚠️ Overdose Risk: Total daily dosage exceeds standard maximum for that drug.
   - ⚠️ Drug–Disease Contraindication: E.g., prescribing a beta‐blocker (e.g., “Propranolol”) when there’s an asthmatic note.
   - ⚠️ Drug–Drug Interaction: E.g., “Warfarin” + “NSAIDs” (increases bleeding risk).
   - ⚠️ Wrong Medication: If the medication does not match the listed diagnosis (e.g., “Insulin” for a patient with no diabetes).
   - ⚠️ Duplicate Therapy: Two drugs from the same class (e.g., “Lisinopril” + “Enalapril” together).
   - ⚠️ Missing Information: If critical fields (e.g., dosage or frequency) are unreadable or missing, mark as “⚠️ Missing [Field Name].”
   - ⚠️ Allergy Conflict: E.g., prescribing “Amoxicillin” when patient has “Penicillin allergy” noted.

9. Maximum Detail Extraction
   - If anything in the handwriting is unclear, make a “best guess” and mark it as “(uncertain)” or “(possible).”
   - If multiple readings are possible (e.g., “25 mg” vs. “2.5 mg”), list both possibilities with “/(possible)” and explain.
   - If there are any scribbles or stray marks that might be text, mention “Unreadable scribble here—could be [text estimate].”"""
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

        mistral_large = ChatMistralAI(
            model_name="mistral-small-latest",
            api_key=os.getenv("MISTRAL_API_KEY"),
            temperature=0.3
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

        response = mistral_large.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=transcript)
        ])
        return response.content

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

