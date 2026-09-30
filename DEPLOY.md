# Portfolio v2 — Deploy Guide

## Overview
- **Backend** → Render (Node + Express + MongoDB)
- **Frontend** → Netlify (React, auto-deploys on every git push)
- **Database** → MongoDB Atlas (free tier)
- **GitHub** → https://github.com/shahzaib-G/portfolio

---

## Step 1 — MongoDB Atlas
1. Go to https://cloud.mongodb.com → create free cluster
2. Create a DB user with a password
3. Network Access → Add IP `0.0.0.0/0` (allow all)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/portfolio`

---

## Step 2 — Gmail App Password (for contact form emails)
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords" → create one labelled "Portfolio"
4. Copy the 16-char password (no spaces)

---

## Step 3 — Deploy Backend on Render

Your backend is already live at: **https://portfolio-6ajg.onrender.com**

If you need to redeploy or update env vars:
1. Go to https://render.com → your `portfolio-backend` service
2. Environment → ensure ALL of these are set:
   ```
   MONGO_URI         = mongodb+srv://...
   JWT_SECRET        = any_long_random_string_here_min_32chars
   ADMIN_EMAIL       = your@email.com
   ADMIN_PASSWORD    = your_secure_admin_password
   GMAIL_USER        = your@gmail.com
   GMAIL_APP_PASSWORD= your_16_char_app_password
   FRONTEND_URL      = https://YOUR_SITE.netlify.app
   NODE_ENV          = production
   ```
3. Render auto-deploys on every push to `main`

> **Note:** Do NOT add PORT — Render injects it automatically.

---

## Step 4 — Deploy Frontend on Netlify

`netlify.toml` is already configured — Netlify reads it automatically.

### First-time setup:
1. Go to https://netlify.com → **Add new site → Import an existing project**
2. Connect to GitHub → choose `shahzaib-G/portfolio`
3. Netlify auto-detects `netlify.toml` settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
4. **Before deploying**, go to **Site settings → Environment variables** and add:
   ```
   REACT_APP_API_URL = https://portfolio-6ajg.onrender.com/api
   ```
5. Click **Deploy site**

### Every push after that:
```
git push origin main
```
Netlify auto-deploys. Done.

---

## Step 5 — Update Render CORS after Netlify gives you a URL

Once Netlify gives you your URL (e.g. `https://shahzaibrj.netlify.app`):
1. Go to Render → your backend service → Environment
2. Set `FRONTEND_URL = https://your-site-name.netlify.app`
3. Render redeploys automatically

> The backend already accepts **any** `*.netlify.app` URL for deploy previews.

---

## Step 6 — First Login & Fill Your Data
1. Go to `https://YOUR_SITE.netlify.app/admin/login`
2. Login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your env vars
3. Fill in: Profile, Skills, Projects, Experience, Certificates
4. Your portfolio updates live — no redeployment needed

---

## Notes
- Render free tier **sleeps after 15 min** inactivity (cold start ~30s on first visit)
- Upgrade to Render Starter ($7/mo) to keep it always-on
- All images are stored as base64 in MongoDB — no Cloudinary needed
- Projects are auto-ranked by engagement (views, clicks) via the RL system
