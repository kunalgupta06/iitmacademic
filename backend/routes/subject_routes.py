from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from database import db
from models.user import User
from models.subject import Subject

subject_bp = Blueprint("subject_bp", __name__)


# Get subjects registered by a particular user using user id
@subject_bp.route("/<int:student_id>", methods=["GET"])
def get_student_subjects(student_id):
    student = User.query.filter_by(id=student_id, role="student").first()
    if not student:
        return jsonify({"error": "Student not found"}), 404
    subject_ids = student.get_subjects()
    subjects = Subject.query.filter(Subject.id.in_(subject_ids)).all()
    subjects_data = [{"id": sub.id, "name": sub.name, "code": sub.code} for sub in subjects]
    return jsonify({"subjects": subjects_data}), 200


# Add a new Subject (Only for Instructors)
@subject_bp.route("/add", methods=["POST"])
@jwt_required()
def add_subject():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    name = data.get("name")
    code = data.get("code")
    if not isinstance(name, str) or not isinstance(code, str):
        return jsonify({"error": "Subject name and code must be strings"}), 400

    # ✅ Get user ID (string) and role claim
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")

    if role != "instructor":
        return jsonify({"error": "Only instructors can add subjects"}), 403

    # Optional: Fetch user if needed (not mandatory unless needed further)
    user = User.query.get(int(user_id))

    # Add new subject
    new_subject = Subject(name=name, code=code)
    db.session.add(new_subject)
    db.session.commit()

    return jsonify({
        "message": "Subject added successfully",
        "subject": {"id": new_subject.id, "name": new_subject.name, "code": new_subject.code}
    }), 201




# Edit Subject Details (Only for Instructors)
@subject_bp.route("/edit/<int:subject_id>", methods=["PUT"])
@jwt_required()  # Requires authentication
def edit_subject(subject_id):
    data = request.get_json()
    user_id = get_jwt_identity()  
    user = User.query.get(user_id)
    if not user or user.role != "instructor":
        return jsonify({"error": "Only instructors can edit subjects"}), 403
    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({"error": "Subject not found"}), 404
    if "name" in data:
        subject.name = data["name"]
    if "code" in data:
        subject.code = data["code"]
    db.session.commit()
    return jsonify({"message": "Subject updated successfully", "subject": {"id": subject.id, "name": subject.name, "code": subject.code}}), 200

