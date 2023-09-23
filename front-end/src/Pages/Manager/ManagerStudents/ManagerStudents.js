import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import classNames from "classnames/bind";
import styles from "./ManagerStudents.module.scss";

const cx = classNames.bind(styles);

function ManagerStudents() {
  const { major } = jwt_decode(Cookies.get("token")).userInfo;

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ major: major, state: "Đang làm" });
  const [editStudent, setEditStudent] = useState({});
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [file, setFile] = useState(null);

  const [isFilterByMajor, setIsFilterByMajor] = useState(true);

  const [error, setError] = useState("");
  const [errorImport, setErrorImport] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);
  const navigate = useNavigate();

  useEffect(getAllStudentsByMajor, [token]);

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
    setIsFilterByMajor(false);
    axios
      .get("http://localhost:3001/api/students", { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách sinh viên.");
      });
  }

  function getAllStudentsByMajor() {
    setIsFilterByMajor(true);

    axios
      .get(`http://localhost:3001/api/students?searchQuery=${major}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được sinh viên");
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

      const form = document.getElementById("formImport");

      axios
        .post("http://localhost:3001/api/studentsUpload", formData, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
        })
        .then((res) => {
          setErrorImport("");
          if (isFilterByMajor) getAllStudentsByMajor();
          else getAllStudents();

          setFile(null);
          if (form) {
            form.reset();
          }
        })

        .catch((error) => {
          setFile(null);
          if (form) {
            form.reset();
          }
          setErrorImport(error.response?.data.message);
        });
    }
  };

  const handleAddStudent = () => {
    if (newStudent.code && newStudent.name && newStudent.year && newStudent.semester && newStudent.state) {
      // Gọi API để thêm sinh viên mới
      axios
        .post("http://localhost:3001/api/students", newStudent, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách sinh viên
          if (res.status !== 400) {
            setStudents([...students, res.data]);
            setIsOpenAddModal(false);
            setNewStudent({ major: major, state: "Đang làm" });
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin sinh viên.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditStudent = () => {
    // Gọi API để sửa sinh viên
    if (editStudent.name && editStudent.code && editStudent.year && editStudent.semester && editStudent.state) {
      axios
        .put(`http://localhost:3001/api/students/${editStudent._id}`, editStudent, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách sinh viên
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
    // Gọi API để xóa sinh viên
    axios
      .delete(`http://localhost:3001/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách sinh viên
        const updatedStudent = students.filter((student) => student._id !== id);
        setStudents(updatedStudent);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa sinh viên.");
      });
  };
  const handleSearchStudent = () => {
    axios
      .get(`http://localhost:3001/api/students?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được sinh viên");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewStudent({ major: major, state: "Đang làm" });
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
      <h2 className={cx("title")}>Quản lý sinh viên làm KLTN</h2>
      <div className={cx("tab")}>
        <button onClick={getAllStudentsByMajor}>Sinh viên theo ngành</button>
        <button onClick={getAllStudents}>Sinh viên toàn trường</button>
      </div>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchStudent} />
        <div style={{ color: "red" }}>{errorImport}</div>
        {isFilterByMajor && (
          <div className={cx("function__allow")}>
            <form id="formImport" className={cx("importFile")}>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <button onClick={handleUpload}>Tải lên</button>
            </form>
            <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
              Thêm sinh viên
            </button>
          </div>
        )}
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã sinh viên</th>
              <th>Tên sinh viên</th>
              <th>Tên ngành</th>
              <th>Năm học</th>
              <th>Kỳ học</th>
              <th>Trạng thái</th>
              {isFilterByMajor && <th>Chức năng</th>}
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
                {isFilterByMajor && (
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
                        title={`Xóa sinh viên ${student.name}`}
                        isOpenDeleteModal={isOpenDeleteModal}
                        id={student._id}
                        handleCancleDelete={handleCancleDelete}
                        handleDelete={handleDeleteStudent}
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
          name="Thêm mới sinh viên"
          fields={[
            ["Mã sinh viên", "code"],
            ["Tên sinh viên", "name"],
          ]}
          newData={newStudent}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddStudent}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Năm học",
              index: 2,
              onSelectionChange: handleChangeAddYear,
              api: "schoolYears",
              nameData: "year",
            },
            {
              title: "Kỳ học",
              index: 3,
              onSelectionChange: handleChangeAddSemester,
              api: "schoolYears",
              nameData: "semester",
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa sinh viên"
          fields={[
            ["Mã sinh viên", "code"],
            ["Tên sinh viên", "name"],
          ]}
          newData={editStudent}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditStudent}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Năm học",
              index: 2,
              onSelectionChange: handleChangeEditYear,
              api: "schoolYears",
              oldData: editStudent.year,
              nameData: "year",
            },
            {
              title: "Kỳ học",
              index: 3,
              onSelectionChange: handleChangeEditSemester,
              api: "schoolYears",
              oldData: editStudent.semester,
              nameData: "semester",
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default ManagerStudents;
