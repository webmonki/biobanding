# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - present | VP-Systeme GmbH, Lyrenstr. 13, 44866 Bochum
"""
from datetime import datetime, timedelta

import json
from urllib import response
from wsgiref import headers
import pytest
import jwt
import time

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
DUMMY_BIRTHDAY = "2015-05-10"
# Configuration
DUMMY_EMAIL_SERVER = "smtp.example-server.org"
DUMMY_EMAIL_PORT = 100
DUMMY_EMAIL_USERNAME = "doe@example.org"
DUMMY_DAYS_REMINDER = 5
DUMMY_EMAIL_USE_SSL = False
# Updated user data
UPDATED_USERNAME = "Eddy"
UPDATED_EMAIL = "eddy@mail.com"
UPDATED_PASS = "eddy22"
PASSWORD_UPDATED_WITH_TOKEN = "token?password"
# Edited user data
EDITED_USERNAME = "Ed"
EDITED_EMAIL = "ed@ed.ed"
# Users details
DETAILS_LAST_NAME = "Collins"
DETAILS_BIRTHDAY = (datetime.today().date() - timedelta(days=5000)).strftime("%Y-%m-%d") # 13,68 years
DETAILS_GENDER = 0 # 0 for male, 1 for female
DETAILS_HEIGHT_FATHER = 189
DETAILS_HEIGHT_MOTHER = 169
# Users anthropomertic data
ANTH_USER_ID = 2 # data gets assigned to this user
ANTH_DATE_MEASURED = datetime.today().date().strftime("%Y-%m-%d")
ANTH_HEIGHT = 188
ANTH_SITTING_HEIGHT =88
ANTH_BODY_SPAN = 88
ANTH_WEIGHT = 88
# Edited anthropometric data
EDITED_ANTH_DATE_MEASURED = (datetime.today().date() - timedelta(99)).strftime("%Y-%m-%d")
EDITED_ANTH_HEIGHT = 192
EDITED_ANTH_SITTING_HEIGHT = 92
EDITED_ANTH_BODY_SPAN = 90
EDITED_ANTH_WEIGHT = 94
# Admin user
ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "admin@example.org"
ADMIN_PASSWORD = "admin"

IMAGINARY_EMAIL = "imagine@mails.en"

def test_user_signup(client):
    '''
        Tests /users/register API: Sign up successfully 
        GIVEN username, email, password and registration code
        WHEN Signing up
        THEN Check for successful sing up
    '''
    # Trigger initial request to create db
    try:
        _ = client.post("/api")
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
    # Check results
    assert response.status_code == 200
    assert "The user was successfully registered and a confirmation link was send" in data["msg"]


def test_user_signup_invalid_data(client):
    '''
       Tests /users/register API: Sign up with invalid data e.g. empty email field empty
       GIVEN username, no email, password and registration code
       WHEN Signing up
       THEN Check for unsuccessful sign up
    '''
    # Execute HTTP POST method (without an email address)
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
    # Check results
    assert response.status_code == 400
    assert "'' is too short" in data["msg"]


def test_user_login_unconfirmed(client):
    '''
       Tests api/users/login API: Email address is not confirmed
       GIVEN Not confirmed user email
       WHEN Logging in
       THEN Check for unsuccessful login
   '''
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
    # Check results
    assert response.status_code == 403
    assert "Email address is not confirmed" in data["msg"]


def test_user_confirm_signup(client):
    '''
        Tests /api/users/confirm API: Successfully confirmed account
        GIVEN User is logged in
        WHEN User confirms his account
        THEN Check for successful confirmation
    '''
    token = jwt.encode({'email': DUMMY_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.post(
        '/api/users/confirm',
        headers={"authorization": token},
        data=json.dumps(
            {
                "last_name": DUMMY_USERNAME,
                "first_name": DUMMY_USERNAME,
                "birthday": DUMMY_BIRTHDAY,
                "sex_m_0_f_1": 0,
                "height_father": 175,
                "height_mother": 164
            }
        ),
        content_type="application/json")

    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 201
    assert data["token"] != ""
    assert data["user"] != ""
    assert "Successful confirmed account. User is Logged in" in data['msg']


def test_user_login_correct(client):
    '''
       Tests /users/signup API: Log in with correct credentials
       GIVEN Valid email address and password
       WHEN Logging in
       THEN Check for successful login
    '''
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
    # Check results
    assert response.status_code == 200
    assert data["token"] != ""


def test_user_login_error(client):
    '''
       Tests /users/signup API: Log in with wrong credentials
       GIVEN Wrong credentials (correct email address and wrong password)
       WHEN Logging in
       THEN Check for unsuccessful
    '''
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
    # Check results
    assert response.status_code == 401
    assert "Wrong credentials." in data["msg"]


def test_update_user_by_id(client):
    '''
        Tests /api/user/<int:id> API: Successfully updated user data by id
        GIVEN User's id
        WHEN Updating username, email and password
        THEN Check for successful data update
    '''
    token = jwt.encode({'email': DUMMY_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.put(
        "/api/user/2",
        data=json.dumps(
            {
                "username": UPDATED_USERNAME,
                "email": UPDATED_EMAIL,
                "password": UPDATED_PASS
            }
        ),
        headers = {"authorization": token},
        content_type = "application/json")
    
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert "Successfully updated user data" in data["msg"]


@pytest.mark.xfail(reason = "returns: '...data could not be created'. But data gets successfully saved in db")
def test_create_anthropometric_data(client):
    '''
        Tests /api/user/<int:id>/anthropometric API: Successfully creates anthropometric data
        GIVEN User's id and anthropometric data
        WHEN Creating new anthropometric data
        THEN Check id data has beeen successfully saved
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.post(
        "/api/user/" + str(ANTH_USER_ID) + "/anthropometric",
        headers={"authorization": token},
        data=json.dumps(
            {
                "userID": ANTH_USER_ID,
                "date_measured": ANTH_DATE_MEASURED,
                "height": ANTH_HEIGHT,
                "sitting_height": ANTH_SITTING_HEIGHT,
                "body_span": ANTH_BODY_SPAN,
                "weight": ANTH_WEIGHT
            }
        ),
        content_type="application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    # assert ??? in data["msg"]

@pytest.mark.xfail(reason = "returns 'measurements:' instead of 'measurements'. PHV 4.53 saved in db. We read 4.529999")
def test_return_players_anthropometric_data(client):
    '''
        Tests /api/user/<int:id>/anthropometric API: Successfully returns user's anthropometric data
        GIVEN User id
        WHEN Retrieving anthropometric data of that user
        THEN Check for successful data retrieval
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.get(
        "/api/user/" + str(ANTH_USER_ID) + "/anthropometric",
        headers={"authorization": token},
        content_type="application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert data["measurements"] is not []
    assert data["measurements"][0] is not []
    assert data["measurements"][0]["Id"] == 1 # the id of measurement (not UserId)
    assert data["measurements"][0]["UserId"] == ANTH_USER_ID
    assert data["measurements"][0]["Datum"] == '"' + ANTH_DATE_MEASURED + '"'
    assert data["measurements"][0]["Alter"] == 7.02
    assert data["measurements"][0]["YAPHV"] == -2.49
    assert data["measurements"][0]["PHV"] == 4.53 # 4.53 in data base, yet we get: 4.529999999999999
    assert data["measurements"][0]["AK_BIO"] == "PHV -2.5 bis -1.5"
    assert data["measurements"][0]["BMI"] == 24.9
    assert data["measurements"][0]["PMH"] == 0.75
    assert data["measurements"][0]["PAH"] == 251.01
    assert data["measurements"][0]["CM until PAH"] == 63.01
    assert data["measurements"][0]["Größe"] == ANTH_HEIGHT
    assert data["measurements"][0]["Sitzgröße"] == ANTH_SITTING_HEIGHT
    assert data["measurements"][0]["Körperspanne"] == ANTH_BODY_SPAN
    assert data["measurements"][0]["Gewicht"] == ANTH_WEIGHT


def test_create_player_details(client):
    '''
        Tests /api/user/<int:id>/details API: Successfully create user details
        GIVEN User's id and user details
        WHEN Creating new user details
        THEN Check if user details where created successfully
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.post(
        "/api/user/" + str(ANTH_USER_ID) + "/details",
        headers={"authorization": token},
        data=json.dumps(
            {
                "userID": ANTH_USER_ID,
                "first_name": UPDATED_USERNAME,
                "last_name": DETAILS_LAST_NAME,
                "birthday": DETAILS_BIRTHDAY,
                "sex_m_0_f_1": DETAILS_GENDER,
                "height_father": DETAILS_HEIGHT_FATHER,
                "height_mother": DETAILS_HEIGHT_MOTHER
            }
        ),
        content_type="application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert "Player details were successfully created" in data["msg"]

@pytest.mark.xfail(reason = "returns 'player_details:' instead of 'player_details'")
def test_get_player_details(client):
    '''
        Tests /api/user/<int:id>/details API: Successfully return user details
        GIVEN User id
        WHEN Retrieving user details of that user
        THEN Check for successful details retrieval
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.get(
        "/api/user/" + str(ANTH_USER_ID) + "/details",
        headers={"authorization": token},
        content_type = "application/json")
    data = json.loads(response.data.decode())
    # Check for results
    assert response.status_code == 200
    assert data["success"] == True
    assert data["player_details"] is not []
    assert data["player_details"]["userID"] == ANTH_USER_ID
    assert data["player_details"]["first_name"] == UPDATED_USERNAME
    assert data["player_details"]["last_name"] == DETAILS_LAST_NAME
    assert data["player_details"]["birthday"] == '"' + DETAILS_BIRTHDAY + '"'
    assert data["player_details"]["sex_m_0_f_1"] == DETAILS_GENDER
    assert data["player_details"]["height_father"] == DETAILS_HEIGHT_FATHER
    assert data["player_details"]["height_mother"] == DETAILS_HEIGHT_MOTHER


@pytest.mark.xfail(reason = "returns 'users:' instead of 'users'")
def test_get_all_users(client):
    '''
        Tests /api/user API: Successfully acquire all users
        GIVEN 
        WHEN Retrieving: userId, Benutzername and E-Mail of all users
        THEN Check for successful data retrieval
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.get(
        '/api/users',
        headers={"authorization": token},
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert data["users"] is not []
    assert data["users"][0]["userID"] == 1
    assert data["users"][0]["Benutzername"] == ADMIN_USERNAME
    assert data["users"][0]["E-Mail"] == ADMIN_EMAIL
    assert data["users"][1]["userID"] == 2
    assert data["users"][1]["Benutzername"] == UPDATED_USERNAME
    assert data["users"][1]["E-Mail"] == UPDATED_EMAIL


# Todo
@pytest.mark.skip(reason="Not implemented. There is no such function?")
def test_get_user_by_id(client):
    '''
        Tests /api/user/<int:id> API: Successfully acquire user data by id
    '''


def test_reset_password_with_valid_token(client):
    '''
        Tests /api/user/reset API: Successfully update user's password if token is valid
        GIVEN A valid token and new password
        WHEN Reseting a password
        THEN Check for successful reset
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.put(
        "/api/user/reset",
        data=json.dumps(
            {
                "token": token,
                "password": PASSWORD_UPDATED_WITH_TOKEN
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 202
    assert data["success"] == True
    assert data["msg"] == "Password for user" + " " + UPDATED_USERNAME + " " + "successfully reset"


def test_reset_password_with_invalid_token(client):
    '''
        Tests /api/user/reset API: Fail to update password with invalid token
        GIVEN An invalid token
        WHEN Reseting the password
        THEN Check if password has been changed
    '''
    token = jwt.encode({'email': IMAGINARY_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    response = client.put(
        "/api/user/reset",
        data=json.dumps(
            {
                "token": token,
                "password": PASSWORD_UPDATED_WITH_TOKEN
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    assert response.status_code == 401
    assert data["success"] == False
    assert "No valid token" in data["msg"]


@pytest.mark.skip(reason="Password change with valid token without new pass is possible.")
def test_reset_password_with_valid_token_and_without_new_password(client):
    '''
        Tests /api/user/reset API: Fail to update user's password if token is valid but no new password is given
        GIVEN Valid token
        WHEN Changing password (to leer string)
        THEN Check results. Results should report issues.
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    # Run HTTP PUT method with valid token and no password
    response = client.put(
        "/api/user/reset",
        data=json.dumps(
            {
                "token": token,
                "password": ""
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    # to do:
    # assert response.status_code == ???
    # assert data["success"] == ???
    # assert data["msg"] == ???


def test_edit_user(client):
    '''
        Tests /api/users/edit API: Successfully edit user data
        GIVEN A successfully logged in user
        WHEN His own data (username and email address) is edited
        THEN Check for successful changes
    '''
    token = jwt.encode({'email': UPDATED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    # Change data base entries
    response = client.post(
        "/api/users/edit",
        headers={"authorization": token},
        data=json.dumps(
            {
                "username": EDITED_USERNAME,
                "email": EDITED_EMAIL
            }
        ),
        content_type="application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert data["token"] != ""


def test_reset_password_with_registered_email(client):
    '''
        Tests /api/user/forget API: Send email to given address with option to reset the password.
        GIVEN An email address registered/saved in data base 
        WHEN User forgets his password and wants to reset it
        THEN Check for successful password reset
    '''
    response = client.put(
        "api/user/forget",
        data=json.dumps(
            {
                "email": EDITED_EMAIL
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert "Link to reset the password was sent via email to " + EDITED_EMAIL + "." in data["msg"]


def test_reset_password_with_registered_email_within_less_than_1min(client):
    '''
        Tests /api/user/forget API: Send email to given address with option to reset the password.
        GIVEN An email address registered/saved in data base 
        WHEN User wants to reset his password again 59s later
        THEN Check for unsuccessful password reset
    '''
    time.sleep(59)
    response = client.put(
        "api/user/forget",
        data=json.dumps(
            {
                "email": EDITED_EMAIL
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 403
    assert data["success"] == False
    assert "Only one password reset email can be sent per minute." in data["msg"]


def test_reset_password_with_registered_email_2_more_sec_later(client):
    '''
        Tests /api/user/forget API: Send email to given address with option to reset the password.
        GIVEN An email address registered/saved in data base 
        WHEN User wants to reset his password again 61s after his first attempt
        THEN Check for successful password reset
    '''
    time.sleep(2)
    response = client.put(
        "api/user/forget",
        data=json.dumps(
            {
                "email": EDITED_EMAIL
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert "Link to reset the password was sent via email to " + EDITED_EMAIL + "." in data["msg"]

@pytest.mark.skip(reason="Should return 'The email address does not exist' instead of INTERNAL SERVER ERROR")
def test_reset_password_with_unregistered_email(client):
    '''
        Tests /api/user/forget API: Send email to given address with option to reset the password.
        GIVEN A not registered email address 
        WHEN User wants to reset the password
        THEN Check for unsuccessful password reset
    '''
    response = client.put(
        "api/user/forget",
        data=json.dumps(
            {
                "email": IMAGINARY_EMAIL
            }
        ),
        content_type = "application/json"
    )
    data = json.loads(response.data.decode())
    # Check results
    #assert response.status_code == 200
    #assert data["success"] == ???
    #assert ??? in data["msg"]

def test_delete_nonexistent_user_by_id(client):
    '''
        Tests /api/user/<int:id> API: Delete user by nonexistent id
        GIVEN Nonexistent user id
        WHEN Deleting user by id
        THEN Check for unsuccessful removal
    '''
    token = jwt.encode({'email': EDITED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    # Execute HTTP DELETE method with notexistent id
    response = client.delete(
        "/api/user/3",
        headers = {"authorization": token},
        content_type = "application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 400
    assert data["success"] == False
    assert "Could not delete User" in data["msg"]


def test_delete_existing_user_by_id(client):
    '''
        Tests /api/user/<int:id> API: Successfully delete user (data gets anonymised)
        GIVEN Id of a user to delete
        WHEN Deleting user by id
        THEN check for successful removal
    '''
    token = jwt.encode({'email': EDITED_EMAIL, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)
    # Execute HTTP DELETE method
    response = client.delete(
        "/api/user/" + str(ANTH_USER_ID),
        headers = {"authorization": token},
        content_type = "application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True
    assert "Successfully deleted user" in data["msg"]


def test_user_logout(client):
    '''
       Tests api/users/logout API: log out successfully
       GIVEN A successful log in
       WHEN Logging out
       THEN Check for successful log out
    '''
    # Log in with POST method
    response = client.post(
        "api/users/login",
        data=json.dumps(
            {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
        ),
        content_type="application/json")
    data = json.loads(response.data.decode())
    # Check for successful log in
    assert response.status_code == 200
    assert data["token"] != ""
    # Log out with POST method
    response = client.post(
        "api/users/logout",
        headers = {"authorization": data["token"]},
        data=json.dumps(
            {
            }
        ),
        content_type="application/json")
    data = json.loads(response.data.decode())
    # Check results
    assert response.status_code == 200
    assert data["success"] == True

# end of /api/users tests


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
