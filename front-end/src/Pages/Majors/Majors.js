import "./Majors.scss";
import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

function Majors() {
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState({ nameDepartment: "", name: "", code: "", nameHead: "", codeHead: "" });
  const [editMajor, setEditMajor] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [error, setError] = useState("");

  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(() => {
    // Gọi API để lấy danh sách ngành
    axios
      .get("http://localhost:3001/api/majors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMajors(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách ngành.");
      });
  }, [token]);

  const handleAddMajor = () => {
    if (newMajor.code && newMajor.name && newMajor.nameDepartment && newMajor.codeHead && newMajor.nameHead) {
      if (!/^[0-9]{7}$/.test(newMajor.code)) {
        setErrorAdd("Mã ngành không đúng định dạng (7 số).");
        return;
      }
      if (newMajor.name.length > 50) {
        setErrorAdd("Tên ngành phải ít hơn 50 ký tự.");
        return;
      }
      if (!/^[A-Z]{3}\d{3}$/.test(newMajor.codeHead)) {
        setErrorAdd("Mã trưởng ngành không đúng định dạng (3 chữ in hoa + 3 số).");
        return;
      }
      if (newMajor.nameHead.length > 30) {
        setErrorAdd("Tên ngành phải ít hơn 30 ký tự.");
        return;
      }
      setOpenAddModal(false);
      // Gọi API để thêm ngành mới
      axios
        .post("http://localhost:3001/api/majors", newMajor, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách ngành
          setMajors([...majors, res.data]);

          setErrorAdd("");
        })
        .catch((err) => {
          setErrorAdd("Không thể thêm ngành mới.");
        });
      setNewMajor({ nameDepartment: "", name: "", code: "", nameHead: "", codeHead: "" });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEdiMajor = () => {
    // Gọi API để sửa ngành

    if (editMajor.nameDepartment && editMajor.name && editMajor.code && editMajor.nameHead && editMajor.codeHead) {
      if (!/^[0-9]{7}$/.test(editMajor.code)) {
        setErrorEdit("Mã ngành không đúng định dạng (6 số).");
        return;
      }
      if (editMajor.name.length > 50) {
        setErrorEdit("Tên ngành phải ít hơn 50 ký tự.");
        return;
      }
      if (!/^[A-Z]{3}\d{3}$/.test(editMajor.codeHead)) {
        setErrorEdit("Mã trưởng ngành không đúng định dạng (3 chữ in hoa + 3 số).");
        return;
      }
      if (editMajor.nameHead.length > 30) {
        setErrorEdit("Tên ngành phải ít hơn 30 ký tự.");
        return;
      }

      axios
        .put(`http://localhost:3001/api/majors/${editMajor._id}`, editMajor, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          // Cập nhật danh sách ngành

          const updatedMajors = majors.map((major) => {
            if (major._id === editMajor._id) {
              return { ...major, ...editMajor };
            }
            return major;
          });
          setMajors(updatedMajors);

          setEditMajor(null);
          setErrorEdit("");
        })
        .catch((err) => {
          setErrorEdit("Không thể sửa ngành.");
        });
    }
  };

  const handleDeleteMajor = (id) => {
    setOpenDeleteModal(false);
    // Gọi API để xóa ngành
    axios
      .delete(`http://localhost:3001/api/majors/${id}`, {
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
      .get(`http://localhost:3001/api/majors?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMajors(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được ngành");
      });
  };

  const handleSelectionChangeEdit = (value) => {
    setEditMajor({ ...editMajor, nameDepartment: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleSelectionChangeAdd = (value) => {
    setNewMajor({ ...newMajor, nameDepartment: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  return (
    <DefaultLayout>
      <div className="majors">
        <h2 className="majors__title">Quản lý ngành</h2>
        <div className="majors__function">
          <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchMajor} />
          <button className="majors__btn majors__btn-add" onClick={() => setOpenAddModal(true)}>
            Thêm ngành
          </button>
        </div>

        <div>
          <table className="majors__db">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã ngành</th>
                <th>Tên ngành</th>
                <th>Tên khoa</th>
                <th>Mã trưởng ngành</th>
                <th>Tên trưởng ngành</th>
                <th>Chức năng</th>
              </tr>
            </thead>

            {majors.map((major, index) => (
              <tbody key={index}>
                {editMajor && editMajor._id === major._id ? (
                  <tr key={index}>
                    <td className="table__index">{index + 1}</td>

                    <td>
                      <input
                        className="majors__input"
                        type="text"
                        value={editMajor.code}
                        onChange={(e) => setEditMajor({ ...editMajor, code: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="majors__input"
                        type="text"
                        value={editMajor.name}
                        onChange={(e) => setEditMajor({ ...editMajor, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <ComboBox onSelectionChange={handleSelectionChangeEdit} api={"departments"} />
                    </td>
                    <td>
                      <input
                        className="majors__input"
                        type="text"
                        value={editMajor.codeHead}
                        onChange={(e) => setEditMajor({ ...editMajor, codeHead: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="majors__input"
                        type="text"
                        value={editMajor.nameHead}
                        onChange={(e) => setEditMajor({ ...editMajor, nameHead: e.target.value })}
                      />
                    </td>
                    <td>
                      <button
                        className="majors__btn"
                        onClick={() => {
                          setEditMajor(null);
                          setErrorEdit("");
                        }}
                      >
                        Hủy
                      </button>
                      <button className="majors__btn" onClick={handleEdiMajor}>
                        Lưu
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="table__index">{index + 1}</td>

                    <td>
                      <div>{major.code} </div>
                    </td>
                    <td>
                      <div>{major.name} </div>
                    </td>
                    <td>
                      <div>{major.nameDepartment} </div>
                    </td>
                    <td>
                      <div>{major.codeHead} </div>
                    </td>
                    <td>
                      <div>{major.nameHead} </div>
                    </td>
                    <td className="majors__wrap-btn">
                      <button
                        className="majors__btn"
                        onClick={() => {
                          setEditMajor(major);
                        }}
                      >
                        Sửa
                      </button>
                      <button className="majors__btn" onClick={() => setOpenDeleteModal(true)}>
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
                          <button className="modal__btn" onClick={() => handleDeleteMajor(major._id)}>
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
          {errorEdit && (
            <div className="modal__message" style={{ "margin-top": "20px" }}>
              {errorEdit}
            </div>
          )}
        </div>
      </div>

      {openAddModal && (
        <div>
          <div className="modal">
            <div className="modal__title">Thêm mới</div>
            <div className="modal__form">
              <div className="modal__row">
                <span className="modal__field">
                  Mã ngành<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <input
                    type="text"
                    value={newMajor.code}
                    onChange={(e) => setNewMajor({ ...newMajor, code: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal__row">
                <span className="modal__field">
                  Tên ngành<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <input
                    type="text"
                    value={newMajor.name}
                    onChange={(e) => setNewMajor({ ...newMajor, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal__row">
                <span className="modal__field">
                  Thuộc khoa<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <ComboBox onSelectionChange={handleSelectionChangeAdd} api={"departments"} />
                </div>
              </div>

              <div className="modal__row">
                <span className="modal__field">
                  Mã trưởng ngành<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <input
                    type="text"
                    value={newMajor.codeHead}
                    onChange={(e) => setNewMajor({ ...newMajor, codeHead: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal__row">
                <span className="modal__field">
                  Tên trưởng ngành<span style={{ color: "red" }}>*</span>
                </span>
                <div className="modal__wrap-input">
                  <input
                    type="text"
                    value={newMajor.nameHead}
                    onChange={(e) => setNewMajor({ ...newMajor, nameHead: e.target.value })}
                  />
                </div>
              </div>
              {errorAdd && <div className="modal__message">{errorAdd}</div>}
              <div className="modal__btns">
                <button
                  className="modal__btn"
                  onClick={() => {
                    setOpenAddModal(false);
                    setNewMajor({ nameDepartment: "", name: "", code: "", nameHead: "", codeHead: "" });
                    setError("");
                  }}
                >
                  Hủy
                </button>
                <button className="modal__btn" onClick={handleAddMajor}>
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

export default Majors;
