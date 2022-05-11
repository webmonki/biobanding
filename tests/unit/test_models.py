# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - present VP-Systeme GmbH, Lyrenstr. 13, 44866
"""

from numpy import datetime_as_string
from api.models import PlayerDetail, Users
from datetime import date, datetime
import pytest


DUMMY_USER_NAME = "johndoe"
DUMMY_USER_MAIL = "doe@example.org"
DUMMY_USER_PASS = "secret-pass"

DUMMIER_USER_NAME = "yetanother"
DUMMIER_USER_MAIL = "mail@internet.com"
DUMMIER_USER_PASS = "secret-password"
DB_ENTRY_AFTER_DELETING_USER = "DELETED"

TO_EDIT_USER_NAME = "beforeedit"
TO_EDIT_USER_NEW_NAME = "afteredit"
TO_EDIT_USER_MAIL = "tobe@edited.com"
TO_EDIT_USER_NEW_MAIL = "edited-address@after.de"
TO_EDIT_USER_PASS = "to@edit-com"
TO_EDIT_USER_NEW_PASS = "edited9$password"

DATE_OF_BIRTH = datetime.strptime("1990-01-01", "%Y-%m-%d").date() # <class 'datetime.date'>
DETAILS_FOR_USER_WITH_ID = 2
SEX = 0
HEIGHT_FATHER = 189
HEIGHT_MOTHER = 169


def test_new_user(app_generator): # app_generator type: <class 'flask.app.Flask'>
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the email, hashed_password, confirmation status, is_activ and role fields are defined correctly
    """

    with app_generator.app_context():
        # Create new user
        user = Users(username=DUMMY_USER_NAME, email=DUMMY_USER_MAIL)
        user.set_password(DUMMY_USER_PASS)
        user.set_is_admin(True)
        user.save()
        # Check results
        print("all users:")
        print(user.get_all_users())
        assert user.id == 2
        assert type(user.id) == int
        assert DUMMY_USER_NAME == user.username
        assert DUMMY_USER_MAIL == user.email
        assert user.check_password(DUMMY_USER_PASS)
        assert (user.date_joined).date() == date.today()
        assert user.check_jwt_auth_active() == None
        assert user.check_is_admin()
        assert user.is_activ == 1
        assert not user.confirmed
        assert user.confirmed_on == None
        assert user.date_last_password_reset == None


def test_delete_user(app_generator):
    """
    GIVEN a user Model
    WHEN a user is deleted
    THEN check if username, email and data from playermaster table is anonymize with 'DELETED'
    """
    with app_generator.app_context():
        # Add user to delete
        user = Users(username=DUMMIER_USER_NAME, email=DUMMIER_USER_MAIL)
        user.set_password(DUMMIER_USER_PASS)
        user.set_is_admin(True)
        user.set_jwt_auth_active(True)
        user.save()
        # Detele user
        user.delete()
        # Check results
        assert user.id == 1
        assert DUMMIER_USER_NAME is not user.username
        assert user.username == DB_ENTRY_AFTER_DELETING_USER
        assert DUMMIER_USER_MAIL is not user.email
        assert user.username == DB_ENTRY_AFTER_DELETING_USER
        assert user.check_password(DUMMIER_USER_PASS)
        assert (user.date_joined).date() == date.today()
        assert user.check_jwt_auth_active() is not None
        assert user.check_jwt_auth_active() is not 0
        assert user.check_jwt_auth_active() == 1
        assert user.check_is_admin()
        assert user.is_activ == 0
        assert not user.confirmed
        assert user.confirmed_on == None
        assert user.date_last_password_reset == None


def test_edit_user(app_generator):
    """
    GIVEN a user Model
    WHEN a user is updated
    THEN check if username, email, is_admin, confirmed and password fields are updated correctly'
    """
    with app_generator.app_context():
        # Add user to edit
        user = Users(username=TO_EDIT_USER_NAME, email=TO_EDIT_USER_MAIL)
        user.set_password(TO_EDIT_USER_PASS)
        user.set_is_admin(1)
        user.save()
        # Edit user data
        user.update_username(TO_EDIT_USER_NEW_NAME)
        user.update_email(TO_EDIT_USER_NEW_MAIL)
        user.set_password(TO_EDIT_USER_NEW_PASS)
        user.set_is_admin(0)
        user.set_jwt_auth_active(1)
        # Check results
        assert user.id == 1
        assert TO_EDIT_USER_NAME is not user.username
        assert user.username == TO_EDIT_USER_NEW_NAME
        assert TO_EDIT_USER_MAIL is not user.email
        assert user.email == TO_EDIT_USER_NEW_MAIL
        assert user.check_password(TO_EDIT_USER_PASS) == False
        assert user.check_password(TO_EDIT_USER_NEW_PASS)
        assert user.check_is_admin() == 0


