# Deploy ShopVue Backend (Django) to Render

The frontend on Netlify is already configured to proxy `/api/*` and `/media/*` to the backend.  
You only need to deploy the Django backend to **Render** and get a URL.  
If you use the service name **shopvue-api**, the URL will be `https://shopvue-api.onrender.com` and the proxy will work with no extra changes.

---

## 1. Push this project to GitHub

In the project root, run:

```bash
git add .
git commit -m "Add backend and deploy config"
git branch -M main
```

Then:

1. Go to **https://github.com/new**
2. Create a repo named `vuelessons` (or any name). **Do not** add a README.
3. Run (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/vuelessons.git
git push -u origin main
```

---

## 2. Deploy the backend on Render

1. Go to **https://render.com** and sign in (GitHub is fine).
2. Click **New +** → **Web Service**.
3. **Connect** your `vuelessons` repo (authorize if asked).
4. Configure:

   | Field | Value |
   |-------|--------|
   | **Name** | `shopvue-api` |
   | **Root Directory** | `ecommerce/backend` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput` |
   | **Start Command** | `python manage.py migrate && (python manage.py create_sample_data || true) && (python manage.py create_default_admin || true) && gunicorn shopvue.wsgi:application` |

5. **Environment** (in the Render dashboard):

   - `SECRET_KEY` = (use “Generate” or any long random string)
   - `DEBUG` = `false`
   - `ALLOWED_HOSTS` = `.onrender.com,.netlify.app,localhost,127.0.0.1`

6. **Create Web Service**.  
   Wait for the first deploy. The URL will be:

   **`https://shopvue-api.onrender.com`**

   (If you used a different **Name**, your URL will be `https://<name>.onrender.com`.)

---

## 3. Point Netlify to your backend (if the name is not `shopvue-api`)

If your Render service is **not** named `shopvue-api`, update the proxy in **`netlify.toml`**:

- Replace `https://shopvue-api.onrender.com` with your Render URL, e.g. `https://YOUR-SERVICE-NAME.onrender.com`.

Then redeploy the frontend:

```bash
# Rebuild deploy folder and redeploy
prepare-deploy.bat
npx netlify deploy --dir=deploy --prod
```

(If the name is `shopvue-api`, you can skip this step.)

---

## 4. Test the full ecommerce site

- **Frontend:** https://vuelessons-learn.netlify.app/ecommerce/
- **Backend:** `https://shopvue-api.onrender.com` (or your URL)

The frontend will call `/api/...`. Netlify proxies those to your Render backend, so products, cart, login, and checkout should work.

---

## Render free tier

- Service may **sleep after ~15 minutes** of no traffic.
- The **first request** after sleep can take 30–60 seconds (cold start).
- **SQLite** is used; the DB is recreated on each deploy (sample data is re-seeded by `create_sample_data`).

---

## Admin user

`create_default_admin` creates: **username** `admin`, **password** `admin123`.  
Django admin: **https://shopvue-api.onrender.com/admin/** (or your Render URL + `/admin/`).
