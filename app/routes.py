from datetime import datetime

from flask import Blueprint, jsonify, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from app import db
from app.data import PRACTICE_LIBRARY
from app.models import Lesson, PracticeSession, TypingResult, User

main_bp = Blueprint("main", __name__)


def normalize_user(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }


@main_bp.route("/")
def index():
    return render_template("index.html", page="home")


@main_bp.route("/practice")
def practice():
    return render_template("practice.html", page="practice", practice_library=PRACTICE_LIBRARY)


@main_bp.route("/library")
def library():
    lessons = Lesson.query.order_by(Lesson.id.asc()).all()
    return render_template("library.html", page="library", lessons=lessons)


@main_bp.route("/auth")
def auth_page():
    return render_template("auth.html", page="auth")


@main_bp.route("/progress")
def progress_page():
    user = None
    if session.get("user_id"):
        user = User.query.get(session["user_id"])
    results = []
    if user:
        results = TypingResult.query.filter_by(user_id=user.id).order_by(TypingResult.created_at.desc()).limit(10).all()
    return render_template("progress.html", page="progress", user=user, results=results)


@main_bp.route("/lesson/<int:lesson_id>")
def lesson_detail(lesson_id):
    lesson = Lesson.query.get_or_404(lesson_id)
    return render_template("practice.html", page="practice", selected_lesson=lesson, practice_library=PRACTICE_LIBRARY)


@main_bp.route("/api/auth/register", methods=["POST"])
def register_user():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not name or not email or len(password) < 6:
        return jsonify({"success": False, "message": "Please provide a valid name, email, and password with at least 6 characters."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "An account with this email already exists."}), 409

    user = User(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    session["user_id"] = user.id
    return jsonify({"success": True, "user": normalize_user(user)})


@main_bp.route("/api/auth/login", methods=["POST"])
def login_user():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    session["user_id"] = user.id
    return jsonify({"success": True, "user": normalize_user(user)})


@main_bp.route("/api/auth/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return jsonify({"success": True})


@main_bp.route("/api/profile")
def profile():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"authenticated": False})

    user = User.query.get(user_id)
    if not user:
        session.pop("user_id", None)
        return jsonify({"authenticated": False})

    return jsonify({"authenticated": True, "user": normalize_user(user)})


@main_bp.route("/api/lessons")
def get_lessons():
    lessons = Lesson.query.order_by(Lesson.id.asc()).all()
    return jsonify(
        [
            {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "difficulty": lesson.difficulty,
                "category": lesson.category,
                "estimated_time": lesson.estimated_time,
                "content": lesson.content,
            }
            for lesson in lessons
        ]
    )


@main_bp.route("/api/results", methods=["POST"])
def save_result():
    payload = request.get_json(silent=True) or {}
    wpm = float(payload.get("wpm", 0) or 0)
    accuracy = float(payload.get("accuracy", 0) or 0)
    errors = int(payload.get("errors", 0) or 0)
    characters_typed = int(payload.get("characters_typed", 0) or 0)
    duration = int(payload.get("duration", 0) or 0)
    difficulty = (payload.get("difficulty") or "beginner").strip()
    mode = (payload.get("mode") or "timed").strip()
    category = (payload.get("category") or "mixed").strip()

    user_id = session.get("user_id")

    result = TypingResult(
        user_id=user_id,
        wpm=wpm,
        accuracy=accuracy,
        errors=errors,
        characters_typed=characters_typed,
        duration=duration,
        difficulty=difficulty,
        mode=mode,
        category=category,
        created_at=datetime.utcnow(),
    )
    db.session.add(result)
    db.session.commit()

    return jsonify({"success": True, "id": result.id})


@main_bp.route("/api/results")
def current_results():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify([])

    results = TypingResult.query.filter_by(user_id=user_id).order_by(TypingResult.created_at.desc()).all()
    return jsonify(
        [
            {
                "id": r.id,
                "wpm": r.wpm,
                "accuracy": r.accuracy,
                "errors": r.errors,
                "characters_typed": r.characters_typed,
                "duration": r.duration,
                "difficulty": r.difficulty,
                "mode": r.mode,
                "category": r.category,
                "created_at": r.created_at.isoformat(),
            }
            for r in results
        ]
    )


@main_bp.route("/api/results/history")
def result_history():
    return current_results()
