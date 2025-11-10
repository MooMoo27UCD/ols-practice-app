# OLS Practice App

A minimal, self‑contained web app for practicing **simple linear regression (OLS)** concepts for your MBA midterm. It includes six conceptual/computational questions with toggleable solutions.

## What’s inside
- `index.html` – the single page with prompts and solution panels
- `style.css` – clean, minimal styles (no frameworks)
- `app.js` – tiny JS to toggle panels and show/hide all
- This app is static: open `index.html` locally in your browser

## Run locally
No build tools needed.
1. Unzip the bundle.
2. Double‑click `index.html` (or serve the folder with any static server).

## Editing
- Add new questions by copying a `<section class="card">…</section>` block in `index.html`.
- Use `data-target="id-of-solution"` on a button and a matching `<div id="…">` with class `solution hidden`.

## Attribution
Content derived from your “Practice Exam – OLS” materials (questions and solutions).
