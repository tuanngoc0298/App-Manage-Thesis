import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./InstructedStudents.module.scss";

const cx = classNames.bind(styles);

function InstructedStudents() {
  const url = process.env.REACT_APP_URL;

  const [instructedStudents, setInstructedStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");

  useEffect(getInstructedStudents, [filterBySemester, filterByYear]);

  function getInstructedStudents() {
    axios
      .get(
        `${url}/api/instructedStudents?searchQuery=${searchQuery}&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${url}` }
      )
      .then((res) => {
        setInstructedStudents(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài đề xuất.");
      });
  }
  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Danh sách sinh viên hướng dẫn</h2>

      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={getInstructedStudents}
        />
      </div>
      <div className={cx("filter-comboBox")}>
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
              <th>Mã sinh viên</th>
              <th>Tên sinh viên</th>
              <th>Tên đề tài</th>
              <th>Tên ngành</th>
              <th>Năm học</th>
              <th>Kỳ học</th>
            </tr>
          </thead>

          {instructedStudents.map((instructedStudent, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{instructedStudent.codeStudent} </div>
                </td>
                <td>
                  <div>{instructedStudent.nameStudent} </div>
                </td>
                <td>
                  <div>{instructedStudent.nameTopic} </div>
                </td>
                <td>
                  <div>{instructedStudent.nameMajor} </div>
                </td>
                <td>
                  <div>{instructedStudent.yearTopic} </div>
                </td>
                <td>
                  <div>{instructedStudent.semesterTopic} </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default InstructedStudents;
