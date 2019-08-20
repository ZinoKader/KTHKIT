import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import * as api from "../../api/api";
import "./styles.scss";
import Course, { COURSE_TYPE } from "../../components/Course";

const Statistics = ({ ctx }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.getStatisticsCourses();
      setCourses(data.courses);
    };
    fetchData();
  }, []);

  const getChartData = async courseCode => {
    const { data } = await api.getStatisticsForCourse(courseCode);
    return data;
  };

  return (
    <Layout title="Tentastatistik" ctx={ctx}>
      <section className="section">
        <div className="container">
          <h1 className="title">Tentastatistik</h1>
          {courses.length === 0 ? (
            <div className="progressContainer">
              <p>Hämtar kurser och statistik från KTH...</p>
              <progress className="progress is-medium is-dark" max="100" />
            </div>
          ) : (
            <div className="content">
              <ul>
                {courses.map(courseItem => (
                  <Course
                    courseItem={courseItem}
                    courseType={COURSE_TYPE.STATISTIC}
                    selectedCourse={selectedCourse}
                    methods={{ getChartData, setSelectedCourse }}
                  />
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
