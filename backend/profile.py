#!/usr/bin/python3

import requests

profile_endpoint = 'https://api.kth.se/api/profile/1.1/'


def get_profile_information(username):
    r = requests.get(profile_endpoint + username)
    return r.json()
