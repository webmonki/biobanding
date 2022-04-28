# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from datetime import datetime, timedelta, date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from api.formulas import mirwald
from .config import BaseConfig
import jwt

db = SQLAlchemy()

@dataclass
class Users(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(64), nullable=False)
    date_joined = db.Column(db.DateTime(), default=datetime.utcnow)
    jwt_auth_active = db.Column(db.Boolean())
    is_admin = db.Column(db.Boolean())
    date_last_measurement_reminder = db.Column(db.Date)

    def __repr__(self):
        return f"User {self.username}"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def update_email(self, new_email):
        self.email = new_email

    def update_username(self, new_username):
        self.username = new_username

    def check_jwt_auth_active(self):
        return self.jwt_auth_active

    def set_jwt_auth_active(self, set_status):
        self.jwt_auth_active = set_status

    def check_is_admin(self):
        return self.is_admin

    def set_is_admin(self, set_status):
        self.is_admin = set_status

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def get_jwt_token(self, expires=500):
        return jwt.encode({'reset_password': self.username, 'exp': datetime.utcnow() + timedelta(minutes=15)}, BaseConfig.SECRET_KEY)

    @staticmethod
    def verify_reset_token(token):
        try:
            username = jwt.decode(token, key=BaseConfig.SECRET_KEY, algorithms=["HS256"])['reset_password']
        except Exception as e:
            print('verify_reset_token error: ',e)
            return
        return Users.query.filter_by(username=username).first()

    @classmethod
    def get_all_users(cls):
        users = cls.query.all()
        return users

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def toDICT(self):

        cls_dict = {}
        cls_dict['_id'] = self.id
        cls_dict['username'] = self.username
        cls_dict['email'] = self.email
        cls_dict['is_admin'] = self.is_admin

        return cls_dict

    def toJSON(self):

        return self.toDICT()


class JWTTokenBlocklist(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    jwt_token = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)

    def __repr__(self):
        return f"Expired Token: {self.jwt_token}"

    def save(self):
        db.session.add(self)
        db.session.commit()

@dataclass
class PlayerMaster(db.Model):
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), primary_key=True)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

@dataclass
class PlayerDetail(db.Model):
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), primary_key=True)
    birthday = db.Column(db.DateTime(), nullable=False)
    sex_m_0_f_1 = db.Column(db.Integer(), nullable=False)
    height_father = db.Column(db.Integer(), nullable=False)
    height_mother = db.Column(db.Integer(), nullable=False)

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)


    def save(self):
        db.session.add(self)
        db.session.commit()

@dataclass
class AnthropometricData(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    date_measured = db.Column(db.Date, default=date.today())
    height = db.Column(db.Integer(), nullable=False)
    sitting_height = db.Column(db.Integer(), nullable=False)
    body_span = db.Column(db.Integer(), nullable=False)
    weight = db.Column(db.Float(), nullable=False)
    result = db.Column(db.Float(), nullable=False)

    def mirwald(self, a, b, c, d):
        '''
            a: Groesse stehend
            b: Groesse sitzend
            c: Chronologisches Alter in Jahren
                := (d2.year-d1.year) + (d2.month-d1.month)/12 + (d2.day-d1.day)/365
            d: Gewicht
        '''
        res = -9.376 + (0.0001882 * ((a-b) * b))+(0.0022 * (c * (a - b))) \
            + (0.005841 * (c * b))-(0.002658 * (c * d))+(0.07693 * ((d / a) * 100))
        return res

    def save(self):
        playerDetail = PlayerDetail.get_by_id(self.user_id)
        gender = playerDetail.sex_m_0_f_1
        # Strip Time from Datetime if exists
        birthdate = str(playerDetail.birthday).split(' ')[0]
        date_measured = str(self.date_measured).split(' ')[0]
        # Calculate PHV age
        self.result = mirwald(self.sitting_height,
                                      self.height,
                                      date_measured,
                                      birthdate,
                                      self.weight,
                                      gender)
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update_date_measured(self, new_date):
        date = datetime.fromisoformat(new_date)
        self.date_measured = date

    def update_height(self, new_height):
        self.height = new_height

    def update_sitting_height(self, new_sitting_height):
        self.sitting_height = new_sitting_height

    def update_body_span(self, new_body_span):
        self.body_span = new_body_span

    def update_weight(self, new_weight):
        self.weight = new_weight

    @classmethod
    def get_by_user_id(cls, _user_id):
        user_data = cls.query.filter_by(user_id=_user_id).all()
        return user_data

    @classmethod
    def get_by_id(cls, _id):
        user_data = cls.query.filter_by(id=_id).first()
        return user_data

    @classmethod
    def get_latest_by_user_id(cls, _id):
        user_data = cls.query.filter_by(user_id=_id).all()
        return user_data[len(user_data) - 1]

    @classmethod
    def get_all(cls):
        user_data = cls.query.all()
        return user_data

@dataclass
class AdminConfig(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    days_reminder = db.Column(db.Integer(), default=90)
    mail_server = db.Column(db.String(), default='smtp.example.org')
    mail_port = db.Column(db.Integer(), default=465)
    mail_use_ssl = db.Column(db.Boolean(), default=True)
    mail_username = db.Column(db.String(64), default='mustermann')
    mail_password = db.Column(db.String(64))

    def update_days_reminder(self, days_reminder):
        self.days_reminder = days_reminder

    def update_mail_server(self, mail_server):
        self.mail_server = mail_server

    def update_mail_port(self, mail_port):
        self.mail_port = mail_port

    def update_mail_use_ssl(self, mail_use_ssl):
        print('SSL: ', mail_use_ssl)
        self.mail_use_ssl = mail_use_ssl

    def update_mail_username(self, mail_username):
        self.mail_username = mail_username

    def update_mail_passwort(self, mail_password):
        self.mail_password = mail_password

    def save(self):
        db.session.add(self)
        db.session.commit()


    @classmethod
    def update_days_reminder (cls, _days_reminder):
        config = cls.query.filter_by(id=1).first()
        config.days_reminder = _days_reminder
        db.session.commit()

    @classmethod
    def get_days_reminder(cls):
        config = cls.query.filter_by(id=1).first()
        return config.days_reminder

    @classmethod
    def get_config(cls):
        return cls.query.filter_by(id=1).first()

    def toDICT(self):

        cls_dict = {}
        cls_dict['days_reminder'] = self.days_reminder
        cls_dict['mail_server'] = self.mail_server
        cls_dict['mail_port'] = self.mail_port
        cls_dict['mail_use_ssl'] = self. mail_use_ssl
        cls_dict['mail_username'] = self.mail_username
        return cls_dict






