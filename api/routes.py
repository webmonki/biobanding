# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from datetime import datetime, timezone, timedelta
from functools import wraps
from json import dumps
from flask import request
from flask_restx import Api, Resource, fields

import jwt

from .models import db, Users, JWTTokenBlocklist, AnthropometricData, AdminConfig, PlayerMaster, PlayerDetail
from .config import BaseConfig
from. utils import json_serial

rest_api = Api(version="1.0", title="Users API")


"""
    Flask-Restx models for api request and response data
"""

signup_model = rest_api.model('SignUpModel', {"username": fields.String(required=True, min_length=2, max_length=32),
                                              "email": fields.String(required=True, min_length=4, max_length=64),
                                              "password": fields.String(required=True, min_length=4, max_length=16)
                                              })

login_model = rest_api.model('LoginModel', {"email": fields.String(required=True, min_length=4, max_length=64),
                                            "password": fields.String(required=True, min_length=4, max_length=16)
                                            })

user_edit_model = rest_api.model('UserEditModel', {"userID": fields.String(required=True, min_length=1, max_length=32),
                                                   "username": fields.String(required=True, min_length=2, max_length=32),
                                                   "email": fields.String(required=True, min_length=4, max_length=64)
                                                   })


config_model = rest_api.model('ConfigModel', {"days_reminder": fields.Integer(min=0, max=120, description='Interval in days in which the players are reminded by mail for a new measurement.')})

player_model = rest_api.model('PlayerModel', {"userID": fields.Integer(required=True, min=0),
                                                   "first_name": fields.String(required=True, min_length=2, max_length=32),
                                                   "last_name": fields.String(required=True, min_length=4, max_length=64),
                                                    "birthday": fields.Date(required=True),
                                                    "sex_m_0_f_1": fields.Integer(required=True, min=0, max=1),
                                                    "height_father": fields.Float(required=True, min=0, max=300),
                                                    "height_mother": fields.Float(required=True, min=0, max=300)
                                              })

anthropometric_data_model = rest_api.model('AnthropometricDataModel', {
        "id": fields.Integer(required=True, min=0),
        "userID": fields.Integer(required=True, min=0),
        "date_measured": fields.Date(required=True),
        "height": fields.Integer(required=True, min=0, max=300),
        "sitting_height": fields.Integer(required=True, min=0, max=300),
        "body_span": fields.Integer(required=True, min=0, max=300),
        "weight": fields.Float(required=True, min=0, max=300),
        "result": fields.Float(required=True, min=0, max=300)
}
)

"""
   Helper function for JWT token required
"""

def token_required(f):

    @wraps(f)
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


@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.expect(signup_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)
        if user_exists:
            return {"success": False,
                    "msg": "Email already taken"}, 400

        new_user = Users(username=_username, email=_email)

        new_user.set_password(_password)
        new_user.save()

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        if not user_exists:
            return {"success": False,
                    "msg": "This email does not exist."}, 400

        if not user_exists.check_password(_password):
            return {"success": False,
                    "msg": "Wrong credentials."}, 400

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

        return {"success": True}, 200


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

@rest_api.route('/api/configurations')
class EditConfiguration(Resource):
    """
       Edits the admin configuration
    """

    @rest_api.expect(config_model)
    @token_required
    def put(self, current_user):
        """Updates the admin configuration"""

        req_data = request.get_json()
        _days_reminder = req_data.get("days_reminder")
        try:
            AdminConfig.update_days_reminder(_days_reminder)
        except Exception:
            return {"success": False,
                    "msg": "Configuration could not be loaded"}, 500

        return {"success": True,
                "msg": "The config was successfully updated"}, 200

    @token_required
    def get(self, current_user):
        """Return the admin configuration"""

        try:
            config = AdminConfig.get_days_reminder()
        except:
            return {"success": False,
                    "msg": "There is no configuration."}, 500


        return {"success": True,
                "days_reminder": config}, 200


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
        _sex_m_0_f_1 = req_data.get('height_father')
        _height_father = req_data.get("height_father")
        _height_mother = req_data.get("height_mother")

        try:
            _new_player_master = PlayerMaster(user_id=userID, first_name=_first_name, last_name=_last_name)
            _new_player_master.save()

            _new_player_detail = PlayerDetail(user_id=userID, birthday=_birthday, sex_m_0_f_1=_sex_m_0_f_1, height_father=_height_father, height_mother=_height_mother )
            _new_player_detail.save()
        except:
            return {"success": False,
                    "msg": "Player details could not be created"}, 500

        return {"success": True,
                "msg": "Player details were successfully created"}, 200

    @token_required
    def get(self, current_user, userID):
        """Return player details"""

        try:
            player_detail = PlayerDetail.get_by_id(userID)
            player_master = PlayerMaster.get_by_id(userID)
            print(player_detail.height_father)
        except:
            return {"success": False,
                    "msg": "Could not read player details"}, 500

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
        _result = 1

        try:
            _new_anthropometric_data = AnthropometricData(
                user_id=userID,
                date_measured=_date_measured,
                height=_height,
                sitting_height=_sitting_height,
                body_span=_body_span,
                weight=_weight,
                result=_result
            )
            _new_anthropometric_data.save()
        except:
            return {"success": False,
                    "msg": "Anthropometric data could not be created"}, 500

        return {"success": True,
                "msg": "Anthropometric data was successfully created"}, 200
