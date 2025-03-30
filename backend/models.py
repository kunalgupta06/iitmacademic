from datetime import datetime
from database import db


class user(db.Model):
    user_id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(50),nullable=False)
    email=db.Column(db.String(50),nullable=False, unique=True)
    username=db.Column(db.String(50), nullable=False, unique=True)
    password=db.Column(db.String(50),nullable=False)
    role=db.Column(db.String(50), nullable=False)

class lectures(db.Model):
    lecture_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    video_link = db.Column(db.String(255))  # Added for video URL
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.subject_id'), nullable=False)
    subject = db.relationship('subject', backref=db.backref('lectures', lazy=True))

class subject(db.Model):
    subject_id = db.Column(db.Integer,primary_key=True)
    subject_name = db.Column(db.String(50),nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    user = db.relationship('user', backref=db.backref('subject', lazy=True))

class assignment(db.Model):
    assignment_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    completion = db.Column(db.Boolean, nullable=False, default=False)
    
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.subject_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)  
    
    subject = db.relationship('subject', backref=db.backref('assignments', lazy=True))
    user = db.relationship('user', backref=db.backref('assignments', lazy=True)) 


class score(db.Model):
    score_id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False, default =0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.assignment_id'), nullable=False)

    

    user = db.relationship('user', backref=db.backref('score', lazy=True))
    assignment = db.relationship('assignment', backref=db.backref('score', lazy=True))

