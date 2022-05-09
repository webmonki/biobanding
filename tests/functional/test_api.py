# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - present | VP-Systeme GmbH, Lyrenstr. 13, 44866 Bochum
"""

import json


"""
   Sample test data
"""
# Login data
DUMMY_USERNAME = "admin"
DUMMY_EMAIL = "admin@example.org"
DUMMY_PASS = "admin"
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
    response = client.post(
        "api/users/register",
        data=json.dumps(
            {
                "username": DUMMY_USERNAME,
                "email": DUMMY_EMAIL,
                "password": DUMMY_PASS
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 200
    assert "The user was successfully registered" in data["msg"]


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
                "password": DUMMY_PASS
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 400
    assert "'' is too short" in data["msg"]


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
                "password": DUMMY_EMAIL
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    assert response.status_code == 400
    assert "Wrong credentials." in data["msg"]


# Todo
def test_update_user_by_id(client):
    """
        Tests /api/user/<int:id> API: Successfully updated user data
    """


# Todo
def test_delete_user_by_id(client):
    """
        Tests /api/user/<int:id> API: Successfully updated user data
    """


# Todo
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









