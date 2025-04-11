from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from loguru import logger
from typing import Optional
from datetime import datetime
import tempfile
import os


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
    allow_origins=["https://medscribe-three.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600
)

# ========== Models ==========

class TranscriptRequest(BaseModel):
    transcript: str

# ========== Startup & Shutdown Events ==========

@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down")

# ========== Routes ==========

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):  # Changed parameter name to match frontend
    try:
        logger.info(f"Received audio file: {audio.filename}")

        # Validate file type
        valid_extensions = {'.mp3', '.wav', '.m4a', '.ogg'}
        file_ext = os.path.splitext(audio.filename or '')[1].lower()
        if file_ext not in valid_extensions:
            logger.warning(f"Invalid file type: {file_ext}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Supported types: {', '.join(valid_extensions)}"
            )

        # Validate file size
        max_size = 25 * 1024 * 1024  # 25MB
        file_size = 0
        temp_path = None
        
        try:
            # Create temp file
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_audio:
                # Read in chunks to get size and save simultaneously
                while content := await audio.read(1024 * 1024):  # 1MB chunks
                    file_size += len(content)
                    if file_size > max_size:
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail="File too large. Max size: 25MB"
                        )
                    temp_audio.write(content)
                temp_path = temp_audio.name
                
            logger.debug(f"Saved temp file: {temp_path}")

            # Initialize Groq client
            client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            logger.debug("Groq client initialized successfully")

            # Transcribe audio
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
            # Clean up temp file
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

# ========== Core Logic ==========
def generate_prescription(transcript: str) -> str:
    try:
        logger.info("Generating prescription...")
        
        # Validate transcript content
        if not transcript or not transcript.strip():
            return ("⚠️ No conversation detected. Please ensure:\n"
                   "1. The audio was recorded properly\n"
                   "2. The consultation contained clear medical discussion\n"
                   "3. Background noise wasn't too loud\n\n"
                   "Try recording again or upload a different file.")
        
        # Check for minimum meaningful content
        if len(transcript.split()) < 10:  # Less than 10 words
            return ("⚠️ Insufficient medical conversation detected. Found only:\n\n"
                   f"'{transcript.strip()}'\n\n"
                   "Please verify the audio quality and ensure it contains "
                   "a complete doctor-patient consultation.")
        
        llama_4 = ChatGroq(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.3,  # Lower temperature for more factual responses
            max_tokens=512,
        )

        SYSTEM_PROMPT = """You are a meticulous medical AI that generates prescriptions ONLY from explicit clinical conversations. Follow these rules:

1. NEVER invent patient details, medications, or diagnoses
2. If information is missing, leave the field blank
3. Flag inconsistencies clearly
4. Use exact terminology from the conversation

--- PRESCRIPTION TEMPLATE ---

Patient Name: [ONLY if mentioned explicitly]

UHID: ___________________
Age/Sex: [ONLY if specified]
Date: {current_date}
Doctor: [If mentioned]

### Chief Complaints
{Extract ONLY if the patient describes symptoms}

### Observations
{Blood pressure, temperature etc. ONLY if measured}

### Diagnosis
{ONLY if the doctor states a diagnosis}

### Medications
| Drug Name | Dose | Frequency | Duration |
|-----------|------|-----------|----------|
{List ONLY medications with complete details}

### Follow-up
{ONLY if specified}

--- RULES ---
* If the conversation doesn't contain medical information, return:
  "❌ No clinical content found. This appears to be: [brief reason]"
* If medication details are incomplete, add: 
  "⚠️ Verify: [drug name] requires dosage/frequency"
* Never guess allergies or medical history

--- TRANSCRIPT ---
{transcript}
""".format(current_date=datetime.now().strftime("%Y-%m-%d"))

        prompt_template = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "{transcript}")
        ])

        prompt_value = prompt_template.format_messages(transcript=transcript)
        response = llama_4.invoke(prompt_value)
        
        # Post-process response for safety
        response_text = response.content
        if "unknown" in response_text.lower() or "not mentioned" in response_text.lower():
            response_text += "\n\n⚠️ NOTE: Incomplete prescription - verify all blank fields with the patient"
        
        logger.success("Prescription generated with validation checks")
        return response_text

    except Exception as e:
        logger.error(f"Prescription generation failed: {str(e)}")
        return ("🚨 Critical Error: Failed to process prescription\n"
                "Technical Details: {str(e)}\n\n"
                "Please try again or contact support")
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
