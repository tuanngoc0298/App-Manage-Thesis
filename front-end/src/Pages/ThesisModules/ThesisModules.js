import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, Modal, DeleteModal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ThesisModules.module.scss";

const cx = classNames.bind(styles);

function ThesisModules() {
  const [thesisModules, setThesisModules] = useState([]);
  const [newThesisModule, setNewThesisModule] = useState({});
  const [editThesisModule, setEditThesisModule] = useState({});
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
      .get("http://localhost:3001/api/thesisModules", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setThesisModules(response.data);
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
    if (newThesisModule.code && newThesisModule.name && newThesisModule.nameMajor && newThesisModule.credit) {
      // Gọi API để thêm học phần KLTN mới
      axios
        .post("http://localhost:3001/api/thesisModules", newThesisModule, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.status !== 400) {
            setThesisModules([...thesisModules, res.data]);
            setIsOpenAddModal(false);
            setErrorAdd("");
            setNewThesisModule({});
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

    if (editThesisModule.nameMajor && editThesisModule.name && editThesisModule.code && editThesisModule.credit) {
      axios
        .put(`http://localhost:3001/api/thesisModules/${editThesisModule._id}`, editThesisModule, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách học phần KLTN
          if (res.status !== 400) {
            const updatedThesisModules = thesisModules.map((thesisModule) => {
              if (thesisModule._id === editThesisModule._id) {
                return { ...thesisModule, ...editThesisModule };
              }
              return thesisModule;
            });
            setThesisModules(updatedThesisModules);

            setEditThesisModule({});
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

  const handleDeleteThesisModule = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa học phần KLTN
    axios
      .delete(`http://localhost:3001/api/thesisModules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách học phần KLTN
        const updatedThesisModules = thesisModules.filter((thesisModule) => thesisModule._id !== id);
        setThesisModules(updatedThesisModules);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa học phần KLTN.");
      });
  };
  const handleSearchMajor = () => {
    axios
      .get(`http://localhost:3001/api/thesisModules?searchQuery=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setThesisModules(res.data);
      })
      .catch((err) => {
        setError("Không tìm kiếm được học phần KLTN");
      });
  };

  const handleChangeEditNameMajor = (value) => {
    setEditThesisModule({ ...editThesisModule, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddNameMajor = (value) => {
    setNewThesisModule({ ...newThesisModule, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewThesisModule({});
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditThesisModule({});
    setErrorEdit("");
    setIdActiveRow(null);
  };
  const handleChangeInputAdd = (value) => {
    setNewThesisModule(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditThesisModule(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Quản lý học phần KLTN</h2>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={handleSearchMajor} />
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

          {thesisModules.map((thesisModule, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>

                <td>
                  <div>{thesisModule.code} </div>
                </td>
                <td>
                  <div>{thesisModule.name} </div>
                </td>
                <td>
                  <div>{thesisModule.nameMajor} </div>
                </td>
                <td>
                  <div>{thesisModule.credit} </div>
                </td>
                <td className={cx("column__functions")}>
                  <button className={cx("btn-more")}>
                    <span
                      className="material-symbols-outlined"
                      onClick={(e) => {
                        setIdActiveRow(thesisModule._id);
                        e.stopPropagation();
                      }}
                    >
                      more_horiz
                    </span>
                  </button>

                  {idActiveRow === thesisModule._id && (
                    <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                      <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditThesisModule(thesisModule);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  {idActiveRow === thesisModule._id && (
                    <DeleteModal
                      title={`Xóa học phần ${thesisModule.name}`}
                      isOpenDeleteModal={isOpenDeleteModal}
                      id={thesisModule._id}
                      handleCancleDelete={handleCancleDelete}
                      handleDelete={handleDeleteThesisModule}
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
            ["Mã học phần", "code"],
            ["Tên học phần", "name"],
            ["Số tín chỉ", "credit"],
          ]}
          newData={newThesisModule}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddMajor}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Thuộc ngành",
              index: 2,
              onSelectionChange: handleChangeAddNameMajor,
              api: "majors",
            },
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa học phần KLTN"
          fields={[
            ["Mã học phần", "code"],
            ["Tên học phần", "name"],
            ["Số tín chỉ", "credit"],
          ]}
          newData={editThesisModule}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEdiMajor}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Thuộc ngành",
              index: 2,
              onSelectionChange: handleChangeEditNameMajor,
              api: "majors",
              oldData: editThesisModule.nameMajor,
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default ThesisModules;
