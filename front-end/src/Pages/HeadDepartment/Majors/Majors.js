import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, Modal, DeleteModal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./Majors.module.scss";

const cx = classNames.bind(styles);

function Majors() {
  const url = process.env.REACT_APP_URL;

  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState({});
  const [editMajor, setEditMajor] = useState({});
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
    // Gọi API để lấy danh sách ngành
    axios
      .get(`/api/majors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMajors(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách ngành.");
      });
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperBtnRef.current &&
        !wrapperBtnRef.current.contains(event.target)
      ) {
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
    if (newMajor.codeMajor && newMajor.nameMajor && newMajor.nameDepartment) {
      // Gọi API để thêm ngành mới
      axios
        .post(`/api/majors`, newMajor, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status !== 400) {
            setMajors([...majors, res.data]);
            setIsOpenAddModal(false);
            setErrorAdd("");
            setNewMajor({});
          }
          // Cập nhật danh sách ngành
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin ngành.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEdiMajor = () => {
    // Gọi API để sửa ngành

    if (
      editMajor.nameDepartment &&
      editMajor.nameMajor &&
      editMajor.codeMajor
    ) {
      axios
        .put(`/api/majors/${editMajor._id}`, editMajor, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách ngành
          if (res.status !== 400) {
            const updatedMajors = majors.map((major) => {
              if (major._id === editMajor._id) {
                return { ...major, ...res.data };
              }
              return major;
            });
            setMajors(updatedMajors);

            setEditMajor({});
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit("Ngành đã tồn tại.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteMajor = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa ngành
    axios
      .delete(`/api/majors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách ngành
        const updatedMajors = majors.filter((major) => major._id !== id);
        setMajors(updatedMajors);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa ngành.");
      });
  };
  const handleSearchMajor = () => {
    axios
      .get(`/api/majors?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMajors(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được ngành");
      });
  };

  const handleChangeEditNameDepartment = (value) => {
    setEditMajor({ ...editMajor, nameDepartment: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddNameDepartment = (value) => {
    setNewMajor({ ...newMajor, nameDepartment: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewMajor({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditMajor({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeInputAdd = (value) => {
    setNewMajor(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditMajor(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý ngành</h2>
      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearchMajor}
        />
        <button
          className={cx("btn", "btn-add")}
          onClick={() => setIsOpenAddModal(true)}
        >
          Thêm ngành
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã ngành</th>
              <th>Tên ngành</th>
              <th>Thuộc khoa</th>
              <th>Tên trưởng ngành</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {majors.map((major, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>

                <td>
                  <div>{major.codeMajor} </div>
                </td>
                <td>
                  <div>{major.nameMajor} </div>
                </td>
                <td>
                  <div>{major.nameDepartment} </div>
                </td>
                <td>
                  <div>{major.nameHeadMajor} </div>
                </td>
                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(major._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>
                  {idActiveRow === major._id && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button
                        className={cx("btn")}
                        onClick={() => setIsOpenDeleteModal(true)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditMajor(major);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === major._id && (
                    <DeleteModal
                      title={`Xóa ngành ${major.nameMajor}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={major._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteMajor}
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
          name="Thêm mới ngành"
          fields={[
            ["Mã ngành", "codeMajor"],
            ["Tên ngành", "nameMajor"],
          ]}
          newData={newMajor}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddMajor}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Thuộc khoa",
              index: 2,
              onSelectionChange: handleChangeAddNameDepartment,
              api: "departments",
              nameData: "nameDepartment",
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa ngành"
          fields={[
            ["Mã ngành", "codeMajor"],
            ["Tên ngành", "nameMajor"],
          ]}
          newData={editMajor}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEdiMajor}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Thuộc khoa",
              index: 2,
              onSelectionChange: handleChangeEditNameDepartment,
              api: "departments",
              oldData: editMajor.nameDepartment,
              nameData: "nameDepartment",
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default Majors;
