import React, { useState } from "react";
import Router from "next/router";
import classnames from "classnames";
import { validateCredentials, getProfile } from "../../api/api";
import Layout from "../../components/Layout";
import { email_pattern } from "../../global/global";
import "./styles.scss";
import {
  setProfileCookies,
  setAuthCookies,
  deleteAuthAndProfileCookies,
  isLoggedIn
} from "../../utils/login-tools";

const Login = ({ ctx, from }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const [mailFormatValid, setUsernameFormatValidity] = useState(true);
  const [passwordFormatValid, setPasswordFormatValidity] = useState(true);
  const [loading, setLoading] = useState(false);

  const submitLogin = async () => {
    const [usernameFormatValidity, passwordFormatValidity] = [
      !username.match(email_pattern) && username.length > 0,
      password.length > 0
    ];
    setUsernameFormatValidity(usernameFormatValidity);
    setPasswordFormatValidity(passwordFormatValidity);

    if (usernameFormatValidity && passwordFormatValidity) {
      setLoading(true);
      const credentialsValid = await validateCredentials(username, password);
      if (credentialsValid) {
        getProfile(username)
          .then(({ data }) => {
            setProfileCookies(ctx, data.givenName, data.familyName, data.image);
            setAuthCookies(ctx, username, password);
            Router.push(from ? from : "/");
          })
          .catch(() =>
            setGeneralErrorMessage("Ett oväntat fel inträffade, försök igen!")
          )
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setGeneralErrorMessage("Fel inloggningsuppgifter, försök igen!");
      }
    }
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
                    "is-loading": loading
                  }
                )}
                onClick={() => submitLogout()}
              >
                Logga ut
              </button>
            ) : (
              <div className="card-content">
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    setGeneralErrorMessage("");
                    await submitLogin();
                  }}
                >
                  <p
                    className={classnames("help", "is-danger", {
                      "is-hidden": generalErrorMessage.length === 0
                    })}
                    style={{ textAlign: "center" }}
                  >
                    {generalErrorMessage}
                  </p>
                  <div className="field">
                    <div className="control has-icons-left has-icons-right">
                      <input
                        className={classnames("input", {
                          "is-danger": !mailFormatValid
                        })}
                        name="username"
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        autoComplete="off"
                        type="username"
                        placeholder="användarnamn"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-envelope" />
                      </span>
                    </div>
                    <p
                      className={classnames("help", "is-danger", {
                        "is-hidden": mailFormatValid
                      })}
                    >
                      Skriv ditt KTH-användarnamn (utan @kth.se)
                    </p>
                  </div>
                  <div className="field">
                    <div className="control has-icons-left has-icons-right">
                      <input
                        className="input"
                        name="password"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        autoComplete="off"
                        type="password"
                        placeholder="lösenord"
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                    <p
                      className={classnames("help", "is-danger", {
                        "is-hidden": passwordFormatValid
                      })}
                    >
                      Glömde du ange ditt lösenord?
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
                            "is-loading": loading
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
