# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - present VP-Systeme GmbH, Lyrenstr. 13, 44866
"""

from numpy import datetime_as_string
from api.models import AdminConfig, AnthropometricData, PlayerDetail, PlayerMaster, Users
from datetime import date, datetime, timedelta
import pytest


DUMMY_USER_NAME = "johndoe"
DUMMY_USER_MAIL = "doe@example.org"
DUMMY_USER_PASS = "secret-pass"

DUMMIER_USER_NAME = "yetanother"
DUMMIER_USER_MAIL = "mail@internet.com"
DUMMIER_USER_PASS = "secret-password"
DB_ENTRY_AFTER_DELETING_USER = "DELETED"

TO_EDIT_USER_NAME = "beforeedit"
EDITED_USER_NAME = "afteredit"
TO_EDIT_USER_MAIL = "tobe@edited.com"
EDITED_USER_MAIL = "edited-address@after.de"
TO_EDIT_USER_PASS = "to@edit-com"
EDITED_USER_PASS = "edited9$password"

DATE_OF_BIRTH = datetime.strptime("1990-01-01", "%Y-%m-%d").date() # <class 'datetime.date'>
DATE_OF_BIRTH_TEENAGER = date.today() - timedelta(days=5000) # 13,68 years
DETAILS_FOR_USER_WITH_ID = 1
SEX = 0
HEIGHT_FATHER = 189
HEIGHT_MOTHER = 169

ACONF_DAYS_REMINDER = 30
ACONF_MAIL_SERVER = "smtp.example.org"
ACONF_MAIL_PORT = 465
ACONF_MAIL_USE_SSL = 1
ACONF_MAIL_USERNAME = "mark"
ACONF_MAIL_PASS = "simple-pass"
ACONF_REGISTRATION_CODE = 1234

EDITED_ACONF_DAYS_REMINDER = 10
EDITED_ACONF_MAIL_SERVER = "smtp.unreal.org"
EDITED_ACONF_MAIL_PORT = 467
EDITED_ACONF_MAIL_USE_SSL = 0
EDITED_ACONF_MAIL_USERNAME = "adam"
EDITED_ACONF_MAIL_PASS = "complex-pass"
EDITED_ACONF_REGISTRATION_CODE = 4321

ANTH_DATA_DATE_MEASURED = "2022-01-01"
ANTH_DATA_HEIGHT = 182
ANTH_DATA_SITTING_HEIGHT = 99
ANTH_DATA_BODY_SPAN = 64
ANTH_DATA_WEIGHT = 89.9
ANTH_DATA_PHV = 15.12
ANTH_DATA_OFFSET = 1.8
ANTH_DATA_AK_BIO = "1.5 bis 2.5"
ANTH_DATA_BMI = 27.1
ANTH_DATA_PAH = 198.73
ANTH_DATA_PMH = 0.92
ANTH_DATA_REMAINING_GROWTH = 16.73
ANTH_DATA_AGE_AT_MEASURMENT = 13.32

ANTH_EDITED_DATA_DATE_MEASURED = "2024-06-06"
ANTH_EDITED_DATA_HEIGHT = 300
ANTH_EDITED_DATA_SITTING_HEIGHT = 200
ANTH_EDITED_DATA_BODY_SPAN = 71
ANTH_EDITED_DATA_WEIGHT = 150
ANTH_EDITED_DATA_PHV = 33.19
ANTH_EDITED_DATA_OFFSET = 17.44
ANTH_EDITED_DATA_AK_BIO = "2.5"
ANTH_EDITED_DATA_BMI = 16.7
ANTH_EDITED_DATA_PAH = 276.14
ANTH_EDITED_DATA_PMH = 1.09
ANTH_EDITED_DATA_REMAINING_GROWTH = -23.86
ANTH_EDITED_DATA_AGE_AT_MEASURMENT = 15.75

PLMAS_FIRST_NAME = "Kevin"
PLMAS_LAST_NAME = "Brügger"

### Users

def test_new_user(app_generator):
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
        assert DUMMY_USER_NAME == user.username
        assert DUMMY_USER_MAIL == user.email
        assert user.check_password(DUMMY_USER_PASS)
        assert (user.date_joined).date() == date.today()
        assert user.check_jwt_auth_active() == None
        assert user.check_is_admin()
        assert user.is_active
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
        assert user.is_active == 0
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
        user.update_username(EDITED_USER_NAME)
        user.update_email(EDITED_USER_MAIL)
        user.set_password(EDITED_USER_PASS)
        user.set_is_admin(0)
        user.set_jwt_auth_active(1)
        # Check results
        assert TO_EDIT_USER_NAME is not user.username
        assert user.username == EDITED_USER_NAME
        assert TO_EDIT_USER_MAIL is not user.email
        assert user.email == EDITED_USER_MAIL
        assert user.check_password(TO_EDIT_USER_PASS) == False
        assert user.check_password(EDITED_USER_PASS)
        assert user.check_is_admin() == 0

### PlayerDetail

def test_new_player_details(app_generator):
    """
    GIVEN a PlayerDetails model
    WHEN the playerdetails for an existing user are set
    THEN check the birthdays, sex_m_0_f_1, height_father and height_mother fields are defined correctly
    """
    with app_generator.app_context():
        # Define new PlayerDetails
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

### AdminConfig

def test_new_admin_config(app_generator):
    """
    GIVEN a AdminConfig model
    WHEN a AdminConfig is created
    THEN check the days_reminder, mail_server, mail_port, mail_use_ssl, mail_password and
        mail_username fields are defined correctly
    """
    with app_generator.app_context():
        # Create new AdminConfig
        adminConf = AdminConfig(days_reminder=ACONF_DAYS_REMINDER,
                                mail_server=ACONF_MAIL_SERVER,
                                mail_port=ACONF_MAIL_PORT,
                                mail_use_ssl=ACONF_MAIL_USE_SSL,
                                mail_username=ACONF_MAIL_USERNAME,
                                registration_code=ACONF_REGISTRATION_CODE)
        adminConf.update_mail_passwort(ACONF_MAIL_PASS)
        adminConf.save()
        # Check results
        assert adminConf.days_reminder == ACONF_DAYS_REMINDER
        assert adminConf.mail_server == ACONF_MAIL_SERVER
        assert adminConf.mail_port == ACONF_MAIL_PORT
        assert adminConf.mail_use_ssl == ACONF_MAIL_USE_SSL
        assert adminConf.mail_username == ACONF_MAIL_USERNAME
        assert adminConf.mail_password == ACONF_MAIL_PASS
        assert adminConf.toDICT().get("days_reminder") == ACONF_DAYS_REMINDER
        assert adminConf.toDICT().get("mail_server") == ACONF_MAIL_SERVER
        assert adminConf.toDICT().get("mail_port") == ACONF_MAIL_PORT
        assert adminConf.toDICT().get("mail_use_ssl") == ACONF_MAIL_USE_SSL
        assert adminConf.toDICT().get("mail_username") == ACONF_MAIL_USERNAME


def test_edit_admin_config(app_generator):
    """
    GIVEN a AdminConfig model
    WHEN a AdminConfig is edited
    THEN check the days_reminder, mail_server, mail_port, mail_use_ssl, mail_password and
        mail_username fields are updated correctly
    """
    with app_generator.app_context():
        # Create AdminConfig to edit
        adminConf = AdminConfig(days_reminder=ACONF_DAYS_REMINDER,
                                mail_server=ACONF_MAIL_SERVER,
                                mail_port=ACONF_MAIL_PORT,
                                mail_use_ssl=ACONF_MAIL_USE_SSL,
                                mail_username=ACONF_MAIL_USERNAME,
                                mail_password=ACONF_MAIL_PASS,
                                registration_code=ACONF_REGISTRATION_CODE)
        adminConf.save()
        # Edit AdminConfig
        adminConf.update_days_reminder(EDITED_ACONF_DAYS_REMINDER)
        adminConf.update_mail_server(EDITED_ACONF_MAIL_SERVER)
        adminConf.update_mail_port(EDITED_ACONF_MAIL_PORT)
        adminConf.update_mail_use_ssl(EDITED_ACONF_MAIL_USE_SSL)
        adminConf.update_mail_username(EDITED_ACONF_MAIL_USERNAME)
        adminConf.update_mail_passwort(EDITED_ACONF_MAIL_PASS)
        adminConf.registration_code = EDITED_ACONF_REGISTRATION_CODE # as there is no function to update reg code, it gets changed in database
        # Check results
        assert adminConf.days_reminder is not ACONF_DAYS_REMINDER
        assert adminConf.days_reminder == EDITED_ACONF_DAYS_REMINDER
        assert adminConf.mail_server is not ACONF_MAIL_SERVER
        assert adminConf.mail_server == EDITED_ACONF_MAIL_SERVER
        assert adminConf.mail_port is not ACONF_MAIL_PORT
        assert adminConf.mail_port == EDITED_ACONF_MAIL_PORT
        assert adminConf.mail_use_ssl is not ACONF_MAIL_USE_SSL
        assert adminConf.mail_use_ssl == EDITED_ACONF_MAIL_USE_SSL
        assert adminConf.mail_username is not ACONF_MAIL_USERNAME
        assert adminConf.mail_username == EDITED_ACONF_MAIL_USERNAME
        assert adminConf.mail_password is not ACONF_MAIL_PASS
        assert adminConf.mail_password == EDITED_ACONF_MAIL_PASS
        assert adminConf.registration_code is not ACONF_REGISTRATION_CODE
        assert adminConf.registration_code == EDITED_ACONF_REGISTRATION_CODE

### AnthropometricData

def test_new_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is created
    THEN check if all fields are defined correctly and the results a calculated correctly
    """
    with app_generator.app_context():
        # Add user
        user = Users(username=DUMMIER_USER_NAME, email=DUMMIER_USER_MAIL)
        user.set_password(DUMMIER_USER_PASS)
        user.set_is_admin(True)
        user.set_jwt_auth_active(True)
        user.save()
        # Add PlayerDetails
        playerDetail = PlayerDetail(user_id=DETAILS_FOR_USER_WITH_ID,
                                    birthday=DATE_OF_BIRTH_TEENAGER,
                                    sex_m_0_f_1=SEX,
                                    height_father=HEIGHT_FATHER,
                                    height_mother=HEIGHT_MOTHER)
        playerDetail.save()
        # Define anthropometric data for that user
        anthData = AnthropometricData(user_id=1, age_at_measurement=ANTH_DATA_AGE_AT_MEASURMENT)
        anthData.update_date_measured(ANTH_DATA_DATE_MEASURED)
        anthData.update_height(ANTH_DATA_HEIGHT)
        anthData.update_sitting_height(ANTH_DATA_SITTING_HEIGHT)
        anthData.update_body_span(ANTH_DATA_BODY_SPAN)
        anthData.update_weight(ANTH_DATA_WEIGHT)
        anthData.save()
        # Check results
        assert anthData.user_id == DETAILS_FOR_USER_WITH_ID
        assert anthData.date_measured == datetime.strptime(ANTH_DATA_DATE_MEASURED, "%Y-%m-%d").date()
        assert anthData.height == ANTH_DATA_HEIGHT
        assert anthData.sitting_height == ANTH_DATA_SITTING_HEIGHT
        assert anthData.body_span == ANTH_DATA_BODY_SPAN
        assert anthData.weight == ANTH_DATA_WEIGHT
        assert anthData.phv == ANTH_DATA_PHV
        assert anthData.offset == ANTH_DATA_OFFSET
        assert anthData.ak_bio == ANTH_DATA_AK_BIO
        assert anthData.bmi == ANTH_DATA_BMI
        assert anthData.pah == ANTH_DATA_PAH
        assert anthData.pmh == ANTH_DATA_PMH
        assert anthData.remaining_growth == ANTH_DATA_REMAINING_GROWTH
        assert anthData.age_at_measurement == ANTH_DATA_AGE_AT_MEASURMENT
        assert anthData.toDICT().get("UserId") == DETAILS_FOR_USER_WITH_ID
