#!/usr/bin/python3
# -*- coding: UTF-8 -*-

import requests

profile_endpoint = 'https://api.kth.se/api/profile/1.1/'
image_key = "image"


def get_profile_information(username):
    request = requests.get(profile_endpoint + username)
    profile_information = request.json()

    # follow image location and return the real image url
    image_url_location = profile_information[image_key]
    request = requests.get(image_url_location)
    image_url = request.url
    profile_information[image_key] = image_url

    return profile_information
