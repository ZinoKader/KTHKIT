import React, { useState, useEffect, useLayoutEffect } from "react";
import Router from "next/router";
import * as api from "../../api/api";
import styles from "./index.module.scss";
import classnames from "classnames";
import Layout from "../../components/Layout";
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

  const [addCourseModalVisible, setAddCourseModalVisibile] = useState(false);
  const [addCourseName, setAddCourseName] = useState("");
  const [addCourseNameValid, setAddCourseNameValid] = useState(true);
  const [addCourseCredits, setAddCourseCredits] = useState("");
  const [addCourseCreditsValid, setAddCourseCreditsValid] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { cookieUsername, cookiePassword } = getAuthCookies(ctx);
      if (cookieUsername && cookiePassword) {
        const { data } = await api.getCourseGrades(
          cookieUsername,
          cookiePassword
        );
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
      .map(courseItem => gradeWeights[courseItem.courseGrade].value)
      .filter(courseGrade => courseGrade !== 0)
      .reduce((total, courseGrade, i, arr) => {
        if (i === arr.length - 1) {
          return parseFloat(
            ((total + courseGrade) / arr.length).toFixed(GRADE_ROUND_PRECISION)
          );
        }
        return total + courseGrade;
      }, 0);
  };

  const weightedGradeAverage = () => {
    const filteredCourses = finishedCourses
      .map(courseItem => {
        return {
          courseGrade: gradeWeights[courseItem.courseGrade].value,
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
    return creditSum === 0
      ? 0
      : parseFloat((gradeProduct / creditSum).toFixed(GRADE_ROUND_PRECISION));
  };

  const changeGrade = (courseItem, newGrade) => {
    const newCourses = cloneDeep(finishedCourses);

    const existingCourseItem = newCourses.filter(
      newCourseItem =>
        newCourseItem.courseCode + newCourseItem.courseName ===
        courseItem.courseCode + courseItem.courseName
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

  const addCourse = (courseName, courseCredits, courseGrade) => {
    const newCourses = cloneDeep(finishedCourses);
    courseCredits = commaStringToFloat(courseCredits);
    newCourses.unshift({
      courseCredits,
      courseGrade,
      courseName
    });
    setFinishedCourses(newCourses);
  };

  const commaStringToFloat = s => parseFloat(s.replace(",", "."));

  const courseTitleExists = courseName =>
    finishedCourses
      .concat(unfinishedCourses)
      .map(course => course.courseCode + " " + course.courseName)
      .includes(courseName);

  const validateAddCourseInput = () => {
    const nameValid =
      addCourseName &&
      addCourseName.length > 0 &&
      !courseTitleExists(addCourseName);
    const creditsValid = addCourseCredits && addCourseCredits.length > 0;
    setAddCourseNameValid(nameValid);
    setAddCourseCreditsValid(creditsValid);
    return nameValid && creditsValid;
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

          {finishedCourses.length === 0 && unfinishedCourses.length === 0 ? (
            <div className={styles.progressContainer}>
              <p>Hämtar dina betyg från KTH/Ladok...</p>
              <progress className="progress is-medium is-dark" max="100" />
            </div>
          ) : (
            <div className="card-content">
              <div
                className={classnames(styles.gradesExplanationContainer, "box")}
              >
                <header
                  className={classnames(styles["card-header"], "card-header")}
                >
                  <p
                    className={classnames(
                      styles["card-header-title"],
                      "card-header-title"
                    )}
                  >
                    Betygssnitt
                  </p>
                </header>
                <div className="card-content">
                  <div className={classnames(styles.grades, styles.content)}>
                    Oviktat:&nbsp;
                    {unWeightedGradeAverage()}
                    &nbsp;/ 5
                    <br />
                    Viktat:&nbsp;
                    {weightedGradeAverage()}
                    &nbsp;/ 5
                  </div>
                  <footer
                    className={classnames(styles["card-footer"], "card-footer")}
                  >
                    <a
                      className={classnames(
                        "tooltip",
                        "is-tooltip-multiline",
                        "is-tooltip-top",
                        "card-footer-item",
                        styles["card-footer-item"],
                        styles.gradesTooltip
                      )}
                      data-tooltip="Betygssnittet beräknas endast för kurser där betyg A - E
                        ges. Kurser med betyg P räknas ej med, likaså
                        tillgodoräknade kurser från andra universitet eller
                        utbytesstudier."
                    >
                      Vad räknas?
                    </a>
                    <a
                      className={classnames(
                        "tooltip",
                        "is-tooltip-multiline",
                        "is-tooltip-top",
                        "card-footer-item",
                        styles["card-footer-item"],
                        styles.gradesTooltip
                      )}
                      data-tooltip="Oviktat betygssnitt är summan av alla betygsvärden 
                        delat med antalet betygsvärden. Viktat betygssnitt tar hänsyn till kursens
                         omfattning (hp) så att större kurser har större inverkan på snittet."
                    >
                      Viktat/oviktat?
                    </a>
                  </footer>

                  <div className={classnames(styles.content, "content")}>
                    <div className="is-divider"></div>
                    {!addCourseModalVisible && (
                      <a
                        onClick={() =>
                          setAddCourseModalVisibile(!addCourseModalVisible)
                        }
                        className="button is-dark"
                      >
                        Lägg till kurs
                      </a>
                    )}
                  </div>

                  {addCourseModalVisible && (
                    <>
                      <div className="content">
                        <div className="field">
                          <label className="label">Kursnamn</label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              name="courseName"
                              onChange={e => {
                                setAddCourseName(e.target.value);
                              }}
                              value={addCourseName}
                              autoComplete="off"
                              type="text"
                              placeholder="DD1337 Programmering"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-signature" />
                            </span>
                          </div>
                          <p
                            className={classnames("help", "is-danger", {
                              "is-hidden": addCourseNameValid
                            })}
                          >
                            Du måste ange ett (unikt) kursnamn
                          </p>
                        </div>
                        <div className="field">
                          <label className="label">Omfattning</label>
                          <div className="control has-icons-left has-icons-right">
                            <input
                              className="input"
                              name="courseCredits"
                              onChange={e =>
                                setAddCourseCredits(e.target.value)
                              }
                              value={addCourseCredits}
                              autoComplete="off"
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="7.0"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-expand" />
                            </span>
                            <span className="icon is-small is-right">hp</span>
                          </div>
                          <p
                            className={classnames("help", "is-danger", {
                              "is-hidden": addCourseCreditsValid
                            })}
                          >
                            Kursomfattning får endast innehålla siffror och
                            kommatecken
                          </p>
                        </div>
                      </div>

                      <div
                        className={classnames(
                          styles.addActionContainer,
                          "content"
                        )}
                      >
                        <div
                          className={styles.action}
                          onClick={() =>
                            setAddCourseModalVisibile(!addCourseModalVisible)
                          }
                        >
                          <span className="icon">
                            <i className="fas fa-times"></i>
                          </span>
                          <span>Avbryt</span>
                        </div>

                        <div
                          className={styles.action}
                          onClick={() => {
                            if (validateAddCourseInput()) {
                              addCourse(
                                addCourseName,
                                addCourseCredits,
                                "NONE"
                              );
                              setAddCourseName("");
                              setAddCourseCredits("");
                              setAddCourseModalVisibile(false);
                            }
                          }}
                        >
                          <span className="icon">
                            <i className="fas fa-check"></i>
                          </span>
                          <span>Lägg till</span>
                        </div>
                      </div>
                    </>
                  )}

                  {gradesChanged() && (
                    <div className={classnames(styles.content, "content")}>
                      <div className="is-divider"></div>
                      <div onClick={() => resetOriginalCourses()}>
                        <span className="icon">
                          <i className="fas fa-undo-alt"></i>
                        </span>
                        <span>Återställ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {finishedCourses.length !== 0 && (
                <div className={classnames(styles.content, "content")}>
                  <ul>
                    {finishedCourses.map((courseItem, i) => (
                      <Course
                        key={courseItem.courseName + i}
                        courseItem={courseItem}
                        courseType={COURSE_TYPE.GRADE}
                        methods={{ changeGrade }}
                        isGraded
                      />
                    ))}
                  </ul>
                </div>
              )}

              {unfinishedCourses.length !== 0 && (
                <div className={classnames(styles.content, "content")}>
                  <ul>
                    <div
                      className="is-divider"
                      data-content="Ej avslutade kurser"
                    ></div>
                    {unfinishedCourses.map((courseItem, i) => (
                      <Course
                        key={courseItem.courseName + i}
                        courseItem={courseItem}
                        courseType={COURSE_TYPE.GRADE}
                        methods={{ changeGrade }}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

Grades.getInitialProps = async ctx => {
  redirectIfLoggedOut(ctx, Router);
};

export default Grades;
