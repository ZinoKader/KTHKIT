import React from "react";
import { gradeWeights } from "../../../global/global";
import styles from "./grade.module.scss";

const Grade = ({ courseItem, isGraded, methods: { changeGrade } }) => {
  return (
    <div className={styles.gradeSelectContainer}>
      <p>Betyg: </p>
      <div className="select">
        <select
          onChange={e => changeGrade(courseItem, e.target.value)}
          value={isGraded ? courseItem.courseGrade : "NONE"}
          className={styles.gradeSelect}
        >
          {Object.keys(gradeWeights).map((gradeKey, i) => (
            <option
              key={courseItem.courseName + courseItem.courseGrade + i}
              label={gradeWeights[gradeKey].name}
            >
              {gradeKey}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Grade;
