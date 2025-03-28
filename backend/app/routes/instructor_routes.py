from flask import Blueprint
from flask_restful import Api
from app.controllers.instructor_auth import AddAssignment, AddLecture, CourseContent, InstructorDashboard, GradeAssignment, ViewSubmittedAssignments

instructor_bp = Blueprint("instructor", __name__)
api = Api(instructor_bp)

api.add_resource(InstructorDashboard, "/instructor-dashboard")
api.add_resource(ViewSubmittedAssignments, "/submitted-assignments/<int:subject_id>")
api.add_resource(GradeAssignment, "/grade-assignment")
api.add_resource(CourseContent, "/course-content")
api.add_resource(AddLecture, "/add-lecture")
api.add_resource(AddAssignment, "/add-assignment")
