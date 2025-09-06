from fastapi import FastAPI, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from langchain_mistralai import ChatMistralAI
from langchain_google_genai import ChatGoogleGenerativeAI
import os, torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from langchain_huggingface import HuggingFacePipeline, ChatHuggingFace
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
from loguru import logger
import tempfile
import os
import base64
import torch
from pathlib import Path


load_dotenv()


logger.add(
    "app.log",
    rotation="10 MB",
    retention="7 days",
    level="DEBUG",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)
GEMINI_API_KEY = "AIzaSyDdbX0U-yob4NLKFUX32JQxakfbQs1YaNU"
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

            client = Groq(api_key="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")
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
                model="gemini-2.5-flash",
                api_key = GEMINI_API_KEY,
                temperature=0.3
            )
            
            # Send to Gemini with prompt to describe the prescription
            response = gemini.invoke([
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": """You are an AI assistant specialized in medical-record analysis. A handwritten prescription image (provided separately) is attached. Your task is to extract every possible detail, presenting the information in a clear, structured format, with maximized clinical completeness and insightful context-driven inference.

Instructions:

Extract Every Detail, Infer When Needed

For every field (patient details, diagnosis, medications, instructions, allergies, vitals), extract the information as written.

If any information is missing but can be reasonably inferred based on the context of the document, standard prescription conventions, or closely related details elsewhere in the prescription, provide the best possible inference.

Clearly label such entries as “(inferred)”—for example:

“Metformin 500mg (inferred from context; dosage not explicitly written)”

If a detail is extremely unclear or ambiguous even after best effort, write “Unclear” for that field, and if possible, provide your best guess in parentheses—for example:

“Medication Name: Unclear (possible ‘Metformin’ based on context)”

Do Not Leave Blanks

Every section/field should be filled either with the extracted detail, your best inference (marked as such), or the word “Unclear.”

Explicit Table and Structured Output

For medications and other structured data, use the table format below.

If any column can be inferred, fill it in and mark as “(inferred)”; if truly unclear, write “Unclear.”

Medication Name (Generic)	Dosage (mg/mL)	Form	Frequency	Duration
Expanded Details & Explanations

Expand (and explain) all abbreviations, shorthands, or doctor lingo.

Include an “Abbreviations & Technical Terms Explained” section at the end.

Maximum Detail Extraction

If handwriting or field is ambiguous, provide every plausible reading, clearly marking “(possible)” or “(uncertain)” as needed, with brief explanation for each.

Mention stray or unreadable marks only if they could plausibly relate to clinical content; otherwise ignore them.

Error & Safety Flags

Review the extracted/inferred details for safety or clinical risks as before.

Mark any flags only if they are present or suggested by the inferred details.

Key Instructions:

Extract everything written.

Infer everything that can plausibly be inferred from context, marking as “(inferred)” or “(uncertain).”

If utterly ambiguous, write “Unclear.”

Do not leave any field blank."""
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
#             os.environ["HUGGINGFACEHUB_API_TOKEN"] = os.getenv("HUGGINGFACEHUB_API_TOKEN", "YOUR_HF_TOKEN")
#             # Initialize the model and tokenizer
#             MODEL_ID = "medgemma-27b-it "
#             dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float32
#             tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, use_fast=True)
#             model = AutoModelForCausalLM.from_pretrained(
#                 MODEL_ID,
#                 torch_dtype=dtype,
#                 device_map="auto",
#             )
            
#             gen_pipe = pipeline(
#                 task="text-generation",
#                 model=model,
#                 tokenizer=tokenizer,
#                 max_new_tokens=8192,
#                 do_sample=True,
#                 temperature=0.2,
#                 top_p=0.9,
#                 return_full_text=False,
#             )
#             llm = HuggingFacePipeline(pipeline=gen_pipe)

#             # Optional: Chat wrapper (lets you pass LC chat messages)
#             chat = ChatHuggingFace(llm=llm)
#             SYSTEM_PROMPT = """You are a senior medical AI assistant and clinical auditor. Your job is to take the structured output below (generated by another AI from a prescription image) and perform the following five tasks meticulously:

# Medical Accuracy Audit:

# Verify all medical details (patient demographics, complaints, diagnosis, medications, clinical notes, instructions, allergies, vitals) for logical and clinical accuracy.

# Ensure consistency between complaints, diagnosis, and prescribed medications.

# Error Identification & Correction:

# Flag (with "⚠") and clearly correct any errors, inconsistencies, or missing information in the extracted data, including but not limited to:

# Incorrect, misspelled, or nonstandard medicine names and dosages.

# Implausible dosages or medication instructions.

# Errors in diagnosis, technical terms, frequency, duration, form, or instructions.

# Unexplained abbreviations or technical shortcuts.

# Suggest medically appropriate corrections using current clinical guidelines.

# Explanations & Clarifications:

# Expand, explain, and correct all abbreviations and shorthand, ensuring every technical term is addressed in an “Abbreviations & Technical Terms Explained” section.

# If any clinical judgment, term, or step may be misunderstood, include a brief explanation in parentheses.

# Completeness & Safety Review:

# Ensure all critical fields are filled with plausible data or clearly marked as “Missing” with a flag.

# Highlight (with "⚠") any safety, allergy, drug drug, or drug disease contraindications, double therapies, or questionable prescriptions, with a brief justification for each flag.

# Standardized Output Enhancement:

# Format your response as a fully structured and corrected clinical document.

# Maintain the original sections and Markdown tables, but incorporate all corrections and clarifications you have made.

# At the end, briefly summarize the number and types of errors or flags found."""
#             message =[
#                 SystemMessage(content=SYSTEM_PROMPT),
#                 HumanMessage(content=response.content)
#             ]
#             result = chat.invoke(message)
            
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
    return {"message": "Hello from Medscribe ka backend!"}


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