def test_new_player_details(app_generator):
    """
    GIVEN a PlayerDetails model
    WHEN the playerdetails for an existing user are set
    THEN check the birthdays, sex_m_0_f_1, height_father and height_mother fields are defined correctly
    """
    with app_generator.app_context():
        # Define new player details
        playerDetail = PlayerDetail(user_id=DETAILS_FOR_USER_WITH_ID,
                                    birthday=DATE_OF_BIRTH,
                                    sex_m_0_f_1=SEX,
                                    height_father=HEIGHT_FATHER,
                                    height_mother=HEIGHT_MOTHER)
        playerDetail.save()
        # Check results
        assert playerDetail.user_id == DETAILS_FOR_USER_WITH_ID
        assert playerDetail.birthday == DATE_OF_BIRTH # both are <class 'datetime.date'>
        assert type(playerDetail.birthday) == type(DATE_OF_BIRTH)
        assert playerDetail.sex_m_0_f_1 == SEX
        assert playerDetail.height_father == HEIGHT_FATHER
        assert playerDetail.height_mother == HEIGHT_MOTHER
        assert playerDetail.toDICT().get("user_id") == DETAILS_FOR_USER_WITH_ID
#        assert playerDetail.toDICT().get("birthday") == DATE_OF_BIRTH.strftime("%Y-%m-%d")
        assert playerDetail.toDICT().get("sex_m_0_f_1") == SEX
        assert playerDetail.toDICT().get("height_father") == HEIGHT_FATHER
        assert playerDetail.toDICT().get("height_mother") == HEIGHT_MOTHER


def test_edit_player_details(app_generator):
    """
    GIVEN a PlayerDetails model
    WHEN the playerdetails for an existing user are edited
    THEN check the birthdays, sex_m_0_f_1, height_father and height_mother fields are updated correctly
    """
    with app_generator.app_context():
        # Define details for an existing player
        playerDetail = PlayerDetail(user_id=DETAILS_FOR_USER_WITH_ID - 1,
                                    birthday=DATE_OF_BIRTH.replace(year=DATE_OF_BIRTH.year+10),
                                    sex_m_0_f_1=SEX+1,
                                    height_father=HEIGHT_FATHER-20,
                                    height_mother=HEIGHT_MOTHER-20)
        playerDetail.save()
        # Edit data
        playerDetail.user_id += playerDetail.user_id + 2
        playerDetail.birthday = DATE_OF_BIRTH.replace(year=DATE_OF_BIRTH.year-20)
        playerDetail.sex_m_0_f_1 = SEX-1
        playerDetail.height_father = HEIGHT_FATHER+15
        playerDetail.height_mother = HEIGHT_MOTHER+14
        # Check results
        assert playerDetail.user_id is not DETAILS_FOR_USER_WITH_ID - 1
        assert playerDetail.user_id == 4
        assert playerDetail.birthday is not DATE_OF_BIRTH.replace(year=DATE_OF_BIRTH.year+10)
        assert playerDetail.birthday == DATE_OF_BIRTH.replace(year=DATE_OF_BIRTH.year-20)
        assert playerDetail.sex_m_0_f_1 is not SEX+1
        assert playerDetail.sex_m_0_f_1 == SEX-1
        assert playerDetail.height_father is not HEIGHT_FATHER-20
        assert playerDetail.height_father == HEIGHT_FATHER+15
        assert playerDetail.height_mother == HEIGHT_MOTHER+14
#        assert playerDetail.toDICT().get("birthday") == DATE_OF_BIRTH.replace(year=DATE_OF_BIRTH.year-20).strftime("%Y-%m-%d")
        assert playerDetail.toDICT().get("sex_m_0_f_1") == SEX-1
        assert playerDetail.toDICT().get("height_father") == HEIGHT_FATHER+15
        assert playerDetail.toDICT().get("height_mother") == HEIGHT_MOTHER+14


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_new_admin_config(app_generator):
    """
    GIVEN a AdminConfig model
    WHEN a AdminConfig is created
    THEN check the days_reminder, mail_server, mail_port, mail_use_ssl, mail_password and
        mail_username fields are defined correctly
    """


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_edit_admin_config(app_generator):
    """
    GIVEN a AdminConfig model
    WHEN a AdminConfig is edited
    THEN check the days_reminder, mail_server, mail_port, mail_use_ssl, mail_password and
        mail_username fields are updated correctly
    """


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_new_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is created
    THEN check if all fields are defined correctly and the results a calculated correctly
    """

    # Hint: User formulas.py for validation


# Todo
@pytest.mark.skip(reason="Not implemented")
def test_edit_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is edited
    THEN check if all fields are updated correctly and the results a calculated correctly again
    """










