export const kth_mail_domain = "@kth.se";

export const kth_profile_edit_url = email => {
  const account_name = email.replace(kth_mail_domain, "");
  return "https://www.kth.se/profile/" + account_name + "/edit/";
};
export const profile_picture_placeholder_path =
  "../../static/profile_placeholder.png";
