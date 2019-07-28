import React, { useState } from "react";
import Router from "next/router";
import { getCookies, setCookies } from "cookies-next";
import classnames from "classnames";
import { getProfile, getGrades } from "../../api/api";
import Layout from "../../components/Layout";
import { kth_mail_domain } from "../../global/global";
import styles from "./styles.scss";
import {
  setProfileCookies,
  setAuthCookies,
  deleteAuthAndProfileCookies,
  isLoggedIn
} from "../../utils/login";

const Login = ({ ctx, from }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mailValid, setEmailValidity] = useState("true");
  const [passwordValid, setPasswordValidity] = useState("true");
  const [loading, setLoading] = useState("false");

  const validateLogin = () => {
    const [emailValidity, passwordValidity] = [
      email.slice(-kth_mail_domain.length).toLowerCase() === kth_mail_domain,
      password.length > 0
    ];
    setEmailValidity(emailValidity);
    setPasswordValidity(passwordValidity);
    return emailValidity && passwordValidity;
  };

  const submitLogin = () => {
    setLoading(true);
    getProfile(email)
      .then(({ data }) => {
        setProfileCookies(ctx, data.givenName, data.familyName, data.image);
      })
      .finally(() => {
        setLoading(false);
        setAuthCookies(ctx, email, password);
        from ? Router.push(from) : Router.push("/");
      });
  };

  const submitLogout = () => {
    deleteAuthAndProfileCookies(ctx);
    Router.push("/");
  };

  return (
    <Layout ctx={ctx}>
      <section className="section">
        <div className="container">
          {isLoggedIn(ctx) ? (
            <h1 className="title">Du är redan inloggad</h1>
          ) : (
            <>
              <h1 className="title">Logga in</h1>
              <p className="subtitle">
                Logga in med ditt <strong>KTH-konto</strong>
              </p>
            </>
          )}
          <div className="card">
            {isLoggedIn(ctx) ? (
              <button
                className={classnames(
                  "button",
                  "is-medium",
                  "is-dark",
                  "is-fullwidth",
                  {
                    "is-loading": loading === true
                  }
                )}
                onClick={() => submitLogout()}
              >
                Logga ut
              </button>
            ) : (
              <div className="card-content">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    validateLogin() && submitLogin();
                  }}
                >
                  <div className="field">
                    <div className="control has-icons-left has-icons-right">
                      <input
                        className={classnames("input", {
                          "is-danger": !mailValid
                        })}
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="jag@kth.se"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-envelope" />
                      </span>
                    </div>
                    <p
                      className={classnames("help", "is-danger", {
                        "is-hidden": mailValid
                      })}
                    >
                      Skriv din KTH-mail med @kth.se
                    </p>
                  </div>
                  <div className="field">
                    <div className="control has-icons-left has-icons-right">
                      <input
                        className="input"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="lösenord"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                    <p
                      className={classnames("help", "is-danger", {
                        "is-hidden": passwordValid
                      })}
                    >
                      Ange ett giltigt lösenord
                    </p>
                  </div>
                  <div className="field loginButtonField">
                    <div className="control">
                      <button
                        className={classnames(
                          "button",
                          "is-dark",
                          "is-fullwidth",
                          {
                            "is-loading": loading === true
                          }
                        )}
                      >
                        Logga in
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

Login.getInitialProps = ({ ctx, query }) => {
  if (query != null && query.from != null) {
    const { from } = query;
    return { ctx, from };
  }
  return { ctx };
};

export default Login;
