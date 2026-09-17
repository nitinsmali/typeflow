# TypeFlow

> Type better. Type faster. Flow naturally.

TypeFlow is a focused typing-practice web app for building speed through accuracy, rhythm, and short repeatable sessions. It uses a quiet dark workspace, live feedback, and guided practice content instead of a noisy dashboard.

## What it includes

- Timed sessions for 1, 2, or 5 minutes
- Page-based practice for 1 or 2 pages
- Easy, Focused, and Challenge difficulty levels
- WPM, characters per minute, accuracy, errors, and progress feedback
- Timer that begins with the first keystroke
- Guest practice with no account required
- Optional login, signup, and saved progress history
- Responsive home, practice, auth, library, and progress views
- Custom SVG visuals that match the typing workspace aesthetic

## Quick start

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python run.py
```

### macOS or Linux

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000). The local SQLite database is created automatically on first launch.

## Configuration

Copy `.env.example` to `.env` and set values for local development:

```dotenv
SECRET_KEY=replace-with-a-long-random-value
DATABASE_URL=sqlite:///instance/typeflow.db
```

`.env`, SQLite files, virtual environments, caches, and Python bytecode are ignored by Git. Never commit credentials or generated local data.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page, practice guidance, and lesson picker |
| `/practice` | Timed or page-based typing practice |
| `/library` | Available lessons |
| `/auth` | Login and signup |
| `/progress` | Saved results for signed-in users |

## Project layout

```text
app/
	data.py             Practice text and lesson seed data
	models.py           SQLAlchemy models
	routes.py           Pages and JSON endpoints
	templates/          Jinja page templates
	static/
		css/              Shared visual system
		js/               Client-side interactions and typing logic
		img/              Brand and practice illustrations
config.py             Environment and database configuration
requirements.txt      Python dependencies
run.py                Local Flask entry point
```

## Checks

Run these before opening a pull request:

```powershell
python -m py_compile run.py config.py app/routes.py
git diff --check
```

If Node.js is installed, also validate the browser script:

```powershell
node --check app/static/js/app.js
```

For a complete manual check, choose a lesson, confirm the timer waits for the first character, finish a session, review results, try again, and return home.

## Notes

- Guest results are not attached to an account.
- Database migrations are not configured yet.
- Account recovery and email verification are outside the current scope.
- Authentication should receive additional hardening before public deployment.
