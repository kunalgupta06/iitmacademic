from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Database Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Change for production
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    api = Api(app)

    # Import controllers to avoid circular imports
    from Backend_AI_AGENT.controllers.user_auth import Register, Login

    # Register API endpoints
    api.add_resource(Register, '/register')
    api.add_resource(Login, '/login')

    return app

