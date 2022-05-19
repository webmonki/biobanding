# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from datetime import timedelta
import psycopg2

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


class BaseConfig():

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'apidata.db')
    #SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://db_admin:o3G3XxmuYdAyzyl6E6Bs3hTdEMAGNBI1@bio-db.postgres.database.azure.com/postgres?sslmode=require'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "flask-app-secret-key-change-it"
    JWT_SECRET_KEY = "jwt-app-secret-key-change-it"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=10)

    # Mail Configuration
    MAIL_SERVER = 'smtp.strato.de'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = "test@vp-services.de"
    MAIL_PASSWORD = "!Sklarja_93"

