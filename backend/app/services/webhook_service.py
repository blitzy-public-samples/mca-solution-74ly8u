from requests import post
from app.db.models import Webhook
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# HUMAN ASSISTANCE NEEDED
# The following function has a confidence level below 0.8 and may need review
def send_webhook_notification(application_id: str, status: str) -> bool:
    try:
        # Retrieve active webhooks from database
        active_webhooks = Webhook.query.filter_by(is_active=True).all()

        if not active_webhooks:
            logger.info("No active webhooks found.")
            return True

        # Prepare webhook payload
        payload = {
            "application_id": application_id,
            "status": status,
            "timestamp": datetime.utcnow().isoformat()
        }

        success = True
        for webhook in active_webhooks:
            try:
                # Send POST request to each webhook URL
                response = post(webhook.url, json=payload, timeout=10)
                
                # Log webhook delivery status
                if response.status_code == 200:
                    logger.info(f"Webhook notification sent successfully to {webhook.url}")
                else:
                    logger.warning(f"Failed to send webhook notification to {webhook.url}. Status code: {response.status_code}")
                    success = False
            except Exception as e:
                logger.error(f"Error sending webhook notification to {webhook.url}: {str(e)}")
                success = False

        return success
    except Exception as e:
        logger.error(f"Error in send_webhook_notification: {str(e)}")
        return False

def validate_webhook_url(url: str) -> bool:
    try:
        # Prepare test payload
        test_payload = {
            "test": True,
            "message": "This is a test webhook notification"
        }

        # Send POST request to the webhook URL
        response = post(url, json=test_payload, timeout=10)

        # Check response status code
        if response.status_code == 200:
            logger.info(f"Webhook URL validation successful: {url}")
            return True
        else:
            logger.warning(f"Webhook URL validation failed: {url}. Status code: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"Error validating webhook URL {url}: {str(e)}")
        return False