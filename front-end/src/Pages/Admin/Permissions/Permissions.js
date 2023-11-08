import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./Permissions.module.scss";

const cx = classNames.bind(styles);

function Permissions() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({});
  const [editPermission, setEditPermission] = useState({});
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
    // Gọi API để lấy danh sách khoa
    axios
      .get(`${host}:${port}/api/permissions`, { withCredentials: true, baseURL: `${host}:${port}` })
      .then((response) => {
        setPermissions(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách nhóm quyền.");
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

  const handleAddPermission = () => {
    if ((newPermission.codePermission, newPermission.namePermission && newPermission.describePermission)) {
      // Gọi API để thêm khoa mới
      axios
        .post(`${host}:${port}/api/permissions`, newPermission, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách khoa
          if (res.status !== 400) {
            setPermissions([...permissions, res.data]);
            setIsOpenAddModal(false);
            setNewPermission({});
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin nhóm quyền.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditPermission = () => {
    // Gọi API để sửa khoa
    if (editPermission.namePermission && editPermission.codePermission && editPermission.describePermission) {
      axios
        .put(`${host}:${port}/api/permissions/${editPermission._id}`, editPermission, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách khoa
          if (res.status !== 400) {
            const updatedPermissions = permissions.map((permission) => {
              if (permission._id === editPermission._id) {
                return { ...permission, ...editPermission };
              }
              return permission;
            });
            setPermissions(updatedPermissions);

            setEditPermission({});
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

  const handleDeletePermission = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa khoa
    axios
      .delete(`${host}:${port}/api/permissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách khoa
        const updatedPermissions = permissions.filter((permission) => permission._id !== id);
        setPermissions(updatedPermissions);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa khoa.");
      });
  };
  const handleSearchPermission = () => {
    axios
      .get(`${host}:${port}/api/permissions?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPermissions(res.data);
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
    setNewPermission({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditPermission({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeInputAdd = (value) => {
    setNewPermission(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditPermission(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý nhóm quyền</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchPermission} />
        <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
          Thêm nhóm quyền
        </button>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã nhóm quyền</th>
              <th>Tên nhóm quyền</th>
              <th>Mô tả</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {permissions.map((permission, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{permission.codePermission} </div>
                </td>
                <td>
                  <div>{permission.namePermission} </div>
                </td>
                <td>
                  <div>{permission.describePermission} </div>
                </td>

                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(permission._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {idActiveRow === permission._id && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditPermission(permission);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === permission._id && (
                    <DeleteModal
                      title={`Xóa nhóm quyền ${permission.namePermission}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={permission._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeletePermission}
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
          name="Thêm mới nhóm quyền"
          fields={[
            ["Mã nhóm quyền", "codePermission"],
            ["Tên nhóm quyền", "namePermission"],
            ["Mô tả", "describePermission"],
          ]}
          newData={newPermission}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddPermission}
          handleChangeInput={handleChangeInputAdd}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa nhóm quyền"
          fields={[
            ["Mã nhóm quyền", "codePermission"],
            ["Tên nhóm quyền", "namePermission"],
            ["Mô tả", "describePermission"],
          ]}
          newData={editPermission}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditPermission}
          handleChangeInput={handleChangeInputEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Permissions;
