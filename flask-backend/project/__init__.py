"""
Flask Project Module Initialisation
"""

import os

from flask import Flask


def create_app(test_config=None):
    """
    Flask Application Factory
    :param test_config: Configuration for testing
    """
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.urandom(32)

    if test_config:
        app.config.from_mapping(test_config)

    return app
