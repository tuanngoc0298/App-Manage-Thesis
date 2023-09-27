import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import classNames from "classnames/bind";
import styles from "./SuggestTopic.module.scss";

const cx = classNames.bind(styles);

function SuggestTopic() {
  const { nameMajor, nameUser } = jwt_decode(Cookies.get("token"));

  const [topic, setTopic] = useState();
  const [newSuggestTopic, setNewSuggestTopic] = useState({ state: "Đang chờ duyệt" });
  const [editSuggestTopic, setEditSuggestTopic] = useState({});

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [error, setError] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);

  useEffect(getSuggestTopic, [token]);

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

  function getSuggestTopic() {
    axios
      .get("http://localhost:3001/api/suggestTopic", { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((res) => {
        setTopic(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đề tài.");
      });
  }

  const handleAddSuggestTopic = () => {
    if (newSuggestTopic.nameTopic && newSuggestTopic.describe) {
      // Gọi API để thêm đề tài mới
      axios
        .post("http://localhost:3001/api/suggestTopic", newSuggestTopic, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
        })
        .then((res) => {
          // Cập nhật danh sách đề tài

          setTopic(res.data);
          setIsOpenAddModal(false);
          setNewSuggestTopic({ state: "Đang chờ duyệt" });
          setErrorAdd("Đề xuất thành công");
        })
        .catch((err) => {
          setErrorAdd(err.response.data.message);
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditTopic = () => {
    // Gọi API để sửa đề tài
    if (editSuggestTopic.nameTopic && editSuggestTopic.describe && editSuggestTopic.nameTeacher) {
      axios
        .put(`http://localhost:3001/api/suggestTopic/${editSuggestTopic._id}`, editSuggestTopic, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
        })
        .then((res) => {
          // Cập nhật danh sách đề tài

          setTopic({ ...topic, ...res.data });

          setEditSuggestTopic({});
          setErrorEdit("");
          setIdActiveRow(null);
          setIsOpenEditModal(false);
        })
        .catch((err) => {
          setErrorEdit("Đề tài đề xuất đã tồn tại!.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteTopic = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa đề tài
    axios
      .delete(`http://localhost:3001/api/suggestTopic/${id}`, {
        withCredentials: true,
        baseURL: "http://localhost:3001",
      })
      .then(() => {
        // Cập nhật danh sách đề tài

        setTopic();
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa đề tài.");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewSuggestTopic({ state: "Đang chờ duyệt" });
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditSuggestTopic({});
    setErrorEdit("");
    setIdActiveRow(null);
  };

  const handleChangeAddNameTeacher = (value) => {
    setNewSuggestTopic({ ...newSuggestTopic, nameTeacher: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeEditNameTeacher = (value) => {
    setEditSuggestTopic({ ...editSuggestTopic, nameTeacher: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeInputAdd = (value) => {
    setNewSuggestTopic(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditSuggestTopic(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Đăng ký đề tài đề xuất</h2>
      <div className={cx("function")}>
        <div className={cx("function__allow")}>
          <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
            Thêm đề tài
          </button>
        </div>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đề tài</th>
              <th>Mô tả</th>
              <th>Giáo viên hướng dẫn</th>
              <th>Tình trạng</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {topic && (
            <tbody>
              <tr>
                <td className={cx("table__index")}>1</td>
                <td>
                  <div>{topic.nameTopic} </div>
                </td>
                <td>
                  <div>{topic.describe} </div>
                </td>
                <td>
                  <div>{topic.nameTeacher} </div>
                </td>
                <td>
                  <div>{topic.state} </div>
                </td>

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
                          setEditSuggestTopic(topic);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === topic._id && (
                    <DeleteModal
                      title={`Xóa đề tài ${topic.nameTopic}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={topic._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteTopic}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {isOpenAddModal && (
        <Modal
          name="Thêm mới đề tài"
          fields={[
            ["Tên đề tài", "nameTopic"],
            ["Mô tả", "describe"],
          ]}
          newData={newSuggestTopic}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddSuggestTopic}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Giáo viên hướng dẫn",
              index: 2,
              onSelectionChange: handleChangeAddNameTeacher,
              api: "teachers",
              nameData: "name",
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa đề tài"
          fields={[
            ["Tên đề tài", "nameTopic"],
            ["Mô tả", "describe"],
          ]}
          newData={editSuggestTopic}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditTopic}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Giáo viên hướng dẫn",
              index: 2,
              onSelectionChange: handleChangeEditNameTeacher,
              api: "teachers",
              nameData: "name",
              oldData: editSuggestTopic.nameTeacher,
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default SuggestTopic;
