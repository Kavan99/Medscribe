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
