from google.cloud import vision
from app.core.config import settings
from app.schema.application_schema import ApplicationSchema
import re

vision_client = vision.ImageAnnotatorClient()

def extract_text_from_document(document_url: str) -> str:
    # HUMAN ASSISTANCE NEEDED
    # This function needs review to ensure proper error handling and optimization
    image = vision.Image()
    image.source.image_uri = document_url
    
    response = vision_client.document_text_detection(image=image)
    
    if response.error.message:
        raise Exception(f"Error in OCR process: {response.error.message}")
    
    full_text = ""
    for page in response.full_text_annotation.pages:
        for block in page.blocks:
            for paragraph in block.paragraphs:
                for word in paragraph.words:
                    full_text += ''.join([symbol.text for symbol in word.symbols])
                full_text += ' '
    
    return full_text.strip()

def parse_application_data(extracted_text: str) -> ApplicationSchema:
    # HUMAN ASSISTANCE NEEDED
    # This function requires more sophisticated parsing logic and validation
    # The current implementation is basic and may not cover all scenarios
    application = ApplicationSchema()
    
    # Example regex patterns (these need to be expanded and refined)
    name_pattern = r"Name:\s*([\w\s]+)"
    email_pattern = r"Email:\s*([\w\.-]+@[\w\.-]+)"
    phone_pattern = r"Phone:\s*(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})"
    
    name_match = re.search(name_pattern, extracted_text)
    email_match = re.search(email_pattern, extracted_text)
    phone_match = re.search(phone_pattern, extracted_text)
    
    if name_match:
        application.name = name_match.group(1).strip()
    if email_match:
        application.email = email_match.group(1)
    if phone_match:
        application.phone = phone_match.group(1)
    
    # Add more field extractions here
    
    # Validate extracted data
    if not application.name or not application.email:
        raise ValueError("Unable to extract required fields from the document")
    
    return application