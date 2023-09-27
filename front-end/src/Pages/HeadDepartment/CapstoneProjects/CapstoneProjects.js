import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, Modal, DeleteModal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./CapstoneProjects.module.scss";

const cx = classNames.bind(styles);

function CapstoneProjects() {
  const [capstoneProjects, setCapstoneProjects] = useState([]);
  const [newCapstoneProject, setNewCapstoneProject] = useState({});
  const [editCapstoneProject, setEditCapstoneProject] = useState({});
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
    // Gọi API để lấy danh sách học phần KLTN
    axios
      .get("http://localhost:3001/api/capstoneProjects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCapstoneProjects(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách học phần KLTN.");
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
  const handleAddMajor = () => {
    if (
      newCapstoneProject.codeCapstoneProject &&
      newCapstoneProject.nameCapstoneProject &&
      newCapstoneProject.nameMajor &&
      newCapstoneProject.credit
    ) {
      // Gọi API để thêm học phần KLTN mới
      axios
        .post("http://localhost:3001/api/capstoneProjects", newCapstoneProject, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status !== 400) {
            setCapstoneProjects([...capstoneProjects, res.data]);
            setIsOpenAddModal(false);
            setErrorAdd("");
            setNewCapstoneProject({});
          }
          // Cập nhật danh sách học phần KLTN
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin học phần KLTN.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEdiMajor = () => {
    // Gọi API để sửa học phần KLTN

    if (
      editCapstoneProject.nameMajor &&
      editCapstoneProject.nameCapstoneProject &&
      editCapstoneProject.codeCapstoneProject &&
      editCapstoneProject.credit
    ) {
      axios
        .put(`http://localhost:3001/api/capstoneProjects/${editCapstoneProject._id}`, editCapstoneProject, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách học phần KLTN
          if (res.status !== 400) {
            const updatedCapstoneProjects = capstoneProjects.map((capstoneProject) => {
              if (capstoneProject._id === editCapstoneProject._id) {
                return { ...capstoneProject, ...res.data };
              }
              return capstoneProject;
            });
            setCapstoneProjects(updatedCapstoneProjects);

            setEditCapstoneProject({});
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit("Học phần KLTN đã tồn tại.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteCapstoneProject = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa học phần KLTN
    axios
      .delete(`http://localhost:3001/api/capstoneProjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách học phần KLTN
        const updatedCapstoneProjects = capstoneProjects.filter((capstoneProject) => capstoneProject._id !== id);
        setCapstoneProjects(updatedCapstoneProjects);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa học phần KLTN.");
      });
  };
  const handleSearchCapstoneProject = () => {
    axios
      .get(`http://localhost:3001/api/capstoneProjects?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCapstoneProjects(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được học phần KLTN");
      });
  };

  const handleChangeEditNameCapstoneProject = (value) => {
    setEditCapstoneProject({ ...editCapstoneProject, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddNameCapstoneProject = (value) => {
    setNewCapstoneProject({ ...newCapstoneProject, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewCapstoneProject({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditCapstoneProject({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeInputAdd = (value) => {
    setNewCapstoneProject(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditCapstoneProject(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý học phần KLTN</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchCapstoneProject} />
        <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
          Thêm học phần KLTN
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Tên ngành</th>
              <th>Số tín chỉ</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {capstoneProjects.map((capstoneProject, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>

                <td>
                  <div>{capstoneProject.codeCapstoneProject} </div>
                </td>
                <td>
                  <div>{capstoneProject.nameCapstoneProject} </div>
                </td>
                <td>
                  <div>{capstoneProject.nameMajor} </div>
                </td>
                <td>
                  <div>{capstoneProject.credit} </div>
                </td>
                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(capstoneProject._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {idActiveRow === capstoneProject._id && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditCapstoneProject(capstoneProject);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === capstoneProject._id && (
                    <DeleteModal
                      title={`Xóa học phần ${capstoneProject.nameCapstoneProject}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={capstoneProject._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteCapstoneProject}
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
          name="Thêm mới học phần KLTN"
          fields={[
            ["Mã học phần", "codeCapstoneProject"],
            ["Tên học phần", "nameCapstoneProject"],
            ["Số tín chỉ", "credit"],
          ]}
          newData={newCapstoneProject}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddMajor}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Thuộc ngành",
              index: 2,
              onSelectionChange: handleChangeAddNameCapstoneProject,
              api: "majors",
              nameData: "nameMajor",
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa học phần KLTN"
          fields={[
            ["Mã học phần", "codeCapstoneProject"],
            ["Tên học phần", "nameCapstoneProject"],
            ["Số tín chỉ", "credit"],
          ]}
          newData={editCapstoneProject}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEdiMajor}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Thuộc ngành",
              index: 2,
              onSelectionChange: handleChangeEditNameCapstoneProject,
              api: "majors",
              oldData: editCapstoneProject.nameMajor,
              nameData: "nameMajor",
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default CapstoneProjects;