#        assert anthData.toDICT().get("Datum") == ANTH_DATA_DATE_MEASURED
        assert round(anthData.toDICT().get("Alter"), 0) == round(ANTH_DATA_AGE_AT_MEASURMENT, 0)
        assert anthData.toDICT().get("YAPHV") == ANTH_DATA_OFFSET 
        assert anthData.toDICT().get("PHV") == ANTH_DATA_PHV
        assert anthData.toDICT().get("AK_BIO") == ANTH_DATA_AK_BIO
        assert anthData.toDICT().get("BMI") == ANTH_DATA_BMI
        assert anthData.toDICT().get("PMH") == ANTH_DATA_PMH
        assert anthData.toDICT().get("PAH") == ANTH_DATA_PAH
        assert anthData.toDICT().get("CM until PAH") == ANTH_DATA_REMAINING_GROWTH
        assert anthData.toDICT().get("Größe") == ANTH_DATA_HEIGHT
        assert anthData.toDICT().get("Sitzgröße") == ANTH_DATA_SITTING_HEIGHT
        assert anthData.toDICT().get("Körperspanne") == ANTH_DATA_BODY_SPAN
        assert anthData.toDICT().get("Gewicht") == ANTH_DATA_WEIGHT

    # Hint: User formulas.py for validation


