from app import app  
from database import db
from models import user
from flask_migrate import Migrate

migrate = Migrate(app, db)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Tables created successfully!")
