export const email_pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const kth_profile_edit_url = username => {
  return "https://www.kth.se/profile/" + username + "/edit/";
};
export const profile_picture_placeholder_path =
  "../../static/profile_placeholder.png";

export const GRADE_ROUND_PRECISION = 3;
export const gradeWeights = { A: 5, B: 4.5, C: 4, D: 3.5, E: 3, P: 0 };
