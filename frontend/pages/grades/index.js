import React, { useState, useEffect } from "react";
import Router from "next/router";
import { getProfile, getGrades } from "../../api/api";
import { getCookies, setCookies } from "cookies-next";
import Layout from "../../components/Layout";
import { kth_mail_domain } from "../../global/global";
import classnames from "classnames";
import "./styles.scss";
import { getAuthCookies, setAuthState } from "../../utils/login";

const Grades = ({ ctx }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("false");

  useEffect(() => {
    const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
    setAuthState(ctx, setEmail, setPassword);
    (async () => {
      !(cookieEmail && cookiePassword) &&
        Router.push({
          pathname: "/login",
          query: { from: "/grades" }
        });
    })();
  }, []);

  return (
    <Layout ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Dina kurser</h1>
          <div className="card">
            <div className="card-content">
              {/*             {() =>
                getGrades(email, password).then(({ data }) => {
                  <p></p>;
                })
              } */}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Grades;
