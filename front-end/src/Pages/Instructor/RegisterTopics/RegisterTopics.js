import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, DeleteModal, Modal, ComboBox } from "~/components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import classNames from "classnames/bind";
import styles from "./RegisterTopics.module.scss";

const cx = classNames.bind(styles);

function RegisterTopic() {
  const { name, nameMajor } = jwt_decode(Cookies.get("token")).userInfo;

  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ nameTeacher: name });
  const [editTopic, setEditTopic] = useState({ nameTeacher: name });
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [file, setFile] = useState(null);

  const [isFilterByUserName, setIsFilterByUserName] = useState(true);

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");
  const [errorImport, setErrorImport] = useState("");
  const [errorAdd, setErrorAdd] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const wrapperBtnRef = useRef(null);
  const { token } = useContext(HeaderContext);

  useEffect(getAllTopics, [filterBySemester, filterByYear, isFilterByUserName]);

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

  function getAllTopics() {
    setErrorImport("");
    axios
      .get(
        `http://localhost:3001/api/topics?searchQuery=${searchQuery}${
          isFilterByUserName ? `&nameTeacher=${name}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: "http://localhost:3001" }
      )
      .then((response) => {
        setTopics(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách sinh viên.");
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
        .post("http://localhost:3001/api/topicsUpload", formData, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
        })
        .then((response) => {
          setErrorImport("");
          if (isFilterByUserName) getAllTopics();

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

  const handleAddTopic = () => {
    if (
      newTopic.describeTopic &&
      newTopic.nameTopic &&
      newTopic.nameMajor &&
      newTopic.nameTeacher &&
      newTopic.year &&
      newTopic.semester
    ) {
      // Gọi API để thêm đề tài mới
      axios
        .post("http://localhost:3001/api/topics", newTopic, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          if (res.status !== 400) {
            setTopics([...topics, res.data]);
            setIsOpenAddModal(false);
            setNewTopic({ nameTeacher: name });
            setErrorAdd("");
          }
        })
        .catch((err) => {
          setErrorAdd("Đã tồn tại thông tin đề tài.");
        });
    } else {
      setErrorAdd("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleEditTopic = () => {
    // Gọi API để sửa đề tài
    if (
      editTopic.nameTopic &&
      editTopic.describeTopic &&
      editTopic.nameMajor &&
      editTopic.nameTeacher &&
      editTopic.year &&
      editTopic.semester
    ) {
      axios
        .put(`http://localhost:3001/api/topics/${editTopic._id}`, editTopic, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          if (res.status !== 400) {
            const updatedStudent = topics.map((topic) => {
              if (topic._id === editTopic._id) {
                return { ...topic, ...res.data };
              }
              return topic;
            });
            setTopics(updatedStudent);

            setEditTopic({ nameTeacher: name });
            setErrorEdit("");
            setIdActiveRow(null);
            setIsOpenEditModal(false);
          }
        })
        .catch((err) => {
          setErrorEdit("Đề tài đã tồn tại!.");
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleDeleteTopic = (id) => {
    setIsOpenDeleteModal(false);
    // Gọi API để xóa đề tài
    axios
      .delete(`http://localhost:3001/api/topics/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách đề tài
        const updatedStudent = topics.filter((topic) => topic._id !== id);
        setTopics(updatedStudent);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa đề tài.");
      });
  };

  const handleCancleDelete = () => {
    setIsOpenDeleteModal(false);
    setIdActiveRow(null);
  };
  const handleCancleAdd = () => {
    setIsOpenAddModal(false);
    setNewTopic({ nameTeacher: name });
    setErrorAdd("");
    setIdActiveRow(null);
  };
  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setEditTopic({ nameTeacher: name });
    setErrorEdit("");
    setIdActiveRow(null);
  };

  const handleChangeInputAdd = (value) => {
    setNewTopic(value);
  };
  const handleChangeInputEdit = (value) => {
    setEditTopic(value);
  };

  const handleChangeEditMajor = (value) => {
    setEditTopic({ ...editTopic, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddMajor = (value) => {
    setNewTopic({ ...newTopic, nameMajor: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleChangeEditYear = (value) => {
    setEditTopic({ ...editTopic, year: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddYear = (value) => {
    setNewTopic({ ...newTopic, year: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleChangeEditSemester = (value) => {
    setEditTopic({ ...editTopic, semester: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };
  const handleChangeAddSemester = (value) => {
    setNewTopic({ ...newTopic, semester: value }); // Lưu giá trị đã chọn vào trạng thái của thành phần cha
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Đăng ký đề tài hướng dẫn</h2>
      <div className={cx("tab")}>
        <button
          onClick={() => {
            setIsFilterByUserName(true);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Đề tài đã đăng ký
        </button>
        <button
          onClick={() => {
            setIsFilterByUserName(false);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Đề tài toàn trường
        </button>
      </div>
      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={getAllTopics} />
        <div style={{ color: "red" }}>{errorImport}</div>
        {isFilterByUserName && (
          <div className={cx("function__allow")}>
            <form id="formImport" className={cx("importFile")}>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
              <button onClick={handleUpload}>Tải lên</button>
            </form>
            <button className={cx("btn", "btn-add")} onClick={() => setIsOpenAddModal(true)}>
              Thêm đề tài
            </button>
          </div>
        )}
      </div>
      <div className={cx("filter-comboBox")}>
        <ComboBox
          hasTitle={false}
          onSelectionChange={handleChangeFilterYear}
          api="schoolYears"
          nameData="year"
          customStyle={{ width: "200px", marginBottom: "20px" }}
          oldData={filterByYear}
          defaultDisplay="Chọn năm học"
        />
        <ComboBox
          hasTitle={false}
          onSelectionChange={handleChangeFilterSemester}
          api="schoolYears"
          nameData="semester"
          customStyle={{ width: "200px", marginBottom: "20px" }}
          oldData={filterBySemester}
          defaultDisplay="Chọn kỳ học"
        />
      </div>
      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên đề tài</th>
              <th>Mô tả</th>
              <th>Tên ngành</th>
              {!isFilterByUserName && <th>Giáo viên hướng dẫn</th>}
              <th>Năm học</th>
              <th>Học kỳ</th>
              {isFilterByUserName && <th>Chức năng</th>}
            </tr>
          </thead>

          {topics.map((topic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{topic.nameTopic} </div>
                </td>
                <td>
                  <div>{topic.describeTopic} </div>
                </td>
                <td>
                  <div>{topic.nameMajor} </div>
                </td>
                {!isFilterByUserName && (
                  <td>
                    <div>{topic.nameTeacher} </div>
                  </td>
                )}
                <td>
                  <div>{topic.year} </div>
                </td>
                <td>
                  <div>{topic.semester} </div>
                </td>
                {isFilterByUserName && (
                  <td className={cx("column__functions")}>
                    <button className={cx("btn-more")}>
                      <span
                        className="material-symbols-outlined"
                        onClick={(e) => {
                          setIdActiveRow(topic._id);
                          e.stopPropagation();
                        }}
                      >
                        more_horiz
                      </span>
                    </button>

                    {idActiveRow === topic._id && (
                      <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                        <button className={cx("btn")} onClick={() => setIsOpenDeleteModal(true)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditTopic(topic);
                            setIsOpenEditModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                    )}
                    {idActiveRow === topic._id && (
                      <DeleteModal
                        title={`Xóa đề tài ${topic.nameTopic}`}
                        isOpenDeleteModal={isOpenDeleteModal}
                        id={topic._id}
                        handleCancleDelete={handleCancleDelete}
                        handleDelete={handleDeleteTopic}
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
          name="Thêm mới đề tài"
          fields={[
            ["Tên đề tài", "nameTopic"],
            ["Mô tả", "describeTopic"],
          ]}
          newData={newTopic}
          error={errorAdd}
          handleCancle={handleCancleAdd}
          handleLogic={handleAddTopic}
          handleChangeInput={handleChangeInputAdd}
          indexsComboBox={[
            {
              title: "Tên ngành",
              index: 2,
              onSelectionChange: handleChangeAddMajor,
              api: `majors?nameMajor=${nameMajor}`,
              nameData: "nameMajor",
            },
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
          ]}
        />
      )}
      {isOpenEditModal && (
        <Modal
          name="Sửa đề tài"
          fields={[
            ["Tên đề tài", "nameTopic"],
            ["Mô tả", "describeTopic"],
          ]}
          newData={editTopic}
          error={errorEdit}
          handleCancle={handleCancleEdit}
          handleLogic={handleEditTopic}
          handleChangeInput={handleChangeInputEdit}
          indexsComboBox={[
            {
              title: "Tên ngành",
              index: 2,
              onSelectionChange: handleChangeEditMajor,
              api: `majors?major=${nameMajor}`,
              nameData: "nameMajor",
              oldData: editTopic.nameMajor,
            },
            {
              title: "Năm học",
              index: 3,
              onSelectionChange: handleChangeEditYear,
              api: "schoolYears",
              oldData: editTopic.year,
              nameData: "year",
            },
            {
              title: "Kỳ học",
              index: 4,
              onSelectionChange: handleChangeEditSemester,
              api: "schoolYears",
              oldData: editTopic.semester,
              nameData: "semester",
            },
          ]}
        />
      )}
    </DefaultLayout>
  );
}

export default RegisterTopic;
