import "./Departments.scss";
import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: "", code: "" });
  const [editDepartment, setEditDepartment] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

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
    if (newDepartment.code && newDepartment.name) {
      if (!/^[A-Z]{3}\d{2}$/.test(newDepartment.code)) {
        setError("Mã khoa không đúng định dạng (3 chữ in hoa + 2 số).");
        return;
      }
      if (newDepartment.name.length > 50) {
        setError("Tên khoa phải ít hơn 50 ký tự.");
        return;
      }
      setOpenAddModal(false);
      // Gọi API để thêm khoa mới
      axios
        .post("http://localhost:3001/api/departments", newDepartment, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách khoa
          setDepartments([...departments, res.data]);

          setError("");
        })
        .catch((err) => {
          setError("Không thể thêm khoa mới.");
        });
      setNewDepartment({ name: "", code: "" });
    } else {
      setError("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditDepartment = () => {
    // Gọi API để sửa khoa

    if (editDepartment.name && editDepartment.code) {
      if (!/^[A-Z]{3}\d{2}$/.test(editDepartment.code)) {
        return;
      }
      if (editDepartment.name.length > 50) {
        return;
      }
      axios
        .put(`http://localhost:3001/api/departments/${editDepartment._id}`, editDepartment, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          // Cập nhật danh sách khoa

          const updatedDepartments = departments.map((department) => {
            if (department._id === editDepartment._id) {
              return { ...department, ...editDepartment };
            }
            return department;
          });
          setDepartments(updatedDepartments);

          setEditDepartment(null);
          setError("");
        })
        .catch((err) => {
          setError("Không thể sửa khoa.");
        });
    }
  };

  const handleDeleteDepartment = (id) => {
    setOpenDeleteModal(false);
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
  return (
    <DefaultLayout>
      <div className="departments">
        <h2 className="departments__title">Quản lý khoa</h2>
        <div className="departments__function">
          <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchDepartment} />
          <button className="departments__btn departments__btn-add" onClick={() => setOpenAddModal(true)}>
            Thêm khoa
          </button>
        </div>

        <div>
          <table className="departments__db">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã khoa</th>
                <th>Tên khoa</th>
                <th>Chức năng</th>
              </tr>
            </thead>

            {departments.map((department, index) => (
              <tbody key={index}>
                {editDepartment && editDepartment._id === department._id ? (
                  <tr key={index}>
                    <td className="table__index">{index + 1}</td>
                    <td>
                      <input
                        className="departments__input"
                        type="text"
                        value={editDepartment.code}
                        onChange={(e) => setEditDepartment({ ...editDepartment, code: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="departments__input"
                        type="text"
                        value={editDepartment.name}
                        onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })}
                      />
                    </td>

                    <td>
                      <button className="departments__btn" onClick={() => setEditDepartment(null)}>
                        Hủy
                      </button>
                      <button className="departments__btn" onClick={handleEditDepartment}>
                        Lưu
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="table__index">{index + 1}</td>
                    <td>
                      <div>{department.code} </div>
                    </td>
                    <td>
                      <div>{department.name} </div>
                    </td>

                    <td className="departments__wrap-btn">
                      <button
                        className="departments__btn"
                        onClick={() => {
                          setEditDepartment(department);
                        }}
                      >
                        Sửa
                      </button>
                      <button className="departments__btn" onClick={() => setOpenDeleteModal(true)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                )}

                {openDeleteModal && (
                  <div>
                    <div className="modal">
                      <div className="modal__title">Xác nhận xóa</div>
                      <div className="modal__form">
                        <div className="modal__btns">
                          <button className="modal__btn" onClick={() => setOpenDeleteModal(false)}>
                            Hủy
                          </button>
                          <button className="modal__btn" onClick={() => handleDeleteDepartment(department._id)}>
                            Xác nhận
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="overlay"></div>
                  </div>
                )}
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {openAddModal && (
        <div>
          <div className="modal">
            <div className="modal__title">Thêm mới</div>
            <div className="modal__form">
              <div className="modal__row">
                <span className="modal__field">
                  Mã khoa<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <input
                    type="text"
                    value={newDepartment.code}
                    onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal__row">
                <span className="modal__field">
                  Tên khoa<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <input
                    type="text"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  />
                </div>
              </div>
              {error && <div className="modal__message">{error}</div>}
              <div className="modal__btns">
                <button
                  className="modal__btn"
                  onClick={() => {
                    setOpenAddModal(false);
                    setNewDepartment({ name: "", code: "" });
                    setError("");
                  }}
                >
                  Hủy
                </button>
                <button className="modal__btn" onClick={handleAddDepartment}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
          <div className="overlay"></div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default Departments;
