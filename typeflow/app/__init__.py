from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config.from_object("config")
    db.init_app(app)

    from app.routes import main_bp

    app.register_blueprint(main_bp)

    with app.app_context():
        from app.models import User, PracticeSession, TypingResult, Lesson
        db.create_all()
        from app.data import seed_lessons
        seed_lessons()

    return app
