from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.db.models import Webhook
from app.services.webhook_service import validate_webhook_url

webhooks_bp = Blueprint('webhooks', __name__)

@webhooks_bp.route('/webhooks', methods=['POST'])
@jwt_required
def register_webhook():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    url = data['url']
    if not validate_webhook_url(url):
        return jsonify({'error': 'Invalid webhook URL'}), 400

    webhook = Webhook(url=url)
    webhook.save()

    return jsonify(webhook.to_dict()), 201

@webhooks_bp.route('/webhooks', methods=['GET'])
@jwt_required
def get_webhooks():
    webhooks = Webhook.query.all()
    return jsonify([webhook.to_dict() for webhook in webhooks]), 200

@webhooks_bp.route('/webhooks/<webhook_id>', methods=['PUT'])
@jwt_required
def update_webhook(webhook_id):
    webhook = Webhook.query.get(webhook_id)
    if not webhook:
        return jsonify({'error': 'Webhook not found'}), 404

    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Invalid request data'}), 400

    new_url = data['url']
    if not validate_webhook_url(new_url):
        return jsonify({'error': 'Invalid webhook URL'}), 400

    webhook.url = new_url
    webhook.save()

    return jsonify(webhook.to_dict()), 200

@webhooks_bp.route('/webhooks/<webhook_id>', methods=['DELETE'])
@jwt_required
def delete_webhook(webhook_id):
    webhook = Webhook.query.get(webhook_id)
    if not webhook:
        return jsonify({'error': 'Webhook not found'}), 404

    webhook.delete()
    return jsonify({'message': 'Webhook deleted successfully'}), 200