# ShopVue Django API - for Fly.io or any Docker host
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput 2>/dev/null || true

# Run migrations and start
# Fly.io/Render set PORT; default 8080
ENV PORT=8080
EXPOSE 8080
CMD python manage.py migrate && \
    (python manage.py create_sample_data || true) && \
    (python manage.py create_default_admin || true) && \
    gunicorn shopvue.wsgi:application --bind 0.0.0.0:${PORT}
