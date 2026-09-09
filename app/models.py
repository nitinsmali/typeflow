from datetime import datetime

from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    practice_sessions = db.relationship("PracticeSession", back_populates="user", cascade="all, delete-orphan")
    typing_results = db.relationship("TypingResult", back_populates="user", cascade="all, delete-orphan")


class PracticeSession(db.Model):
    __tablename__ = "practice_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    mode = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", back_populates="practice_sessions")


class TypingResult(db.Model):
    __tablename__ = "typing_results"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    wpm = db.Column(db.Float, nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    errors = db.Column(db.Integer, nullable=False)
    characters_typed = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    mode = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", back_populates="typing_results")


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    estimated_time = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
