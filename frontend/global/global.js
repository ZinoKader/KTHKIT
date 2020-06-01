export const email_pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const kth_profile_edit_url = username => {
  return "https://www.kth.se/profile/" + username + "/edit/";
};
export const profile_picture_placeholder_path =
  "../../static/profile_placeholder.png";

export const GRADE_ROUND_PRECISION = 3;
export const gradeWeights = {
  A: { name: "A", value: 5 },
  B: { name: "B", value: 4.5 },
  C: { name: "C", value: 4 },
  D: { name: "D", value: 3.5 },
  E: { name: "E", value: 3 },
  P: { name: "Pass", value: 0 },
  NONE: { name: "Räkna ej", value: 0 }
};
