import React from "react";
import "./styles.scss";
import Grade from "./Grade";
import Statistic from "./Statistic";

export const COURSE_TYPE = {
  GRADE: "grade",
  STATISTIC: "statistic"
};

const Course = ({
  courseItem,
  courseType,
  selectedCourse,
  methods,
  ...restProps
}) => (
  <div
    className={
      "box courseContainer" +
      (selectedCourse
        ? selectedCourse === courseItem
          ? " expanded"
          : " collapsed"
        : "")
    }
  >
    <p>
      <strong>
        {courseItem.courseCode} {courseItem.courseName}
      </strong>
    </p>
    <p>Omfattning: {courseItem.courseCredits} hp</p>
    {courseType === COURSE_TYPE.GRADE && (
      <Grade courseItem={courseItem} methods={methods} {...restProps} />
    )}
    {courseType === COURSE_TYPE.STATISTIC && (
      <Statistic
        courseItem={courseItem}
        methods={methods}
        selectedCourse={selectedCourse}
        {...restProps}
      />
    )}
  </div>
);

export default Course;
