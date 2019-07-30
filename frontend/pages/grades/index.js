import React, { useState, useEffect } from "react";
import Router from "next/router";
import { getGrades } from "../../api/api";
import Layout from "../../components/Layout";
import "./styles.scss";
import { getAuthCookies, redirectIfLoggedOut } from "../../utils/login";

const GRADE_ROUND_PRECISION = 3;

const Grades = ({ ctx }) => {
  const gradeWeights = { A: 5, B: 4.5, C: 4, D: 3.5, E: 3, P: 0 };

  const [grades, setGrades] = useState([]);
  const [unfinishedCourses, setUnfinishedCourses] = useState([]);

  useEffect(() => {
    redirectIfLoggedOut(ctx, Router);
    const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
    (async () => {
      cookieEmail &&
        cookiePassword &&
        getGrades(cookieEmail, cookiePassword).then(({ data }) => {
          setGrades(data[0].finishedCourses);
          setUnfinishedCourses(data[1].unfinishedCourses);
        });
    })();
  }, []);

  const calculateUnweightedGrade = grades => {
    return grades
      .map(gradeItem => gradeWeights[gradeItem.courseGrade])
      .filter(courseGrade => courseGrade !== 0)
      .reduce((total, courseGrade, i, arr) => {
        if (i === arr.length - 1) {
          return ((total + courseGrade) / arr.length).toFixed(
            GRADE_ROUND_PRECISION
          );
        }
        return total + courseGrade;
      });
  };

  const calculateWeightedGrade = grades => {
    const filteredGrades = grades
      .map(gradeItem => {
        return {
          courseGrade: gradeWeights[gradeItem.courseGrade],
          courseCredits: gradeItem.courseCredits
        };
      })
      .filter(({ courseGrade }) => courseGrade !== 0);

    let gradeProduct = 0;
    let creditSum = 0;
    for (const gradeItem of filteredGrades) {
      gradeProduct += gradeItem.courseGrade * gradeItem.courseCredits;
      creditSum += gradeItem.courseCredits;
    }
    return (gradeProduct / creditSum).toFixed(GRADE_ROUND_PRECISION);
  };

  return (
    <Layout ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Dina kurser</h1>
          <div className="card-content">
            {grades.length === 0 && unfinishedCourses.length === 0 && (
              <div className="progressContainer">
                <p>Hämtar kurser från KTH</p>
                <progress className="progress is-medium is-dark" max="100" />
              </div>
            )}

            {grades.length !== 0 && (
              <>
                <div className="gradesExplanationContainer box">
                  <header className="card-header">
                    <p className="card-header-title">Betygssnitt</p>
                  </header>
                  <div className="card-content">
                    <div className="grades content">
                      Oviktat:&nbsp;
                      {calculateUnweightedGrade(grades)}
                      &nbsp;/ 5
                      <br />
                      Viktat:&nbsp;
                      {calculateWeightedGrade(grades)}
                      &nbsp;/ 5
                    </div>
                    <footer className="card-footer">
                      <a
                        className="tooltip is-tooltip-multiline is-tooltip-top card-footer-item gradesTooltip"
                        data-tooltip="Betygssnittet beräknas endast för kurser där betyg A - E
                        ges. Kurser med betyg P räknas ej med, likaså
                        tillgodoräknade kurser från andra universitet eller
                        utbytesstudier."
                      >
                        Vad räknas?
                      </a>
                      <a
                        className="tooltip is-tooltip-multiline is-tooltip-top card-footer-item gradesTooltip"
                        data-html="true"
                        data-tooltip="Oviktat betygssnitt är summan av alla betygsvärden 
                        delat med antalet betygsvärden. Viktat betygssnitt tar hänsyn till kursens
                         omfattning (hp) så att större kurser har större inverkan på snittet."
                      >
                        Viktat/oviktat?
                      </a>
                    </footer>
                  </div>
                </div>

                <ul>
                  <div className="content">
                    {grades.map((gradeItem, index) => (
                      <li key={index}>
                        <div className="box gradeContainer">
                          <p>
                            <strong>
                              {gradeItem.courseCode} {gradeItem.courseName}
                            </strong>
                          </p>
                          <p>Omfattning: {gradeItem.courseCredits} hp</p>
                          <p>Betyg: {gradeItem.courseGrade}</p>
                        </div>
                      </li>
                    ))}
                  </div>
                </ul>
              </>
            )}

            {unfinishedCourses.length !== 0 && (
              <>
                <div
                  className="is-divider"
                  data-content="Ej avslutade kurser"
                ></div>
                <ul>
                  <div className="content">
                    {unfinishedCourses.map((courseItem, index) => (
                      <li key={index}>
                        <div className="box gradeContainer">
                          <p>
                            <strong>
                              {courseItem.courseCode} {courseItem.courseName}
                            </strong>
                          </p>
                          <p>Omfattning: {courseItem.courseCredits} hp</p>
                        </div>
                      </li>
                    ))}
                  </div>
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Grades;
