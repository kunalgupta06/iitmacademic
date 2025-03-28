from app.database import db
import enum


# Define Enums
class AssignmentType(enum.Enum):
    GRADED = "graded"
    PRACTICE = "practice"

class Week(enum.Enum):
    WEEK_1 = "Week 1"
    WEEK_2 = "Week 2"

# Assignment Model
class Assignment(db.Model):
    assignment_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    completion = db.Column(db.Boolean, nullable=False, default=False)

    # Assignment Type and Week
    assignment_type = db.Column(db.Enum(AssignmentType), nullable=False)
    week = db.Column(db.Enum(Week), nullable=False)

    # Foreign Keys
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.subject_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)  

    # Relationships
    subject = db.relationship('Subject', backref=db.backref('assignments', lazy=True))
    user = db.relationship('User', backref=db.backref('assignments', lazy=True))
