#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import re
import html
import requests
import json
import time
from bs4 import BeautifulSoup as bs

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

courses_endpoint = 'https://api.kth.se/api/kopps/v2/course/'
stats_base_url = 'https://kthgrumatte.webfactional.com'
db = None


def init_db():
    global db
    if (not len(firebase_admin._apps)):
        cred = credentials.Certificate('serviceaccount.json')
        firebase_admin.initialize_app(cred)
    if not db:
        db = firestore.client()
    return db


def get_course_exam_dates(course_code):
    db = init_db()
    return {'dates': [collection.id for collection in db.collection(
        'examstatistics').document(course_code).collections()]}


def get_course_statistics(course_code, exam_date):
    db = init_db()
    return next(db.collection('examstatistics').document(course_code).collection(exam_date).get()).to_dict()


def get_all_courses():
    db = init_db()
    courses_ref = db.collection('examstatistics').stream()
    return {'courses': [course.to_dict() for course in courses_ref]}


def update_data(session):
    db = init_db()

    time_start = time.time()
    try:
        request = session.get(stats_base_url + '/stat')
        soup = bs(request.text, "html.parser")
        course_links = [course_link['href']
                        for course_link in soup.select('.leaf.standardNavigationLink > a')]

        exam_links = []
        for course_link in course_links:
            request = session.get(stats_base_url + course_link + 'tenres')
            soup = bs(request.text, "html.parser")
            exam_links += [exam_link['href'] for exam_link in soup.select(
                '.leaf.standardNavigationLink > a')]

        all_exam_statistics = {}
        for exam_link in exam_links:
            try:
                course_code = re.search(
                    '/stat/(.*)/tenres/', exam_link).group(1)
                request = session.get(stats_base_url + exam_link)
                exam_date = re.search(course_code + ': (.*)</h1>',
                                      request.text).group(1)
                exam_stats = bytes(re.search('tentastat = \n(.*)',
                                             request.text).group(1), 'utf-8').decode('unicode-escape')

                if course_code not in all_exam_statistics:
                    all_exam_statistics[course_code] = {}

                all_exam_statistics[course_code][exam_date] = json.loads(
                    exam_stats)
            except Exception as e:
                print(e)
        batch = db.batch()
        for course_code, course_val in all_exam_statistics.items():
            request = requests.get(courses_endpoint + course_code)
            course_information = request.json()
            course_doc_ref = db.collection(
                'examstatistics').document(course_code)
            batch.set(course_doc_ref, {'courseName': course_information['title']['sv'],
                                       'courseCode': course_code, 'courseCredits': course_information['credits'],
                                       'courseLink': course_information['href']['sv'],
                                       'courseDescription': html.unescape(re.sub('(<p>)|(<\/p>)', '', course_information['info']['sv']))})
            for exam_date, exam_val in course_val.items():
                exam_doc_ref = db.collection('examstatistics').document(
                    course_code).collection(exam_date).document(exam_date)
                batch.set(exam_doc_ref, exam_val)

        batch.commit()
        return "Successfully updated exam statistics in: " + str(round(time.time() - time_start, 2)) + "s"
    except Exception as e:
        print(e)
        return "Failed to update exam statistics, time elapsed: " + str(round(time.time() - time_start, 2)) + "s"
