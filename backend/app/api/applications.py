from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.db.models import Application, Document
from app.schema.application_schema import ApplicationSchema
from app.services.document_classifier import classify_document
from app.services.ocr_service import extract_text_from_document
from app.services.webhook_service import send_webhook_notification

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('/applications', methods=['GET'])
@jwt_required
def get_applications():
    applications = Application.query.all()
    application_schema = ApplicationSchema(many=True)
    return jsonify(application_schema.dump(applications))

# HUMAN ASSISTANCE NEEDED
# This function has a confidence level of 0.7 and may need additional error handling and input validation
@applications_bp.route('/applications', methods=['POST'])
@jwt_required
def create_application():
    data = request.get_json()
    
    # Validate incoming JSON data
    # TODO: Implement proper validation

    new_application = Application(**data)
    
    # Process attached documents
    for document in data.get('documents', []):
        doc_type = classify_document(document['file'])
        doc_text = extract_text_from_document(document['file'])
        new_document = Document(type=doc_type, content=doc_text)
        new_application.documents.append(new_document)
    
    # Save application to the database
    db.session.add(new_application)
    db.session.commit()
    
    # Send webhook notification
    send_webhook_notification('application_created', new_application.id)
    
    application_schema = ApplicationSchema()
    return jsonify(application_schema.dump(new_application)), 201

@applications_bp.route('/applications/<application_id>', methods=['GET'])
@jwt_required
def get_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404
    
    application_schema = ApplicationSchema()
    return jsonify(application_schema.dump(application))

@applications_bp.route('/applications/<application_id>', methods=['PUT'])
@jwt_required
def update_application(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404
    
    data = request.get_json()
    
    # Validate incoming JSON data
    # TODO: Implement proper validation
    
    old_status = application.status
    
    for key, value in data.items():
        setattr(application, key, value)
    
    db.session.commit()
    
    if old_status != application.status:
        send_webhook_notification('application_status_changed', application.id)
    
    application_schema = ApplicationSchema()
    return jsonify(application_schema.dump(application))