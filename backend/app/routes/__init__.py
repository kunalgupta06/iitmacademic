from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    CORS(app)
    db.init_app(app)
    api = Api(app)
   

    # from Backend_AI_AGENT.controllers.user_auth import register, login
    # api.add_resource(register, '/register')
    # api.add_resource(login, '/login')

    return app
