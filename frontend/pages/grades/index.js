import React, { useState, useEffect } from "react";
import Router from "next/router";
import * as api from "../../api/api";
import Layout from "../../components/Layout";
import "./styles.scss";
import { GRADE_ROUND_PRECISION, gradeWeights } from "../../global/global";
import Course, { COURSE_TYPE } from "../../components/Course";
import { getAuthCookies, redirectIfLoggedOut } from "../../utils/login-tools";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";

const Grades = ({ ctx }) => {
  const [finishedCourses, setFinishedCourses] = useState([]);
  const [unfinishedCourses, setUnfinishedCourses] = useState([]);
  const [originalCourses, setOriginalCourses] = useState([]);
  const [originalUnfinishedCourses, setOriginalUnfinishedCourses] = useState(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const { cookieEmail, cookiePassword } = getAuthCookies(ctx);
      if (cookieEmail && cookiePassword) {
        const { data } = await api.getCourseGrades(cookieEmail, cookiePassword);
        const [finished, unfinished] = [
          data.finishedCourses,
          data.unfinishedCourses
        ];
        setFinishedCourses(finished);
        setUnfinishedCourses(unfinished);
        setOriginalCourses(finished);
        setOriginalUnfinishedCourses(unfinished);
      }
    };
    fetchData();
  }, []);

  const unWeightedGradeAverage = () => {
    return finishedCourses
      .map(courseItem => gradeWeights[courseItem.courseGrade])
      .filter(courseGrade => courseGrade !== 0)
      .reduce((total, courseGrade, i, arr) => {
        if (i === arr.length - 1) {
          return parseFloat(
            ((total + courseGrade) / arr.length).toFixed(GRADE_ROUND_PRECISION)
          );
        }
        return total + courseGrade;
      });
  };

  const weightedGradeAverage = () => {
    const filteredCourses = finishedCourses
      .map(courseItem => {
        return {
          courseGrade: gradeWeights[courseItem.courseGrade],
          courseCredits: courseItem.courseCredits
        };
      })
      .filter(({ courseGrade }) => courseGrade !== 0);

    let gradeProduct = 0;
    let creditSum = 0;
    for (const courseItem of filteredCourses) {
      gradeProduct += courseItem.courseGrade * courseItem.courseCredits;
      creditSum += courseItem.courseCredits;
    }
    return parseFloat(
      (gradeProduct / creditSum).toFixed(GRADE_ROUND_PRECISION)
    );
  };

  const changeGrade = (courseItem, newGrade) => {
    const newCourses = cloneDeep(finishedCourses);

    const existingCourseItem = newCourses.filter(
      newCourseItem => newCourseItem.courseCode === courseItem.courseCode
    )[0];

    if (existingCourseItem !== undefined) {
      existingCourseItem.courseGrade = newGrade;
      setFinishedCourses(newCourses);
    } else {
      // add a new course to finished courses, remove it from unfinished courses
      const newCourse = courseItem;
      newCourse.courseGrade = newGrade;
      newCourses.push(newCourse);

      const newUnfinishedCourses = unfinishedCourses.filter(
        course => course.courseCode !== newCourse.courseCode
      );

      setFinishedCourses(newCourses);
      setUnfinishedCourses(newUnfinishedCourses);
    }
  };

  const gradesChanged = () => {
    const currentCourseGrades = finishedCourses.map(
      courseItem => courseItem.courseGrade
    );
    const originalCourseGrades = originalCourses.map(
      courseItem => courseItem.courseGrade
    );
    return !isEqual(currentCourseGrades, originalCourseGrades);
  };

  const resetOriginalCourses = () => {
    setFinishedCourses(originalCourses);
    setUnfinishedCourses(originalUnfinishedCourses);
  };

  return (
    <Layout title="Räkna betygssnitt" ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Räkna snitt</h1>

          {finishedCourses.length === 0 && unfinishedCourses.length === 0 && (
            <div className="progressContainer">
              <p>Hämtar dina betyg från KTH/Ladok...</p>
              <progress className="progress is-medium is-dark" max="100" />
            </div>
          )}

          <div className="card-content">
            {finishedCourses.length !== 0 && (
              <>
                <div className="gradesExplanationContainer box">
                  <header className="card-header">
                    <p className="card-header-title">Betygssnitt</p>
                  </header>
                  <div className="card-content">
                    <div className="grades content">
                      Oviktat:&nbsp;
                      {unWeightedGradeAverage()}
                      &nbsp;/ 5
                      <br />
                      Viktat:&nbsp;
                      {weightedGradeAverage()}
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
                    {gradesChanged() && (
                      <div className="content">
                        <div className="is-divider"></div>
                        <a
                          onClick={() => resetOriginalCourses()}
                          className="button is-dark"
                        >
                          Återställ
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="content">
                  <ul>
                    {finishedCourses.map(courseItem => (
                      <Course
                        courseItem={courseItem}
                        courseType={COURSE_TYPE.GRADE}
                        changeGrade={changeGrade}
                        isGraded
                      />
                    ))}
                  </ul>
                </div>
              </>
            )}

            {unfinishedCourses.length !== 0 && (
              <div className="content">
                <ul>
                  <div
                    className="is-divider"
                    data-content="Ej avslutade kurser"
                  ></div>
                  {unfinishedCourses.map(courseItem => (
                    <Course
                      courseItem={courseItem}
                      courseType={COURSE_TYPE.GRADE}
                      changeGrade={changeGrade}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

Grades.getInitialProps = async ctx => {
  redirectIfLoggedOut(ctx, Router);
};

export default Grades;
