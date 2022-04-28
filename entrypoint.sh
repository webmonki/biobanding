#!/bin/sh
printenv >> /etc/environment
service cron start &
tail -f /var/log/cron.log &
gunicorn -b 0.0.0.0:5000 run:app

