import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

import axios from "axios";

import classNames from "classnames/bind";
import styles from "./StatisticsStudent.module.scss";

const cx = classNames.bind(styles);

function StatisticsStudent() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [statistics, setStatistics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");

  const [filterByDepartment, setFilterByDepartment] = useState("");

  const [error, setError] = useState("");

  useEffect(getStatistics, [filterByYear, filterByDepartment]);

  function getStatistics() {
    axios
      .get(
        `${host}:${port}/api/statisticsStudent?searchQuery=${searchQuery}&year=${filterByYear}&department=${filterByDepartment}`,
        { withCredentials: true, baseURL: `${host}:${port}` }
      )
      .then((res) => {
        setStatistics(res.data);
      })
      .catch((err) => {
        setError("Không thể tải báo cáo.");
      });
  }
  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterDepartment = (value) => {
    setFilterByDepartment(value);
  };
  const headers = [
    { label: "Mã giáo viên", key: "code" },
    { label: "Tên giáo viên", key: "name" },
    { label: "Tên ngành", key: "nameMajor" },
    { label: "Học kỳ 1", key: "studentsByYear[0].count" },
    { label: "Học kỳ 2", key: "studentsByYear[1].count" },
    { label: "Học kỳ 3", key: "studentsByYear[2].count" },
    { label: "Cả năm", key: "totalStudents" },
  ];
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Thống kê tỷ lệ hoàn thành KLTN</h2>

      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={getStatistics} />
        <CSVLink
          data={statistics}
          filename={`Thống_kê_khoa_${filterByDepartment}_năm_${filterByYear}`}
          headers={headers}
          separator={";"}
          className={cx("function__export")}
        >
          <span class="material-symbols-outlined">download</span>
          Export
        </CSVLink>
      </div>
      <div className={cx("filter-comboBox")}>
        <ComboBox
          hasTitle={false}
          onSelectionChange={handleChangeFilterDepartment}
          api="departments"
          nameData="nameDepartment"
          customStyle={{ width: "200px", marginBottom: "20px" }}
          oldData={filterByDepartment}
          defaultDisplay="Chọn khoa"
        />
        <ComboBox
          hasTitle={false}
          onSelectionChange={handleChangeFilterYear}
          api="schoolYears"
          nameData="year"
          customStyle={{ width: "200px", marginBottom: "20px" }}
          oldData={filterByYear}
          defaultDisplay="Chọn năm học"
        />
      </div>
      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã giáo viên</th>
              <th>Tên giáo viên</th>
              <th>Tên ngành</th>
              <th>Học kỳ 1</th>
              <th>Học kỳ 2</th>
              <th>Học kỳ 3</th>
              <th>Năm học</th>
            </tr>
          </thead>

          {statistics.map((statistic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{statistic.code} </div>
                </td>
                <td>
                  <div>{statistic.name} </div>
                </td>
                <td>
                  <div>{statistic.nameMajor} </div>
                </td>
                <td>
                  <div>{statistic.studentsByYear[0].count} </div>
                </td>
                <td>
                  <div>{statistic.studentsByYear[1].count} </div>
                </td>
                <td>
                  <div>{statistic.studentsByYear[2].count}</div>
                </td>
                <td>
                  <div>{statistic.totalStudents}</div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default StatisticsStudent;
