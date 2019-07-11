import { setCookies, getCookies, removeCookies } from "cookies-next";

export const getAuthCookies = ctx => {
  const cookieEmail = getCookies(ctx, "email");
  const cookiePassword = getCookies(ctx, "password");
  return { cookieEmail, cookiePassword };
};

export const setAuthCookies = (ctx, email, password) => {
  setCookies(ctx, "email", email);
  setCookies(ctx, "password", password);
};

export const setAuthState = (ctx, setEmail, setPassword) => {
  setEmail(getCookies(ctx, "email"));
  setPassword(getCookies(ctx, "password"));
};

export const setProfileCookies = (ctx, name, surName, imageUrl) => {
  setCookies(ctx, "fullname", name + " " + surName);
  setCookies(ctx, "profileimageurl", imageUrl);
};

export const setProfileState = (ctx, setFullName, setProfileImageUrl) => {
  setFullName(getCookies(ctx, "fullname"));
  setProfileImageUrl(getCookies(ctx, "profileimageurl"));
};

export const deleteAuthAndProfileCookies = ctx => {
  removeCookies(ctx, "email");
  removeCookies(ctx, "password");
  removeCookies(ctx, "fullname");
  removeCookies(ctx, "profileimageurl");
};
