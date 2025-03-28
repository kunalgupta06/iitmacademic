from flask import Blueprint
from flask_restful import Api

from app.controllers.student_auth import StudentDashboard, ViewAssignments, SubmitAssignment, ViewScores, Question
from app.controllers.chatbot import AIChat, ServePDF  

student_bp = Blueprint("student", __name__)
api = Api(student_bp)

api.add_resource(StudentDashboard, "/student-dashboard")
api.add_resource(ViewAssignments, "/assignments/<int:subject_id>")
api.add_resource(SubmitAssignment, "/submit-assignment")
api.add_resource(ViewScores, "/student-scores")
api.add_resource(AIChat, "/ai-chat")
api.add_resource(ServePDF, '/pdfs/<filename>')
api.add_resource(Question, '/question')