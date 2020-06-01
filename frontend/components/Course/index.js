import React from "react";
import Grade from "./Grade";
import Statistic from "./Statistic";
import classnames from "classnames";
import styles from "./course.module.scss";

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
    className={classnames(
      styles.courseContainer,
      selectedCourse
        ? selectedCourse === courseItem
          ? styles.expanded
          : styles.collapsed
        : "",
      "box"
    )}
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
