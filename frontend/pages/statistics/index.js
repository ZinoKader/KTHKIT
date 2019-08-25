import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import * as api from "../../api/api";
import { useWindowSize } from "../../utils/device-tools";
import "./styles.scss";
import Course, { COURSE_TYPE } from "../../components/Course";

const Statistics = ({ ctx }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const windowSize = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.getStatisticsCourses();
      setCourses(data.courses);
    };
    fetchData();
  }, []);

  const getExamDates = async courseCode => {
    const { data } = await api.getExamDatesForCourse(courseCode);
    return data.dates;
  };

  const getChartData = async (courseCode, examDate) => {
    const { data } = await api.getStatisticsForCourse(courseCode, examDate);
    return data;
  };

  return (
    <Layout title="Tentastatistik" ctx={ctx}>
      <section className="section">
        <div className="container">
          {!selectedCourse && <h1 className="title">Tentastatistik</h1>}
          {courses.length === 0 ? (
            <div className="progressContainer">
              <p>Hämtar kurser och statistik från KTH...</p>
              <progress className="progress is-medium is-dark" max="100" />
            </div>
          ) : (
            <div className="content">
              <ul>
                {courses.map((courseItem, i) => (
                  <li key={i}>
                    <Course
                      courseItem={courseItem}
                      courseType={COURSE_TYPE.STATISTIC}
                      selectedCourse={selectedCourse}
                      methods={{
                        getExamDates,
                        getChartData,
                        setSelectedCourse,
                        getDeviceWidth: () => windowSize.width
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Statistics;
