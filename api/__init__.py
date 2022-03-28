# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import json

from flask import Flask
from flask_cors import CORS

from .routes import rest_api
from .models import db, AdminConfig, Users

app = Flask(__name__)

app.config.from_object('api.config.BaseConfig')

db.init_app(app)
rest_api.init_app(app)
CORS(app)

# Setup database
@app.before_first_request
def initialize_database():
    db.create_all()

    # Set default config
    if not db.session.query(AdminConfig).first():
        config = AdminConfig(days_reminder=90)
        db.session.add(config)
        db.session.commit()

    if not db.session.query(Users).first():
        new_user = Users(username='admin', email='admin@admin.de')

        new_user.set_password('12345')
        new_user.set_is_admin(True)
        db.session.add(new_user)
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
