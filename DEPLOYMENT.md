# 🚀 Deploy Your Vue Lessons Online (Free)

This guide walks you through deploying your project to **free hosting** with a **free URL**.  
You’ll get a link like: `https://your-site.netlify.app` or `https://username.github.io/vuelessons`

---

## What Gets Deployed?

| Part | Works on static hosting? | Notes |
|------|---------------------------|------|
| **Vue Lessons** (index + lessons/) | ✅ Yes | Fully static, works 100% |
| **Ecommerce frontend** (HTML/JS/CSS) | ⚠️ Partial | Pages load, but **cart, login, products need the Django API** |
| **Ecommerce backend** (Django) | ❌ No | Needs Python hosting (e.g. Render, Railway) |

**Recommended:** Deploy **Vue Lessons only** first. It’s fully static and works everywhere.

---

## Option 1: Netlify (Easiest – Drag & Drop, ~5 min)

### Step 1: Prepare the deploy folder

1. **Double‑click `prepare-deploy.bat`** in the project root (or run it in the terminal).
2. This creates a **`deploy`** folder with:
   - `index.html`
   - `lessons/` (all 26 lessons)

### Step 2: Create a Netlify account

1. Go to: **https://app.netlify.com**
2. Sign up with **Email** or **GitHub** (free).

### Step 3: Deploy by drag & drop

1. In Netlify, click **“Add new site” → “Deploy manually”**.
2. Drag the **entire `deploy` folder** (or its contents) into the drop zone.
3. Wait 1–2 minutes.
4. You’ll get a URL like:  
   `https://random-name-12345.netlify.app`

### Step 4: (Optional) Custom subdomain

1. In Netlify: **Site settings → Domain management → Options → Edit site name**.
2. Change to something like: `vuelessons`  
   → Your site will be: `https://vuelessons.netlify.app`

---

## Option 2: Netlify with GitHub (Updates on every push)

### Step 1: Push the project to GitHub

1. Create a repo at **https://github.com/new** (e.g. `vuelessons`).
2. In your project folder, run:

   ```bash
   git init
   git add index.html lessons/ README.md DEPLOYMENT.md netlify.toml
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/vuelessons.git
   git push -u origin main
   ```

   (If the repo already exists, use your own remote and branch names.)

### Step 2: Connect Netlify to GitHub

1. In Netlify: **Add new site → Import an existing project**.
2. Choose **GitHub** and authorize Netlify.
3. Select the **vuelessons** repo.
4. Settings:
   - **Build command:** leave empty
   - **Publish directory:** `.`
5. Click **Deploy site**.

Every `git push` to `main` will trigger a new deployment.

---

## Option 3: GitHub Pages

### Step 1: Push to GitHub

(Same as Option 2, Step 1.)

### Step 2: Turn on GitHub Pages

1. Open your repo on GitHub.
2. **Settings → Pages**.
3. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**.

### Step 3: Your URL

- **Project site:**  
  `https://YOUR_USERNAME.github.io/vuelessons/`  
- Replace `YOUR_USERNAME` and `vuelessons` with your GitHub username and repo name.

It can take 1–2 minutes for the first deployment.

---

## Option 4: Vercel

1. Go to **https://vercel.com** and sign up (e.g. with GitHub).
2. **Add New → Project**.
3. Import your **GitHub** repo (or upload the `deploy` folder via the CLI).
4. **Framework Preset:** Other (or leave as detected).
5. **Root Directory:** `.`
6. **Build Command:** leave empty  
   **Output Directory:** `.`
7. Click **Deploy**.

You’ll get a URL like: `https://vuelessons-xxx.vercel.app`.

---

## Option 5: Cloudflare Pages

1. Go to **https://pages.cloudflare.com** and sign up.
2. **Create a project → Direct Upload**.
3. Upload a **ZIP** of your `deploy` folder (or of `index.html` + `lessons/`).
4. **Project name:** e.g. `vuelessons`.
5. Click **Deploy**.

Your site will be at: `https://vuelessons.pages.dev` (or similar).

---

## Include Ecommerce (Static Pages Only)

If you also want the ecommerce **HTML/CSS/JS** (pages will load, but cart/login/products won’t work without the Django API):

1. Run `prepare-deploy.bat` as usual.
2. Manually copy into `deploy`:
   - `ecommerce/*.html`
   - `ecommerce/assets/`
   - `ecommerce/ecommerce/assets/images/` (if you use those images)
3. Do **not** copy `ecommerce/backend/` (Django, venv, `db.sqlite3`).

Then deploy the `deploy` folder with Netlify, Vercel, or Cloudflare as above.

---

## Ecommerce Backend (Django)

The ecommerce **backend** needs a Python/Django host. Free options (with limits):

- **Render:** https://render.com (free tier for Web Services)
- **Railway:** https://railway.app (free tier)
- **PythonAnywhere:** https://www.pythonanywhere.com (free tier)

You would:

1. Deploy the Django app to one of these.
2. Point the ecommerce frontend `API_BASE_URL` to that URL (e.g. in `ecommerce/assets/js/config.js` or via build/env).

This is separate from deploying the Vue Lessons and is more advanced.

---

## Troubleshooting

| Problem | What to do |
|--------|------------|
| 404 on lesson links | Make sure `index.html` and the `lessons/` folder are at the **root** of what you deploy. |
| Blank page | Open DevTools (F12) → Console. Check for errors (e.g. wrong path to Vue or assets). |
| Ecommerce cart/login not working | Expected if only the frontend is deployed. The backend must run on a separate host. |
| Netlify “Build” errors | For this project, use **Deploy manually** (drag & drop) or leave **Build command** empty when using Git. |

---

## Quick Reference

| Service       | Free URL example              | Best for              |
|---------------|-------------------------------|------------------------|
| Netlify       | `yoursite.netlify.app`        | Easiest, drag & drop  |
| Vercel        | `yoursite.vercel.app`         | Git-based, fast        |
| GitHub Pages  | `user.github.io/vuelessons`   | If you already use Git|
| Cloudflare    | `yoursite.pages.dev`          | Fast CDN              |

---

**Summary:**  
Run `prepare-deploy.bat` → upload the `deploy` folder to Netlify (or use Git with Netlify/Vercel/GitHub Pages/Cloudflare). Your Vue Lessons will be live on a free URL in a few minutes.
