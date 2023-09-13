import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./SchoolYears.module.scss";

const cx = classNames.bind(styles);

function SchoolYears() {
  const [schoolYears, setSchoolYears] = useState([]);
  const [newSchoolYear, setNewSchoolYear] = useState({});
  const [editSchoolYear, setEditSchoolYear] = useState({});
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [error, setError] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);

  const { token } = useContext(HeaderContext);

  useEffect(() => {
    // Gọi API để lấy danh sách năm học
    axios
      .get("http://localhost:3001/api/schoolYears", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setSchoolYears(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách năm học.");
      });
  }, [token]);

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

  const handleAddSchoolYear = () => {
    if (newSchoolYear.year && newSchoolYear.semester) {
      // Gọi API để thêm năm học mới
      axios
        .post("http://localhost:3001/api/schoolYears", newSchoolYear, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách năm học
          if (res.status !== 400) {
            setSchoolYears([...schoolYears, res.data]);
            setIsOpenAddModal(false);
            setNewSchoolYear({});
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin năm học.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditSchoolYear = () => {
    // Gọi API để sửa năm học
    if (editSchoolYear.semester && editSchoolYear.year) {
      axios
        .put(`http://localhost:3001/api/schoolYears/${editSchoolYear._id}`, editSchoolYear, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách năm học
          if (res.status !== 400) {
            const updatedTeachers = schoolYears.map((teacher) => {
              if (teacher._id === editSchoolYear._id) {
                return { ...teacher, ...editSchoolYear };
              }
              return teacher;
            });
            setSchoolYears(updatedTeachers);

            setEditSchoolYear({});
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit("Năm học đã tồn tại!.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteSchoolYear = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa năm học
    axios
      .delete(`http://localhost:3001/api/schoolYears/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách năm học
        const updatedTeachers = schoolYears.filter((teacher) => teacher._id !== id);
        setSchoolYears(updatedTeachers);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa năm học.");
      });
  };
  const handleSearchSchoolYear = () => {
    axios
      .get(`http://localhost:3001/api/schoolYears?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSchoolYears(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được năm học");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewSchoolYear({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditSchoolYear({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeInputAdd = (value) => {
    setNewSchoolYear(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditSchoolYear(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý năm học</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchSchoolYear} />
        <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
          Thêm năm học
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Năm học</th>
              <th>Học kỳ</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {schoolYears.map((teacher, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{teacher.year} </div>
                </td>
                <td>
                  <div>{teacher.semester} </div>
                </td>

                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(teacher._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {idActiveRow === teacher._id && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditSchoolYear(teacher);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === teacher._id && (
                    <DeleteModal
                      title={`Xóa năm học ${teacher.semester}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={teacher._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteSchoolYear}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenAddModal && (
        <Modal
          name="Thêm mới năm học"
          fields={[
            ["Năm học", "year"],
            ["Học kỳ", "semester"],
          ]}
          newData={newSchoolYear}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddSchoolYear}
          handleChangeInput={handleChangeInputAdd}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa năm học"
          fields={[
            ["Năm học", "year"],
            ["Học kỳ", "semester"],
          ]}
          newData={editSchoolYear}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditSchoolYear}
          handleChangeInput={handleChangeInputEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default SchoolYears;
