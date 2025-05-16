FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

# O volume de dados de mídia será montado em /data/media
ENV MEDIA_FOLDER /data/media

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"] 