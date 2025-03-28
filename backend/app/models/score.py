from app.database import db

class Score(db.Model):
    score_id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.assignment_id'), nullable=False)

    user = db.relationship('User', backref=db.backref('scores', lazy=True))
    assignment = db.relationship('Assignment', backref=db.backref('scores', lazy=True))
