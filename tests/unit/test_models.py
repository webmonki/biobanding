# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - present VP-Systeme GmbH, Lyrenstr. 13, 44866
"""

from api.models import Users

DUMMY_USER_NAME = "johndoe"
DUMMY_USER_MAIL = "doe@example.org"
DUMMY_USER_PASS = "secret-pass"


def test_new_user(app_generator):
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the email, hashed_password, confirmation status, is_activ and role fields are defined correctly
    """

    with app_generator.app_context():
        # Create new user
        user = Users(username=DUMMY_USER_NAME, email=DUMMY_USER_MAIL)
        # Set password
        user.set_password(DUMMY_USER_PASS)
        # Set admin = True
        user.set_is_admin(True)
        user.save()
        # Check results
        assert DUMMY_USER_NAME == user.username
        assert DUMMY_USER_MAIL == user.email
        assert user.check_password(DUMMY_USER_PASS)
        assert user.check_is_admin()
        assert user.is_activ
        assert not user.confirmed


# Todo
def test_delete_user(app_generator):
    """
    GIVEN a user Model
    WHEN a user is deleted
    THEN check if username, email and data from playermaster table is anonymize with 'DELETED'
    """


# Todo
def test_edit_user(app_generator):
    """
    GIVEN a user Model
    WHEN a user is updated
    THEN check if username, email, is_admin, confirmed and password fields are updated correctly'
    """


# Todo
def test_new_player_details(app_generator):
    """
    GIVEN a PlayerDetails model
    WHEN the playerdetails for an existing user are set
    THEN check the birthdays, sex_m_0_f_1, height_father and height_mother fields are defined correctly
    """


# Todo
def test_edit_player_details(app_generator):
    """
    GIVEN a PlayerDetails model
    WHEN the playerdetails for an existing user are edited
    THEN check the birthdays, sex_m_0_f_1, height_father and height_mother fields are updated correctly
    """


# Todo
def test_new_admin_config(app_generator):
    """
    GIVEN a AdminConfig model
    WHEN a AdminConfig is created
    THEN check the days_reminder, mail_server, mail_port, mail_use_ssl, mail_password and
        mail_username fields are defined correctly
    """


# Todo
def test_edit_admin_config(app_generator):
    """
    GIVEN a AdminConfig model
    WHEN a AdminConfig is edited
    THEN check the days_reminder, mail_server, mail_port, mail_use_ssl, mail_password and
        mail_username fields are updated correctly
    """


# Todo
def test_new_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is created
    THEN check if all fields are defined correctly and the results a calculated correctly
    """

    # Hint: User formulas.py for validation


# Todo
def test_edit_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is edited
    THEN check if all fields are updated correctly and the results a calculated correctly again
    """










