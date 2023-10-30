import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, Modal, ComboBox } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./AssignTeachers.module.scss";

const cx = classNames.bind(styles);

function AssignTeachers() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [suggestTopics, setSuggestTopics] = useState([]);

  const [valNameTeacher, setValNameTeacher] = useState("");

  const [editSuggestTopic, setEditSuggestTopic] = useState({});

  const [isOpenAssignModal, setIsOpenAssignModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");

  const [errorAssign, setErrorAssign] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getAllStudentsNeedAssign, [filterBySemester, filterByYear]);

  function getAllStudentsNeedAssign() {
    axios
      .get(
        `${host}:${port}/api/assignTeachers?searchQuery=${searchQuery}&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${host}:${port}` }
      )
      .then((res) => {
        setSuggestTopics(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài đề xuất.");
      });
  }

  const handleAssignTeacher = () => {
    // Gọi API để sửa đề tài đề xuất
    if (valNameTeacher) {
      axios
        .put(
          `${host}:${port}/api/assignTeachers/${editSuggestTopic._id}`,
          { valNameTeacher, editSuggestTopic },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setEditSuggestTopic({});
          setValNameTeacher("");
          setIsOpenAssignModal(false);
          getAllStudentsNeedAssign();
          setErrorAssign("");
        })
        .catch((err) => {
          setErrorAssign(err.response.data.message);
        });
    } else {
      setErrorAssign("Vui lòng lựa chọn!");
    }
  };

  const handleCancleAssign = () => {
    setIsOpenAssignModal(false);
    setValNameTeacher("");

    setErrorAssign("");
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };
  const handleChangNameTeacher = (value) => {
    setValNameTeacher(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Phân công giáo viên hướng dẫn</h2>

      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={getAllStudentsNeedAssign} />
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
              <th>Tên đề tài</th>
              <th>Giáo viên hướng dẫn</th>
              <th>Năm học</th>
              <th>Kỳ học</th>

              <th>Chức năng</th>
            </tr>
          </thead>

          {suggestTopics.map((suggestTopic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{suggestTopic.codeStudent} </div>
                </td>
                <td>
                  <div>{suggestTopic.nameTopic} </div>
                </td>
                <td>
                  <div>{suggestTopic.nameTeacher} </div>
                </td>
                <td>
                  <div>{suggestTopic.year} </div>
                </td>
                <td>
                  <div>{suggestTopic.semester} </div>
                </td>

                <td className={cx("column__functions")}>
                  <div className={cx("wrapper__btn")}>
                    <button
                      className={cx("btn")}
                      onClick={() => {
                        setEditSuggestTopic(suggestTopic);
                        setIsOpenAssignModal(true);
                      }}
                    >
                      Phân công
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenAssignModal && (
        <Modal
          name="Phân công giáo viên hướng dẫn"
          details={[
            ["Mã SV", editSuggestTopic.codeStudent],
            ["Tên SV", editSuggestTopic.nameStudent],
            ["Tên đề tài", editSuggestTopic.nameTopic],
            ["GV hướng dẫn", editSuggestTopic.nameTeacher],
            ["Mô tả", editSuggestTopic.describe],
            ["Năm học", editSuggestTopic.year],
            ["Kỳ học", editSuggestTopic.semester],
          ]}
          error={errorAssign}
          handleCancle={handleCancleAssign}
          handleLogic={handleAssignTeacher}
          indexsComboBox={{
            title: "Tên giáo viên",
            onSelectionChange: handleChangNameTeacher,
            api: "teachersByDepartment",
            nameData: "name",
            customStyle: { justifyContent: "center", marginTop: "40px" },
            defaultDisplay: "Chọn giáo viên",
          }}
        />
      )}
    </DefaultLayout>
  );
}

export default AssignTeachers;
