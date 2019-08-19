import React from "react";
import "./styles.scss";

const Statistic = ({ courseItem, chooseCourse, ...restProps }) => {
  const { selectedCourse } = restProps;

  return (
    <>
      <a
        className="courseInformation"
        href={courseItem.courseLink}
        target="_blank"
      >
        Kursinformation
      </a>
      <div
        className={
          "courseDescriptionContainer" + (selectedCourse ? " expanded" : "")
        }
      >
        {courseItem.courseDescription.length !== 0
          ? courseItem.courseDescription
          : "Kursen saknar beskrivning"}
      </div>
      <a id={courseItem.courseCode} className="courseAnchor"></a>
      <a
        href={"#" + courseItem.courseCode}
        onClick={() =>
          selectedCourse ? chooseCourse() : chooseCourse(courseItem)
        }
        className={"expandButton" + (selectedCourse ? " flipped" : "")}
      >
        {selectedCourse ? "Göm statistik" : "Visa statistik"}
      </a>
    </>
  );
};

export default Statistic;
