import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar } from "~/components";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import classNames from "classnames/bind";
import styles from "./ChooseTopics.module.scss";

const cx = classNames.bind(styles);

function ChooseTopics() {
  const url = process.env.REACT_APP_URL;

  const { code, nameMajor } = jwt_decode(Cookies.get("token")).userInfo;

  let editTopic = {};
  const [topics, setTopics] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isSelectedTopicTab, setIsSelectedTopicTab] = useState(true);

  const [error, setError] = useState("");
  const [errorRegister, setErrorRegister] = useState("");

  const wrapperBtnRef = useRef(null);

  useEffect(getSelectedTopic, []);

  function getAllTopics() {
    setErrorRegister("");

    setIsSelectedTopicTab(false);
    axios
      .get(`/api/topicsByMajor`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((res) => {
        setTopics(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài.");
      });
  }

  function getSelectedTopic() {
    setIsSelectedTopicTab(true);
    axios
      .get(`/api/chooseTopics`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((res) => {
        setTopics(res.data);
        setError("");
      })
      .catch((err) => {
        setError("Không thể tải đề tài đăng ký.");
      });
  }

  const handleRegisterTopic = () => {
    axios
      .put(
        `/api/chooseTopics/${editTopic._id}`,
        { editTopic, code },
        {
          withCredentials: true,
          baseURL: `${url}`,
        }
      )
      .then((res) => {
        // Cập nhật danh sách đề tài
        setErrorRegister(res.data.message);
        editTopic = {};
      })
      .catch((err) => {
        setErrorRegister(err.response.data.message);
      });
  };

  const handleCancleRegisterTopic = () => {
    // Gọi API để xóa đề tài
    axios
      .delete(`/api/chooseTopics/${editTopic._id}`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((res) => {
        // Cập nhật danh sách đề tài
        editTopic = {};

        getSelectedTopic();
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  const handleSearchTopic = () => {
    axios
      .get(`/api/topicsByMajor?searchQuery=${searchQuery}`, {
        withCredentials: true,
        baseURL: `${url}`,
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
      {!isSelectedTopicTab && (
        <div className={cx("function")}>
          <SearchBar
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearchTopic}
          />
          <div style={{ color: "red" }}>{errorRegister}</div>
        </div>
      )}
      {
        <div
          style={{ color: "red", textAlign: "center", marginBottom: "10px" }}
        >
          {error}
        </div>
      }
      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đề tài</th>
              <th>Mô tả</th>
              <th>Giáo viên hướng dẫn</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {topics.map((topic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{topic.nameTopic} </div>
                </td>
                <td>
                  <div>{topic.describeTopic} </div>
                </td>
                <td>
                  <div>{topic.nameTeacher} </div>
                </td>

                <td className={cx("column__functions")}>
                  {isSelectedTopicTab && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button
                        className={cx("btn")}
                        onClick={handleCancleRegisterTopic}
                      >
                        Hủy đăng ký
                      </button>
                    </div>
                  )}
                  {!isSelectedTopicTab && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          editTopic = topic;
                          handleRegisterTopic();
                        }}
                      >
                        Đăng ký
                      </button>
                    </div>
                  )}
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
