from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from app.db.models import User
from app.core.security import hash_password, verify_password

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['POST'])
@jwt_required
def register_user():
    data = request.get_json()
    
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    
    if User.query.filter((User.username == data['username']) | (User.email == data['email'])).first():
        return jsonify({'error': 'Username or email already exists'}), 400
    
    hashed_password = hash_password(data['password'])
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        'id': new_user.id,
        'username': new_user.username,
        'email': new_user.email
    }), 201

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not verify_password(data['password'], user.password):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

@users_bp.route('/users/me', methods=['GET'])
@jwt_required
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200

@users_bp.route('/users/me', methods=['PUT'])
@jwt_required
def update_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Invalid data'}), 400
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = hash_password(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200

# HUMAN ASSISTANCE NEEDED
# The following issues need to be addressed:
# 1. Error handling for database operations
# 2. Input validation and sanitization
# 3. Proper handling of database sessions (commit/rollback)
# 4. Logging of important events and errors
# 5. Rate limiting for sensitive operations (e.g., login attempts)
# 6. Implement proper CORS handling if needed
# 7. Consider adding email verification for new user registration