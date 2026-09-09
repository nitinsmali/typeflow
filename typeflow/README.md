# TypeFlow

TypeFlow is a lightweight typing-practice website built with Flask, SQLAlchemy, and vanilla JavaScript. Its tagline is: **Type better. Type faster. Flow naturally.**

## Features

- Landing page with premium milky-white and blue visual style
- Fully functional typing test with live WPM, accuracy, timers, and error tracking
- Simple timed lessons: 1, 2, or 5 minutes
- Simple page lessons: 1 or 2 pages
- Guest mode with no forced signup
- Optional sign up / login flow with hashed passwords
- Progress dashboard for authenticated users
- SQLite database with clean model structure for future PostgreSQL migration

## Tech Stack

- Flask
- Flask-SQLAlchemy
- SQLite
- Vanilla JavaScript
- CSS custom properties and responsive design

## Local Setup (Windows)

1. Open PowerShell in the project folder.
2. Create a virtual environment:

   python -m venv venv

3. Activate it:

   .\venv\Scripts\Activate.ps1

4. Install dependencies:

   pip install -r requirements.txt

5. Create your environment file:

   Copy-Item .env.example .env

6. Initialize the database by starting the app. The database is created automatically when the app first launches.

## Run the app

From the project root:

   .\venv\Scripts\Activate.ps1
   python run.py

Then visit:

   http://127.0.0.1:5000/

## Environment variables

The project includes `.env.example`:

   SECRET_KEY=change-this-secret-key
   DATABASE_URL=sqlite:///instance/typing_jungle.db

If you want to customize the secret key or database location, update the `.env` file.

## Project structure

- `app/` - Flask app package
  - `templates/` - HTML templates
  - `static/` - CSS and JavaScript assets
  - `data.py` - lesson and practice content
  - `models.py` - SQLAlchemy models
  - `routes.py` - routes and API endpoints
- `instance/` - local SQLite database files
- `config.py` - Flask configuration
- `requirements.txt` - Python dependencies
- `run.py` - app entry point
- `.env.example` - sample environment configuration

## Authentication

The app supports guest practice without an account. Users can also create an account, log in, and view saved typing history.

Passwords are hashed before storage using Werkzeug's password hashing utilities.

## API overview

- `GET /` - landing page
- `GET /practice` - typing workspace with setup screen
- `GET /library` - lesson library
- `GET /progress` - progress dashboard
- `POST /api/auth/register` - sign up
- `POST /api/auth/login` - log in
- `POST /api/auth/logout` - log out
- `POST /api/results` - save a typing result
- `GET /api/results` - get current user's saved results
- `GET /api/lessons` - JSON lesson list

## Troubleshooting

- If the app fails to start, confirm your virtual environment is active and dependencies are installed.
- If the database is not created, delete any stale database file and rerun the app.
- If you get a `409` on registration, the email already exists. Use a different email or sign in.
- If static assets are not loading, confirm the Flask app is running from the project root.

## Future improvements

- Add saved lesson progress per user
- Expand the library with more lessons and categories
- Add challenge mode and multiplayer leaderboards
- Support PostgreSQL migration for production workloads
