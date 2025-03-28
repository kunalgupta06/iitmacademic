import os

class Config:
    SECRET_KEY = "Kunal@2004"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.sqlite3'
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    UPLOAD_FOLDER = "uploads"  # ADD THIS LINE!

    
   
