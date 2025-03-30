import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from database import db
from config import Config
from controllers.user_auth import AIChat, AddAssignment, AddLecture, CourseContent, GradeAssignment, InstructorDashboard, Login, Register, ServePDF, StudentDashboard, SubmitAssignment, ViewAssignments, ViewScores, ViewSubmittedAssignments
from flask import Flask, session
from flask_session import Session

app = Flask(__name__)
app.config.from_object(Config)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER  
ALLOWED_EXTENSIONS = {"pdf"}

api = Api(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE"],
     supports_credentials=True)  # Ensure credentials are supported
db.init_app(app)

app.config["SESSION_TYPE"] = "filesystem"  # Store session data in files
app.config["SECRET_KEY"] = "supersecretkey"  # Needed for session encryption
Session(app) 

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
api.add_resource(ServePDF, "/pdfs/<path:filename>")
print(app.url_map)
print("UPLOAD_FOLDER Path:", os.path.abspath(UPLOAD_FOLDER))
print("Files in UPLOAD_FOLDER:", os.listdir(UPLOAD_FOLDER))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
