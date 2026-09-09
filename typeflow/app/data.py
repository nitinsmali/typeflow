from app import db
from app.models import Lesson

LESSON_LIBRARY = [
    {
        "title": "Home Row Basics",
        "description": "Build confidence with the foundation keys used in everyday typing.",
        "difficulty": "Beginner",
        "category": "Home Row",
        "estimated_time": "8 min",
        "content": "asdf jkl; asdf jkl; asdf jkl; the quick brown fox jumps over the lazy dog while your fingers remain relaxed and steady.",
    },
    {
        "title": "Top Row Warmup",
        "description": "Practice the upper-row keys that unlock speed and rhythm.",
        "difficulty": "Beginner",
        "category": "Top Row",
        "estimated_time": "10 min",
        "content": "qwerty uiop qwerty uiop. type with relaxed wrists and a steady pace while keeping your eyes on the screen.",
    },
    {
        "title": "Speed Sentences",
        "description": "Short exercises designed to improve smooth keystroke flow and confidence.",
        "difficulty": "Intermediate",
        "category": "Sentences",
        "estimated_time": "12 min",
        "content": "The best way to improve typing is to practice gently every day and stay consistent with a relaxed rhythm and steady pace.",
    },
    {
        "title": "Focus Paragraph",
        "description": "A longer practice paragraph for accurate, controlled typing.",
        "difficulty": "Intermediate",
        "category": "Paragraphs",
        "estimated_time": "15 min",
        "content": "Typing accuracy matters more than raw speed at first. Keep your hands poised over the keyboard, look ahead, and let your fingers move in a smooth and efficient rhythm.",
    },
    {
        "title": "Code Rhythm",
        "description": "A programming-focused set that helps improve speed on common symbols and words.",
        "difficulty": "Advanced",
        "category": "Programming",
        "estimated_time": "18 min",
        "content": "const data = { name: 'typing', speed: 72, accuracy: 98 }; function practice() { return data.speed + data.accuracy; }",
    },
    {
        "title": "Number Flow",
        "description": "Improve control and accuracy when working with numbers and symbols.",
        "difficulty": "Advanced",
        "category": "Numbers",
        "estimated_time": "14 min",
        "content": "1234567890 9876543210 2025 18.42 7.25 44% 11:42 PM, built for speed and clean accuracy with careful rhythm.",
    },
]

PRACTICE_LIBRARY = {
    "beginner": [
        "as soon as you begin, keep your fingers relaxed and your posture comfortable.",
        "practice a few lines at a time and let your accuracy grow before speeding up.",
        "the home row is the foundation for every good typing habit and strong rhythm.",
    ],
    "intermediate": [
        "consistent practice creates calm progress and steadier keystrokes over time.",
        "good touch typing depends on rhythm, focus, and the ability to stay relaxed under pressure.",
        "when your eyes stay in front of the words, your fingers can move with clarity and confidence.",
    ],
    "advanced": [
        "precision under pressure is the mark of a strong typist; focus on smooth motion and clean patterns.",
        "efficient keyboard control turns repetitive practice into real momentum for speed, accuracy, and confidence.",
        "the most productive sessions combine deliberate pacing, strong posture, and a steady flow of text.",
    ],
    "numbers": [
        "1234567890 9876543210 2024 44 18.5 7.25 99.9 percent accuracy during timed practice.",
        "5, 12, 18, 27, 36, 45, 52, 64, 78, 91, 104, 120, 135, 148, 160 are included in this session.",
    ],
    "programming": [
        "const user = { name: 'Avery', level: 'advanced', focus: 'precision' }; return user.name + user.level;",
        "function buildSpeed() { let wpm = 72; let accuracy = 97; return wpm * accuracy; }",
    ],
    "mixed": [
        "typing mastery grows from calm repetition, accurate habits, and daily practice built around confidence.",
        "the goal is not rushing; the goal is smooth movement, deliberate timing, and clean results under pressure.",
        "every session strengthens memory, patterns, and control, which leads to stable improvements in speed and focus.",
    ],
}


def seed_lessons():
    if Lesson.query.first():
        return

    for lesson in LESSON_LIBRARY:
        db.session.add(Lesson(**lesson))
    db.session.commit()
