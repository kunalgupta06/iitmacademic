import os
import re
from flask import   app, current_app, jsonify, make_response, request, send_from_directory, session, url_for
from app.models import assignment, lectures, score, subject, User
from app.database import db
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from app.models import questions as QuestionModel, assignment



class StudentDashboard(Resource):
    
    def get(self):
        """Fetches all courses a student is enrolled in"""
        if "User" not in session or session["User"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        student_id = session["User"]["id"]
        enrolled_courses = subject.query.filter_by(User_id=student_id).all()
        
        courses = [{"subject_id": s.subject_id, "subject_name": s.subject_name} for s in enrolled_courses]
        return jsonify({"enrolled_courses": courses})
    
# class ViewAssignments(Resource):
#     def get(self, subject_id):
#         """Fetches assignments for a student's course"""
#         if "user" not in session or session["user"]["role"] != "student":
#             return {"error": "Unauthorized access"}, 403

#         assignments = assignment.query.filter_by(subject_id=subject_id).all()
        
#         assignment_list = [{
#             "assignment_id": a.assignment_id,
#             "name": a.name,
#             "due_date": a.due_date.strftime("%Y-%m-%d"),
#             "completion": a.completion
#         } for a in assignments]
        
#         return jsonify({"assignments": assignment_list})

UPLOAD_FOLDER = "uploads"

class ViewAssignments(Resource):
    def get(self, subject_id):
        """Fetches assignments for a student's course"""
        if "User" not in session or session["User"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        assignments = assignment.Assignment.query.filter_by(subject_id=subject_id).all()  # Use Assignment.query
        
        assignment_list = [{
            "assignment_id": a.assignment_id,
            "name": a.name,
            "due_date": a.due_date.strftime("%Y-%m-%d"),
            "completion": a.completion
        } for a in assignments]
        
        return {"assignments": assignment_list}


class SubmitAssignment(Resource):
    def post(self):
        """Allows students to submit assignments by uploading a PDF"""
        if "User" not in session or session["User"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        student_id = session["User"]["id"]
        
        if "file" not in request.files:
            return {"error": "No file uploaded"}, 400

        file = request.files["file"]
        filename = secure_filename(f"student_{student_id}_{file.filename}")

        # Ensure upload directory exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        return {"message": "Assignment submitted successfully!", "file_url": f"/pdfs/{filename}"}




class ViewScores(Resource):
    def get(self):
        """Fetches student's scores for completed assignments"""
        if "User" not in session or session["User"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        student_id = session["User"]["id"]
        scores = score.Score.query.filter_by(User_id=student_id).all()  # Use Score.query
        
        score_list = [{"assignment_id": s.assignment_id, "score": s.score} for s in scores]
        return {"scores": score_list}

    

# class Question(Resource):
#     def get(self, assignment_id):
#         """Fetches all questions for a given assignment"""
#         if "user" not in session or session["user"]["role"] != "student":
#             return {"error": "Unauthorized access"}, 403

#         questions = QuestionModel.query.filter_by(assignment_id=assignment_id).all()
        
#         if not questions:
#             return {"error": "No questions found for this assignment"}, 404
        
#         question_list = [{
#             "question_id": q.question_id,
#             "text": q.text,
#             "options": {
#                 "A": q.option_a,
#                 "B": q.option_b,
#                 "C": q.option_c,
#                 "D": q.option_d,
#             },
#             "correct_answer": q.correct_answer  # This can be removed if students shouldn't see it
#         } for q in questions]

#         return jsonify({"questions": question_list})

#     def post(self):
#         """Allows an admin to add a new question to an assignment"""
#         if "user" not in session or session["user"]["role"] != "admin":
#             return {"error": "Unauthorized access"}, 403

#         data = request.get_json()
        
#         required_fields = ["assignment_id", "text", "option_a", "option_b", "option_c", "option_d", "correct_answer"]
#         for field in required_fields:
#             if field not in data:
#                 return {"error": f"Missing field: {field}"}, 400
        
#         new_question = QuestionModel(
#             assignment_id=data["assignment_id"],
#             text=data["text"],
#             option_a=data["option_a"],
#             option_b=data["option_b"],
#             option_c=data["option_c"],
#             option_d=data["option_d"],
#             correct_answer=data["correct_answer"].upper()
#         )

#         db.session.add(new_question)
#         db.session.commit()

#         return jsonify({"message": "Question added successfully!"})

#     def delete(self, question_id):
#         """Allows an admin to delete a question"""
#         if "user" not in session or session["user"]["role"] != "admin":
#             return {"error": "Unauthorized access"}, 403

#         question = QuestionModel.query.get(question_id)

#         if not question:
#             return {"error": "Question not found"}, 404

#         db.session.delete(question)
#         db.session.commit()

#         return jsonify({"message": "Question deleted successfully!"})

class Question(Resource):
    def get(self, assignment_id):
        """Fetches all questions for a given assignment"""
        if "User" not in session or session["User"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        questions = QuestionModel.query.filter_by(assignment_id=assignment_id).all()
        
        if not questions:
            return {"error": "No questions found for this assignment"}, 404
        
        question_list = [{
            "question_id": q.question_id,
            "text": q.text,
            "options": {
                "A": q.option_a,
                "B": q.option_b,
                "C": q.option_c,
                "D": q.option_d,
            }
        } for q in questions]  # Removed correct_answer for security

        return {"questions": question_list}  # No need for jsonify

    def post(self):
        """Allows an admin to add a new question to an assignment"""
        if "User" not in session or session["User"]["role"] != "admin":
            return {"error": "Unauthorized access"}, 403

        data = request.get_json()
        
        required_fields = ["assignment_id", "text", "option_a", "option_b", "option_c", "option_d", "correct_answer"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return {"error": f"Missing fields: {', '.join(missing_fields)}"}, 400

        new_question = QuestionModel(
            assignment_id=data["assignment_id"],
            text=data["text"],
            option_a=data["option_a"],
            option_b=data["option_b"],
            option_c=data["option_c"],
            option_d=data["option_d"],
            correct_answer=data["correct_answer"].upper()  # Ensure it's uppercase
        )

        db.session.add(new_question)
        db.session.commit()

        return {"message": "Question added successfully!"}

    def delete(self, question_id):
        """Allows an admin to delete a question"""
        if "User" not in session or session["User"]["role"] != "admin":
            return {"error": "Unauthorized access"}, 403

        question = QuestionModel.query.get(question_id)

        if not question:
            return {"error": "Question not found"}, 404

        db.session.delete(question)
        db.session.commit()

        return {"message": "Question deleted successfully!"}
