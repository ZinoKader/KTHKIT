/* All API calls are made here */
import axios from "axios";

const api = "https://api.kthkit.se";

const credentialsEndpoint = api + "/credentials";
const profileEndpoint = api + "/profile";
const gradesEndpoint = api + "/grades";
const examDatesForCourseEndpoint = api + "/statistics/course-exams";
const statisticsForCourseEndpoint = api + "/statistics/course";
const statisticsCoursesEndpoint = api + "/statistics/all-courses";

export const validateCredentials = async (username, password) => {
  return await axios
    .get(credentialsEndpoint, {
      auth: {
        username,
        password
      }
    })
    .then(result => {
      return result && result.status === 200;
    })
    .catch(() => {
      return false;
    });
};

export const getProfile = username => {
  return axios.get(profileEndpoint, {
    params: {
      username
    }
  });
};

export const getCourseGrades = (username, password) => {
  return axios.get(gradesEndpoint, {
    auth: {
      username,
      password
    }
  });
};

export const getExamDatesForCourse = async courseCode => {
  return await axios.get(examDatesForCourseEndpoint, {
    params: { courseCode }
  });
};

export const getStatisticsForCourse = async (courseCode, examDate) => {
  return await axios.get(statisticsForCourseEndpoint, {
    params: { courseCode, examDate }
  });
};

export const getStatisticsCourses = () => {
  return axios.get(statisticsCoursesEndpoint);
};
