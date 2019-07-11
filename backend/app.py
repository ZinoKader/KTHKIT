#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, request
from flask_cors import CORS
from ladokscraper import LadokScraper
import json

app = Flask("api")
CORS(app)


@app.route("/grades/", methods=["GET"])
def get_student_grades():
    username = request.args.get("username")
    password = request.args.get("password")
    ladok_scraper = LadokScraper()
    ladok_scraper.login(username, password)
    grades = ladok_scraper.get_grades()
    ladok_scraper.kill()

    return json.dumps(grades, ensure_ascii=False, indent=3).encode("utf8")


if __name__ == "__main__":
    app.run(debug=True)
