import React from "react";
import "./styles.scss";
import Link from "next/link";

const Statistic = ({ courseItem }) => {
  return (
    <>
      <a
        className="courseInformation"
        href={courseItem.courseLink}
        target="_blank"
      >
        Kursinformation
      </a>
      <div className="courseDescriptionContainer">
        {courseItem.courseDescription.length !== 0
          ? courseItem.courseDescription
          : "Kursen saknar beskrivning"}
      </div>
    </>
  );
};

export default Statistic;
