import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
INSTANCE_DIR = BASE_DIR / "instance"
INSTANCE_DIR.mkdir(exist_ok=True)

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
database_url = os.getenv("DATABASE_URL")
if database_url and database_url.startswith("sqlite:///"):
    database_path = Path(database_url.removeprefix("sqlite:///"))
    if not database_path.is_absolute():
        database_url = f"sqlite:///{(BASE_DIR / database_path).resolve().as_posix()}"

SQLALCHEMY_DATABASE_URI = database_url or f"sqlite:///{INSTANCE_DIR / 'typeflow.db'}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
