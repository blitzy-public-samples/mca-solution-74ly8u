from celery import Celery
from app.core.config import settings
from app.services.email_processor import process_emails
from app.services.document_classifier import classify_document
from app.services.ocr_service import extract_text_from_document, parse_application_data
from app.services.webhook_service import send_webhook_notification
from app.db.models import Application, Document
from app.db.database import SessionLocal

celery_app = Celery('mca_processor', broker=settings.CELERY_BROKER_URL)

@celery_app.task
def process_new_applications():
    # HUMAN ASSISTANCE NEEDED
    # This function needs review for production readiness
    processed_ids = []
    new_applications = process_emails()
    
    db = SessionLocal()
    try:
        for app_data in new_applications:
            new_app = Application(**app_data)
            db.add(new_app)
            db.commit()
            db.refresh(new_app)
            processed_ids.append(new_app.id)
            document_processing.delay(new_app.id)
    finally:
        db.close()
    
    return processed_ids

@celery_app.task
def document_processing(application_id: str) -> bool:
    # HUMAN ASSISTANCE NEEDED
    # This function needs review for production readiness and error handling
    db = SessionLocal()
    try:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            return False

        documents = db.query(Document).filter(Document.application_id == application_id).all()
        
        for document in documents:
            document_type = classify_document(document.file_path)
            document.document_type = document_type
            
            if document_type == "ISO_APPLICATION":
                extracted_text = extract_text_from_document(document.file_path)
                parsed_data = parse_application_data(extracted_text)
                
                for key, value in parsed_data.items():
                    setattr(application, key, value)
        
        db.commit()
        webhook_notification.delay(application_id)
        return True
    except Exception as e:
        db.rollback()
        # Log the error
        return False
    finally:
        db.close()

@celery_app.task
def webhook_notification(application_id: str) -> bool:
    db = SessionLocal()
    try:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            return False

        notification_status = send_webhook_notification(application.to_dict())
        application.notification_sent = notification_status
        db.commit()
        return notification_status
    except Exception as e:
        db.rollback()
        # Log the error
        return False
    finally:
        db.close()