import React, { useState, useEffect } from "react";
import Router from "next/router";
import { getGrades } from "../../api/api";
import Layout from "../../components/Layout";
import "./styles.scss";
import { getAuthCookies, setAuthState } from "../../utils/login";

const Grades = ({ ctx }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState("false");

  useEffect(() => {
    const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
    (async () => {
      !(cookieEmail && cookiePassword) &&
        Router.push({
          pathname: "/login",
          query: { from: "/grades" }
        });
    })();
    (async () => {
      getGrades(cookieEmail, cookiePassword).then(({ data }) => {
        setGrades(data);
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
              <ul>
                <div className="content">
                  {grades.length === 0 && (
                    <div className="progressContainer">
                      <p>Hämtar kurser från KTH</p>
                      <progress
                        className="progress is-medium is-dark"
                        max="100"
                      ></progress>
                    </div>
                  )}
                  {grades.map((gradeItem, index) => (
                    <li key={index}>
                      <div className="box gradeContainer">
                        <p>
                          {gradeItem.name}, {gradeItem.credits},{" "}
                          {gradeItem.grade}
                        </p>
                      </div>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Grades;
