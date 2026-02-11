# CRNA Interview Prep Study Site

Interactive pharmacology study app for CRNA program interview preparation. Built with React + Vite.

## Features
- Medication deep dives with MOA, receptor physiology, dosing, metabolism, warnings, and clinical pearls
- Interactive receptor/molecular mechanism diagrams (exportable as JPEG/PNG)
- ACLS/PALS protocol cards with AHA 2025 algorithm links
- Confidence tracking, personal notes, and search
- Dark/light theme toggle
- PDF export for each medication card

## Current Medications
- **Propofol** — GABA-A receptor agonist + full receptor diagram
- **Norepinephrine** — α₁/β₁/α₂ adrenergic pathways + baroreceptor reflex diagram

## Current Protocols
10 ACLS/PALS protocols with AHA 2025 algorithm PDFs

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Deploy to Vercel (Recommended)

### First-Time Setup (5 minutes)

1. **Push to GitHub:**
   ```bash
   # In this project folder:
   git init
   git add .
   git commit -m "Initial commit"

   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/crna-study-site.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) → Sign up with GitHub
   - Click "Add New Project"
   - Import your `crna-study-site` repo
   - Framework: **Vite** (auto-detected)
   - Click "Deploy"
   - Done! Your site is live at `crna-study-site.vercel.app`

### Updating the Site

**Option A — Manual (download from Claude):**
```bash
# Replace src/App.jsx with the updated file from Claude
cp ~/Downloads/crna-study-site.jsx src/App.jsx
git add .
git commit -m "Add new medication: epinephrine"
git push
# Vercel auto-deploys in ~30 seconds
```

**Option B — Claude Code (fully automated):**
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# In your project folder:
claude
# Then tell it: "Add epinephrine to src/App.jsx"
# It edits, commits, and pushes — Vercel auto-deploys
```

## Project Structure

```
crna-study-site/
├── index.html          # Entry point
├── package.json        # Dependencies
├── vite.config.js      # Build config
├── src/
│   ├── main.jsx        # React root
│   └── App.jsx         # ← THE STUDY SITE (all content lives here)
└── README.md
```

**All content lives in `src/App.jsx`.** When Claude gives you an updated file, just replace that one file and push.

## Tech Stack
- React 18
- Vite 6
- Zero external UI libraries (pure React + inline styles)
- No database needed (all data is in-component)
