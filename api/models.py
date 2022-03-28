# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from datetime import datetime
from xmlrpc.client import DateTime

from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(32), nullable=False)
    email = db.Column(db.String(64), nullable=False)
    password = db.Column(db.String(64), nullable=False)
    date_joined = db.Column(db.DateTime(), default=datetime.utcnow)
    jwt_auth_active = db.Column(db.Boolean())
    is_admin = db.Column(db.Boolean())

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


class AnthropometricData(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    date_measured = db.Column(db.DateTime(), default=datetime.utcnow)
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

class AdminConfig(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    days_reminder = db.Column(db.Integer(), default=90)

    @classmethod
    def update_days_reminder (cls, _days_reminder):
        config = cls.query.filter_by(id=1).first()
        config.days_reminder = _days_reminder
        db.session.commit()

    @classmethod
    def get_days_reminder(cls):
        config = cls.query.filter_by(id=1).first()
        return config.days_reminder


