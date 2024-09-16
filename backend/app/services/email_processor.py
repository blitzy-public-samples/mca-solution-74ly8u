from email import message_from_bytes
from imaplib import IMAP4_SSL
from google.cloud import storage
from app.core.config import settings
from app.db.models import Application

storage_client = storage.Client()
bucket = storage_client.bucket(settings.GOOGLE_CLOUD_STORAGE_BUCKET)

# HUMAN ASSISTANCE NEEDED
# The following function has a confidence level below 0.8 and may need additional review or modifications for production readiness.
def process_emails():
    processed_ids = []
    
    # Connect to the IMAP server
    with IMAP4_SSL(settings.IMAP_SERVER) as imap:
        imap.login(settings.EMAIL_USERNAME, settings.EMAIL_PASSWORD)
        imap.select('INBOX')
        
        # Fetch new emails
        _, message_numbers = imap.search(None, 'UNSEEN')
        for num in message_numbers[0].split():
            _, msg_data = imap.fetch(num, '(RFC822)')
            email_body = msg_data[0][1]
            email_message = message_from_bytes(email_body)
            
            # Extract metadata and attachments
            sender = email_message['From']
            subject = email_message['Subject']
            attachments = extract_attachments(email_message)
            
            # Create a new Application record
            application = Application(
                email=sender,
                subject=subject,
                status='new'
            )
            application.save()
            
            # Store attachments in Google Cloud Storage
            for filename, content in attachments:
                blob = bucket.blob(f"{application.id}/{filename}")
                blob.upload_from_string(content)
                
            # Mark email as processed
            imap.store(num, '+FLAGS', '\\Seen')
            
            processed_ids.append(application.id)
    
    return processed_ids

def extract_attachments(email_message):
    attachments = []
    
    for part in email_message.walk():
        if part.get_content_maintype() == 'multipart':
            continue
        
        if part.get('Content-Disposition') is None:
            continue
        
        filename = part.get_filename()
        if filename:
            content = part.get_payload(decode=True)
            attachments.append((filename, content))
    
    return attachments