from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate  
from database import db
from config import Config
from flask_jwt_extended import JWTManager

from routes.user_routes import user_bp
from routes.subject_routes import subject_bp
from routes.assignments_routes import assignments_bp

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Initialize JWT
jwt = JWTManager(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(subject_bp, url_prefix="/api/subjects")
app.register_blueprint(assignments_bp, url_prefix="/api/assignments")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
