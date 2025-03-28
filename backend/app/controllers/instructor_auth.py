import os
import google.generativeai as genai
import fitz
from flask import   app, current_app, jsonify, make_response, request, send_from_directory, session, url_for
from app.models import assignment, lectures, score, subject, User
from app.database import db
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename


class InstructorDashboard(Resource):
    
    def get(self):
        """Fetches analytics for instructors instead of courses"""
        if "User" not in session or session["User"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        # Fetch total number of students
        total_students = User.query.filter_by(role="student").count()

        # Fetch total number of subjects managed by this instructor
        instructor_id = session["User"]["id"]
        total_subjects = subject.query.filter_by(User_id=instructor_id).count()

        # Fetch total number of assignments created by this instructor
        total_assignments = assignment.query.join(subject).filter(subject.User_id == instructor_id).count()

        # Fetch total number of submitted assignments
        total_submitted_assignments = score.query.join(assignment).join(subject).filter(subject.User_id == instructor_id).count()

        analytics_data = {
            "total_students": total_students,
            "total_subjects_managed": total_subjects,
            "total_assignments": total_assignments,
            "total_submitted_assignments": total_submitted_assignments
        }
        ###"""""""" SANKALP'S ANALYTICS ADD KARNA HAI YAHA PE """"""""""

        return jsonify(analytics_data)



class AddLecture(Resource):
    def post(self):
        """Allows an instructor to add a new lecture"""
        if "User" not in session or session["User"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.get_json()
        title = data.get("title")
        video_link = data.get("video_link")
        subject_id = data.get("subject_id")
        lecture_number = data.get("lecture_number")  # Add lecture number

        if not all([title, video_link, subject_id, lecture_number]):
            return {"error": "Missing required fields"}, 400

        # Ensure subject_id exists
        subject = subject.Subject.query.get(subject_id)
        if not subject:
            return {"error": "Subject not found"}, 404

        new_lecture = lectures.Lectures(title=title, video_link=video_link, subject_id=subject_id, week=lecture_number)
        db.session.add(new_lecture)
        db.session.commit()

        return jsonify({"message": "Lecture added successfully"})


def allowed_file(filename):
    # Helper function to check allowed file extensions (e.g., PDF)
    ALLOWED_EXTENSIONS = {'pdf'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class AddAssignment(Resource):
    def post(self):
        """Allows an instructor to add a new assignment with PDF upload"""
        if "User" not in session or session["User"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.form
        name = data.get("name")
        due_date = data.get("due_date")
        subject_id = data.get("subject_id")
        assignment_type = data.get("assignment_type")  # New field for type (e.g., graded, practice)
        week = data.get("week")  # New field for week

        if not all([name, due_date, subject_id, assignment_type, week]):
            return {"error": "Missing required fields"}, 400

        # Ensure subject_id exists
        subject = subject.Subject.query.get(subject_id)
        if not subject:
            return {"error": "Subject not found"}, 404

        # Process PDF file
        file = request.files.get("file")
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))  # ✅ Fix Here!
            pdf_link = f"/pdfs/{filename}"
        else:
            pdf_link = None  # If no PDF provided

        new_assignment = assignment.Assignment(
            name=name,
            due_date=due_date,
            subject_id=subject_id,
            assignment_type=assignment_type,
            week=week,  # Adding the week field
            completion=False,
        )

        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({"message": "Assignment added successfully", "pdf_link": pdf_link})



class ViewSubmittedAssignments(Resource):
    def get(self, subject_id):
        """Fetches all student submissions for an assignment"""
        if "User" not in session or session["User"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        # Ensure uploads folder exists
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        if not os.path.exists(upload_folder):
            return {"error": "Uploads folder not found"}, 500

        submitted_files = os.listdir(upload_folder)
        submissions = [file for file in submitted_files if file.startswith(f"student_")]

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

    
# class GradeAssignment(Resource):
#     def post(self):
#         """Allows an instructor to grade student assignments using AI Assistance"""
#         if "user" not in session or session["user"]["role"] != "instructor":
#             return {"error": "Unauthorized access"}, 403

#         data = request.get_json()
#         student_id = data.get("student_id")
#         assignment_id = data.get("assignment_id")
#         score_value = data.get("score")
#         file_path = f"uploads/student_{student_id}_assignment_{assignment_id}.pdf"

#         if not all([student_id, assignment_id, score_value]):
#             return {"error": "Missing required fields"}, 400

#         # Extract text from the PDF
#         extracted_text = self.extract_text_from_pdf(file_path)

#         # Generate AI feedback
#         ai_feedback = self.analyze_with_gemini(extracted_text)

#         # Save the score in the database
#         new_score = score(user_id=student_id, assignment_id=assignment_id, score=score_value)
#         db.session.add(new_score)
#         db.session.commit()

#         return jsonify({"message": "Score added successfully", "ai_feedback": ai_feedback})

#     def extract_text_from_pdf(self, file_path):
#         """Extracts text from a PDF using PyMuPDF"""
#         text = ""
#         try:
#             with fitz.open(file_path) as doc:
#                 for page in doc:
#                     text += page.get_text()
#         except Exception as e:
#             print(f"Error extracting text: {e}")
#         return text

#     def analyze_with_gemini(self, extracted_text):
#         """Sends extracted text to Gemini API for AI-based grading assistance"""
#         prompt = f"Evaluate the following student assignment and provide a score out of 100 with constructive feedback:\n\n{extracted_text}"
        
#         try:
#             response = genai.generate_text(prompt)
#             return response.text
#         except Exception as e:
#             print(f"Error with AI grading: {e}")
#             return "AI grading failed."


class GradeAssignment(Resource):
    def post(self):
        """Allows an instructor to grade student assignments using AI Assistance"""
        if "User" not in session or session["User"]["role"] != "instructor":
            return {"error": "Unauthorized access"}, 403

        data = request.get_json()
        student_id = data.get("student_id")
        assignment_id = data.get("assignment_id")
        score_value = data.get("score")
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], f"student_{student_id}_assignment_{assignment_id}.pdf")

        if not all([student_id, assignment_id, score_value]):
            return {"error": "Missing required fields"}, 400

        # Ensure student and assignment exist
        student = User.User.query.get(student_id)
        assignment = assignment.Assignment.query.get(assignment_id)
        if not student or not assignment:
            return {"error": "Student or Assignment not found"}, 404

        # Check if file exists
        if not os.path.exists(file_path):
            return {"error": f"Assignment file not found: {file_path}"}, 404

        # Extract text from the PDF
        extracted_text = self.extract_text_from_pdf(file_path)

        # Generate AI feedback
        ai_feedback = self.analyze_with_gemini(extracted_text)

        # Save the score in the database
        new_score = score.Score(User_id=student_id, assignment_id=assignment_id, score=score_value)
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
    ALLOWED_EXTENSIONS = {"pdf"}  # Assuming PDFs are the only allowed extension
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


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
        course_data = {"subjects": []}

        for subj in subjects:
            subject_info = {
                "subject_name": subj.subject_name,
                "weeks": []
            }

            # Fetch all lectures and assignments for this subject in one query
            lectures_list = lectures.query.filter_by(subject_id=subj.subject_id).all()
            assignments_list = assignment.query.filter_by(subject_id=subj.subject_id).all()

            # Assuming we need to group by weeks (maybe from another field like 'week_number' in lectures)
            week_groups = {}  # Will store lectures and assignments grouped by week number
            for lec in lectures_list:
                week_groups.setdefault(lec.week_number, {"lectures": [], "assignments": []})["lectures"].append({
                    "title": lec.title,
                    "youtube_link": lec.video_link
                })

            for a in assignments_list:
                week_groups.setdefault(a.week_number, {"lectures": [], "assignments": []})["assignments"].append({
                    "title": a.name,
                    "due_date": str(a.due_date),
                    "pdf_link": f"/pdfs/{a.name}.pdf",
                    "graded": a.completion
                })

            # Populate subject info for each week
            for week, content in week_groups.items():
                assignments_data = {
                    "graded": [a for a in content["assignments"] if a["graded"]],
                    "non_graded": [a for a in content["assignments"] if not a["graded"]]
                }
                subject_info["weeks"].append({
                    "week": week,
                    "lectures": content["lectures"],
                    "assignments": assignments_data
                })

            course_data["subjects"].append(subject_info)

        return jsonify(course_data)
