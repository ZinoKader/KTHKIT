#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import re
import json
import time
from bs4 import BeautifulSoup as bs

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

stats_base_url = 'https://kthgrumatte.webfactional.com'


def init_db():
    if (not len(firebase_admin._apps)):
        cred = credentials.Certificate('serviceaccount.json')
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db


def get_all_courses():
    db = init_db()
    courses_ref = db.collection('examstatistics').stream()
    courses = {'courses': [course.id for course in courses_ref]}
    return courses


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
            course_code = re.search('/stat/(.*)/tenres/', exam_link).group(1)
            request = session.get(stats_base_url + exam_link)
            exam_date = re.search(course_code + ': (.*)</h1>',
                                  request.text).group(1)
            exam_stats = bytes(re.search('tentastat = \n(.*)',
                                         request.text).group(1), 'utf-8').decode('unicode-escape')

            if course_code not in all_exam_statistics:
                all_exam_statistics[course_code] = {}

            all_exam_statistics[course_code][exam_date] = json.loads(
                exam_stats)

        batch = db.batch()
        for field, val in all_exam_statistics.items():
            doc_ref = db.collection('examstatistics').document(field)
            batch.set(doc_ref, val)

        batch.commit()
        return "Successfully updated exam statistics in: " + str(round(time.time() - time_start, 2)) + "s"
    except Exception as e:
        print(repr(e))
        return "Failed to update exam statistics, time elapsed: " + str(round(time.time() - time_start, 2)) + "s"
