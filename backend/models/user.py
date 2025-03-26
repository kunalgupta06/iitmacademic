from database import db

from database import db
import json

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    subjects = db.Column(db.Text, nullable=True, default="[]")  # Stores subject IDs as JSON list

    def get_subjects(self):
        return json.loads(self.subjects) if self.subjects else []

    def set_subjects(self, subject_list):
        self.subjects = json.dumps(subject_list)

