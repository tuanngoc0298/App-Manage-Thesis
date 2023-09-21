import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import classNames from "classnames/bind";
import styles from "./RegisterTopics.module.scss";

const cx = classNames.bind(styles);

function RegisterTopic() {
  const { major, name } = jwt_decode(Cookies.get("token")).userInfo;

  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ nameMajor: major, nameTeacher: name });
  const [editTopic, setEditTopic] = useState({ nameMajor: major, nameTeacher: name });
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [file, setFile] = useState(null);

  const [isFilterByUserName, setIsFilterByUserName] = useState(true);

  const [error, setError] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);

  useEffect(getAllTopicsByUserName, [token]);

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
    setIsFilterByUserName(false);
    axios
      .get("http://localhost:3001/api/topics", { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((response) => {
        setTopics(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài.");
      });
  }

  function getAllTopicsByUserName() {
    setIsFilterByUserName(true);

    axios
      .get(`http://localhost:3001/api/topics?searchQuery=${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được đề tài");
      });
  }

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://localhost:3001/api/topicsUpload", formData, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
        })
        .then((response) => {
          if (isFilterByUserName) getAllTopicsByUserName();
          else getAllTopics();

          setFile(null);
          const form = document.getElementById("formImport");
          if (form) {
            form.reset();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleAddTopic = () => {
    if (newTopic.describe && newTopic.name && newTopic.nameMajor && newTopic.nameTeacher) {
      // Gọi API để thêm đề tài mới
      axios
        .post("http://localhost:3001/api/topics", newTopic, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          if (res.status !== 400) {
            setTopics([...topics, res.data]);
            setIsOpenAddModal(false);
            setNewTopic({ nameMajor: major, nameTeacher: name });
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin đề tài.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditTopic = () => {
    // Gọi API để sửa đề tài
    if (editTopic.name && editTopic.describe && editTopic.nameMajor && editTopic.nameTeacher) {
      axios
        .put(`http://localhost:3001/api/topics/${editTopic._id}`, editTopic, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          if (res.status !== 400) {
            const updatedStudent = topics.map((topic) => {
              if (topic._id === editTopic._id) {
                return { ...topic, ...editTopic };
              }
              return topic;
            });
            setTopics(updatedStudent);

            setEditTopic({ nameMajor: major, nameTeacher: name });
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit("Học sinh đã tồn tại!.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteTopic = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa đề tài
    axios
      .delete(`http://localhost:3001/api/topics/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách đề tài
        const updatedStudent = topics.filter((topic) => topic._id !== id);
        setTopics(updatedStudent);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa đề tài.");
      });
  };
  const handleSearchTopic = () => {
    axios
      .get(`http://localhost:3001/api/topics?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được đề tài");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewTopic({ nameMajor: major, nameTeacher: name });
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditTopic({ nameMajor: major, nameTeacher: name });
    setErrorEdit("");
    setIdActiveRow(null);
  };

  const handleChangeInputAdd = (value) => {
    setNewTopic(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditTopic(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Đăng ký đề tài hướng dẫn</h2>
      <div className={cx("tab")}>
        <button onClick={getAllTopicsByUserName}>Đề tài đã đăng ký</button>
        <button onClick={getAllTopics}>Đề tài toàn trường</button>
      </div>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchTopic} />
        {isFilterByUserName && (
          <div className={cx("function__allow")}>
            <form id="formImport" className={cx("importFile")}>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <button onClick={handleUpload}>Tải lên</button>
            </form>
            <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
              Thêm đề tài
            </button>
          </div>
        )}
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đề tài</th>
              <th>Mô tả</th>
              <th>Tên ngành</th>
              {!isFilterByUserName && <th>Giáo viên hướng dẫn</th>}
              {isFilterByUserName && <th>Chức năng</th>}
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
                <td>
                  <div>{topic.nameMajor} </div>
                </td>
                {!isFilterByUserName && (
                  <td>
                    <div>{topic.nameTeacher} </div>
                  </td>
                )}

                {isFilterByUserName && (
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

                    {idActiveRow === topic._id && (
                      <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                        <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditTopic(topic);
                            setIsOpenEditModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                    )}
                    {idActiveRow === topic._id && (
                      <DeleteModal
                        title={`Xóa đề tài ${topic.name}`}
                        isOpenDeleteModal={isOpenDeleteModal}
                        id={topic._id}
                        handleCancleDelete={handleCancleDelete}
                        handleDelete={handleDeleteTopic}
                      />
                    )}
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenAddModal && (
        <Modal
          name="Thêm mới đề tài"
          fields={[
            ["Tên đề tài", "name"],
            ["Mô tả", "describe"],
          ]}
          newData={newTopic}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddTopic}
          handleChangeInput={handleChangeInputAdd}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa đề tài"
          fields={[
            ["Tên đề tài", "name"],
            ["Mô tả", "describe"],
          ]}
          newData={editTopic}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditTopic}
          handleChangeInput={handleChangeInputEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default RegisterTopic;
