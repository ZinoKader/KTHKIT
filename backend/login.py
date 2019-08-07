#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import requests
import re
import html


def login_student(username, password):
    session = requests.session()

    request = session.get(url='https://www.student.ladok.se/')
    request = session.get(url='https://www.student.ladok.se/student/shiblogin')

    shibstate = None

    for cookie in session.cookies.get_dict():
        cookie = re.search('_shibstate_([a-zA-Z0-9_]+)', cookie)

        if cookie is not None:
            shibstate = cookie.group(1)
            break

    request = session.get(url='https://www.student.ladok.se/Shibboleth.sso/Login?SAMLDS=1&target=cookie%3A' +
                          shibstate + '&entityID=https://saml.sys.kth.se/idp/shibboleth')

    post_data = {
        'shib_idp_ls_exception.shib_idp_session_ss': '',
        'shib_idp_ls_success.shib_idp_session_ss': 'true',
        'shib_idp_ls_value.shib_idp_session_ss': '',
        'shib_idp_ls_exception.shib_idp_persistent_ss': '',
        'shib_idp_ls_success.shib_idp_persistent_ss': 'true',
        'shib_idp_ls_value.shib_idp_persistent_ss': '',
        'shib_idp_ls_supported': 'true',
        '_eventId_proceed': ''
    }

    request = session.post(
        url='https://saml-5.sys.kth.se/idp/profile/SAML2/Redirect/SSO?execution=e1s1', data=post_data)

    action = re.search(
        '<form id="fm1" action="(.*?)" method="post">', request.text).group(1)
    lt = re.search(
        '<input type="hidden" name="lt" value="(.*?)" />', request.text).group(1)
    execution = re.search(
        '<input type="hidden" name="execution" value="(.*?)" />', request.text).group(1)

    post_data = {
        'username': username,
        'password': password,
        'lt': lt,
        'execution': execution,
        '_eventId': 'submit',
        'submit': 'Logga in'
    }

    request = session.post(
        url='https://login.kth.se' + action, data=post_data)

    action = re.search('<form action="(.*?)" method="post">', request.text)
    if action is None:
        raise Exception('Invalid username or password')
    action = html.unescape(action.group(1))

    relay_state = re.search(
        '<input type="hidden" name="RelayState" value="([^"]+)"\/>', request.text)
    relay_state = html.unescape(relay_state.group(1))

    saml_response = re.search(
        '<input type="hidden" name="SAMLResponse" value="(.*?)"/>', request.text)
    saml_response = html.unescape(saml_response.group(1))

    post_data = {
        'RelayState': relay_state,
        'SAMLResponse': saml_response
    }

    request = session.post(url=action, data=post_data)
    # session now logged in to KTH and Ladok

    request = session.get(url='https://www.student.ladok.se/student/ladok/L3')

    m = re.search('studentUID: "([a-z0-9\- ]+)",', request.text)

    student_uid = m.group(1)

    return session, student_uid
