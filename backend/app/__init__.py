from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api

# Initialize extensions (without binding to app yet)
db = SQLAlchemy()
api = Api()

def create_app():
    app = Flask(__name__)

    # Config (example: database URI placeholder)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    api.init_app(app)


    return app
