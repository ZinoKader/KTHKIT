import React, { useEffect, useState } from "react";
import classnames from "classnames";
import Bar from "../../Charts/Bar";
import { formatStatisticsData } from "../../../utils/chart-tools";
import "./styles.scss";

const Statistic = ({
  courseItem,
  selectedCourse,
  methods: { setSelectedCourse, getExamDates, getChartData, getDeviceWidth },
  ...restProps
}) => {
  const [examDates, setExamDates] = useState([]);
  const [selectedExamDate, setSelectedExamDate] = useState();
  const [dropdownActive, setDropdownActive] = useState(false);
  const [percentizeChart, setPercentizeChart] = useState(true);
  const [courseStatistics, setCourseStatistics] = useState();

  const compactBreakpoint = 480;

  useEffect(() => {
    const fetchExamDates = async () => {
      setExamDates(await getExamDates(selectedCourse.courseCode));
    };
    const fetchCourseStatistics = async () => {
      const rawChartData = await getChartData(
        selectedCourse.courseCode,
        selectedExamDate
      );
      const formattedStatistics = formatStatisticsData(
        rawChartData,
        percentizeChart
      );
      setCourseStatistics(formattedStatistics);
    };

    if (selectedCourse === courseItem) {
      if (examDates.length === 0) {
        fetchExamDates();
      }
      if (selectedExamDate) {
        fetchCourseStatistics();
      }
    }
  }, [selectedCourse, selectedExamDate, percentizeChart]);

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
        <>
          <div
            className={classnames(
              "dateDropDown",
              "dropdown",
              "stretchDropdown",
              {
                ["is-active"]: dropdownActive
              }
            )}
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
                <span className="icon is-small">
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

          {courseStatistics && (
            <>
              {courseStatistics.length > 0 ? (
                <>
                  <div className="controlsContainer">
                    <input
                      id="percentizeCheckbox"
                      className="switch"
                      type="checkbox"
                      onChange={() => setPercentizeChart(!percentizeChart)}
                      checked={!percentizeChart}
                    ></input>
                    <label htmlFor="percentizeCheckbox">
                      Visa absoluta antal
                    </label>
                  </div>
                  <div className="chartContainer">
                    <Bar
                      data={courseStatistics}
                      percentize={percentizeChart}
                      compact={getDeviceWidth() <= compactBreakpoint}
                    />
                  </div>
                </>
              ) : (
                <div className="noDataNotice">
                  <p>Ingen statistik har publicerats för tentan</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Statistic;
