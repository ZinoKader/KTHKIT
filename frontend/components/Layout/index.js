import React, { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import classnames from "classnames";
import {
  deleteAuthAndProfileCookies,
  setProfileState,
  isLoggedIn
} from "../../utils/login-tools";
import styles from "./styles.scss";

const Layout = ({ children, ctx, title }) => {
  const [fullName, setFullName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [hamburgerMenuActive, setHamburgerMenuActive] = useState("false");

  const submitLogout = () => {
    deleteAuthAndProfileCookies(ctx);
    Router.pathname === "/" ? (window.location.href = "/") : Router.push("/");
  };

  useEffect(() => {
    setProfileState(ctx, setFullName, setProfileImageUrl);
  }, []);

  return (
    <div>
      <Head>
        <title>KTHKIT{title ? " - " + title : ""}</title>
        <script defer src="https://kit.fontawesome.com/befefca298.js"></script>
      </Head>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <a
            role="button"
            className={classnames("navbar-burger", {
              "is-active": !hamburgerMenuActive
            })}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setHamburgerMenuActive(!hamburgerMenuActive)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
          <div
            className={classnames("navbar-menu", {
              "is-active": !hamburgerMenuActive
            })}
          >
            <div className="navbar-start">
              <Link href="/">
                <a className="navbar-item">Hem</a>
              </Link>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Konto</a>
                <div className="navbar-dropdown">
                  <Link href="/profile">
                    <a className="navbar-item">Din profil</a>
                  </Link>
                  <hr className="navbar-divider" />
                  {isLoggedIn(ctx) ? (
                    <a className="navbar-item" onClick={() => submitLogout()}>
                      Logga ut
                    </a>
                  ) : (
                    <a
                      className="navbar-item"
                      onClick={() => Router.push("/login")}
                    >
                      Logga in
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="navbar-brand">
            <Link href="/">
              <a className="navbar-item">
                <img src="../../static/logo.png" width="120" height="30" />
              </a>
            </Link>
          </div>

          <div className="profileContainer">
            <div className="nameContainer">
              <p className="subtitle is-6">
                {fullName != null ? fullName.split(" ")[0] : ""}
              </p>
              <p className="subtitle is-6">
                {fullName != null ? fullName.split(" ")[1] : ""}
              </p>
            </div>
            <Link href="/profile">
              <figure
                className={classnames("image", "is-64x64", {
                  "is-hidden": profileImageUrl === null
                })}
              >
                <img className="is-rounded" src={profileImageUrl} />
              </figure>
            </Link>
          </div>
        </nav>
      </header>

      <div className="root">{children}</div>

      <footer className="footer">
        <div className="content has-text-centered">
          <span>Utveckling: Zino Kader</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
