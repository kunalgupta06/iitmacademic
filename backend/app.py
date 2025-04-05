import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from database import db
from config import Config
from controllers.user_auth import AIChat, AddAssignment, AddLecture, CourseContent, GradeAssignment, InstructorDashboard, Login, Register, ServePDF, StudentDashboard, SubmitAssignment, ViewAssignments, ViewScores, ViewSubmittedAssignments
from controllers.chatbot_apis import ProgrammeGuideline, SubjectQueries
from flask import Flask, session
from models import db, subject_questions
from flask_session import Session
from flask import Flask, request, jsonify
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


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
api.add_resource(ProgrammeGuideline, "/programme-guideline")
api.add_resource(SubjectQueries, "/subject-queries")
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
