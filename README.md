# TypeFlow

TypeFlow is a lightweight typing-practice website built with Flask, SQLAlchemy, and vanilla JavaScript. Its tagline is: **Type better. Type faster. Flow naturally.**

## Project status

TypeFlow is a working MVP for local use, portfolio demonstration, and community improvement. The core typing flow is complete, but production deployment should wait until the security and database items in the roadmap are addressed.

## Features

- Focused landing page with TypeFlow branding
- Live WPM, accuracy, timers, character counts, and error tracking
- Timed lessons: 1, 2, or 5 minutes
- Page lessons: 1 or 2 pages
- Guest practice with no forced signup
- Optional signup and login with hashed passwords
- Progress dashboard for authenticated users
- SQLite database with a clear path to PostgreSQL

## Quick start

From the repository root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py
```

Open `http://127.0.0.1:5000/`. The first launch creates the local SQLite database and seeds lesson records. Stop the development server with `Ctrl+C`.

On macOS or Linux, use `source venv/bin/activate` instead of the PowerShell activation command.

## Tech stack

- Flask
- Flask-SQLAlchemy
- SQLite for development
- Vanilla JavaScript
- CSS custom properties and responsive design

## Configuration

Copy `.env.example` to `.env` for local development:

```dotenv
SECRET_KEY=replace-with-a-long-random-value
DATABASE_URL=sqlite:///instance/typing_jungle.db
```

- Never commit `.env` or real credentials.
- Use a long random `SECRET_KEY` outside local development.
- Use PostgreSQL for a persistent production deployment.
- `instance/` contains local runtime data and is not source code.

## Project structure

- `app/` - Flask application package
  - `templates/` - HTML templates
  - `static/` - CSS, JavaScript, and image assets
  - `data.py` - lesson and practice content
  - `models.py` - SQLAlchemy models
  - `routes.py` - web routes and API endpoints
- `instance/` - local SQLite database files
- `config.py` - Flask configuration
- `requirements.txt` - Python dependencies
- `run.py` - application entry point
- `.env.example` - sample environment configuration

## Production deployment

The simplest hosting choice for this Flask MVP is **Render** or **Railway**. Both can deploy directly from GitHub.

```text
Build command: pip install -r requirements.txt
Start command: gunicorn run:app
```

Before deploying, add Gunicorn:

```powershell
pip install gunicorn
pip freeze > requirements.txt
```

Configure `SECRET_KEY` and a PostgreSQL `DATABASE_URL` in the hosting provider's environment settings. Do not run `python run.py` or Flask debug mode in production. Add a health check for `/` and configure database backups.

## Development workflow

1. Create a branch for each change.
2. Run the app locally and test guest practice, account flows, and results.
3. Keep the experience focused: choose a lesson, type, view results, or return home.
4. Validate JavaScript with `node --check app/static/js/app.js`.
5. Open a pull request with a concise description and screenshots for visual changes.

## Authentication and security

Users can practice as guests or create an account, log in, and view saved typing history. Passwords are hashed with Werkzeug.

Authentication is currently an MVP implementation. Before public launch, add CSRF protection, rate limiting, secure cookie settings, password reset, email verification, and production session configuration.

## API overview

- `GET /` - landing page
- `GET /practice` - typing workspace
- `GET /library` - lesson library
- `GET /progress` - progress dashboard
- `POST /api/auth/register` - sign up
- `POST /api/auth/login` - log in
- `POST /api/auth/logout` - log out
- `POST /api/results` - save a typing result
- `GET /api/results` - get the current user's saved results
- `GET /api/lessons` - JSON lesson list

## Troubleshooting

- Confirm the virtual environment is active and dependencies are installed.
- If the database is not created, delete the local database and rerun the app.
- A `409` during registration means the email already exists.
- If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process Bypass` and activate again.
- If port `5000` is busy, stop the other development server or change the port in `run.py`.
- If static assets are missing, confirm Flask is running from the repository root.

## Known limitations

- There is no automated test suite yet.
- Schema migrations are not configured; tables currently use `db.create_all()`.
- SQLite is not appropriate for multiple production workers or durable cloud storage.
- Guest results are not associated with an account.
- There is no password reset, email verification, moderation, or abuse protection.
- The development entry point enables debug mode and must not be used as the production server.

## Prioritized roadmap

### High priority

1. Add automated tests for lesson selection, typing metrics, authentication, and result persistence.
2. Add Flask-Migrate/Alembic migrations and verify PostgreSQL support.
3. Harden authentication with CSRF protection, secure cookies, rate limiting, and password reset.
4. Add a production WSGI configuration, health check, structured logging, and deployment checks.
5. Fix accessibility gaps: keyboard navigation, focus states, semantic labels, and color contrast.

### Medium priority

6. Add personal bests and saved progress for signed-in users.
7. Test and improve mobile and tablet typing layouts.
8. Expand the curated lesson library without adding unnecessary interface complexity.
9. Add CI checks for Python syntax, JavaScript syntax, and the test suite.

### Later

10. Add optional challenges or leaderboards after the core experience is stable.
11. Add privacy-respecting, minimal analytics only if product decisions need them.
12. Add a custom domain, monitoring, backups, and performance tuning.

Contributors should start with the open GitHub issues, especially the production-readiness issue, and keep changes small and focused.
