export const kth_mail_domain = "@kth.se";

export const kth_profile_edit_url = email => {
  const account_name = email.replace(kth_mail_domain, "");
  return "https://www.kth.se/profile/" + account_name + "/edit/";
};
export const profile_picture_placeholder_path =
  "../../static/profile_placeholder.png";

export const GRADE_ROUND_PRECISION = 3;
export const gradeWeights = { A: 5, B: 4.5, C: 4, D: 3.5, E: 3, P: 0 };
