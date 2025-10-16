# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import json
from flask import Flask
from flask_cors import CORS
from sqlalchemy import func, and_
from datetime import date, datetime
from random import randrange

from .routes import rest_api
from .models import db, AdminConfig, Users, AnthropometricData
from .email import send_email_with_token, send_email
from .config import BaseConfig


app = Flask(__name__)

app.config.from_object('api.config.BaseConfig')

db.init_app(app)
rest_api.init_app(app)
CORS(app)


# Setup database
@app.before_first_request
def initialize_database():
    db.create_all()

    # Create initial admin user and setting if not exists
    if db.session.query(Users).first() is None:
        admin = Users(username='admin',
                      email='admin@example.org',
                      is_admin=True,
                      confirmed=True,
                      confirmed_on=datetime.now())
        admin.set_password('admin')
        db.session.add(admin)
        db.session.commit()

    if db.session.query(AdminConfig).first() is None:
        config = AdminConfig(
            days_reminder=90, registration_code=randrange(1000, 9999, 4))
        db.session.add(config)
        db.session.commit()


"""
   Custom responses
"""


@app.after_request
def after_request(response):
    """
       Sends back a custom error with {"success", "msg"} format
    """

    if int(response.status_code) >= 400:
        response_data = json.loads(response.get_data())
        if "errors" in response_data:
            response_data = {"success": False,
                             "msg": list(response_data["errors"].items())[0][1]}
            response.set_data(json.dumps(response_data))
        response.headers.add('Content-Type', 'application/json')
    return response


# [BEGIN reminder]
@app.cli.command()
def reminder():
    """Send a scheduled reminder to all users."""

    days_reminder = AdminConfig.get_days_reminder()

    # Select auf die letzte Messung aller User
    subq = db.session.query(
        AnthropometricData.user_id,
        func.max(AnthropometricData.date_measured).label('maxdate')
    ).group_by(AnthropometricData.user_id).subquery('t2')

    query = db.session.query(AnthropometricData).join(
        subq,
        and_(
            AnthropometricData.user_id == subq.c.user_id,
            AnthropometricData.date_measured == subq.c.maxdate
        )
    ).all()

    for row in query:
        # Calculate Delta between today and last measurement
        delta1 = (date.today() - row.date_measured).days
        # Check if Timedelta < days_reminder
        if delta1 >= days_reminder:
            user = Users.get_by_id(row.user_id)
            # Check if user is activ
            if user.is_active:
                # Check if the user has already received a reminder email
                if user.date_last_measurement_reminder is not None:
                    delta2 = (date.today() -
                              user.date_last_measurement_reminder).days
                    if delta2 >= 7:
                        # Set date of reminder in user table
                        user.date_last_measurement_reminder = date.today()
                        user.save()
                        # Generate token and url for email reminder
                        token = user.get_jwt_token()
                        url = "{}/measurement?token={}".format(
                            app.config.get(
                                'PREACT_APP_HOST_URI',
                                BaseConfig.PREACT_APP_HOST_URI
                            ),
                            token
                        )
                        # Send email reminder to user
                        send_email_with_token(
                            user, 'Neue Messung eintragen', 'measurement_reminder.html', url)
                else:
                    user.date_last_measurement_reminder = date.today()
                    user.save()
                    # Generate token and url for email reminder
                    token = user.get_jwt_token()
                    url = "{}/measurement?token={}".format(
                        app.config.get(
                            'PREACT_APP_HOST_URI',
                            BaseConfig.PREACT_APP_HOST_URI
                        ),
                        token
                    )
                    # Send email reminder to user
                    send_email_with_token(
                        user, 'Neue Messung eintragen', 'measurement_reminder.html', url)

# [END reminder]
