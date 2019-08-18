import React from "react";
import { gradeWeights } from "../../global/global";
import "./styles.scss";
import Grade from "./Grade";
import Statistic from "./Statistic";

export const COURSE_TYPE = {
  GRADE: "grade",
  STATISTIC: "statistic"
};

const Course = ({ courseItem, courseType, ...restProps }) => {
  return (
    <li key={courseItem.courseCode}>
      <div className="box courseContainer">
        <p>
          <strong>
            {courseItem.courseCode} {courseItem.courseName}
          </strong>
        </p>
        <p>Omfattning: {courseItem.courseCredits} hp</p>
        {courseType === COURSE_TYPE.GRADE && (
          <Grade courseItem={courseItem} {...restProps} />
        )}
        {courseType === COURSE_TYPE.STATISTIC && (
          <Statistic courseItem={courseItem} />
        )}
      </div>
    </li>
  );
};

export default Course;
