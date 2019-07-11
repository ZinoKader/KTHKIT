/* All API calls are made here */
import axios from "axios";
import { kth_mail_domain } from "../global/global";

const corsUrl = "https://cors-anywhere.herokuapp.com/";
const profileApi = "https://api.kth.se/api/profile/1.1/";
const gradesApi = "http://127.0.0.1:5000/grades/";

export const getProfile = email => {
  const profileName = email.replace(kth_mail_domain, "");
  return axios.get(corsUrl + profileApi + profileName);
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
