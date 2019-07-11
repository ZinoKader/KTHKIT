import React, { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import Link from "next/link";
import classnames from "classnames";
import { getCookies, removeCookies } from "cookies-next";
import styles from "./styles.scss";
import {
  deleteAuthAndProfileCookies,
  setProfileState
} from "../../utils/login";

const Layout = ({ children, ctx, title }) => {
  const [fullName, setFullName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

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
          <div className="navbar-brand">
            <Link prefetch href="/">
              <a className="navbar-item">
                <img src="../../static/logo.png" width="120" height="30" />
              </a>
            </Link>
          </div>
          <div className="profileContainer">
            <figure
              className={classnames("image", "is-64x64", "profileIconFigure", {
                "is-hidden": profileImageUrl === null
              })}
            >
              <img className="is-rounded" src={profileImageUrl} />
            </figure>
            <div className="nameContainer">
              <p className="subtitle is-6">
                {fullName != null ? fullName.split(" ")[0] : ""}
              </p>
              <p className="subtitle is-6">
                {fullName != null ? fullName.split(" ")[1] : ""}
              </p>
            </div>
            <a onClick={() => submitLogout()}>Logga ut</a>
          </div>
        </nav>
      </header>

      {children}

      <footer className="footer">
        <div className="content has-text-centered">
          <span>Zino Kader</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