@pytest.mark.xfail(reason = "Age outside of 4-17,5")
def test_new_anthropometric_data_WHEN_AGE_IS_NOT_BETWEEN_4and17(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is created
    THEN check if all fields are defined correctly and the results a calculated correctly
    """
    with app_generator.app_context():
        # Add user
        user = Users(username=DUMMIER_USER_NAME, email=DUMMIER_USER_MAIL)
        user.set_password(DUMMIER_USER_PASS)
        user.set_is_admin(True)
        user.set_jwt_auth_active(True)
        user.save()
        # Add PlayerDetails
        playerDetail = PlayerDetail(user_id=DETAILS_FOR_USER_WITH_ID,
                                    birthday=DATE_OF_BIRTH,
                                    sex_m_0_f_1=SEX,
                                    height_father=HEIGHT_FATHER,
                                    height_mother=HEIGHT_MOTHER)
        playerDetail.save()
        # Define anthropometric data for that user
        anthData = AnthropometricData(user_id=1, age_at_measurement=ANTH_DATA_AGE_AT_MEASURMENT)
        anthData.update_date_measured(ANTH_DATA_DATE_MEASURED)
        anthData.update_height(ANTH_DATA_HEIGHT)
        anthData.update_sitting_height(ANTH_DATA_SITTING_HEIGHT)
        anthData.update_body_span(ANTH_DATA_BODY_SPAN)
        anthData.update_weight(ANTH_DATA_WEIGHT)
        anthData.save()
        # Check results
        assert anthData.user_id == DETAILS_FOR_USER_WITH_ID
        assert anthData.date_measured == datetime.strptime(ANTH_DATA_DATE_MEASURED, "%Y-%m-%d").date()
        assert anthData.height == ANTH_DATA_HEIGHT
        assert anthData.sitting_height == ANTH_DATA_SITTING_HEIGHT
        assert anthData.body_span == ANTH_DATA_BODY_SPAN
        assert anthData.weight == ANTH_DATA_WEIGHT
        assert anthData.phv == ANTH_DATA_PHV
        assert anthData.offset == ANTH_DATA_OFFSET
        assert anthData.ak_bio == ANTH_DATA_AK_BIO
        assert anthData.bmi == ANTH_DATA_BMI
        assert anthData.pah == ANTH_DATA_PAH
        assert anthData.pmh == ANTH_DATA_PMH
        assert anthData.remaining_growth == ANTH_DATA_REMAINING_GROWTH
        assert anthData.age_at_measurement == ANTH_DATA_AGE_AT_MEASURMENT


def test_edit_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN a AnthropometricData is edited
    THEN check if all fields are updated correctly and the results a calculated correctly again
    """
    with app_generator.app_context():
        # Add user
        user = Users(username=DUMMIER_USER_NAME, email=DUMMIER_USER_MAIL)
        user.set_password(DUMMIER_USER_PASS)
        user.set_is_admin(True)
        user.set_jwt_auth_active(True)
        user.save()
        # Add PlayerDetails
        playerDetail = PlayerDetail(user_id=DETAILS_FOR_USER_WITH_ID,
                                    birthday=DATE_OF_BIRTH_TEENAGER,
                                    sex_m_0_f_1=SEX,
                                    height_father=HEIGHT_FATHER,
                                    height_mother=HEIGHT_MOTHER)
        playerDetail.save()
        # Define anthropometric data for that user
        anthData = AnthropometricData(user_id=1, age_at_measurement=ANTH_DATA_AGE_AT_MEASURMENT)
        anthData.update_date_measured(ANTH_DATA_DATE_MEASURED)
        anthData.update_height(ANTH_DATA_HEIGHT)
        anthData.update_sitting_height(ANTH_DATA_SITTING_HEIGHT)
        anthData.update_body_span(ANTH_DATA_BODY_SPAN)
        anthData.update_weight(ANTH_DATA_WEIGHT)
        anthData.save()
        # Edit data
        anthData.update_date_measured(ANTH_EDITED_DATA_DATE_MEASURED)
        anthData.update_height(ANTH_EDITED_DATA_HEIGHT)
        anthData.update_sitting_height(ANTH_EDITED_DATA_SITTING_HEIGHT)
        anthData.update_body_span(ANTH_EDITED_DATA_BODY_SPAN)
        anthData.update_weight(ANTH_EDITED_DATA_WEIGHT)
        anthData.save()
        # Check results
        assert anthData.user_id == DETAILS_FOR_USER_WITH_ID
        assert anthData.date_measured == datetime.strptime(ANTH_EDITED_DATA_DATE_MEASURED, "%Y-%m-%d").date()
        assert anthData.height == ANTH_EDITED_DATA_HEIGHT
        assert anthData.sitting_height == ANTH_EDITED_DATA_SITTING_HEIGHT
        assert anthData.body_span == ANTH_EDITED_DATA_BODY_SPAN
        assert anthData.weight == ANTH_EDITED_DATA_WEIGHT
        assert anthData.phv == ANTH_EDITED_DATA_PHV
        assert anthData.offset == ANTH_EDITED_DATA_OFFSET
        assert anthData.ak_bio == ANTH_EDITED_DATA_AK_BIO
        assert anthData.bmi == ANTH_EDITED_DATA_BMI
        assert anthData.pah == ANTH_EDITED_DATA_PAH
        assert anthData.pmh == ANTH_EDITED_DATA_PMH
        assert anthData.remaining_growth == ANTH_EDITED_DATA_REMAINING_GROWTH
        assert anthData.age_at_measurement == ANTH_EDITED_DATA_AGE_AT_MEASURMENT


def test_delete_anthropometric_data(app_generator):
    """
    GIVEN a AnthropometricData model
    WHEN an AnthropometricData is deleted
    THEN check if data has been removed from the table
    """
    with app_generator.app_context():
        # Add user
        user = Users(username=DUMMIER_USER_NAME, email=DUMMIER_USER_MAIL)
        user.set_password(DUMMIER_USER_PASS)
        user.set_is_admin(True)
        user.set_jwt_auth_active(True)
        user.save()
        # Add PlayerDetails
        playerDetail = PlayerDetail(user_id=DETAILS_FOR_USER_WITH_ID,
                                    birthday=DATE_OF_BIRTH_TEENAGER,
                                    sex_m_0_f_1=SEX,
                                    height_father=HEIGHT_FATHER,
                                    height_mother=HEIGHT_MOTHER)
        playerDetail.save()
        # Define anthropometric data for that user
        anthData = AnthropometricData(user_id=1, age_at_measurement=ANTH_DATA_AGE_AT_MEASURMENT)
        anthData.update_date_measured(ANTH_DATA_DATE_MEASURED)
        anthData.update_height(ANTH_DATA_HEIGHT)
        anthData.update_sitting_height(ANTH_DATA_SITTING_HEIGHT)
        anthData.update_body_span(ANTH_DATA_BODY_SPAN)
        anthData.update_weight(ANTH_DATA_WEIGHT)
        anthData.save()
        # Delete anthropometric data
        anthData.delete()
        # Check results
        assert AnthropometricData.get_all() == []

### PlayerMaster

def test_new_player_master(app_generator):
    """
    GIVEN a PlayerMaster model
    WHEN a PlayerMaster is added to database
    THEN check if data has been added successfully
    """
    with app_generator.app_context():
        # Add user
        user = Users(username=DUMMIER_USER_NAME, email=DUMMIER_USER_MAIL)
        user.set_password(DUMMIER_USER_PASS)
        user.set_is_admin(True)
        user.set_jwt_auth_active(True)
        user.save()
        # Add PlayerMaster
        playerMaster = PlayerMaster(user_id=1, first_name=PLMAS_FIRST_NAME, last_name=PLMAS_LAST_NAME)
        playerMaster.save()
        # Check results
        assert playerMaster.first_name == PLMAS_FIRST_NAME
        assert playerMaster.last_name == PLMAS_LAST_NAME