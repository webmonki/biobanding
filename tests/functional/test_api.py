# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - present | VP-Systeme GmbH, Lyrenstr. 13, 44866 Bochum
"""
from datetime import datetime, timedelta

import json
import pytest
import jwt

from api import app
from api.config import BaseConfig
from api.models import AdminConfig


"""
   Sample test data
"""
# Login data
DUMMY_USERNAME = "admin2"
DUMMY_EMAIL = "admin2@example.org"
DUMMY_PASS = "admin2"
# Configuration
DUMMY_EMAIL_SERVER = "smtp.example-server.org"
DUMMY_EMAIL_PORT = 100
DUMMY_EMAIL_USERNAME = "doe@example.org"
DUMMY_DAYS_REMINDER = 5
DUMMY_EMAIL_USE_SSL = False


def test_user_signup(client):
    """
       Tests /users/register API
    """

    # Trigger initial request to create db
    try:
        _ = client.post("/api/users/register")
    except Exception:
        pass

    # Access db within app context to get default registration code
    with app.app_context():
        config = AdminConfig.get_config()
        config = config.toDICT()

    code = config["registration_code"]

    response = client.post(
        "api/users/register",
        data=json.dumps(
            {
                "username": DUMMY_USERNAME,
                "email": DUMMY_EMAIL,
                "password": DUMMY_PASS,
                "registration_code": code
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 200
    assert "The user was successfully registered and a confirmation link was send" in data["msg"]


def test_user_signup_invalid_data(client):
    """
       Tests /users/register API: invalid data like email field empty
    """
    response = client.post(
        "api/users/register",
        data=json.dumps(
            {
                "username": DUMMY_USERNAME,
                "email": "",
                "password": DUMMY_PASS,
                "registration_code": 1111
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 400
    assert "'' is too short" in data["msg"]


def test_user_login_unconfirmed(client):
    """
       Tests api/users/login API: Email address is not confirmed
   """

    response = client.post(
        "api/users/login",
        data=json.dumps(
            {
                "email": DUMMY_EMAIL,
                "password": DUMMY_PASS
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 403
    assert "Email address is not confirmed" in data["msg"]


def test_user_confirm_signup(client):
    """
    Tests /api/users/confirm API: Successful confirmed account. User is Logged in
    """

    token = jwt.encode({'email': DUMMY_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)

    response = client.post(
        '/api/users/confirm',
        headers={"authorization": token},
        data=json.dumps(
            {
                "last_name": DUMMY_USERNAME,
                "first_name": DUMMY_USERNAME,
                "birthday": "2015-05-10",
                "sex_m_0_f_1": 0,
                "height_father": 175,
                "height_mother": 164
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 201
    assert data["token"] != ""
    assert data["user"] != ""
    assert "Successful confirmed account. User is Logged in" in data['msg']


def test_user_login_correct(client):
    """
       Tests /users/signup API: Correct credentials
    """
    response = client.post(
        "api/users/login",
        data=json.dumps(
            {
                "email": DUMMY_EMAIL,
                "password": DUMMY_PASS
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 200
    assert data["token"] != ""


def test_user_login_error(client):
    """
       Tests /users/signup API: Wrong credentials
    """
    response = client.post(
        "api/users/login",
        data=json.dumps(
            {
                "email": DUMMY_EMAIL,
                "password": DUMMY_PASS + "x"
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 401
    assert "Wrong credentials." in data["msg"]


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_update_user_by_id(client):
    """
        Tests /api/user/<int:id> API: Successfully updated user data
    """


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_delete_user_by_id(client):
    """
        Tests /api/user/<int:id> API: Successfully updated user data
    """


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_get_user_by_id(client):
    """
    Tests /api/user/<int:id> API: Successfully deleted user
    """


def test_set_configuration(client):
    """
    Tests /api/configurations API: The config was successfully updated
    """
    response = client.post(
        "api/users/login",
        data=json.dumps(
            {
                "days_reminder": DUMMY_DAYS_REMINDER,
                "mail_server": DUMMY_EMAIL_SERVER,
                "mail_port": DUMMY_EMAIL_PORT,
                "mail_user_ssl": DUMMY_EMAIL_USE_SSL,
                "mail_username": DUMMY_EMAIL_USERNAME,
                "mail_password": DUMMY_PASS

            }
        ),
        content_type="application/json")









