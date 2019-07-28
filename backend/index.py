#!/usr/bin/python3

from flask import Flask, request, jsonify
from login import *
from grades import *
from profile import *

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False


@app.route('/grades', methods=['GET'])
def grades():
    username = request.args.get('username')
    password = request.args.get('password')
    auth_session, uid = login_student(username, password)
    finished_courses = get_finished_courses(auth_session, uid)
    unfinished_courses = get_unfinished_courses(auth_session, uid)
    return jsonify(finished_courses, unfinished_courses)


@app.route('/profile', methods=['GET'])
def profile():
    username = request.args.get('username')
    profile_information = get_profile_information(username)
    return jsonify(profile_information)


if __name__ == '__main__':
    app.run(debug=True)
