FROM python:3.5.6-jessie
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app
ADD requirements.txt /app/
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
RUN apt-get update && apt-get --yes --force-yes install libgdal-dev
RUN apt-get update && apt-get --yes --force-yes install postgresql-client

RUN pip install -r requirements.txt
ADD . /app/

CMD python manage.py runserver 0.0.0.0:8585