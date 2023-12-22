import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, Modal, ComboBox } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ApproveSuggestTopics.module.scss";

const cx = classNames.bind(styles);

function ApproveSuggestTopics() {
  const url = process.env.REACT_APP_URL;

  const [suggestTopics, setSuggestTopics] = useState([]);

  const [editSuggestTopic, setEditSuggestTopic] = useState({});
  const [isApprove, setIsApprove] = useState("");
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");

  const [errorApprove, setErrorApprove] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getAllSuggestTopics, [filterBySemester, filterByYear]);

  function getAllSuggestTopics() {
    axios
      .get(
        `/api/approveSuggesttopics?searchQuery=${searchQuery}&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${url}` }
      )
      .then((res) => {
        setSuggestTopics(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài đề xuất.");
      });
  }

  const handleApproveSuggestTopic = () => {
    // Gọi API để sửa đề tài đề xuất
    if (isApprove) {
      axios
        .put(
          `/api/approveSuggesttopics/${editSuggestTopic._id}`,
          { editSuggestTopic, isApprove },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setEditSuggestTopic({});
          setIsApprove("");
          setIsOpenApproveModal(false);
          getAllSuggestTopics();
        })
        .catch((err) => {
          setErrorApprove(err.response.data.message);
        });
    } else {
      setErrorApprove("Vui lòng lựa chọn!");
    }
  };

  const handleCancleApprove = () => {
    setIsOpenApproveModal(false);
    setIsApprove("");
    setEditSuggestTopic({});
    setErrorApprove("");
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Duyệt đề tài đề xuất</h2>

      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={getAllSuggestTopics}
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
              <th>Tên đề tài</th>
              <th>Tên ngành</th>
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
                  <div>{suggestTopic.nameMajor} </div>
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
                        setIsOpenApproveModal(true);
                      }}
                    >
                      Duyệt
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenApproveModal && (
        <Modal
          name="Duyệt đề tài đề xuất"
          details={[
            ["Mã SV", editSuggestTopic.codeStudent],
            ["Tên SV", editSuggestTopic.nameStudent],
            ["Tên đề tài", editSuggestTopic.nameTopic],
            ["Tên ngành", editSuggestTopic.nameMajor],
            ["Mô tả", editSuggestTopic.describe],
            ["Năm học", editSuggestTopic.year],
            ["Kỳ học", editSuggestTopic.semester],
          ]}
          error={errorApprove}
          handleCancle={handleCancleApprove}
          handleLogic={handleApproveSuggestTopic}
          handleApproveTopic={{ isApprove, setIsApprove }}
        />
      )}
    </DefaultLayout>
  );
}

export default ApproveSuggestTopics;
