/* All API calls are made here */
import axios from "axios";
import { kth_mail_domain } from "../global/global";

const profileEndpoint = "https://api.kthkit.se/profile";
const gradesEndpoint = "https://api.kthkit.se/grades";
const examDatesForCourseEndpoint =
  "https://api.kthkit.se/statistics/course-exams";
const statisticsForCourseEndpoint = "https://api.kthkit.se/statistics";
const statisticsCoursesEndpoint =
  "https://api.kthkit.se/statistics/all-courses";

export const getProfile = email => {
  const username = email.replace(kth_mail_domain, "");
  return axios.get(profileEndpoint, {
    params: {
      username
    }
  });
};

export const getCourseGrades = (email, password) => {
  const username = email.replace(kth_mail_domain, "");
  return axios.get(gradesEndpoint, {
    params: {
      username,
      password
    }
  });
};

export const getExamDatesForCourse = courseCode => {
  return axios.get(examDatesForCourseEndpoint, {
    params: { courseCode }
  });
};

export const getStatisticsForCourse = courseCode => {
  return axios.get(statisticsForCourseEndpoint, {
    params: { courseCode }
  });
};

export const getStatisticsCourses = () => {
  return axios.get(statisticsCoursesEndpoint);
};
