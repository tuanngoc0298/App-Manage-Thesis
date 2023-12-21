import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal, ComboBox } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ManagerUsers.module.scss";

const cx = classNames.bind(styles);

function ManagerUsers() {
  const url = process.env.REACT_APP_URL;

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [editUser, setEditUser] = useState({});

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [file, setFile] = useState(null);

  const [error, setError] = useState("");
  const [errorImport, setErrorImport] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);

  useEffect(getAllUsers, []);

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

  function getAllUsers() {
    setErrorImport("");
    axios
      .get(`${url}/api/managerUsers?searchQuery=${searchQuery}`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách người dùng.");
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
        .post(`${url}/api/managerUsersUpload`, formData, {
          withCredentials: true,
          baseURL: `${url}`,
        })
        .then((response) => {
          getAllUsers();
          setErrorImport(response.data);

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
          setErrorImport(error.response?.data);
        });
    }
  };

  const handleAddUser = () => {
    if (newUser.username && newUser.code && newUser.email && newUser.role) {
      // Gọi API để thêm người dùng mới
      axios
        .post(`${url}/api/managerUsers`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách người dùng

          setUsers([...users, res.data]);
          setIsOpenAddModal(false);
          setNewUser({});
          setErrorAdd("");
        })
        .catch((err) => {
          setErrorAdd(err.response.data);
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditUser = () => {
    // Gọi API để sửa người dùng
    if (editUser.code && editUser.username && editUser.email && editUser.role) {
      axios
        .put(`${url}/api/managerUsers/${editUser._id}`, editUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách người dùng

          getAllUsers();

          setEditUser({});
          setErrorEdit("");
          setIdActiveRow(null);
          setIsOpenEditModal(false);
        })
        .catch((err) => {
          setErrorEdit(err.response.data);
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteUser = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa người dùng
    axios
      .delete(`${url}/api/managerUsers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách người dùng
        const updatedUser = users.filter((user) => user._id !== id);
        setUsers(updatedUser);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa người dùng.");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewUser({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditUser({});
    setErrorEdit("");
    setIdActiveRow(null);
  };

  const handleChangeInputAdd = (value) => {
    setNewUser(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditUser(value);
  };

  const handleChangeEditRole = (value) => {
    setEditUser({ ...editUser, role: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddRole = (value) => {
    setNewUser({ ...newUser, role: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý người dùng</h2>

      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={getAllUsers} />
        <div style={{ color: "red" }}>{errorImport}</div>

        <div className={cx("function__allow")}>
          <form id="formImport" className={cx("importFile")}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <button onClick={handleUpload}>Tải lên</button>
          </form>
          <button
            className={cx("btn", "btn-add")}
            onClick={() => setIsOpenAddModal(true)}
          >
            Thêm người dùng
          </button>
        </div>
      </div>

      <div className={cx("data__container")}>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã người dùng</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Nhóm quyền</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {users.map((user, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{user.code} </div>
                </td>
                <td>
                  <div>{user.username} </div>
                </td>
                <td>
                  <div>{user.email} </div>
                </td>
                <td>
                  <div>{user.role} </div>
                </td>

                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(user._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {idActiveRow === user._id && (
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
                          setEditUser(user);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === user._id && (
                    <DeleteModal
                      title={`Xóa người dùng ${user.code}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={user._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteUser}
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
          name="Thêm mới người dùng"
          fields={[
            ["Mã người dùng", "code"],
            ["Tên đăng nhập", "username"],
            ["Email", "email"],
          ]}
          newData={newUser}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddUser}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Nhóm quyền",
              index: 3,
              onSelectionChange: handleChangeAddRole,
              api: `permissions`,
              nameData: "namePermission",
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa người dùng"
          fields={[
            ["Mã người dùng", "code"],
            ["Tên đăng nhập", "username"],
            ["Email", "email"],
          ]}
          newData={editUser}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditUser}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Nhóm quyền",
              index: 3,
              onSelectionChange: handleChangeEditRole,
              api: `permissions`,
              nameData: "namePermission",
              oldData: editUser.role,
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default ManagerUsers;
