import os
from flask import   app, current_app, jsonify, make_response, request, send_from_directory, session, url_for

from models import assignment, lectures, score, subject, user
from database import db
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import re
import google.generativeai as genai
import fitz
from flask import current_app 


#done
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


        existing_user = user.query.filter((user.email == email) | (user.username == data['username'])).first()
        if existing_user:
            return {'message': 'User Already Exists! Please use a different email or username.'}, 400


        hashed_password = generate_password_hash(password)


        new_user = user(
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
                new_subject = subject(subject_name=subject_name, user_id=new_user.user_id)
                db.session.add(new_subject)

            db.session.commit()

        except Exception as e:
            db.session.rollback()
            print(f'Error during registration: {e}')
            return {'message': 'An error occurred while registering the user. Please try again later.'}, 500

        return {'message': 'User registered successfully with predefined subjects!'}, 201


#done
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
            user_instance = user.query.filter(user.email == email).first()
            if not user_instance or user_instance.role != role or not check_password_hash(user_instance.password, password):
                return {'message': 'Invalid credentials. Please check and try again.'}, 401

            # Store session
            session['user'] = {'user_id': user_instance.user_id,'username': user_instance.username, 'role': user_instance.role}
            session.modified = True

            # Determine redirect URL based on role
            if role == 'student':
                redirect_url = '/student-portal'
            else:
                redirect_url = '/instructor-portal'

            return {
                'message': f'Welcome {user_instance.username}!',
                'user': {
                    'user_id': user_instance.user_id,
                    'username': user_instance.username,
                    'role': user_instance.role,
                },
                'redirect_url': redirect_url
            }, 200

        except Exception as e:
            print(f'An unexpected error occurred: {e}')
            return {'message': 'An unexpected error occurred. Please try again later.'}, 500
        
#done
class StudentDashboard(Resource):
    
    def get(self):
        """Fetches all courses a student is enrolled in"""
        print("Session Data:", session)  # Debugging statement
        
        if "user" not in session or "user_id" not in session["user"]:
            return {"error": "User ID missing in session"}, 400
        
        student_id = session["user"]["user_id"]
        enrolled_courses = subject.query.filter_by(user_id=student_id).all()
        
        courses = [{"subject_id": s.subject_id, "subject_name": s.subject_name} for s in enrolled_courses]
        return jsonify({"enrolled_courses": courses})
#done    
class ViewAssignments(Resource):
    def get(self, subject_id):
        """Fetches assignments for a student's course"""
        if "user" not in session or session["user"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        assignments = assignment.query.filter_by(subject_id=subject_id).all()
        
        assignment_list = [{
            "assignment_id": a.assignment_id,
            "name": a.name,
            "due_date": a.due_date.strftime("%Y-%m-%d"),
            "completion": a.completion
        } for a in assignments]
        
        return jsonify({"assignments": assignment_list})


class SubmitAssignment(Resource):
    def post(self):
        """Allows students to submit assignments by uploading a PDF"""
        if "user" not in session or session["user"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        student_id = session["user"]["id"]
        
        if "file" not in request.files:
            return {"error": "No file uploaded"}, 400

        file = request.files["file"]
        filename = f"student_{student_id}_{file.filename}"
        file.save(f"uploads/{filename}")

        return jsonify({"message": "Assignment submitted successfully!", "file_url": f"/pdfs/{filename}"})


class ViewScores(Resource):
    def get(self):
        """Fetches student's scores for completed assignments"""
        if "user" not in session or session["user"]["role"] != "student":
            return {"error": "Unauthorized access"}, 403

        student_id = session["user"]["id"]
        scores = score.query.filter_by(user_id=student_id).all()
        
        score_list = [{"assignment_id": s.assignment_id, "score": s.score} for s in scores]
        return jsonify({"scores": score_list})
    
'''
class InstructorDashboard(Resource):
    
    def get(self):
        """Fetches analytics for instructors instead of courses"""
        if "user" not in session or session["user"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        # Fetch total number of students
        total_students = user.query.filter_by(role="student").count()

        # Fetch total number of subjects managed by this instructor
        instructor_id = session["user"]["id"]
        total_subjects = subject.query.filter_by(user_id=instructor_id).count()

        # Fetch total number of assignments created by this instructor
        total_assignments = assignment.query.join(subject).filter(subject.user_id == instructor_id).count()

        # Fetch total number of submitted assignments
        total_submitted_assignments = score.query.join(assignment).join(subject).filter(subject.user_id == instructor_id).count()

        analytics_data = {
            "total_students": total_students,
            "total_subjects_managed": total_subjects,
            "total_assignments": total_assignments,
            "total_submitted_assignments": total_submitted_assignments
        }

        return jsonify(analytics_data)

'''
class InstructorDashboard(Resource):
    
    def get(self):
        """Fetches analytics for instructors instead of courses"""
        print("Session Data:", session)  # Debugging

        if "user" not in session or "user_id" not in session["user"]:
            return {"error": "Unauthorized access"}, 403

        instructor_id = session["user"]["user_id"]
        print("Instructor ID:", instructor_id)  # Debugging

        # Fetch total number of students
        total_students = user.query.filter_by(role="student").count()

        analytics_data = {
            "total_students": total_students
        }
        print("Session Data:", session)
        print("Analytics Data:", analytics_data)  # Debugging
        return jsonify(analytics_data)
#done
class AddLecture(Resource):
    def post(self):
        """Allows an instructor to add a new lecture"""
        if "user" not in session or session["user"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.get_json()
        title = data.get("title")
        video_link = data.get("video_link")
        subject_id = data.get("subject_id")

        if not all([title, video_link, subject_id]):
            return {"error": "Missing required fields"}, 400

        new_lecture = lectures(title=title, video_link=video_link, subject_id=subject_id)
        db.session.add(new_lecture)
        db.session.commit()

        return jsonify({"message": "Lecture added successfully"})
'''
class AddAssignment(Resource):
    def post(self):
        """Allows an instructor to add a new assignment with PDF upload"""
        if "user" not in session or session["user"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.form
        name = data.get("name")
        due_date = data.get("due_date")
        subject_id = data.get("subject_id")

        if not all([name, due_date, subject_id]):
            return {"error": "Missing required fields"}, 400

        file = request.files.get("file")
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))  # ✅ Fix Here!
            pdf_link = f"/pdfs/{filename}"
        else:
            pdf_link = None  # If no PDF provided

        new_assignment = assignment(
            name=name,
            due_date=due_date,
            subject_id=subject_id,
            completion=False,
        )

        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({"message": "Assignment added successfully", "pdf_link": pdf_link})
'''
import os
from flask import request, jsonify, session, current_app
from flask_restful import Resource
from werkzeug.utils import secure_filename
from datetime import datetime
from models import db, assignment  # Ensure Assignment model is imported

ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
class AddAssignment(Resource):
    def post(self):
        """Allows an instructor to add a new assignment with PDF upload"""
        if "user" not in session or session["user"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.form
        name = data.get("name")
        if len(request.form["due_date"])==0:
            return {"error": "Missing required fields"}, 400

        due_date = datetime.strptime(request.form["due_date"], "%Y-%m-%d").date()
        #due_date = data.get("due_date")
        subject_id = data.get("subject_id")
        user_id = session["user"]["user_id"]  # ✅ Fetch user_id from session

        if not all([name, due_date, subject_id, user_id]):
            return {"error": "Missing required fields"}, 400

        file = request.files.get("file")
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
            pdf_link = f"/pdfs/{filename}"
        else:
            pdf_link = None  

        # ✅ Include user_id while creating the assignment
        new_assignment = assignment(
            name=name,
            due_date=due_date,
            subject_id=subject_id,
            user_id=user_id,  # ✅ Fix here
            completion=False,
        )

        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({"message": "Assignment added successfully", "pdf_link": pdf_link})

class ViewSubmittedAssignments(Resource):
    def get(self, subject_id):
        """Fetches all student submissions for an assignment"""
        if "user" not in session or session["user"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        submitted_files = os.listdir("uploads/")
        submissions = [file for file in submitted_files ]

        return jsonify({"submissions": submissions})


# class GradeAssignment(Resource):
#     def post(self):
#         """Allows an instructor to grade student assignments"""
#         if "user" not in session or session["user"]["role"] != "instructor":
#             return {"error": "Unauthorized access"}, 403

#         data = request.get_json()
#         student_id = data.get("student_id")
#         assignment_id = data.get("assignment_id")
#         score_value = data.get("score")

#         if not all([student_id, assignment_id, score_value]):
#             return {"error": "Missing required fields"}, 400

#         new_score = score(user_id=student_id, assignment_id=assignment_id, score=score_value)
#         db.session.add(new_score)
#         db.session.commit()

#         return jsonify({"message": "Score added successfully"})

    
class GradeAssignment(Resource):
    def post(self):
        """Allows an instructor to grade student assignments using AI Assistance"""
        if "user" not in session or session["user"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.get_json()
        student_id = data.get("student_id")
        assignment_id = data.get("assignment_id")
        score_value = data.get("score")
        file_path = f"uploads/student_{student_id}_assignment_{assignment_id}.pdf"

        if not all([student_id, assignment_id, score_value]):
            return {"error": "Missing required fields"}, 400

        # Extract text from the PDF
        extracted_text = self.extract_text_from_pdf(file_path)

        # Generate AI feedback
        ai_feedback = self.analyze_with_gemini(extracted_text)

        # Save the score in the database
        new_score = score(user_id=student_id, assignment_id=assignment_id, score=score_value)
        db.session.add(new_score)
        db.session.commit()

        return jsonify({"message": "Score added successfully", "ai_feedback": ai_feedback})

    def extract_text_from_pdf(self, file_path):
        """Extracts text from a PDF using PyMuPDF"""
        text = ""
        try:
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
        except Exception as e:
            print(f"Error extracting text: {e}")
        return text

    def analyze_with_gemini(self, extracted_text):
        """Sends extracted text to Gemini API for AI-based grading assistance"""
        prompt = f"Evaluate the following student assignment and provide a score out of 100 with constructive feedback:\n\n{extracted_text}"
        
        try:
            response = genai.generate_text(prompt)
            return response.text
        except Exception as e:
            print(f"Error with AI grading: {e}")
            return "AI grading failed."




def allowed_file(filename):
    """Checks if the uploaded file is a valid PDF"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in current_app.config.get("ALLOWED_EXTENSIONS", {})


# class CourseContent(Resource):
#     def get(self):
#         course_data = {
#             "subjects": [
#                 {
#                     "subject_name": "Business Analytics",
#                     "weeks": [
#                         {
#                             "week": 1,
#                             "lectures": [
#                                 {"title": "L1.1 Introduction to Data Visualization", "youtube_link": "https://youtu.be/_0z2c-Awpt0?si=OcQ0y8hO6ZRMtsHn"},
#                                 {"title": "L1.2 Defining the Message", "youtube_link": "https://youtu.be/1zWJyhv6j_g?si=bld0pvhCROahvpRO"},
#                                 {"title": "L1.3 Creating Designs", "youtube_link": "https://youtu.be/lLvRWjclPus?si=-m8zkZgd9M0YY7Yx"},
#                                 {"title": "Tutorial1.1 Misleading Visuals", "youtube_link": "https://youtu.be/iRdCG6Xg0AY?si=X1J3z8dFlXjsrnho"},
#                                 {"title": "Tutorial1.2 Building a Sample Dashboard", "youtube_link": "https://youtu.be/Nhf5VyNwY9U?si=wvCRpTBY2308Ab0P"},
#                             ],
#                             "assignments": {
#                                 "graded": [
#                                     {"title": "Assignment 1: Data Visualization Report", "due_date": "2025-03-10","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
                                   
#                                 ],
#                                 "non_graded": [
#                                     {"title": "Practice Exercise: Identify Misleading Visuals","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
                                   
#                                 ]
#                             }
#                         },
#                         {
#                             "week": 2,
#                             "lectures": [
#                                 {"title": "L2.1 Probability Distribution", "youtube_link": "https://youtu.be/yMFsKaMRqdw?si=krlUw0wOTGIhDgUn"},
#                                 {"title": "L2.2 Business Example", "youtube_link": "https://youtu.be/ePqGFuLnVFM?si=CEb-QUDTTv-Ss0u7"},
#                                 {"title": "L2.3 Guessing the Distribution", "youtube_link": "https://youtu.be/UM-3E8fsCgA?si=czF8YC6VTqxyB92h"},
#                             ],
#                             "assignments": {
#                                 "graded": [
#                                     {"title": "Assignment 3: Probability Distributions in Business", "due_date": "2025-03-20","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
#                                 ],
#                                 "non_graded": [
#                                     {"title": "Practice Exercise: Understanding Probability Distributions","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
#                                 ]
#                             }
#                         }
#                     ]
#                 },
#                 {
#                     "subject_name": "Software Engineering",
#                     "weeks": [
#                         {
#                             "week": 1,
#                             "lectures": [
#                                 {"title": "L1.1 Introduction to Software Engineering", "youtube_link": "https://youtu.be/XYZ123"},
#                                 {"title": "L1.2 Software Development Life Cycle (SDLC)", "youtube_link": "https://youtu.be/ABC456"},
#                                 {"title": "L1.3 Agile Methodologies", "youtube_link": "https://youtu.be/DEF789"},
#                                 {"title": "Tutorial1.1 Writing User Stories", "youtube_link": "https://youtu.be/GHI101"},
#                             ],
#                             "assignments": {
#                                 "graded": [
#                                     {"title": "Assignment 1: Software Development Lifecycle Case Study", "due_date": "2025-03-12","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
#                                 ],
#                                 "non_graded": [
#                                     {"title": "Practice Exercise: Identify SDLC Phases in a Project","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
#                                 ]
#                             }
#                         },
#                         {
#                             "week": 2,
#                             "lectures": [
#                                 {"title": "L2.1 Requirements Engineering", "youtube_link": "https://youtu.be/JKL102"},
#                                 {"title": "L2.2 Software Design Principles", "youtube_link": "https://youtu.be/MNO103"},
#                                 {"title": "L2.3 Object-Oriented Design", "youtube_link": "https://youtu.be/PQR104"},
#                             ],
#                             "assignments": {
#                                 "graded": [
#                                     {"title": "Assignment 2: Design Principles in Software Engineering", "due_date": "2025-03-22","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
#                                 ],
#                                 "non_graded": [
#                                     {"title": "Practice Exercise: Compare Different Software Design Principles","pdf_link": f"/pdfs/assignment1_data_visualization.pdf"},
#                                 ]
#                             }
#                         }
#                     ]
#                 }
#             ]
#         }
#         return jsonify(course_data)

class CourseContent(Resource):
    def get(self):
        """Fetches all course content including lectures and assignments"""
        subjects = subject.query.all()
        print(len(subjects))
        course_data = {"subjects": []}

        for subj in subjects:
            subject_info = {
                "subject_name": subj.subject_name,
                "weeks": []
            }

            for week in range(1, 3):  # Assuming 2 weeks per subject
                lectures_list = lectures.query.filter_by(subject_id=subj.subject_id).all()
                assignments_list = assignment.query.filter_by(subject_id=subj.subject_id).all()

                lectures_data = [
                    {"title": lec.title, "youtube_link": lec.video_link} for lec in lectures_list
                ]
                assignments_data = {
                    "graded": [
                        {"title": a.name, "due_date": str(a.due_date), "pdf_link": f"/pdfs/{a.name}.pdf"} 
                        for a in assignments_list if a.completion
                    ],
                    "non_graded": [
                        {"title": a.name, "pdf_link": f"/pdfs/{a.name}.pdf"}
                        for a in assignments_list if not a.completion
                    ]
                }

                subject_info["weeks"].append({
                    "week": week,
                    "lectures": lectures_data,
                    "assignments": assignments_data
                })

            course_data["subjects"].append(subject_info)

        return jsonify(course_data)

    
def get_upload_folder():
        """Get upload folder path from Flask app context"""
        with current_app.app_context():
            return current_app.config["UPLOAD_FOLDER"]


#class ServePDF(Resource):
  #  def get(self, filename):
   #     """Serves PDFs stored in the uploads directory."""
   #     return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=False)
class ServePDF(Resource):
    def get(self, filename):
        """Serves PDFs stored in the uploads directory."""
        directory = os.path.abspath(current_app.config["UPLOAD_FOLDER"])
        file_path = os.path.join(directory, filename)

        print(f"Attempting to serve: {file_path}")  # Debugging output

        if not os.path.exists(file_path):
            print("File does NOT exist!")  # Debugging output
            return {"error": "File not found"}, 404
        
        return send_from_directory(directory, filename, as_attachment=False)

# Initialize Gemini API with API key
import logging

logging.basicConfig(level=logging.DEBUG)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class AIChat(Resource):
    def post(self):
        """Handles AI-based responses using Google's Gemini API"""
        data = request.get_json()
        user_query = data.get("query")

        if not user_query:
            return jsonify({"error": "Missing query parameter"}), 400

        try:
            model = genai.GenerativeModel("gemini-pro")  # Use Gemini-Pro Model
            response = model.generate_content(user_query)
            
            return jsonify({"response": response.text})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
