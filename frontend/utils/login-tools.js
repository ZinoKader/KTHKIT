import { setCookies, getCookies, removeCookies } from "cookies-next";

export const getAuthCookies = ctx => {
  const cookieUsername = getCookies(ctx, "username");
  const cookiePassword = getCookies(ctx, "password");
  return { cookieUsername, cookiePassword };
};

export const setAuthCookies = (ctx, username, password) => {
  setCookies(ctx, "username", username);
  setCookies(ctx, "password", password);
};

export const setAuthState = async (ctx, setUsername, setPassword) => {
  setUsername(getCookies(ctx, "username"));
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
  const { cookieUsername, cookiePassword } = getAuthCookies(ctx);
  return cookieUsername != null && cookiePassword != null;
};

export const redirectIfLoggedOut = (ctx, router) => {
  const { cookieUsername, cookiePassword } = getAuthCookies(ctx);
  if (!(cookieUsername && cookiePassword)) {
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: "/login"
      });
      ctx.res.end();
    } else {
      router.push({
        pathname: "/login",
        query: { from: ctx.pathname }
      });
    }
  }
  return !(cookieUsername && cookiePassword);
};

export const deleteAuthAndProfileCookies = ctx => {
  removeCookies(ctx, "username");
  removeCookies(ctx, "password");
  removeCookies(ctx, "fullname");
  removeCookies(ctx, "profileimageurl");
};
