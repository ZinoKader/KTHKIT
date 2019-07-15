#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, request, Response
from bs4 import BeautifulSoup as soup
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
import time
import json

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def get_student_grades(path):
    username = request.args.get("username")
    password = request.args.get("password")
    ladok_scraper = LadokScraper()
    ladok_scraper.login(username, password)
    grades = ladok_scraper.get_grades()
    ladok_scraper.kill()
    return json.dumps(grades, ensure_ascii=False, indent=3).encode("utf8")


default_sleep_time = 0.25
chrome_sv_lang = "--lang=sv"

ladok_login_url = "https://www.student.ladok.se/student/loggain"
ladok_grades_url = "https://www.student.ladok.se/student/#/avslutade"
ladok_login_button_text = "Välj lärosäte / Choose university"
ladok_change_lang_swedish_text = "På svenska"
ladok_form_search_id = "searchlist"
ladok_confirm_school_button_id = "proceed"
ladok_card_id = "card-body"
ladok_school_form_xpath = "/html/body/div[1]/div[2]/div[1]/form"
ladok_change_lang_xpath = "//*[@id=\"navigation-first-meny\"]/div[1]/ul/li[2]/a"
ladok_credits_allowed_characters = ",0123456789"

kth_alt = "KTH Royal Institute of Technology"
kth_login_form_username_id = "username"
kth_login_form_password_id = "password"
kth_login_button_id = "btn-submit"

school_not_found_err_msg = "Did not find your school in Ladok"


class LadokScraper:

    def __init__(self):
        self.opts = Options()
        self.opts.set_headless()
        self.opts.add_argument(chrome_sv_lang)
        self.browser = Chrome(options=self.opts)
        self.browser.implicitly_wait(1)

    def kill(self):
        self.browser.quit()

    def login(self, username, password):
        self.browser.get(ladok_login_url)
        self.browser.find_element_by_link_text(ladok_login_button_text).click()

        # find desired school in form and proceed to its ladok page
        school_form = self.browser.find_element_by_xpath(
            ladok_school_form_xpath)
        school_container = school_form.find_element_by_id(ladok_form_search_id)
        school_elements = school_container.find_elements_by_xpath("*")
        desired_school_name = kth_alt  # temporarily testing with only KTH
        desired_school = None
        for school in school_elements:
            if school.get_attribute("alt") == desired_school_name:
                desired_school = school
        if not desired_school:
            return school_not_found_err_msg
        desired_school.click()
        self.browser.find_element_by_id(ladok_confirm_school_button_id).click()

        time.sleep(default_sleep_time)

        # log in to KTH
        self.browser.find_element_by_name(
            kth_login_form_username_id).send_keys(username)
        self.browser.find_element_by_name(
            kth_login_form_password_id).send_keys(password)
        self.browser.find_element_by_class_name(kth_login_button_id).click()

        # change language to Swedish if currently English
        change_lang_link = self.browser.find_element_by_xpath(
            ladok_change_lang_xpath)
        if change_lang_link.text == ladok_change_lang_swedish_text:
            change_lang_link.click()

        time.sleep(default_sleep_time)

    def get_grades(self):
        self.browser.get(ladok_grades_url)
        time.sleep(default_sleep_time)
        all_elements = self.browser.find_element_by_xpath("//*")
        grades_page_html = soup(all_elements.get_attribute("outerHTML"))

        # filter grades out of cards
        cards = grades_page_html.find_all("div", class_=ladok_card_id)
        grade_cards = []
        for card in cards:
            course_name_exists = False
            course_grade_exists = False
            for child in card.findChildren():
                if child.name == "h4":
                    course_name_exists = True
                elif child.name == "p":
                    course_grade_exists = True
            # if both h4 and p is in our card, it's a grade card
            if course_name_exists and course_grade_exists:
                grade_cards.append(card)

        grades = []
        for grade_card in grade_cards:
            course_name = grade_card.find("a", href=True).text
            course_grade = grade_card.find("strong")
            if course_grade:
                course_grade = course_grade.text.replace("Betyg: ", "")
            else:
                course_grade = "N/A"
            credits_start = "| "
            credits_end = " |"
            course_credits = course_name[course_name.find(
                credits_start) + len(credits_start):course_name.rfind(credits_end)]
            course_credits = "".join(
                i for i in course_credits if i in ladok_credits_allowed_characters)
            course_credits = float(course_credits.replace(",", "."))
            grades.append({"name": course_name,
                           "credits": course_credits, "grade": course_grade})
        return grades
