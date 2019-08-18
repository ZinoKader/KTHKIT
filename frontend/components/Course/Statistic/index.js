import React from "react";
import "./styles.scss";

const Statistic = ({ courseItem }) => {
  return (
    <div>
      <div className="courseDescriptionContainer">
        {courseItem.courseDescription.length !== 0
          ? courseItem.courseDescription
          : "Kursen saknar beskrivning"}
      </div>
    </div>
  );
};

export default Statistic;
