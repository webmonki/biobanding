# -*- encoding: utf-8 -*-
"""
Copyright (c) 2022 - VP-Systeme GmbH, Lyrenstr. 13, 44866 Bochum
"""

from datetime import datetime, timezone, timedelta
from functools import wraps
from json import dumps
from random import randrange

import jwt
import os
from flask import request
from flask_restx import Api, Resource, fields

from .config import BaseConfig
from .email import send_email_with_token, send_email
from .models import db, Users, JWTTokenBlocklist, AnthropometricData, AdminConfig, PlayerMaster, PlayerDetail
from .utils import json_serial, emailIsValid

# Define authorization method for SWAGGER UI
authorizations = {"jwt": {"type": "apiKey", "in": "header", "name": "authorization"}}

# Create Flask_RESTx Object
rest_api = Api(version="1.0", title="Users API", authorizations=authorizations)

"""
    Flask-Restx models for api request and response data
"""

signup_model = rest_api.model('SignUpModel', {"username": fields.String(required=True, min_length=2, max_length=32),
                                              "email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=4, max_length=16),
                                              "registration_code" : fields.Integer(required=True, min=1000, max=9999),
                                              "is_admin": fields.Boolean()
                                              })

login_model = rest_api.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = rest_api.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2,
                                                                             max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })
user_password_forget_model = rest_api.model('UserPasswordForgetModel',
                                            {"email": fields.String(required=True, min_length=4)})

user_password_reset_model = rest_api.model('UserPasswordResetModel',
                                           {"token": fields.String(required=True, min_length=1),
                                            "password": fields.String(required=True, min_length=2, max_length=16)
                                            })

user_confirm_model = rest_api.model('UserConformModel',
                                    {"first_name": fields.String(required=True, min_length=2, max_length=32),
                                     "last_name": fields.String(required=True, min_length=4,
                                                                max_length=64),
                                     "birthday": fields.Date(required=True),
                                     "sex_m_0_f_1": fields.Integer(required=True, min=0, max=1),
                                     "height_father": fields.Float(required=False, min=0, max=300),
                                     "height_mother": fields.Float(required=False, min=0, max=300)
                                     })

config_model = rest_api.model('ConfigModel', {"days_reminder": fields.Integer(min=0, max=120,
                                                                              description='Interval in days in which '
                                                                                          'the players are reminded by '
                                                                                          'mail for a new measurement.'),
                                              "mail_server": fields.String(),
                                              "mail_port": fields.Integer(min=0, max=65000),
                                              "mail_use_ssl": fields.Boolean(),
                                              "mail_username": fields.String(),
                                              "mail_password": fields.String()
                                              })


config_check_code_model = rest_api.model('ConfigCheckCodeModel', {"registration_code": fields.Integer(required=True, max=9999)})

test_mail_config_model = rest_api.model('TestMailConfigModel', {
    "test_email_address": fields.String(required=True, min_length=5, max_length=64)})

player_model = rest_api.model('PlayerModel', {"userID": fields.Integer(required=True, min=0),
                                              "first_name": fields.String(required=True, min_length=2, max_length=32),
                                              "last_name": fields.String(required=True, min_length=4, max_length=64),
                                              "birthday": fields.Date(required=True),
                                              "sex_m_0_f_1": fields.Integer(required=True, min=0, max=1),
                                              "height_father": fields.Float(required=True, min=0, max=300),
                                              "height_mother": fields.Float(required=True, min=0, max=300)
                                              })

anthropometric_data_model = rest_api.model('AnthropometricDataModel', {
    "userID": fields.Integer(required=True, min=0),
    "date_measured": fields.Date(required=True),
    "height": fields.Integer(required=True, min=0, max=300),
    "sitting_height": fields.Integer(required=True, min=0, max=300),
    "body_span": fields.Integer(required=True, min=0, max=300),
    "weight": fields.Float(required=True, min=0, max=300)
}
                                           )

anthropometric_data_edit_model = rest_api.model('AnthropometricDataEditModel', {
    "date_measured": fields.Date(required=True),
    "height": fields.Integer(required=True, min=0, max=300),
    "sitting_height": fields.Integer(required=True, min=0, max=300),
    "body_span": fields.Integer(required=True, min=0, max=300),
    "weight": fields.Float(required=True, min=0, max=300)
})


