import React, { useEffect, useState } from "react";
import classnames from "classnames";
import Bar from "../../Charts/Bar";
import { formatStatisticsData } from "../../../utils/chart-tools";
import "./styles.scss";

const Statistic = ({
  courseItem,
  methods: { setSelectedCourse, getExamDates, getChartData },
  selectedCourse,
  ...restProps
}) => {
  const [examDates, setExamDates] = useState([]);
  const [selectedExamDate, setSelectedExamDate] = useState();
  const [dropdownActive, setDropdownActive] = useState(false);
  const [courseStatistics, setCourseStatistics] = useState();

  useEffect(() => {
    const fetchExamDates = async () => {
      setExamDates(await getExamDates(selectedCourse.courseCode));
    };
    const fetchCourseStatistics = async () => {
      const rawChartData = await getChartData(
        selectedCourse.courseCode,
        selectedExamDate
      );
      console.log(rawChartData);
      setCourseStatistics(formatStatisticsData(rawChartData));
    };
    selectedCourse === courseItem && examDates.length === 0 && fetchExamDates();
    selectedExamDate && fetchCourseStatistics();
  }, [selectedCourse, selectedExamDate]);

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
        className={classnames("courseDescriptionContainer", {
          ["expanded"]: selectedCourse
        })}
      >
        {courseItem.courseDescription}
      </div>
      <a id={courseItem.courseCode} className="courseAnchor"></a>
      <a
        href={"#" + courseItem.courseCode}
        onClick={() =>
          selectedCourse ? setSelectedCourse() : setSelectedCourse(courseItem)
        }
        className={classnames("expandButton", { ["flipped"]: selectedCourse })}
      >
        {selectedCourse ? "Göm statistik" : "Visa statistik"}
      </a>
      {selectedCourse && (
        <div
          className={classnames("dropdown", "stretchDropdown", {
            ["is-active"]: dropdownActive
          })}
          onClick={() => setDropdownActive(!dropdownActive)}
        >
          <div className="dropdown-trigger stretchDropdown">
            <div
              className="button stretchDropdown"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              tabIndex="1"
            >
              <span>
                {selectedExamDate ? selectedExamDate : "Tentamensdatum"}
              </span>
              <span class="icon is-small">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {examDates.map((examDate, i) => (
                <a
                  key={i}
                  className={classnames("dropdown-item", {
                    ["is-active"]: examDate === selectedExamDate
                  })}
                  onClick={() => setSelectedExamDate(examDate)}
                >
                  {examDate}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      {courseStatistics && <Bar data={courseStatistics} />}
    </>
  );
};

export default Statistic;
