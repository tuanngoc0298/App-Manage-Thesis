import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ManagerStudents.module.scss";

const cx = classNames.bind(styles);

function ManagerStudents() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({});
  const [editStudent, setEditStudent] = useState({});
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [file, setFile] = useState(null);

  const [error, setError] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);
  const navigate = useNavigate();

  useEffect(getAllStudents, [token]);

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

  function getAllStudents() {
    axios
      .get("http://localhost:3001/api/students", { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách học sinh.");
      });
  }
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://localhost:3001/api/studentsUpload", formData)
        .then((response) => {
          getAllStudents();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleAddDepartment = () => {
    if (newStudent.code && newStudent.name && newStudent.year && newStudent.semester && newStudent.state) {
      // Gọi API để thêm học sinh mới
      axios
        .post("http://localhost:3001/api/students", newStudent, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách học sinh
          if (res.status !== 400) {
            setStudents([...students, res.data]);
            setIsOpenAddModal(false);
            setNewStudent({});
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin học sinh.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditDepartment = () => {
    // Gọi API để sửa học sinh
    if (editStudent.name && editStudent.code && editStudent.year && editStudent.semester && editStudent.state) {
      axios
        .put(`http://localhost:3001/api/students/${editStudent._id}`, editStudent, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách học sinh
          if (res.status !== 400) {
            const updatedStudent = students.map((student) => {
              if (student._id === editStudent._id) {
                return { ...student, ...editStudent };
              }
              return student;
            });
            setStudents(updatedStudent);

            setEditStudent({});
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

  const handleDeleteStudent = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa học sinh
    axios
      .delete(`http://localhost:3001/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách học sinh
        const updatedStudent = students.filter((student) => student._id !== id);
        setStudents(updatedStudent);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa học sinh.");
      });
  };
  const handleSearchDepartment = () => {
    axios
      .get(`http://localhost:3001/api/students?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được học sinh");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewStudent({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditStudent({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeEditState = (value) => {
    setEditStudent({ ...editStudent, state: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddState = (value) => {
    setNewStudent({ ...newStudent, state: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleChangeEditYear = (value) => {
    setEditStudent({ ...editStudent, year: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddYear = (value) => {
    setNewStudent({ ...newStudent, year: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleChangeEditSemester = (value) => {
    setEditStudent({ ...editStudent, semester: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddSemester = (value) => {
    setNewStudent({ ...newStudent, semester: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeInputAdd = (value) => {
    setNewStudent(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditStudent(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý học sinh</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchDepartment} />
        <div className={cx("importFile")}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <button onClick={handleUpload}>Tải lên</button>
        </div>
        <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
          Thêm học sinh
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã học sinh</th>
              <th>Tên học sinh</th>
              <th>Tên ngành</th>
              <th>Năm học</th>
              <th>Kỳ học</th>
              <th>Trạng thái</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {students.map((student, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{student.code} </div>
                </td>
                <td>
                  <div>{student.name} </div>
                </td>
                <td>
                  <div>{student.major} </div>
                </td>
                <td>
                  <div>{student.year} </div>
                </td>
                <td>
                  <div>{student.semester} </div>
                </td>

                <td>
                  <div>{student.state} </div>
                </td>
                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(student._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {idActiveRow === student._id && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditStudent(student);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === student._id && (
                    <DeleteModal
                      title={`Xóa học sinh ${student.name}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={student._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteStudent}
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
          name="Thêm mới học sinh"
          fields={[
            ["Mã học sinh", "code"],
            ["Tên học sinh", "name"],
            ["Tên ngành", "major"],
          ]}
          newData={newStudent}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddDepartment}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Năm học",
              index: 3,
              onSelectionChange: handleChangeAddYear,
              api: "schoolYears",
              nameData: "year",
            },
            {
              title: "Kỳ học",
              index: 4,
              onSelectionChange: handleChangeAddSemester,
              api: "schoolYears",
              nameData: "semester",
            },
            {
              title: "Trạng thái",
              index: 5,
              onSelectionChange: handleChangeAddState,
              selfData: [
                { name: "Đang làm" },
                { name: "Không làm" },
                { name: "Hoàn thành KLTN" },
                { name: "Không hoàn thành KLTN" },
              ],
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa học sinh"
          fields={[
            ["Mã học sinh", "code"],
            ["Tên học sinh", "name"],
            ["Tên ngành", "major"],
          ]}
          newData={editStudent}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditDepartment}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Năm học",
              index: 3,
              onSelectionChange: handleChangeEditYear,
              api: "schoolYears",
              oldData: editStudent.nameMajor,
              nameData: "year",
            },
            {
              title: "Kỳ học",
              index: 4,
              onSelectionChange: handleChangeEditSemester,
              api: "schoolYears",
              oldData: editStudent.nameMajor,
              nameData: "semester",
            },
            {
              title: "Trạng thái",
              index: 5,
              onSelectionChange: handleChangeEditState,
              selfData: [
                { name: "Đang làm" },
                { name: "Không làm" },
                { name: "Hoàn thành KLTN" },
                { name: "Không hoàn thành KLTN" },
              ],
              oldData: editStudent.state,
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default ManagerStudents;
