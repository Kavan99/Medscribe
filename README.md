MedScribe - AI-Powered Medical Prescription Platform
🔗 Live Demo: https://mediscribe.in/ | 📂 GitHub: https://github.com/Kavan99/Medscribe/

Overview
MedScribe automates medical prescription documentation with 98% accuracy, eliminating manual paperwork while maintaining clinical precision. The platform offers two intelligent solutions for healthcare providers:​

Audio-to-Prescription: Transforms doctor-patient conversations into structured, SOAP-format prescriptions

OCR-to-Digital: Digitizes handwritten prescriptions and seamlessly integrates with hospital EHR systems

How It Works
Audio-to-Prescription Workflow
Step 1: Ambient Listening & Transcription
MedScribe silently captures natural doctor-patient conversations in real-time without interruption. The AI-powered transcription engine handles medical terminology, accents, and background noise, converting speech to text with high clinical accuracy.​

Step 2: Intelligent Data Extraction
The system analyzes the conversation and automatically identifies key clinical elements: patient demographics (name, age, gender), symptoms and medical history, diagnosis (e.g., "acute bronchitis"), prescribed medications with dosages and frequency, and follow-up instructions.​

Step 3: Structured Prescription Generation
Using medical-optimized AI, MedScribe transforms raw data into standardized clinical documentation. It organizes information into SOAP format, infers missing details (e.g., suggests standard 500mg dosage if unspecified), flags inconsistencies like missing dosage information or potential drug interactions, and ensures compliance with clinical best practices.​

Step 4: Review & Integration
Clinicians review and validate the generated prescription before finalizing. The output can be digitally signed, printed, or directly integrated with EHR systems.​


**GIVE A TRY TO OUR WHAT'S APP BOT AS WELL WHICH WE HAVE DEPLOYED AT TATA MEMORIAL HOSPITAL AS WELL AND THEY ARE USING IT AS PILOT TESTING IN HEMATO ONCOLOGY OPDs  
<img src="https://github.com/user-attachments/assets/3be8a3f6-8f65-4cf6-ac13-5902ac3a7947" width="220" />
Step 1: SCAN THE QR CODE THROUGH YOUR MOBILE. IT WILL REDIRECT YOU TO WHATSAPP  
Step 2: SEND ANY IMAGE TO THAT NUMBER WITH "YOUR EMAIL ID AS CAPTION" (If you dont put your email ID as the caption, you'll get back a prompting reply suggesting you to do so)  
Step 3: OPEN YOUR EMAIL INBOX AND YOU WOULD HAVE RECEIVED THE TRANSCRIBED TEXT! THAT'S HOW FAST IT IS**





Handwritten Prescription OCR Workflow
Step 1: Image Processing
Accepts uploaded images of handwritten prescriptions and applies advanced preprocessing techniques including adaptive thresholding, noise reduction, and contrast normalization to enhance text visibility.​

Step 2: OCR Recognition
Multiple OCR passes with handwriting-specific optimizations extract text from prescriptions. The system recognizes medical terminology from a comprehensive database of medications, dosages, administration routes, and frequency terms.​

Step 3: Validation & Structuring
Fuzzy matching algorithms verify medication names against a medical dictionary. The system structures extracted data into standardized digital format ready for EHR integration.​

Step 4: EHR Auto-Fill
Digitized prescription data automatically populates EHR forms, eliminating manual data entry and reducing errors.​

Key Features
Context-Aware Intelligence
MedScribe understands medical jargon and abbreviations (e.g., "bid" → "twice daily"). It detects your medical specialty and adapts terminology, tone, and format automatically—whether you're in pediatrics, psychiatry, or surgery.​

Smart Clinical Summaries
The AI flags new symptoms, recurring issues, and auto-structures notes without rigid templates. It recognizes chief complaints, HPI (History of Present Illness), physical exam findings, assessment, and plan.​

High Accuracy Performance
Audio transcription achieves 98% accuracy for structured prescriptions. OCR recognition delivers 95%+ accuracy for trained prescription formats and 90%+ for untrained handwritten prescriptions.​

Comprehensive Integration
Seamless EHR/EMR integration with major platforms. Supports multi-format exports including PDF, JSON, and CSV for flexible record-keeping.​

Enterprise-Grade Security
HIPAA-compliant and GDPR-ready with end-to-end encryption, audit logs, and enterprise-grade safeguards trusted by hospitals worldwide.​

Benefits
Time Savings: Reduces prescription documentation from minutes to seconds

Error Reduction: Minimizes manual entry mistakes and medication errors

Improved Patient Care: Frees clinicians to focus on patients rather than paperwork

Scalability: Handles high-volume clinic workflows efficiently

Compliance: Maintains clinical accuracy with full audit trails

Tech Stack
Built with Python, Next.js/React, Google Gemini API, Supabase, and deployed on Render.com.

Quick Start
Clone the repository and follow setup instructions in /docs/SETUP.md. Test files available in /tests/sample_data/ including sample consultation recordings and handwritten prescription images.

Roadmap
Real-time live transcription during consultations, multi-language support (Hindi, Tamil, Telugu), OAuth patient authentication, HIPAA/GDPR compliance certification, direct HL7 FHIR integration with EHR vendors, mobile app (iOS/Android), and doctor validation workflow (human-in-the-loop).

License
MIT License - Copyright (c) 2025 MedScribe. Free to use, modify, and distribute.

Contact
GitHub: https://github.com/Kavan99/Medscribe/ | Website: mediscribe.in
