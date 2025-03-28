import os
import re
from flask import   app, current_app, jsonify, make_response, request, send_from_directory, session, url_for
from app.models import assignment, lectures, score
from app.models.User import User
from app.models.subject import Subject

from app.database import db
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename


class Register(Resource):
    def post(self):
        data = request.get_json()
        print(data)

        required_fields = ['name', 'email', 'username', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return {'message': f'Missing required field: {field}'}, 400
      
        email = data['email']
        role = data['role']
        if role == 'instructor' and not email.endswith('study.iitm.ac.in'):
            return {'message': 'Instructors must use an email with the domain "study.iitm.ac.in".'}, 400
        elif role in ['student', 'ta'] and not email.endswith('ds.study.iitm.ac.in'):
            return {'message': 'Students and TAs must use an email with the domain "ds.study.iitm.ac.in".'}, 400


        password = data['password']
        password_pattern = r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$'
        if not re.match(password_pattern, password):
            return {
                'message': 'Password must be at least 6 characters long, '
                           'contain at least one uppercase letter, one number, and one special character.'
            }, 400


        existing_user = User.query.filter((User.email == email) | (User.username == data['username'])).first()

        if existing_user:
            return {'message': 'User Already Exists! Please use a different email or username.'}, 400


        hashed_password = generate_password_hash(password)


        new_user = User(
            name=data['name'],
            email=email,
            username=data['username'],
            password=hashed_password,
            role=role,
        )

        db.session.add(new_user)
        try:
            db.session.commit()

            hardcoded_subjects = ["Business Analytics", "Software Engineering"]
            for subject_name in hardcoded_subjects:
                new_subject = Subject(subject_name=subject_name, user_id=new_user.user_id)
                db.session.add(new_subject)

            db.session.commit()

        except Exception as e:
            db.session.rollback()
            print(f'Error during registration: {e}')
            return {'message': 'An error occurred while registering the user. Please try again later.'}, 500

        return {'message': 'User registered successfully with predefined subjects!'}, 201



class Login(Resource):
    def post(self):
        data = request.get_json()

        if 'email' not in data or 'password' not in data or 'role' not in data:
            return {'message': 'Missing required fields.'}, 400

        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        # Validate email domain based on role
        if role == 'instructor' and not email.endswith('study.iitm.ac.in'):
            return {'message': 'Instructors must use an email with the domain "study.iitm.ac.in".'}, 400
        elif role in ['student', 'ta'] and not email.endswith('ds.study.iitm.ac.in'):
            return {'message': 'Students and TAs must use an email with the domain "ds.study.iitm.ac.in".'}, 400

        try:
            user_instance = User.query.filter(User.email == email).first()
            if not user_instance or user_instance.role != role or not check_password_hash(user_instance.password, password):
                return {'message': 'Invalid credentials. Please check and try again.'}, 401

            # Store session
            session['user'] = {'username': user_instance.username, 'role': user_instance.role}

            # Determine redirect URL based on role
            if role == 'student':
                redirect_url = '/student-dashboard'
            else:
                redirect_url = '/instructor-dashboard'

            return {
                'message': f'Welcome {user_instance.username}!',
                'user': {
                    'id': user_instance.user_id,
                    'username': user_instance.username,
                    'role': user_instance.role,
                },
                'redirect_url': redirect_url
            }, 200

        except Exception as e:
            print(f'An unexpected error occurred: {e}')
            return {'message': 'An unexpected error occurred. Please try again later.'}, 500