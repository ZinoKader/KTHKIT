#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

profile_api_url = "https://api.kth.se/api/profile/1.1/"


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def get_profile(path):
    username = request.args.get("username")
    r = requests.get(profile_api_url + username)
    return jsonify(r.json())
