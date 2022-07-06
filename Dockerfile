FROM alpine:latest
LABEL maintainer="LifestreamVII"

ENV PYTHONUNBUFFERED=1 
RUN apk add nano 
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk add build-base
RUN python3 -m pip install deemix

RUN python3 -m pip install flask
#RUN python3 -m pip install gunicorn
RUN pip install --upgrade pip
RUN pip install celery
RUN pip install redis
RUN apk add supervisor
RUN mkdir -p /usr/src/music/app
#ADD ./scripts/mp3api.py /usr/src/music/app/app.py
#ADD ./scripts/dl_track.py /usr/src/music/app/dl_track.py
#ADD ./scripts/supervisord.conf /usr/src/music/app/supervisord.conf
WORKDIR /usr/src/music/app
#EXPOSE 6379
EXPOSE 5000
