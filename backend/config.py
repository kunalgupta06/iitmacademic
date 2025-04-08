import os


class Config:
    SECRET_KEY="Kunal@2004"
    SQLALCHEMY_DATABASE_URI='sqlite:///database.sqlite3'
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GOOGLE_CONFIG = os.getenv("821b6d1955a406316bf104284f9cd104bfcf3a74")
    
   
