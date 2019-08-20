import React from "react";
import { gradeWeights } from "../../../global/global";
import "./styles.scss";

const Grade = ({ courseItem, isGraded, methods: { changeGrade } }) => {
  return (
    <div className="gradeSelectContainer">
      <p>Betyg: </p>
      <div className="select">
        <select
          onChange={e => changeGrade(courseItem, e.target.value)}
          className="gradeSelect"
        >
          {!isGraded && (
            <option value="" selected>
              Välj betyg
            </option>
          )}
          {Object.keys(gradeWeights).map((gradeWeight, i) => (
            <option
              key={i}
              selected={isGraded && gradeWeight === courseItem.courseGrade}
            >
              {isGraded
                ? gradeWeight === courseItem.courseGrade
                  ? courseItem.courseGrade
                  : gradeWeight
                : gradeWeight}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Grade;
