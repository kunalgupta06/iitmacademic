from app.models.assignment import AssignmentType, Week
from app.database import db


# Question Model (Fixed)
class Question(db.Model):
    question_id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)  
    option_a = db.Column(db.String(255), nullable=False)
    option_b = db.Column(db.String(255), nullable=False)
    option_c = db.Column(db.String(255), nullable=False)
    option_d = db.Column(db.String(255), nullable=False)
    correct_answer = db.Column(db.String(1), nullable=False)  

    # Foreign Keys
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.assignment_id'), nullable=False)
    
    # Relationship
    assignment = db.relationship('Assignment', backref=db.backref('questions', lazy=True, cascade="all, delete-orphan"))
