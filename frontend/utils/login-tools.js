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

export const setAuthState = async (ctx, setEmail, setPassword) => {
  setEmail(getCookies(ctx, "email"));
  setPassword(getCookies(ctx, "password"));
};

export const setProfileCookies = (ctx, name, surName, imageUrl) => {
  setCookies(ctx, "fullname", name + " " + surName);
  setCookies(ctx, "profileimageurl", imageUrl);
};

export const setProfileState = async (ctx, setFullName, setProfileImageUrl) => {
  getCookies(ctx, "fullname") != null &&
    setFullName(getCookies(ctx, "fullname"));
  getCookies(ctx, "profileimageurl") != null &&
    setProfileImageUrl(getCookies(ctx, "profileimageurl"));
};

export const isLoggedIn = ctx => {
  const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
  return cookieEmail != null && cookiePassword != null;
};

export const redirectIfLoggedOut = (ctx, router) => {
  const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
  if (ctx.res) {
    ctx.res.writeHead(302, {
      Location: "/login"
    });
    ctx.res.end();
  } else {
    !(cookieEmail && cookiePassword) &&
      router.push({
        pathname: "/login",
        query: { from: ctx.pathname }
      });
  }
  return !(cookieEmail && cookiePassword);
};

export const deleteAuthAndProfileCookies = ctx => {
  removeCookies(ctx, "email");
  removeCookies(ctx, "password");
  removeCookies(ctx, "fullname");
  removeCookies(ctx, "profileimageurl");
};
