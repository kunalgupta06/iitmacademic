import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from app.config import Config
from app.database import db  # Import from extensions.py
from app.routes.auth_routes import auth_bp  # Import Blueprint
from app.routes.student_routes import student_bp
from app.routes.instructor_routes import instructor_bp

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize database & CORS
db.init_app(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, 
     allow_headers=["Content-Type", "Authorization"], 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Ensure upload folder exists
if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(student_bp, url_prefix="/student")
app.register_blueprint(instructor_bp, url_prefix="/instructor")

# Run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
