import React from "react";
import "./styles.scss";

const gradeWeights = { A: 5, B: 4.5, C: 4, D: 3.5, E: 3, P: 0 };

const Courses = ({ courses, changeGrade, withGrades }) => {
  return (
    <ul>
      <div className="content">
        {courses.map(courseItem => (
          <li key={courseItem.courseCode}>
            <div className="box courseContainer">
              <p>
                <strong>
                  {courseItem.courseCode} {courseItem.courseName}
                </strong>
              </p>
              <p>Omfattning: {courseItem.courseCredits} hp</p>
              <div className="gradeSelectContainer">
                <p>Betyg: </p>
                <div className="select">
                  <select
                    onChange={e => changeGrade(courseItem, e.target.value)}
                    className="gradeSelect"
                  >
                    {!withGrades && (
                      <option value="" selected>
                        Välj betyg
                      </option>
                    )}
                    {Object.keys(gradeWeights).map((gradeWeight, i) => (
                      <option
                        key={i}
                        selected={
                          withGrades && gradeWeight === courseItem.courseGrade
                        }
                      >
                        {withGrades
                          ? gradeWeight === courseItem.courseGrade
                            ? courseItem.courseGrade
                            : gradeWeight
                          : gradeWeight}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </li>
        ))}
      </div>
    </ul>
  );
};

export default Courses;
