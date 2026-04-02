# Portfolio v2 — Deploy Guide

## Step 1 — MongoDB Atlas (free)
1. Go to https://cloud.mongodb.com → create free cluster
2. Create DB user with password
3. Network Access → Add IP → 0.0.0.0/0 (allow all)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/portfolio`

## Step 2 — Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords" → create one for "Portfolio Backend"
4. Copy the 16-char password (no spaces)

## Step 3 — Deploy Backend on Render
1. Push ONLY the `backend/` folder to a GitHub repo
   (or push the whole project and set root directory to `backend`)
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node version: 18
5. Environment Variables → Add ALL of these:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=any_long_random_string_here_min_32chars
   ADMIN_EMAIL=shahzaibnasir3011@gmail.com
   ADMIN_PASSWORD=your_secure_admin_password
   GMAIL_USER=shahzaibnasir3011@gmail.com
   GMAIL_APP_PASSWORD=your_16_char_app_password
   FRONTEND_URL=https://shahzaibrj.netlify.app
   PORT=5000
   ```
6. Click Deploy → Wait for "Live" status
7. Copy your backend URL: https://your-app-name.onrender.com

## Step 4 — Deploy Frontend on Netlify
1. In `frontend/.env` (create this file), add:
   ```
   REACT_APP_API_URL=https://your-app-name.onrender.com/api
   ```
2. Push the `frontend/` folder to GitHub
3. Go to https://netlify.com → New Site from Git
4. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
5. Environment Variables → add:
   ```
   REACT_APP_API_URL=https://your-app-name.onrender.com/api
   ```
6. Deploy → Your site is live!

## Step 5 — First Login
1. Go to https://yoursite.netlify.app/admin/login
2. Login with ADMIN_EMAIL and ADMIN_PASSWORD from your env vars
3. Go to Profile → fill in your name, bio, title, skills, etc.
4. Add projects, skills, experience, certificates
5. Portfolio shows your data instantly — visitors see it live!

## RL System — How It Works
- Every time a visitor views or clicks a project → backend logs engagement
- After EVERY tracking event, the RL engine (epsilon-greedy bandit) re-ranks all projects automatically
- Projects with more engagement (views, clicks, GitHub clicks, live clicks) move to the top
- 15% exploration rate ensures newer projects get a chance to be seen
- Zero Python needed — it's all Node.js, all automatic

## Notes
- Render free tier sleeps after 15min inactivity (cold start ~30s)
- Upgrade to Render Starter ($7/mo) for always-on
- All images stored as base64 in MongoDB — no Cloudinary needed
