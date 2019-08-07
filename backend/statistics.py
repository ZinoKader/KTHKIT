#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import re
from bs4 import BeautifulSoup as bs

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

stats_base_url = 'https://kthgrumatte.webfactional.com'


def init_db():
    cred = credentials.Certificate('serviceaccount.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db


def fetch_statistics_data():
    pass


def update_data(session):
    db = init_db()

    request = session.get(stats_base_url + '/stat')
    soup = bs(request.text)
    course_links = [course_link['href']
                    for course_link in soup.select('.leaf.standardNavigationLink > a')]

    exam_links = []
    for course_link in course_links:
        request = session.get(stats_base_url + course_link + 'tenres')
        soup = bs(request.text)
        exam_links = [exam_link['href'] for exam_link in soup.select(
            '.leaf.standardNavigationLink > a')]

    all_exam_statistics = {}
    for exam_link in exam_links:
        course_code = re.search('/stat/(.*)/tenres/', exam_link).group(1)
        request = session.get(stats_base_url + exam_link)
        exam_date = re.search(course_code + ': (.*)</h1>',
                              request.text).group(1)
        exam_stats = re.search(
            'tentastat = \n(.*)', request.text).group(1)
            
        all_exam_statistics[course_code][exam_date] = exam_stats
    print(all_exam_statistics)
