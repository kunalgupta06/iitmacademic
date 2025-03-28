from app.main import app  # Main app instance
from app.database import db  # Single db instance
from app.models import User, subject, score, lectures, assignment, questions

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Tables created successfully!")




# import sys
# import os

# # Add the parent directory to sys.path to allow Python to find the 'app' module
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# from app import app  # Import the Flask app
# from app.extensions import db  # Import db from extensions
# from flask_migrate import Migrate

# # Initialize Migrate
# migrate = Migrate(app, db)

# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all()  # Create all tables
#         print("Tables created successfully!")
