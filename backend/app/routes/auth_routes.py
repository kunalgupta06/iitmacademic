from flask import Blueprint
from flask_restful import Api
from app.controllers.user_auth import Login, Register

auth_bp = Blueprint("auth", __name__)
api = Api(auth_bp)

# Define authentication routes
api.add_resource(Login, "/login")
api.add_resource(Register, "/register")
