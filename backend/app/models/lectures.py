from app.models.assignment import Week
from app.database import db

class Lectures(db.Model):
    lecture_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    video_link = db.Column(db.String(255))  

    # Foreign Keys
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.subject_id'), nullable=False)
    week = db.Column(db.Enum(Week), nullable=False)  # Added week field

    # Relationships
    subject = db.relationship('Subject', backref=db.backref('lectures', lazy=True))
