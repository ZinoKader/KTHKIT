#!/usr/bin/python3

finished_grades_endpoint = 'https://www.student.ladok.se/student/proxy/resultat/studentresultat/attesterade/student/'
unfinished_grades_endpoint = 'https://www.student.ladok.se/student/proxy/studiedeltagande/tillfallesdeltagande/oavslutade/student/'
sv_lang_key = 'sv'
only_courses = '?endastKurs=true'

# finished course keys
course_key = 'StudentresultatPerKurs'
result_key = 'Studentresultat'
# inner keys
course_name_key = 'Benamning'
course_code_key = 'Utbildningskod'
course_credits_key = 'Omfattningsvarde'
course_grade_key = 'Betygsgradskod'

# unfinished course keys
unfin_course_key = 'Tillfallesdeltaganden'
unfin_result_key = 'Utbildningsinformation'

headers = {
    'Accept': 'application/vnd.ladok-resultat+json, application/vnd.ladok-kataloginformation+json,\
    application/vnd.ladok-studentinformation+json, application/vnd.ladok-studiedeltagande+json,\
    application/vnd.ladok-utbildningsinformation+json, application/vnd.ladok-examen+json,\
    application/vnd.ladok-extintegration+json, application/vnd.ladok-uppfoljning+json,\
            application/vnd.ladok-extra+json, application/json, text/plain'
}


def get_finished_courses(session, uid):
    request = session.get(
        url=(finished_grades_endpoint + uid + only_courses), headers=headers)
    grades_data = request.json()

    grades = []
    for course in grades_data[course_key]:
        course_info = course[result_key][0]
        course_name = course_info[course_name_key][sv_lang_key]
        course_code = course_info[course_code_key]
        course_credits = course_info[course_credits_key]
        course_grade = course_info[course_grade_key]
        grades.append({'courseName': course_name, 'courseCode': course_code,
                       'courseCredits': course_credits, 'courseGrade': course_grade})

    finished_courses = {'finishedCourses': grades}

    return finished_courses


def get_unfinished_courses(session, uid):
    request = session.get(
        url=(unfinished_grades_endpoint + uid), headers=headers)
    grades_data = request.json()

    grades = []
    for course in grades_data[unfin_course_key]:
        course_info = course[unfin_result_key]
        course_name = course_info[course_name_key][sv_lang_key]
        course_code = course_info[course_code_key]
        course_credits = course_info[course_credits_key]
        grades.append({'courseName': course_name, 'courseCode': course_code,
                       'courseCredits': course_credits})

    unfinished_courses = {'unfinishedCourses': grades}
    return unfinished_courses
