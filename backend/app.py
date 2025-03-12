import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from database import db
from config import Config
from controllers.user_auth import AIChat, AddAssignment, AddLecture, CourseContent, GradeAssignment, InstructorDashboard, Login, Register, ServePDF, StudentDashboard, SubmitAssignment, ViewAssignments, ViewScores, ViewSubmittedAssignments

app = Flask(__name__)
app.config.from_object(Config)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER  
ALLOWED_EXTENSIONS = {"pdf"}

api = Api(app)
CORS(app)

db.init_app(app)

# Load API Routes
api.add_resource(Login, "/login")
api.add_resource(Register, "/register")
api.add_resource(StudentDashboard, "/student-dashboard")
api.add_resource(InstructorDashboard, "/instructor-dashboard")
api.add_resource(CourseContent, "/course-content")
api.add_resource(AIChat, "/ai-chat")
api.add_resource(ViewAssignments, "/student-assignments/<int:subject_id>")
api.add_resource(SubmitAssignment, "/submit-assignment")
api.add_resource(ViewScores, "/student-scores")
api.add_resource(AddLecture, "/add-lecture")
api.add_resource(AddAssignment, "/add-assignment")
api.add_resource(ViewSubmittedAssignments, "/submitted-assignments/<int:subject_id>")
api.add_resource(GradeAssignment, "/grade-assignment")
api.add_resource(ServePDF, '/pdfs/<filename>')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
