import React, { useEffect, useState } from "react";
import classnames from "classnames";
import Bar from "../../Charts/Bar";
import styles from "./statistic.module.scss";
import { formatStatisticsData } from "../../../utils/chart-tools";

const Statistic = ({
  courseItem,
  selectedCourse,
  methods: { setSelectedCourse, getExamDates, getChartData, getDeviceWidth }
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
        className={styles.courseInformation}
        href={courseItem.courseLink}
        target="_blank"
      >
        Kursinformation
      </a>
      <div
        className={classnames(styles.courseDescriptionContainer, {
          [styles.expanded]: selectedCourse
        })}
      >
        {courseItem.courseDescription}
      </div>
      <a id={courseItem.courseCode} className={styles.courseAnchor}></a>
      <a
        href={"#" + courseItem.courseCode}
        onClick={() =>
          selectedCourse ? setSelectedCourse() : setSelectedCourse(courseItem)
        }
        className={classnames(styles.expandButton, {
          [styles.flipped]: selectedCourse
        })}
      >
        {selectedCourse ? "Göm statistik" : "Visa statistik"}
      </a>
      {selectedCourse && (
        <>
          <div
            className={classnames(
              styles.dateDropDown,
              styles.stretchDropdown,
              "dropdown",
              {
                ["is-active"]: dropdownActive
              }
            )}
            onClick={() => setDropdownActive(!dropdownActive)}
          >
            <div
              className={classnames(styles.stretchDropdown, "dropdown-trigger")}
            >
              <div
                className={classnames(
                  styles.stretchDropdown,
                  styles.button,
                  "button"
                )}
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
            <div
              className={classnames(styles["dropdown-menu"], "dropdown-menu")}
              role="menu"
            >
              <div className="dropdown-content">
                {examDates.map((examDate, i) => (
                  <a
                    key={i}
                    className={classnames(
                      "dropdown-item",
                      styles["dropdown-item"],
                      {
                        ["is-active"]: examDate === selectedExamDate
                      }
                    )}
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
                  <div className={styles.controlsContainer}>
                    <input
                      className={classnames(styles.switch, "switch")}
                      id="percentizeCheckbox"
                      type="checkbox"
                      onChange={() => setPercentizeChart(!percentizeChart)}
                      checked={!percentizeChart}
                    ></input>
                    <label htmlFor="percentizeCheckbox">
                      Visa absoluta antal
                    </label>
                  </div>
                  <div className={styles.chartContainer}>
                    <Bar
                      data={courseStatistics}
                      percentize={percentizeChart}
                      compact={getDeviceWidth() <= compactBreakpoint}
                    />
                  </div>
                </>
              ) : (
                <div className={styles.noDataNotice}>
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
