import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import classNames from "classnames/bind";
import styles from "./ChooseTopics.module.scss";

const cx = classNames.bind(styles);

function ChooseTopics() {
  const { major, name } = jwt_decode(Cookies.get("token")).userInfo;

  const [topics, setTopics] = useState([]);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [isSelectedTopicTab, setIsSelectedTopicTab] = useState(true);

  const [error, setError] = useState("");

  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);

  useEffect(getSelectedTopic, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperBtnRef.current && !wrapperBtnRef.current.contains(event.target)) {
        setIdActiveRow(null);
      }
    }

    if (isOpenDeleteModal) {
      document.removeEventListener("click", handleClickOutside);
    } else {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenDeleteModal]);

  function getAllTopics() {
    setIsSelectedTopicTab(false);
    axios
      .get("http://localhost:3001/api/topicsByMajor", { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài.");
      });
  }

  function getSelectedTopic() {
    setIsSelectedTopicTab(true);
    axios
      .get(`http://localhost:3001/api/chooseTopics`, { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        setError("Không thể tải đề tài đăng ký.");
      });
  }

  // const handleRegisterTopic = () => {
  //   axios
  //     .post("http://localhost:3001/api/chooseTopics", newTopic, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       // Cập nhật danh sách đề tài
  //       if (res.status !== 400) {
  //         setTopics([...chooseTopics, res.data]);
  //         setIsOpenAddModal(false);
  //         setNewTopic({ nameMajor: major, nameTeacher: name });
  //         setErrorAdd("");
  //       }
  //     })
  //     .catch((err) => {
  //       setErrorAdd("Đã tồn tại thông tin đề tài.");
  //     });
  // };

  // const handleDeleteTopic = (id) => {
  //   setIsOpenDeleteModal(false);
  //   // Gọi API để xóa đề tài
  //   axios
  //     .delete(`http://localhost:3001/api/topics/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then(() => {
  //       // Cập nhật danh sách đề tài
  //       const updatedStudent = topics.filter((topic) => topic._id !== id);
  //       setTopics(updatedStudent);
  //       setError("");
  //     })
  //     .catch((err) => {
  //       setError("Không thể xóa đề tài.");
  //     });
  // };

  // const handleCancleDelete = () => {
  //   setIsOpenDeleteModal(false);
  //   setIdActiveRow(null);
  // };
  const handleSearchTopic = () => {
    axios
      .get(`http://localhost:3001/api/topicsByMajor?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được đề tài");
      });
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Lựa chọn đề tài</h2>
      <div className={cx("tab")}>
        <button onClick={getSelectedTopic}>Đề tài đã chọn</button>
        <button onClick={getAllTopics}>Lựa chọn đề tài</button>
      </div>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchTopic} />
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đề tài</th>
              <th>Mô tả</th>

              {!isSelectedTopicTab && <th>Giáo viên hướng dẫn</th>}
              <th>Chức năng</th>
            </tr>
          </thead>

          {topics.map((topic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{topic.name} </div>
                </td>
                <td>
                  <div>{topic.describe} </div>
                </td>

                {!isSelectedTopicTab && (
                  <td>
                    <div>{topic.nameTeacher} </div>
                  </td>
                )}

                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(topic._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {/* {idActiveRow === topic._id && isSelectedTopicTab && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={handleCancleRegisterTopic}>
                        Hủy đăng ký
                      </button>
                    </div>
                  )}
                  {idActiveRow === topic._id && !isSelectedTopicTab && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={handleRegisterTopic}>
                        Đăng ký
                      </button>
                    </div>
                  )} */}
                  {/* {idActiveRow === topic._id && (
                      <DeleteModal
                        title={`Hủy đăng ký đề tài ${topic.name}`}
                        isOpenDeleteModal={isOpenDeleteModal}
                        id={topic._id}
                        handleCancleDelete={handleCancleDelete}
                        handleDelete={handleDeleteTopic}
                      />
                    )} */}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </DefaultLayout>
  );
}

export default ChooseTopics;
