# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from datetime import datetime, timedelta, date
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from json import dumps
from api.formulas import mirwald, bmi, predicted_adult_height, ape_index
from .config import BaseConfig
from .utils import json_serial
import jwt

db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(256), nullable=False)
    date_joined = db.Column(db.DateTime(), default=datetime.utcnow)
    jwt_auth_active = db.Column(db.Boolean())
    is_admin = db.Column(db.Boolean())
    date_last_measurement_reminder = db.Column(db.Date)
    confirmed = db.Column(db.Boolean, nullable=False, default=False)
    confirmed_on = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    date_last_password_reset = db.Column(db.DateTime())

    playermaster = db.relationship("PlayerMaster", back_populates="users", uselist=False)

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
        # Anonymize PlayerMaster
        has_record = db.session.query(PlayerMaster).filter_by(user_id=self.id).scalar()

        if has_record:
            self.playermaster.first_name = "DELETED"
            self.playermaster.last_name = "DELETED"

        self.email = "DELETED"
        self.username = "DELETED"
        self.is_active = False
        self.save()

        # Anonymize user data

        db.session.commit()

    def get_jwt_token(self, expires=500):
        return jwt.encode({'username': self.username, 'exp': datetime.utcnow() + timedelta(hours=1)}, BaseConfig.SECRET_KEY)

    @staticmethod
    def verify_reset_token(token):
        try:
            username = jwt.decode(token, key=BaseConfig.SECRET_KEY, algorithms=["HS256"])['username']
        except Exception as e:
            print('verify_reset_token error: ', e)
            return
        return Users.get_by_username(username)

    @classmethod
    def get_all_users(cls):
        users = cls.query.filter_by(is_active=True).all()
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

        cls_dict = {'_id': self.id,
                    'username': self.username,
                    'email': self.email,
                    'is_admin': self.is_admin}

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


class PlayerMaster(db.Model):
    __tablename__ = 'playermaster'

    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), primary_key=True)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)

    users = db.relationship("Users", back_populates="playermaster")

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()


class PlayerDetail(db.Model):
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), primary_key=True)
    birthday = db.Column(db.Date(), nullable=False)
    sex_m_0_f_1 = db.Column(db.Integer(), nullable=False)
    height_father = db.Column(db.Integer())
    height_mother = db.Column(db.Integer())

    @classmethod
    def get_by_id(cls, id):
        return cls.query.get_or_404(id)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def toDICT(self):
        cls_dict = {'user_id': self.user_id,
                    'birthday': dumps(self.birthday, default=json_serial),
                    'sex_m_0_f_1': self.sex_m_0_f_1,
                    'height_father': self.height_father,
                    'height_mother': self.height_mother}

        return cls_dict


class AnthropometricData(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    date_measured = db.Column(db.Date, default=date.today())
    height = db.Column(db.Integer(), nullable=False)
    sitting_height = db.Column(db.Integer(), nullable=False)
    body_span = db.Column(db.Integer(), nullable=False)
    weight = db.Column(db.Float(), nullable=False)
    phv = db.Column(db.Float(), nullable=False)
    offset = db.Column(db.Float(), nullable=False)
    ak_bio = db.Column(db.String, nullable=False)
    bmi = db.Column(db.Float(), nullable=False)
    pah = db.Column(db.Float())
    pmh = db.Column(db.Float())
    remaining_growth = db.Column(db.Float())
    age_at_measurement = db.Column(db.Float, nullable=False)
    ape_index = db.Column(db.Float, nullable=False)

    # [BEGIN save()] #######
    def save(self):
        playerDetail = PlayerDetail.get_by_id(self.user_id)
        gender = playerDetail.sex_m_0_f_1
        # Strip Time from Datetime if exists
        birthdate = str(playerDetail.birthday).split(' ')[0]
        date_measured = str(self.date_measured).split(' ')[0]
        # Run mirwald equation
        res = mirwald(self.sitting_height,
                      self.height,
                      date_measured,
                      birthdate,
                      self.weight,
                      gender)

        # Get pvh, offset and ak_bio from result dict
        self.phv = res['phv']
        self.ak_bio = res['ak_bio']
        self.offset = res['offset']

        # calculate bmi
        self.bmi = bmi(self.height, self.weight)

        # calculate ape index
        self.ape_index = ape_index(self.body_span, self.height)

        # Check if user as saved parent height
        if playerDetail.height_father is not None and playerDetail.height_mother is not None:
            date_measured = datetime.strptime(date_measured, '%Y-%m-%d')
            birthdate = datetime.strptime(birthdate, '%Y-%m-%d')
            # Calculate chronological age
            age = round((date_measured - birthdate).days / 365, 2)
            # Calculate predicted adult height with Khamos Roche method
            res = predicted_adult_height(gender, self.height, self.weight, age,
                                         playerDetail.height_father, playerDetail.height_mother)

            self.pah = res['pah']
            self.pmh = res['pmh']
            self.remaining_growth = res['remaining_growth']
            self.age_at_measurement = age

        # Add and commit results to db
        db.session.add(self)
        db.session.commit()

    # [END save()] ######

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

    def toDICT(self):
        cls_dict = {'Id': self.id,
                    'UserId': self.user_id,
                    'Datum': dumps(self.date_measured, default=json_serial),
                    'Alter': self.age_at_measurement,
                    'YAPHV': self.offset,
                    'PHV': self.phv,
                    'AK_BIO': self.ak_bio,
                    'BMI': self.bmi,
                    'PMH': self.pmh,
                    'PAH': self.pah,
                    'CM until PAH': self.remaining_growth,
                    'APE Index': self.ape_index,
                    "Größe": self.height,
                    'Sitzgröße': self.sitting_height,
                    'Körperspanne': self.body_span,
                    'Gewicht': self.weight}

        return cls_dict


class AdminConfig(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    days_reminder = db.Column(db.Integer(), default=90)
    mail_server = db.Column(db.String(), default='smtp.example.org')
    mail_port = db.Column(db.Integer(), default=465)
    mail_use_ssl = db.Column(db.Boolean(), default=True)
    mail_username = db.Column(db.String(64), default='doe')
    mail_password = db.Column(db.String(64))
    registration_code = db.Column(db.Integer, nullable=False)

    def update_days_reminder(self, days_reminder):
        self.days_reminder = days_reminder

    def update_mail_server(self, mail_server):
        self.mail_server = mail_server

    def update_mail_port(self, mail_port):
        self.mail_port = mail_port

    def update_mail_use_ssl(self, mail_use_ssl):
        self.mail_use_ssl = mail_use_ssl

    def update_mail_username(self, mail_username):
        self.mail_username = mail_username

    def update_mail_passwort(self, mail_password):
        self.mail_password = mail_password

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def update_days_reminder(cls, _days_reminder):
        config = cls.query.filter_by(id=1).first()
        config.days_reminder = _days_reminder
        db.session.commit()

    @classmethod
    def get_days_reminder(cls):
        config = cls.query.filter_by(id=1).first()
        return config.days_reminder

    @classmethod
    def check_registration_code(cls, code):
        code_exists = cls.query.filter_by(registration_code=code).first()

        if code_exists is None:
            return False
        else:
            return True

    @classmethod
    def get_config(cls):
        return cls.query.filter_by(id=1).first()

    def toDICT(self):

        cls_dict = {'days_reminder': self.days_reminder,
                    'mail_server': self.mail_server,
                    'mail_port': self.mail_port,
                    'mail_use_ssl': self.mail_use_ssl,
                    'mail_username': self.mail_username,
                    'registration_code': self.registration_code}

        return cls_dict
