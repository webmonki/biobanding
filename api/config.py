# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


def _load_environment() -> None:
    """Load environment variables from a .env file when present."""
    env_file = os.getenv("ENV_FILE")
    if env_file:
        _parse_env_file(Path(env_file))
        return

    default_env = BASE_DIR.parent / ".env"
    _parse_env_file(default_env)


def _parse_env_file(path: Path) -> None:
    if not path.exists():
        return

    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        os.environ.setdefault(key, value)


def _env_bool(name: str, default: bool = False) -> bool:
    """Read a boolean environment variable."""
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "on", "yes"}


def _env_int(name: str, default: int) -> int:
    """Read an integer environment variable."""
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


_load_environment()


class BaseConfig():

    SQLALCHEMY_DATABASE_URI = (
        os.getenv("SQLALCHEMY_DATABASE_URI")
        or os.getenv("DATABASE_URL")
        or f"sqlite:///{(BASE_DIR / 'apidata.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = (
        os.getenv("FLASK_SECRET_KEY")
        or os.getenv("SECRET_KEY")
        or "dev-insecure-secret"
    )
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=_env_int("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 10)
    )
    PREACT_APP_HOST_URI = os.getenv(
        "PREACT_APP_HOST_URI", "http://localhost:8080"
    )

    # Mail Configuration
    MAIL_SERVER = os.getenv("MAIL_SERVER", "localhost")
    MAIL_PORT = _env_int("MAIL_PORT", 465)
    MAIL_USE_SSL = _env_bool("MAIL_USE_SSL", True)
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
