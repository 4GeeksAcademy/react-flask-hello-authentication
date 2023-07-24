"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from api.models import db, User, Character
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)

jwt = JWTManager()
bcrypt = Bcrypt()


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    request_data = request.get_json()

    if request_data:
        email = request_data.get('email')
        password = request_data.get('password')

        if not email or not password:
            return jsonify({'message': 'email and password are mandatory fields', 'status': 'error'}), 400

        existing_user = User.query.filter_by(email = email).first()
        if existing_user:
            return jsonify({'message': 'Email already exists', 'status': 'error'}), 400

        password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(email = email, password = password, is_active = True)
        db.session.add(user)
        db.session.commit()
    else:
        return jsonify({"message": "Invalid JSON data", 'status': 'success'}), 400

    return jsonify({"message": f"{email} was added successfully"}), 200

@api.route('/token', methods=['POST'])
def get_token():
    request_data = request.get_json()

    if request_data:
        email = request_data.get('email')
        password = request_data.get('password')

        if not email or not password:
            return jsonify({'message': 'email and password are mandatory fields'})

        login_user = User.query.filter_by(email = email).first()
        if login_user is None:
            return jsonify({'message': 'User not found'}), 400

        is_valid_login = bcrypt.check_password_hash(login_user.password, password)
        
        if is_valid_login:
            access_token = create_access_token(identity=login_user.id)
            return jsonify({'access_token': access_token}), 200
        else:
            return jsonify({'message': 'Bad credentials'}) , 400
    else:
        return jsonify({"message": "Invalid JSON data"}), 400

@api.route('/private', methods=['GET', 'POST'])
@jwt_required()
def protected():
    current_user_id =  get_jwt_identity()
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({'valid_user': False}), 400
    
    return jsonify({'valid_user': True}), 200


@api.route('/get_all_users', methods=['GET'])
def get_all_users():
    userList = User.query.all()
    response_body = [User.serialize(user) for user in userList]

    return response_body, 200

@api.route('/delete_all_users', methods=['DELETE'])
def delete_all_users():
    User.query.delete()
    db.session.commit()
    return jsonify({'message': "all users deleted"})

@api.route('/create_character', methods=['POST'])
def create_character():
    request_data = request.get_json()

    character = Character(**request_data)
    db.session.add(character)
    db.session.commit()

    return jsonify({'message': 'Character created correctly'})

@api.route('/get_all_characters', methods=['GET'])
def get_all_character():

    characters = Character.query.all()

    response_body = {
        "characters": [Character.serialize(char) for char in characters]
    }

    return response_body, 200

@api.route('/delete_all_characters', methods=['DELETE'])
def delete_all_characters():
        Character.query.delete()
        db.session.commit()

        return jsonify({'message': 'All character deleted'})