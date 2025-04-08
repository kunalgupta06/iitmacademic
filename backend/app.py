import os
import logging
import traceback
from flask import Flask, session, request, jsonify, current_app
from flask_cors import CORS
from flask_restful import Api
from flask_session import Session
from analytics import AnalyticsEngine, initialize_vertex
from models import db, subject_questions
from config import Config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Import controllers after other dependencies
from controllers.user_auth import (
    Register, Login, StudentDashboard, InstructorDashboard, AddLecture,
    CourseContent, AddAssignment, ViewAssignments, SubmitAssignment,
    ViewSubmittedAssignments, GradeAssignment, ViewScores, ServePDF,
    AIChat, GenerateAnalytics, AnalyticsReport, ExplanationGenerator
)
from controllers.chatbot_apis import ProgrammeGuideline, SubjectQueries





# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Configure upload folder
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER  
ALLOWED_EXTENSIONS = {"pdf"}

# Initialize extensions
api = Api(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE"],
     supports_credentials=True)
db.init_app(app)

# Configure session management
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "supersecretkey"
Session(app)

try:
    with app.app_context():
        # Step 1: Import the model
        from models import subject_questions
        
        # Step 2: Initialize Vertex AI
        vertex_model = initialize_vertex()
        
        # Step 3: Pass the model into the constructor
        analytics_engine = AnalyticsEngine(subject_questions)
        analytics_engine.initialize(vertex_model)
        
        # Step 4: Store in app context
        app.analytics_engine = analytics_engine
        
        # Step 5: Init DB
        db.create_all()
        
        logger.info("✅ All systems initialized")
except Exception as e:
    logger.critical(f"❌ Initialization failed: {str(e)}")
    raise


# Register API routes
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
api.add_resource(AnalyticsReport, '/analyticsreport')
api.add_resource(GenerateAnalytics, '/generate_analytics')
api.add_resource(ExplanationGenerator, '/generateaudio')

# Debug info
logger.info("\n🔗 Registered routes:")
for rule in app.url_map.iter_rules():
    logger.info(f" - {rule}")
    
logger.info(f"\n📁 Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
logger.info(f"📄 Files in upload folder: {os.listdir(UPLOAD_FOLDER)}")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    logger.info("\n🚀 Starting Flask development server...")
    app.run(debug=True)

    
# import os
# import msgpack
# import time
# import traceback
# import logging
# from flask import Flask, request, jsonify, Response, session, current_app
# from flask_restful import Api
# from flask_cors import CORS
# from flask_session import Session
# from models import db

# from dotenv import load_dotenv
# from config import Config
# from analytics import CourseAnalyzerManager
# from controllers.user_auth import (
#     AIChat, AddAssignment, AddLecture, AnalyticsReport, CourseContent,
#     GenerateAnalytics, GradeAssignment, InstructorDashboard, Login, Register,
#     ServePDF, StudentDashboard, SubmitAssignment, ViewAssignments, ViewScores,
#     ViewSubmittedAssignments
# )
# from controllers.chatbot_apis import ProgrammeGuideline, SubjectQueries
# from analytics import initialize_analytics, analytics_engine

# # Initialize Flask app
# app = Flask(__name__)
# app.config.from_object(Config)
# initialize_analytics(app)

# # Configure upload folder
# UPLOAD_FOLDER = "uploads"
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER  
# ALLOWED_EXTENSIONS = {"pdf"}

# # Initialize extensions
# api = Api(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
#      allow_headers=["Content-Type", "Authorization"],
#      methods=["GET", "POST", "PUT", "DELETE"],
#      supports_credentials=True)
# db.init_app(app)

# # Configure session management
# app.config["SESSION_TYPE"] = "filesystem"
# app.config["SECRET_KEY"] = "supersecretkey"
# Session(app)

# # Initialize analytics components
# analytics_manager = CourseAnalyzerManager()
# logger = logging.getLogger(__name__)

# # Add content negotiation headers
# @app.after_request
# def add_content_headers(response):
#     """Add MessagePack support headers"""
#     if 'application/msgpack' in request.headers.get('Accept', '') and \
#        request.accept_mimetypes['application/msgpack'] > request.accept_mimetypes['application/json']:
#         response.headers['X-Content-Type-Options'] = 'nosniff'
#         response.headers['X-Data-Format'] = 'msgpack'
#     return response

# # API Resources
# api.add_resource(Login, "/login")
# api.add_resource(Register, "/register")
# api.add_resource(ProgrammeGuideline, "/programme-guideline")
# api.add_resource(SubjectQueries, "/subject-queries")
# api.add_resource(StudentDashboard, "/student-dashboard")
# api.add_resource(InstructorDashboard, "/instructor-dashboard")
# api.add_resource(CourseContent, "/course-content")
# api.add_resource(AIChat, "/ai-chat")
# api.add_resource(ViewAssignments, "/student-assignments/<int:subject_id>")
# api.add_resource(SubmitAssignment, "/submit-assignment")
# api.add_resource(ViewScores, "/student-scores")
# api.add_resource(AddLecture, "/add-lecture")
# api.add_resource(AddAssignment, "/add-assignment")
# api.add_resource(ViewSubmittedAssignments, "/submitted-assignments/<int:subject_id>")
# api.add_resource(GradeAssignment, "/grade-assignment")
# api.add_resource(ServePDF, "/pdfs/<path:filename>")
# api.add_resource(AnalyticsReport, '/analyticsreport')
# api.add_resource(GenerateAnalytics, '/generate_analytics')

# # Debug routes
# @app.route('/debug/routes')
# def list_routes():
#     return jsonify([str(rule) for rule in app.url_map.iter_rules()])

# if __name__ == "__main__":
#     with app.app_context():
#         db.create_all()
#     app.run(debug=True)