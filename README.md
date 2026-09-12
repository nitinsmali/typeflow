# TypeFlow

TypeFlow is a simple typing-practice website built with Flask, SQLAlchemy, vanilla JavaScript, and CSS.

**Tagline:** Type better. Type faster. Flow naturally.

## Features

- Timed practice: 1, 2, or 5 minutes
- Page practice: 1 or 2 pages
- Easy, Focused, and Challenge difficulty levels
- Live WPM, accuracy, errors, characters, and progress
- Guest practice without required registration
- Optional account login and progress history
- Responsive interface with custom TypeFlow branding

## Run locally

From the project root:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py
```

Open `http://127.0.0.1:5000/`.

On macOS or Linux:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

The local SQLite database is created automatically on first launch. Stop the app with `Ctrl+C`.

## Local configuration

`.env.example` contains placeholder values:

```dotenv
SECRET_KEY=replace-with-a-long-random-value
DATABASE_URL=sqlite:///instance/typeflow.db
```

Keep `.env`, database files, passwords, tokens, and other private values out of Git. Never publish real credentials in documentation, screenshots, issues, or pull requests.

## Project structure

- `app/` - Flask application, routes, models, templates, and static assets
- `app/data.py` - practice text and lesson data
- `app/static/img/` - TypeFlow illustrations and favicon
- `instance/` - local SQLite data
- `config.py` - application configuration
- `requirements.txt` - Python dependencies
- `run.py` - local entry point

## Main routes

- `/` - landing page
- `/practice` - typing practice
- `/library` - lesson library
- `/auth` - optional login and signup
- `/progress` - signed-in user progress

## Development checks

Run these checks before submitting changes:

```powershell
python -m py_compile run.py config.py app/routes.py
node --check app/static/js/app.js
git diff --check
```

Keep changes small and focused. Test the complete flow: choose a lesson, type, finish the session, review results, try again, and return home.

## Current limitations

- No automated test suite yet
- Database schema migrations are not configured
- Guest results are not saved to an account
- Account recovery and email verification are not included
- Authentication still needs additional hardening before public use

## Recommended future improvements

1. Add tests for lesson selection, typing metrics, authentication, and result saving.
2. Add database migrations and improve account security.
3. Improve keyboard accessibility and mobile layouts.
4. Add personal bests and saved progress.
5. Expand lesson content while keeping the interface simple.
6. Add continuous integration checks for every pull request.

## Contributing

Create a focused branch, make the smallest useful change, run the checks above, and open a pull request with a clear summary. Do not include confidential data or generated local database files.
