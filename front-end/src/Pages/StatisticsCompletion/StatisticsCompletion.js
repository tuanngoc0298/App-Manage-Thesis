import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

import axios from "axios";

import classNames from "classnames/bind";
import styles from "./StatisticsCompletion.module.scss";

const cx = classNames.bind(styles);

function StatisticsCompletion() {
  const url = process.env.REACT_APP_URL;

  const [statistics, setStatistics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  const [filterByDepartment, setFilterByDepartment] = useState("");

  const [error, setError] = useState("");

  useEffect(getStatistics, [
    filterBySemester,
    filterByYear,
    filterByDepartment,
  ]);

  function getStatistics() {
    axios
      .get(
        `${url}/api/statisticsCompletion?searchQuery=${searchQuery}&year=${filterByYear}&semester=${filterBySemester}&department=${filterByDepartment}`,
        { withCredentials: true, baseURL: `${url}` }
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

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };

  const handleChangeFilterDepartment = (value) => {
    setFilterByDepartment(value);
  };
  const headers = [
    { label: "Tên khoa", key: "nameDepartment" },
    { label: "Tên ngành", key: "nameMajor" },
    { label: "Số lượng SV đăng ký KL", key: "totalStudents" },
    { label: "Số lượng SV hoàn thành KL", key: "totalCompletedStudents" },
    { label: "Tỷ lệ hoàn thành KL", key: "completionRate" },
  ];
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Thống kê tỷ lệ hoàn thành KLTN</h2>

      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={getStatistics}
        />
        <CSVLink
          data={statistics}
          filename={`Thống_kê${
            filterByDepartment ? `_khoa_${filterByDepartment}` : ""
          }_năm_${filterByYear}_kỳ_${filterBySemester}`}
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
        <ComboBox
          hasTitle={false}
          onSelectionChange={handleChangeFilterSemester}
          api="schoolYears"
          nameData="semester"
          customStyle={{ width: "200px", marginBottom: "20px" }}
          oldData={filterBySemester}
          defaultDisplay="Chọn kỳ học"
        />
      </div>
      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên khoa</th>
              <th>Tên ngành</th>
              <th>Số lượng SV đăng ký KL</th>
              <th>Số lượng SV hoàn thành KL</th>
              <th>Tỷ lệ hoàn thành KL</th>
            </tr>
          </thead>

          {statistics.map((statistic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{statistic.nameDepartment} </div>
                </td>
                <td>
                  <div>{statistic.nameMajor} </div>
                </td>
                <td>
                  <div>{statistic.totalStudents} </div>
                </td>
                <td>
                  <div>{statistic.totalCompletedStudents} </div>
                </td>
                <td>
                  <div>{statistic.completionRate}</div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default StatisticsCompletion;
