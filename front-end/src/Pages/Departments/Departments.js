import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./Departments.module.scss";

const cx = classNames.bind(styles);

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({});
  const [editDepartment, setEditDepartment] = useState({});
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [error, setError] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(() => {
    // Gọi API để lấy danh sách khoa
    axios
      .get("http://localhost:3001/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách khoa.");
      });
  }, [token]);

  const handleAddDepartment = () => {
    if (newDepartment.code && newDepartment.name && newDepartment.describe) {
      // Gọi API để thêm khoa mới
      axios
        .post("http://localhost:3001/api/departments", newDepartment, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách khoa
          if (res.status !== 400) {
            setDepartments([...departments, res.data]);
            setIsOpenAddModal(false);
            setNewDepartment({});
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin khoa.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditDepartment = () => {
    // Gọi API để sửa khoa
    if (editDepartment.name && editDepartment.code && editDepartment.describe) {
      axios
        .put(`http://localhost:3001/api/departments/${editDepartment._id}`, editDepartment, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách khoa
          if (res.status !== 400) {
            const updatedDepartments = departments.map((department) => {
              if (department._id === editDepartment._id) {
                return { ...department, ...editDepartment };
              }
              return department;
            });
            setDepartments(updatedDepartments);

            setEditDepartment({});
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit("Khoa đã tồn tại!.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteDepartment = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa khoa
    axios
      .delete(`http://localhost:3001/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách khoa
        const updatedDepartments = departments.filter((department) => department._id !== id);
        setDepartments(updatedDepartments);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa khoa.");
      });
  };
  const handleSearchDepartment = () => {
    axios
      .get(`http://localhost:3001/api/departments?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được khoa");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewDepartment({});
    setErrorAdd("");
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditDepartment({});
    setErrorEdit("");
  };
  const handleChangeInputAdd = (value) => {
    setNewDepartment(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditDepartment(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý khoa</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchDepartment} />
        <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
          Thêm khoa
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã khoa</th>
              <th>Tên khoa</th>
              <th>Mô tả khoa</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {departments.map((department, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{department.code} </div>
                </td>
                <td>
                  <div>{department.name} </div>
                </td>
                <td>
                  <div>{department.describe} </div>
                </td>

                <td>
                  <button className={cx("btn-more")}>
                    <span
                      class="material-symbols-outlined"
                      onClick={() => setIdActiveRow(idActiveRow === department._id ? null : department._id)}
                    >
                      more_horiz
                    </span>
                    {idActiveRow === department._id && (
                      <div className={cx("wrapper__btn")}>
                        <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                          <span class="material-symbols-outlined">delete</span>
                        </button>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditDepartment(department);
                            setIsOpenEditModal(true);
                          }}
                        >
                          <span class="material-symbols-outlined">edit</span>
                        </button>
                        <DeleteModal
                          title={`Xóa khoa ${department.name}`}
                          isOpenDeleteModal={isOpenDeleteModal}
                          id={department._id}
                          handleCancleDelete={handleCancleDelete}
                          handleDelete={handleDeleteDepartment}
                        />
                      </div>
                    )}
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenAddModal && (
        <Modal
          name="Thêm mới khoa"
          fields={[
            ["Mã khoa", "code"],
            ["Tên khoa", "name"],
            ["Mô tả khoa", "describe"],
          ]}
          newData={newDepartment}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddDepartment}
          handleChangeInput={handleChangeInputAdd}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa khoa"
          fields={[
            ["Mã khoa", "code"],
            ["Tên khoa", "name"],
            ["Mô tả khoa", "describe"],
          ]}
          newData={editDepartment}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditDepartment}
          handleChangeInput={handleChangeInputEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Departments;
