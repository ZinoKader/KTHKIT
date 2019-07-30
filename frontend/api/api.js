/* All API calls are made here */
import axios from "axios";
import { kth_mail_domain } from "../global/global";

const profileApi = "https://api.kthkit.se/profile";
const gradesApi = "https://api.kthkit.se/grades";

export const getProfile = email => {
  const username = email.replace(kth_mail_domain, "");
  return axios.get(profileApi, {
    params: {
      username
    }
  });
};

export const getGrades = (email, password) => {
  const username = email.replace(kth_mail_domain, "");
  return axios.get(gradesApi, {
    params: {
      username,
      password
    }
  });
};
