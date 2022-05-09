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
