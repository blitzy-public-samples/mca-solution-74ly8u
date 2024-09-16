from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.db.models import Document, Application
from app.services.document_classifier import classify_document
from app.services.ocr_service import extract_text_from_document
from google.cloud import storage

documents_bp = Blueprint('documents', __name__)
storage_client = storage.Client()
bucket_name = 'mca_documents_bucket'

@documents_bp.route('/applications/<application_id>/documents', methods=['POST'])
@jwt_required
def upload_document(application_id):
    # HUMAN ASSISTANCE NEEDED
    # This function has a low confidence score (0.6) and may need additional error handling and security checks
    application = Application.query.get(application_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(f"{application_id}/{file.filename}")
    blob.upload_from_string(file.read(), content_type=file.content_type)

    document_type = classify_document(file)
    text_content = extract_text_from_document(file)

    document = Document(
        application_id=application_id,
        filename=file.filename,
        document_type=document_type,
        content=text_content,
        storage_path=blob.name
    )
    document.save()

    return jsonify(document.to_dict()), 201

@documents_bp.route('/applications/<application_id>/documents', methods=['GET'])
@jwt_required
def get_documents(application_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    documents = Document.query.filter_by(application_id=application_id).all()
    return jsonify([doc.to_dict() for doc in documents]), 200

@documents_bp.route('/applications/<application_id>/documents/<document_id>', methods=['DELETE'])
@jwt_required
def delete_document(application_id, document_id):
    application = Application.query.get(application_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    document = Document.query.get(document_id)
    if not document or document.application_id != application_id:
        return jsonify({'error': 'Document not found'}), 404

    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(document.storage_path)
    blob.delete()

    document.delete()

    return jsonify({'message': 'Document deleted successfully'}), 200