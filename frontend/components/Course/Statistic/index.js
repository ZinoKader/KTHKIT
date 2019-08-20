import React from "react";
import Bar from "../../Charts/Bar";
import "./styles.scss";

const Statistic = ({
  courseItem,
  methods: { setSelectedCourse, getChartData },
  selectedCourse,
  ...restProps
}) => {
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
          selectedCourse ? setSelectedCourse() : setSelectedCourse(courseItem)
        }
        className={"expandButton" + (selectedCourse ? " flipped" : "")}
      >
        {selectedCourse ? "Göm statistik" : "Visa statistik"}
      </a>
      {/*selectedCourse === courseItem && console.log(getChartData(selectedCourse.courseCode, selectedCourse.course))*/}
      {/*<Bar data={getChartData(courseItem.courseCode)} >*/}
    </>
  );
};

export default Statistic;