def token_required(f):
    """
       Helper function for JWT token required
    """

    @wraps(f)
    @rest_api.doc(security='jwt')
    def decorator(*args, **kwargs):

        token = None

        if "authorization" in request.headers:
            token = request.headers["authorization"]

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            current_user = Users.get_by_email(data["email"])

            if not current_user:
                return {"success": False,
                        "msg": "Sorry. Wrong auth token. This user does not exist."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()

            if token_expired is not None:
                return {"success": False, "msg": "Token revoked."}, 400

            if not current_user.check_jwt_auth_active():
                return {"success": False, "msg": "Token expired."}, 400

        except:
            return {"success": False, "msg": "Token is invalid"}, 400

        return f(current_user, *args, **kwargs)

    return decorator


"""
    Flask-Restx routes
"""


@rest_api.route('/api/usercount', doc={"deprecated": True})
class UserCount(Resource):

    def get(self):
        try:
            users = Users.get_all_users()
        except:
            return {"success": False,
                    "msg": "Could not count users"}, 500

        return {"success": True,
                "length": len(users)}, 200


@rest_api.route('/api/users/details', doc={"deprecated": True})
class AllUserDetails(Resource):

    @token_required
    def get(self, current_user):
        try:
            users = Users.get_all_users()
        except:
            return {"success": False,
                    "msg": "Could not read users"}, 400

        detailsList = []

        for user in users:
            try:
                player_details = PlayerDetail.get_by_id(user.id)
                birthday = dumps(player_details.birthday, default=json_serial)
                sex = player_details.sex_m_0_f_1
            except:
                birthday = "/"
                sex = "/"

            try:
                player_master = PlayerMaster.get_by_id(user.id)
                first_name = player_master.first_name
                last_name = player_master.last_name
            except:
                first_name = "/"
                last_name = "/"

            try:
                anthro_data = AnthropometricData.get_latest_by_user_id(user.id)
                measureID = anthro_data.id
                height = anthro_data.height
                result = anthro_data.result
            except:
                measureID = "/"
                height = "/"
                result = "/"

            detailsList.append(
                {
                    "userID": user.id,
                    "measureID": measureID,
                    "username": user.username,
                    "firstname": first_name,
                    "lastname": last_name,
                    "email": user.email,
                    "birthday": birthday,
                    "sex_m_0_f_1": sex,
                    "height": height,
                    "result": result
                }
            )
        return {"success": True,
                "userdetails": detailsList}


@rest_api.route('/api/users')
class AllUsers(Resource):

    @rest_api.response(200, 'Success')
    @rest_api.response(400, 'Could not read players anthropometric data')
    @token_required
    def get(self, current_user):
        """Return all users"""

        try:
            users = Users.get_all_users()
        except:
            return {"success": False,
                    "msg": "Could not read players anthropometric data"}, 400
        userList = []
        for row in users:
            userList.append(
                {
                    "userID": row.id,
                    "Benutzername": row.username,
                    "E-Mail": row.email
                }
            )
        return {"success": True,
                "users:": userList}, 200


@rest_api.expect(user_password_forget_model)
@rest_api.route('/api/user/forget')
class ResetPasswort(Resource):

    @rest_api.response(200, 'Success')
    @rest_api.response(403, 'Only one password reset email can be sent per minute')
    @rest_api.response(404, 'The email address does not exist')
    def put(self):
        """Send email to given address with option to reset the password."""

        req_data = request.get_json()

        _email = req_data.get("email")
        user = Users.get_by_email(_email)

        token = user.get_jwt_token()
        url = "{}/reset?token={}".format(os.environ['PREACT_APP_HOST_URI'], token)

        if user:
            block_reset = False
            # Check id user has already requested a password reset
            if user.date_last_password_reset is not None:
                # Get seconds since last reset
                delta = (datetime.utcnow() - user.date_last_password_reset).total_seconds() / 60
                # Check if the last mail was sent more than one minute ago
                if delta <= 1:
                    block_reset = True
            if not block_reset:
                user.date_last_password_reset = datetime.utcnow()
                user.save()
                send_email_with_token(user, 'Passwort vergessen', 'reset_email.html', url)

                return {"success": True,
                        "msg": "Link to reset the password was sent via email to {}.".format(_email)}, 200
            else:
                return {"success": False,
                        "msg": "Only one password reset email can be sent per minute."}, 403
        else:
            return {"success": False,
                    "msg": "The email address {} does not exist.".format(_email)}, 404


@rest_api.expect(user_password_reset_model)
@rest_api.route('/api/user/reset')
class ResetVerified(Resource):

    @rest_api.response(202, 'Accepted')
    @rest_api.response(401, 'No valid token')
    def put(self):
        """Update user password if token is valid."""

        req_data = request.get_json()
        _token = req_data.get("token")
        _password = req_data.get("password")

        user = Users.verify_reset_token(_token)

        if not user:
            return {"success": False,
                    "msg": "No valid token"}, 401

        user.set_password(_password)
        user.save()

        return {"success": True,
                "msg": "Password for user {} successfully reset".format(user.username)}, 202


# @rest_api.expect(login_model)
@rest_api.route('/api/user/<int:id>')
class EditUser(Resource):

    @token_required
    def put(self, current_user, id):
        """Update user from given id."""

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")
        try:
            user = Users.get_by_id(id)

            if _new_username:
                user.update_username(_new_username)

            if _new_email:
                user.update_email(_new_email)
        except:
            return {"success": False,
                    "msg": "No user found with given id"}, 400

        user.save()

        return {"success": True,
                "msg": "Successfully updated user data"}, 200

    @rest_api.response(200, 'Success')
    @rest_api.response(400, 'Could not delete User')
    @token_required
    def delete(self, current_user, id):
        """Delete user with given id"""

        try:
            user = Users.get_by_id(id)
            user.delete()
        except Exception as e:
            print(e)
            return {
                       "success": False,
                       "msg": "Could not delete User {}".format(e)}, 400

        return {"success": True,
                "msg": "Successfully deleted user"}, 200


@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.response(200, 'Success')
    @rest_api.response(400, 'Invalid credentials')
    @rest_api.expect(signup_model, validate=True)
    def post(self):
        """Register a new user and send an email with a confirmation link (example.org/confirm?token=example-token)"""

        req_data = request.get_json()

        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")
        _is_admin = req_data.get("is_admin")
        _registration_code = req_data.get("registration_code")

        if not AdminConfig.check_registration_code(_registration_code):
            return {"success": False,
                    "msg": "Registration code {} is not valid".format(_registration_code)}, 400

        if not emailIsValid(_email):
            return {"success": False,
                    "msg": "Email {} is not valid".format(_email)}, 400

        email_exists = Users.get_by_email(_email)
        if email_exists:
            return {"success": False,
                    "msg": "Email {} already taken".format(_email)}, 400

        user_exists = Users.get_by_username(_username)
        if user_exists:
            return {"success": False,
                    "msg": "Username {} already taken".format(_username)}, 400

        new_user = Users(username=_username, email=_email, confirmed=False)

        new_user.set_password(_password)
        new_user.set_is_admin(_is_admin)
        new_user.save()

        token = new_user.get_jwt_token()
        url = "{}/confirm?token={}".format(os.environ['PREACT_APP_HOST_URI'], token)

        send_email_with_token(new_user, 'Bitte bestätige deine E-Mail-Adresse', 'confirm_email_address.html', url)

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered and a confirmation link was send"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    @rest_api.response(200, 'Success')
    @rest_api.response(401, 'Wrong credentials')
    @rest_api.response(403, 'Email address is not confirmed')
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 401

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 401

        if not user_exists.confirmed:
            return {"success": False,
                    "msg": "Email address is not confirmed"}, 403

        # create access token uwing JWT
        token = jwt.encode({'email': _email, 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200


@rest_api.route('/api/users/edit')
class EditUser(Resource):
    """
       Edits User's username or password or both using 'user_edit_model' input
    """

    @rest_api.expect(user_edit_model)
    @token_required
    def post(self, current_user):

        req_data = request.get_json()

        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            self.update_username(_new_username)

        if _new_email:
            self.update_email(_new_email)

        self.save()

        token = jwt.encode({'email': _new_email, 'exp': datetime.utcnow() + timedelta(minutes=30)},
                           BaseConfig.SECRET_KEY)
        self.set_jwt_auth_active(True)
        self.save()

        return {"success": True,
                "token": token}, 200


@rest_api.route('/api/users/logout')
class LogoutUser(Resource):
    """
       Logs out User using 'logout_model' input
    """

    @token_required
    def post(self, current_user):
        _jwt_token = request.headers["authorization"]

        jwt_block = JWTTokenBlocklist(jwt_token=_jwt_token, created_at=datetime.now(timezone.utc))
        jwt_block.save()

        self.set_jwt_auth_active(False)
        self.save()

        return {"success": True}, 200


@rest_api.route('/api/users/confirm')
@rest_api.expect(user_confirm_model)
class Confirm(Resource):
    """
      Confirm users email address
    """

    @rest_api.response(200, 'Email address already confirmed')
    @rest_api.response(201, 'Account Confirmed and created player details')
    @rest_api.response(401, 'No valid token')
    def post(self):
        req_data = request.get_json()

        _last_name = req_data.get("last_name")
        _first_name = req_data.get("first_name")
        _birthday = datetime.strptime(req_data.get("birthday"), '%Y-%m-%d')
        _sex_m_0_f_1 = req_data.get("sex_m_0_f_1")
        _height_father = req_data.get("height_father")
        _height_mother = req_data.get("height_mother")

        token = None

        # Check if token is valid
        if "authorization" in request.headers:
            token = request.headers["authorization"]

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            user = Users.verify_reset_token(token)

            if not user:
                return {"success": False,
                        "msg": "Sorry. Wrong auth token. This user does not exist."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()

            if token_expired is not None:
                return {"success": False, "msg": "Token revoked."}, 400

        except:
            return {"success": False, "msg": "Token is invalid"}, 400

        # Check if user is alread confirmed
        if user.confirmed:
            return {"success": True,
                    "msg": "Email address already confirmed. Please login."}, 200

        # Save PlayerDetails to DB
        playerdetails = PlayerDetail(user_id=user.id, birthday=_birthday, sex_m_0_f_1=_sex_m_0_f_1)

        if _height_father:
            playerdetails.height_father = _height_father
        if _height_mother:
            playerdetails.height_mother = _height_mother

        playerdetails.save()

        # Save last- and firstname to PlayerMaster table
        playermaster = PlayerMaster(user_id=user.id, last_name=_last_name, first_name=_first_name)
        playermaster.save()

        # Set user confirmed to true
        user.confirmed = True
        user.confirmed_on = datetime.utcnow()
        # Set user session
        user.set_jwt_auth_active(True)
        # Save confirmed user
        user.save()

        return {"success": True,
                "token": token,
                "user": user.toJSON(),
                "msg": "Successful confirmed account. User is Logged in"}, 201


@rest_api.route('/api/configurations')
class EditConfiguration(Resource):
    """
       Edits the admin configuration
    """

    @rest_api.expect(config_model)
    @token_required
    def post(self, current_user):
        """Updates the admin configuration"""

        req_data = request.get_json()
        _days_reminder = req_data.get("days_reminder")
        _mail_server = req_data.get("mail_server")
        _mail_port = req_data.get("mail_port")
        _mail_use_ssl = req_data.get("mail_use_ssl")
        _mail_username = req_data.get("mail_username")
        _mail_password = req_data.get("mail_password")

        try:
            config = AdminConfig.get_config()
            if _days_reminder:
                config.update_days_reminder(_days_reminder)
            if _mail_server:
                config.update_mail_server(_mail_server)
            if _mail_port:
                config.update_mail_port(_mail_port)
            if _mail_use_ssl is not None:
                config.update_mail_use_ssl(_mail_use_ssl)
            if _mail_username:
                config.update_mail_username(_mail_username)
            if _mail_password:
                config.update_mail_passwort(_mail_password)
            config.save()
        except Exception:
            return {"success": False,
                    "msg": "Configuration could not be loaded"}, 400

        return {"success": True,
                "config": config.toDICT(),
                "msg": "The config was successfully updated"}, 200

    @token_required
    def get(self, current_user):
        """Return the admin configuration"""

        try:
            config = AdminConfig.get_config()
        except:
            return {"success": False,
                    "msg": "There is no configuration."}, 500

        return {"success": True,
                "config": config.toDICT()}, 200


@rest_api.route('/api/configurations/code')
class Configuration(Resource):

    @rest_api.response(200, 'Success')
    @rest_api.response(400, 'Could not save new registration code')
    @rest_api.response(404, 'Authenticated, but no permissions')
    @token_required
    def post(self, current_user):
        """Generate new registration code"""

        if self.is_admin:
            # Generate new registration code
            new_code = randrange(1000, 9999, 4)
            try:
                # Get configuration from db
                config = AdminConfig.get_config()
                # Save new code to AdminConfig in db
                config.registration_code = new_code
                config.save()

            except Exception:
                return {"success": False,
                        "msg": "Could not save new registration code"}, 400

            return {"success": True,
                    "registration_code": new_code,
                    "msg": "Successfully generated new registration code"}, 200
        else:
            return {"success": False,
                    "msg": "Authenticated, but no permissions"}, 403


@rest_api.route('/api/configurations/testmail')
class EditConfiguration(Resource):

    @rest_api.expect(test_mail_config_model)
    @token_required
    def post(self, current_user):
        """Send test mail to given e-mail address"""

        if self.is_admin:
            try:
                send_email(self.email, 'Testmail: Mail-Server ist korrekt konfiguriert.', 'Testmail')
            except Exception:
                return {"success": False,
                        "msg": "Test email could not be sent"}, 400

            return {"success": True,
                    "msg": "Test email has been sent"}, 200
        else:
            return {"success": False,
                    "msg": "Authenticated, but no permissions"}, 403


@rest_api.route('/api/configurations/check_code')
class Configuration(Resource):

    @rest_api.response(200, 'Code is valid')
    @rest_api.response(400, 'Code is not valid')
    @rest_api.expect(config_check_code_model)
    def post(self):
        req_data = request.get_json()
        _registration_code = req_data.get("registration_code")

        is_valid = AdminConfig.check_registration_code(_registration_code)

        if is_valid:
            return {"success": True,
                    "msg": "Code is valid"}, 200
        else:
            return {"success": False,
                    "msg": "Code is not valid"}, 400


@rest_api.route('/api/user/<int:userID>/details')
class PlayerDetails(Resource):
    """
       Edits the admin configuration
    """

    @rest_api.expect(player_model)
    @token_required
    def post(self, current_user, userID):
        """create player details"""

        req_data = request.get_json()
        _first_name = req_data.get("first_name")
        _last_name = req_data.get("last_name")
        _birthday = datetime.strptime(req_data.get("birthday"), '%Y-%m-%d')
        _sex_m_0_f_1 = req_data.get('sex_m_0_f_1')
        _height_father = req_data.get("height_father")
        _height_mother = req_data.get("height_mother")

        try:
            # Check if user has already PlayerMaster row
            master_exists = db.session.query(PlayerMaster).filter_by(user_id=userID).first()
            # Check if user has already PlayerDetails row
            details_exists = db.session.query(PlayerDetail).filter_by(user_id=userID).first()

            # INSERT or UPDATE users PlayerMaster row
            if master_exists:
                master_exists.first_name = _first_name
                master_exists.last_name = _last_name
                master_exists.save()
            else:
                _new_player_master = PlayerMaster(user_id=userID, first_name=_first_name, last_name=_last_name)
                _new_player_master.save()

            # INSERT or UPDATE users PlayerDetails row
            if details_exists:
                details_exists.birthday = _birthday
                details_exists.sex_m_0_f_1 = _sex_m_0_f_1
                details_exists.height_father = _height_father
                details_exists.height_mother = _height_mother
                details_exists.save()
            else:
                _new_player_detail = PlayerDetail(user_id=userID, birthday=_birthday, sex_m_0_f_1=_sex_m_0_f_1,
                                                  height_father=_height_father, height_mother=_height_mother)
                _new_player_detail.save()

        except:
            return {"success": False,
                    "msg": "Player details could not be created "}, 400

        return {"success": True,
                "msg": "Player details were successfully created"}, 200

    @token_required
    @rest_api.response(200, "Success", player_model)
    @rest_api.response(404, "404 Not Found: The requested URL was not found on the server.")
    def get(self, current_user, userID):
        """Return player details"""

        player_detail = PlayerDetail.get_by_id(userID)
        player_master = PlayerMaster.get_by_id(userID)

        return {"success": True,
                "player_details:": {
                    "userID": player_detail.user_id,
                    "first_name": player_master.first_name,
                    "last_name": player_master.last_name,
                    "birthday": dumps(player_detail.birthday, default=json_serial),
                    "sex_m_0_f_1": player_detail.sex_m_0_f_1,
                    "height_father": player_detail.height_father,
                    "height_mother": player_detail.height_mother}}, 200


@rest_api.route('/api/user/<int:userID>/anthropometric')
class Anthropometric(Resource):
    """
       Posts the anthropometric deta
    """

    @rest_api.expect(anthropometric_data_model)
    @token_required
    def post(self, current_user, userID):
        """create anthropometric data"""

        req_data = request.get_json()
        _date_measured = datetime.strptime(req_data.get("date_measured"), '%Y-%m-%d')
        _height = req_data.get("height")
        _sitting_height = req_data.get("sitting_height")
        _body_span = req_data.get("body_span")
        _weight = req_data.get("weight")

        _new_anthropometric_data = AnthropometricData(
            user_id=userID,
            date_measured=_date_measured,
            height=_height,
            sitting_height=_sitting_height,
            body_span=_body_span,
            weight=_weight
        )
        _new_anthropometric_data.save()

        return {"success": False,
                "msg": "Anthropometric data could not be created"}, 400

        return {"success": True,
                "anthropometric_data": anthropometric_data_model.toDICT(),
                "msg": "Anthropometric data was successfully created"}, 200

    @token_required
    def get(self, current_user, userID):
        """Return players anthropometric data"""

        try:
            user_data = AnthropometricData.get_by_user_id(userID)
        except:
            return {"success": False,
                    "msg": "Could not read players anthropometric data"}, 500

        measurements = []
        for measurement in user_data:
            measurements.append(measurement.toDICT())
        return {"success": True,
                "measurements:": measurements}, 200


@rest_api.route('/api/measurement/<int:id>')
class Measurement(Resource):
    @token_required
    def get(self, current_user, id):
        """Return anthropometric measurement"""

        try:
            measurement = AnthropometricData.get_by_id(id)
        except:
            return {
                       "success": False,
                       "msg": "Could not read players anthropometric data"}, 500

        return {"success": True,
                "measurement:": measurement.toDICT()
                }, 200

    @token_required
    def delete(self, current_user, id):
        """Delete anthropometric measurement"""

        try:
            measurement_data = AnthropometricData.get_by_id(id)
            measurement_data.delete()
        except:
            return {
                       "success": False,
                       "msg": "Could not delete players anthropometric data"}, 500

        return {"success": True,
                "msg": "Measurement successfully deleted"}, 200

    @rest_api.expect(anthropometric_data_edit_model)
    @token_required
    def put(self, current_user, id):

        req_data = request.get_json()

        print("Request", req_data)

        _new_date_measured = req_data.get("date_measured")
        _new_height = req_data.get("height")
        _new_sitting_height = req_data.get("sitting_height")
        _new_body_span = req_data.get("body_span")
        _new_weight = req_data.get("weight")

        measurement_data = AnthropometricData.get_by_id(id)
        print("Measurement_Data: ", measurement_data)

        if _new_date_measured:
            measurement_data.update_date_measured(_new_date_measured)

        if _new_height:
            measurement_data.update_height(_new_height)

        if _new_sitting_height:
            measurement_data.update_sitting_height(_new_sitting_height)

        if _new_body_span:
            measurement_data.update_body_span(_new_body_span)

        if _new_weight:
            measurement_data.update_weight(_new_weight)

        measurement_data.save()

        return {"success": True,
                'msg': 'Successfully created new measurement.'}, 200


@rest_api.route('/api/measurements')
class Measurements(Resource):

    @token_required
    def get(self, current_user):
        """Return all anthropometric measurements for all users"""

        try:
            query = db.session.query(AnthropometricData, Users.username).join(Users).all()
            result = []

            for a, u in query:
                # Merge dicts
                measurement = {**{'Benutzer': u}, **a.toDICT()}
                result.append(measurement)

            return {"success": True,
                    'measurements': result}, 200
        except Exception as e:
            print(e)
            return {"success": False,
                    'msg': 'Could not read measurements.'}, 400
