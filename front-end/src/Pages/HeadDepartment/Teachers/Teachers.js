import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./Teachers.module.scss";

const cx = classNames.bind(styles);

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({});
  const [editTeacher, setEditTeacher] = useState({});
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [initialValueComboBox, setInitialValueComboBox] = useState("");
  const [error, setError] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);

  const { token } = useContext(HeaderContext);

  useEffect(() => {
    // Gọi API để lấy danh sách giáo viên
    axios
      .get("http://localhost:3001/api/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách giáo viên.");
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

  const handleAddTeacher = () => {
    if (newTeacher.codeTeacher && newTeacher.nameTeacher && newTeacher.nameMajor && newTeacher.roleTeacher) {
      // Gọi API để thêm giáo viên mới
      axios
        .post("http://localhost:3001/api/teachers", newTeacher, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách giáo viên
          if (res.status !== 400) {
            setTeachers([...teachers, res.data]);
            setIsOpenAddModal(false);
            setNewTeacher({});
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd(err.response.data.message);
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditTeacher = () => {
    // Gọi API để sửa giáo viên
    if (editTeacher.nameTeacher && editTeacher.codeTeacher && editTeacher.nameMajor && editTeacher.roleTeacher) {
      axios
        .put(
          `http://localhost:3001/api/teachers/${editTeacher._id}`,
          { editTeacher, initialValueComboBox },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          // Cập nhật danh sách giáo viên
          if (res.status !== 400) {
            const updatedTeachers = teachers.map((teacher) => {
              if (teacher._id === editTeacher._id) {
                return { ...teacher, ...editTeacher };
              }
              return teacher;
            });
            setTeachers(updatedTeachers);

            setEditTeacher({});
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit(err.response.data.message);
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteDepartment = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa giáo viên
    axios
      .delete(`http://localhost:3001/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách giáo viên
        const updatedTeachers = teachers.filter((teacher) => teacher._id !== id);
        setTeachers(updatedTeachers);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa giáo viên.");
      });
  };
  const handleSearchTeacher = () => {
    axios
      .get(`http://localhost:3001/api/teachers?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeachers(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được giáo viên");
      });
  };
  const handleChangeEditNameMajor = (value) => {
    setEditTeacher({ ...editTeacher, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddNameMajor = (value) => {
    setNewTeacher({ ...newTeacher, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleChangeEditSelf = (value) => {
    setEditTeacher({ ...editTeacher, roleTeacher: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddSelf = (value) => {
    setNewTeacher({ ...newTeacher, roleTeacher: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeInitialValueComboBox = (value) => {
    setInitialValueComboBox(value);
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewTeacher({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditTeacher({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeInputAdd = (value) => {
    setNewTeacher(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditTeacher(value);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý giáo viên</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchTeacher} />
        <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
          Thêm giáo viên
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã giáo viên</th>
              <th>Tên giáo viên</th>
              <th>Tên ngành</th>
              <th>Chức vụ</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {teachers.map((teacher, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{teacher.codeTeacher} </div>
                </td>
                <td>
                  <div>{teacher.nameTeacher} </div>
                </td>
                <td>
                  <div>{teacher.nameMajor} </div>
                </td>
                <td>
                  <div>{teacher.roleTeacher} </div>
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
                          setEditTeacher(teacher);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === teacher._id && (
                    <DeleteModal
                      title={`Xóa giáo viên ${teacher.nameTeacher}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={teacher._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteDepartment}
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
          name="Thêm mới giáo viên"
          fields={[
            ["Mã giáo viên", "codeTeacher"],
            ["Tên giáo viên", "nameTeacher"],
          ]}
          newData={newTeacher}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddTeacher}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Thuộc ngành",
              index: 2,
              onSelectionChange: handleChangeAddNameMajor,
              api: "majors",
              nameData: "nameMajor",
            },
            {
              title: "Chức vụ",
              index: 3,
              onSelectionChange: handleChangeAddSelf,
              selfData: [{ name: "Trưởng khoa" }, { name: "Trưởng ngành" }, { name: "Giáo viên" }],
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa giáo viên"
          fields={[
            ["Mã giáo viên", "codeTeacher"],
            ["Tên giáo viên", "nameTeacher"],
          ]}
          newData={editTeacher}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditTeacher}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Thuộc ngành",
              index: 2,
              onSelectionChange: handleChangeEditNameMajor,
              api: "majors",
              oldData: editTeacher.nameMajor,
              nameData: "nameMajor",
            },
            {
              title: "Chức vụ",
              index: 3,
              onSelectionChange: handleChangeEditSelf,
              selfData: [{ name: "Trưởng khoa" }, { name: "Trưởng ngành" }, { name: "Giáo viên" }],
              oldData: editTeacher.roleTeacher,
              onGetInitialValue: handleChangeInitialValueComboBox,
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default Teachers;
