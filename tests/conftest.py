from api import app
from api.models import db

import pytest


@pytest.fixture()
def app_generator():
    with app.app_context():
        db.create_all(app=app)
        yield app
        db.drop_all()


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client
