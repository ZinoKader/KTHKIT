#!/usr/bin/python3
# -*- coding: UTF-8 -*-

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
import json
import login
import grades
import profile
import statistics

app = Flask(__name__)
app.config.from_mapping({'JSON_AS_ASCII': False, 'CACHE_TYPE': 'simple'})
cache = Cache(app)
CORS(app)


@app.route('/grades', methods=['GET'])
def grades_endpoint():
    username = request.args.get('username')
    password = request.args.get('password')
    auth_session, uid = login.login_student(username, password)
    finished_courses = grades.get_finished_courses(auth_session, uid)
    unfinished_courses = grades.get_unfinished_courses(auth_session, uid)
    courses = {'finishedCourses': finished_courses,
               'unfinishedCourses': unfinished_courses}
    return jsonify(courses)


@app.route('/profile', methods=['GET'])
def profile_endpoint():
    username = request.args.get('username')
    profile_information = profile.get_profile_information(username)
    return jsonify(profile_information)


@app.route('/statistics/all-courses', methods=['GET'])
@cache.cached(timeout=86400)
def statistics_all_courses_endpoint():
    return jsonify(statistics.get_all_courses())


@app.route('/statistics/course-exams', methods=['GET'])
def statistics_exam_dates_for_course_endpoint():
    return jsonify(statistics.get_course_exam_dates(request.args.get('courseCode')))


@app.route('/statistics/course', methods=['GET'])
def statistics_for_course_endpoint():
    return jsonify(statistics.get_course_statistics(request.args.get('courseCode'),
                                                    request.args.get('examDate')))


@app.route('/statistics/update', methods=['GET'])
def statistics_update_endpoint():
    f = open('kthaccount.json', 'r')
    kth_account = json.load(f)
    f.close()

    auth_session, _ = login.login_student(
        kth_account['username'], kth_account['password'])

    update_status = statistics.update_data(auth_session)
    return update_status


if __name__ == '__main__':
    app.run(host='0.0.0.0')
