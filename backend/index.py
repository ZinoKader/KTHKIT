#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, request, Response
import json

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
def catch_all(path):
    return Response("<h1>KTHKIT API</h1> <br> <p>...asså det finns inte mycket att se här</p> <br> ", mimetype="text/html")
