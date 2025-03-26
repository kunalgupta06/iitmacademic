from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from models.user import User

user_bp = Blueprint("user_bp", __name__)

# User/Instructor Registration
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # Validate request data
    if not all([username, email, password, role]):
        return jsonify({"error": "Missing fields"}), 400
    
    # Validate role and email domain
    if role == "instructor" and not email.endswith("@study.iitm.ac.in"):
        return jsonify({"error": 'Instructors must use an email with the domain "study.iitm.ac.in".'}), 400
    elif role == "student" and not email.endswith("@ds.study.iitm.ac.in"):
        return jsonify({"error": 'Students must use an email with the domain "ds.study.iitm.ac.in".'}), 400

    # Check if user already exists (by email or username)
    existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
    if existing_user:
        return jsonify({"error": "User Already Exists! Please use a different email or username."}), 400

    # Hash password
    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

    # Create new user
    new_user = User(username=username, email=email, password=hashed_password, role=role)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201


# User/Instructor Login
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Missing email or password"}), 400

    # Fetch user
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # ✅ Generate access token: ID in identity, role in claims
    access_token = create_access_token(
        identity=str(user.id),  # Pass user ID as string (required!)
        additional_claims={"role": user.role}  # Store role in claims
    )
    return jsonify({"message": "Login successful", "token": access_token}), 200



# Logout (Needs to be done in frontend
# (Below is optional - If using token blacklisting)
@user_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # Get token ID
    return jsonify({"message": "Logout successful"}), 200


# Forgot Password (future)


