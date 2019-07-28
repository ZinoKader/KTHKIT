import React, { useState, useEffect } from "react";
import Router from "next/router";
import { getGrades } from "../../api/api";
import Layout from "../../components/Layout";
import "./styles.scss";
import { getAuthCookies, redirectIfLoggedOut } from "../../utils/login";

const Grades = ({ ctx }) => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    redirectIfLoggedOut(ctx, Router);
    const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
    (async () => {
      cookieEmail &&
        cookiePassword &&
        getGrades(cookieEmail, cookiePassword).then(({ data }) => {
          setGrades(data[0].finishedCourses);
        });
    })();
  }, []);

  return (
    <Layout ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Dina kurser</h1>
          <div className="card-content">
            <ul>
              <div className="content">
                {grades.length === 0 && (
                  <div className="progressContainer">
                    <p>Hämtar kurser från KTH</p>
                    <progress className="progress is-medium is-dark" max="100" />
                  </div>
                )}
                {grades.map((gradeItem, index) => (
                  <li key={index}>
                    <div className="box gradeContainer">
                      <p>
                        <strong>
                          Kurs: {gradeItem.courseCode} {gradeItem.courseName}
                        </strong>
                      </p>
                      <p>Omfattning:{gradeItem.courseCredits} hp</p>
                      <p>
                        Betyg:
                        {gradeItem.courseGrade}
                      </p>
                    </div>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Grades;
