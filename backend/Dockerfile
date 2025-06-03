FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && apt-get install -y \
    libgdal-dev postgresql-client gcc python3-dev libxml2-dev libxslt1-dev \
    postgis \
    libmagickwand-dev \
    # && pip install --upgrade pip \
    && pip install pip==24.0 \
    && pip install -r requirements.txt \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8585"]