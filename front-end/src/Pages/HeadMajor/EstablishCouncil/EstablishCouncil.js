import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./EstablishCouncil.module.scss";

const cx = classNames.bind(styles);

function EstablishCouncil() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [councils, setCouncils] = useState([]);
  const [idActiveRow, setIdActiveRow] = useState(null);

  const [editCouncil, setEditCouncil] = useState({});

  const [isTabCouncil, setIsTabCouncil] = useState(false);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  const [error, setError] = useState("");

  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);
  const wrapperBtnRef = useRef(null);

  useEffect(getAllStudents, [filterBySemester, filterByYear, isTabCouncil]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperBtnRef.current && !wrapperBtnRef.current.contains(event.target)) {
        setIdActiveRow(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  function getAllStudents() {
    axios
      .get(
        `${host}:${port}/api/establishCouncil?searchQuery=${searchQuery}${
          isTabCouncil ? `&isTabCouncil=${true}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${host}:${port}` }
      )
      .then((res) => {
        setCouncils(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách hội đồng bảo vệ.");
      });
  }

  const handleEstablishCouncil = () => {
    if (
      editCouncil.protectionCouncil?.nameCouncil &&
      editCouncil.protectionCouncil?.describeCouncil &&
      editCouncil.protectionCouncil?.shift &&
      editCouncil.protectionCouncil?.time &&
      editCouncil.protectionCouncil?.roomCode &&
      editCouncil.protectionCouncil?.members?.chairperson &&
      editCouncil.protectionCouncil?.members?.secretary &&
      editCouncil.protectionCouncil?.members?.commissioner
    ) {
      axios
        .put(`${host}:${port}/api/establishCouncil/${editCouncil._id}`, editCouncil, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setEditCouncil({});
          setIsOpenEditModal(false);
          getAllStudents();
          setErrorEdit("");
        })
        .catch((err) => {
          setErrorEdit(err.response.data.error);
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleCancleEdit = () => {
    setIsOpenEditModal(false);

    setErrorEdit("");
    setEditCouncil({});
  };
  const handleCancleDetail = () => {
    setIsOpenDetailModal(false);
    setEditCouncil({});
  };
  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };
  const handleChangeChairperson = (value) => {
    setEditCouncil({
      ...editCouncil,
      protectionCouncil: {
        ...editCouncil.protectionCouncil,
        members: { ...editCouncil.protectionCouncil?.members, chairperson: value },
      },
    });
  };
  const handleChangeSecretary = (value) => {
    setEditCouncil({
      ...editCouncil,
      protectionCouncil: {
        ...editCouncil.protectionCouncil,
        members: { ...editCouncil.protectionCouncil?.members, secretary: value },
      },
    });
  };
  const handleChangeCommissioner = (value) => {
    setEditCouncil({
      ...editCouncil,
      protectionCouncil: {
        ...editCouncil.protectionCouncil,
        members: { ...editCouncil.protectionCouncil?.members, commissioner: value },
      },
    });
  };
  const handleChangeShift = (value) => {
    setEditCouncil({
      ...editCouncil,
      protectionCouncil: {
        ...editCouncil.protectionCouncil,
        shift: value,
      },
    });
  };
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Thành lập hội đồng bảo vệ</h2>
      <div className={cx("tab")}>
        <button
          onClick={() => {
            setIsTabCouncil(false);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên
        </button>
        <button
          onClick={() => {
            setIsTabCouncil(true);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Hội đồng bảo vệ
        </button>
      </div>

      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={getAllStudents} />
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
              {isTabCouncil ? <th>Tên HĐBV</th> : <th>Mã sinh viên</th>}
              <th>Tên sinh viên</th>
              {isTabCouncil && <th>Tên đề tài</th>}
              {isTabCouncil && <th>Trạng thái</th>}
              <th>Năm học</th>
              <th>Kỳ học</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {councils.map((council, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                {isTabCouncil ? (
                  <td>
                    <div>{council.protectionCouncil?.nameCouncil} </div>
                  </td>
                ) : (
                  <td>
                    <div>{council.codeStudent} </div>
                  </td>
                )}

                <td>
                  <div>{council.nameStudent} </div>
                </td>
                {isTabCouncil && (
                  <td>
                    <div>{council.nameTopic} </div>
                  </td>
                )}
                {isTabCouncil && (
                  <td>
                    <div>{council.protectionCouncil?.stateProtection} </div>
                  </td>
                )}

                <td>
                  <div>{council.yearTopic} </div>
                </td>
                <td>
                  <div>{council.semesterTopic} </div>
                </td>

                {isTabCouncil ? (
                  <td className={cx("column__functions")}>
                    <button className={cx("btn-more")}>
                      <span
                        className="material-symbols-outlined"
                        onClick={(e) => {
                          setIdActiveRow(council._id);
                          e.stopPropagation();
                        }}
                      >
                        more_horiz
                      </span>
                    </button>

                    {idActiveRow === council._id && (
                      <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditCouncil({
                              ...council,
                              protectionCouncil: { stateProtection: "Chưa bảo vệ", ...council.protectionCouncil },
                            });
                            setIsOpenDetailModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditCouncil({
                              ...council,
                              protectionCouncil: { stateProtection: "Chưa bảo vệ", ...council.protectionCouncil },
                            });
                            setIsOpenEditModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                    )}
                  </td>
                ) : (
                  <td className={cx("column__functions")}>
                    <div className={cx("wrapper__btn-approve")}>
                      <button
                        className={cx("btn-approve")}
                        onClick={() => {
                          setEditCouncil({
                            ...council,
                            protectionCouncil: { stateProtection: "Chưa bảo vệ", ...council.protectionCouncil },
                          });
                          setIsOpenEditModal(true);
                        }}
                      >
                        Thành lập
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenEditModal && (
        <div>
          <div className={cx("modal")}>
            <div className={cx("modal-close")} onClick={handleCancleEdit}>
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className={cx("title-modal")}>Thành lập HĐBV</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên sinh viên:</span>
                    <span className={cx("details__content")}>{editCouncil.nameStudent}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Đề tài KLTN:</span>
                    <span className={cx("details__content")}>{editCouncil.nameTopic}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Năm học:</span>
                    <span className={cx("details__content")}>{editCouncil.yearTopic}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Kỳ học:</span>
                    <span className={cx("details__content")}>{editCouncil.semesterTopic}</span>
                  </div>
                </div>
                <div className={cx("details__wrapInput")}>
                  <span className={cx("details__title")}>
                    Tên HĐBV:
                    <span style={{ color: "red" }}>*</span>
                  </span>
                  <div className={cx("details__input")}>
                    <input
                      type="text"
                      value={editCouncil.protectionCouncil?.nameCouncil}
                      onChange={(e) => {
                        setEditCouncil({
                          ...editCouncil,
                          protectionCouncil: { ...editCouncil.protectionCouncil, nameCouncil: e.target.value },
                        });
                      }}
                    />
                  </div>
                </div>
                <div className={cx("form__comment")}>
                  <span className={cx("details__title")}>
                    Mô tả:
                    <span style={{ color: "red" }}>*</span>
                  </span>
                  <div>
                    <textarea
                      className={cx("form__textArea")}
                      value={editCouncil.protectionCouncil?.describeCouncil}
                      onChange={(e) => {
                        setEditCouncil({
                          ...editCouncil,
                          protectionCouncil: { ...editCouncil.protectionCouncil, describeCouncil: e.target.value },
                        });
                      }}
                    ></textarea>
                  </div>
                </div>

                <div className={cx("details__title")}>
                  Thành viên Hội đồng bảo vệ
                  <span style={{ color: "red" }}>*</span>
                </div>

                <div className={cx("details__members")}>
                  <ComboBox
                    title="Chủ tịch hội đồng"
                    customStyle={{ marginBottom: "10px" }}
                    isRequired={false}
                    api={`teachersByDepartment?nameTeacher=${editCouncil.nameTeacher}&nameCounterTeacher=${editCouncil.nameCounterTeacher}`}
                    nameData="name"
                    onSelectionChange={handleChangeChairperson}
                    oldData={editCouncil.protectionCouncil?.members?.chairperson}
                  />
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Giáo viên hướng dẫn:</span>
                    <span className={cx("details__content")}>{editCouncil.nameTeacher}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Giáo viên phản biện:</span>
                    <span className={cx("details__content")}>{editCouncil.nameCounterTeacher}</span>
                  </div>
                  <ComboBox
                    title="Thư ký"
                    customStyle={{ marginBottom: "10px" }}
                    isRequired={false}
                    api={`teachersByDepartment?nameTeacher=${editCouncil.nameTeacher}&nameCounterTeacher=${editCouncil.nameCounterTeacher}`}
                    nameData="name"
                    onSelectionChange={handleChangeSecretary}
                    oldData={editCouncil.protectionCouncil?.members?.secretary}
                  />
                  <ComboBox
                    title="Ủy viên"
                    customStyle={{ marginBottom: "10px" }}
                    isRequired={false}
                    api={`teachersByDepartment?nameTeacher=${editCouncil.nameTeacher}&nameCounterTeacher=${editCouncil.nameCounterTeacher}`}
                    nameData="name"
                    onSelectionChange={handleChangeCommissioner}
                    oldData={editCouncil.protectionCouncil?.members?.commissioner}
                  />
                </div>

                <div className={cx("details__title")}>
                  Lịch bảo vệ
                  <span style={{ color: "red" }}>*</span>
                </div>

                <div className={cx("details__schedule")}>
                  <ComboBox
                    title="Ca"
                    customStyle={{ marginBottom: "0" }}
                    customInput={{ width: "85px" }}
                    defaultDisplay="Chọn ca"
                    selfData={[{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }]}
                    isRequired={false}
                    onSelectionChange={handleChangeShift}
                    oldData={editCouncil.protectionCouncil?.shift}
                  />
                  <div className={cx("details__time")}>
                    <span className={cx("details__title")}>Ngày:</span>

                    <div className={cx("details__input")} style={{ width: "210px" }}>
                      <DatePicker
                        selected={editCouncil.protectionCouncil?.time && new Date(editCouncil.protectionCouncil?.time)}
                        onChange={(date) =>
                          setEditCouncil({
                            ...editCouncil,
                            protectionCouncil: { ...editCouncil.protectionCouncil, time: date },
                          })
                        }
                        showIcon
                        isClearable
                        showTimeInput={false}
                        dateFormat="dd/MM/yyyy" // Định dạng ngày/tháng/năm
                        placeholderText="Chọn ngày"
                        fixedHeight
                      />
                    </div>
                  </div>
                  <div className={cx("details__wrapInput")}>
                    <span className={cx("details__title")}>Mã phòng:</span>
                    <div className={cx("details__input")} style={{ width: "150px" }}>
                      <input
                        type="text"
                        value={editCouncil.protectionCouncil?.roomCode}
                        onChange={(e) =>
                          setEditCouncil({
                            ...editCouncil,
                            protectionCouncil: { ...editCouncil.protectionCouncil, roomCode: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {errorEdit && <div className={cx("message")}>{errorEdit}</div>}
                <div className={cx("btns")}>
                  <button className={cx("btn-modal")} onClick={handleCancleEdit}>
                    Hủy
                  </button>
                  <button className={cx("btn-modal")} onClick={handleEstablishCouncil}>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}

      {isOpenDetailModal && (
        <div>
          <div className={cx("modal", "modal__details")}>
            <div className={cx("modal-close")} onClick={handleCancleDetail}>
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className={cx("title-modal")}>Chi tiết HĐBV</div>
            <div className={cx("form")} style={{ padding: "40px 60px" }}>
              <div className={cx("wrap__modalDetails")}>
                <div className={cx("wrap__modalDetail1")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên sinh viên:</span>
                    <span className={cx("details__content")}>{editCouncil.nameStudent}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Năm học:</span>
                    <span className={cx("details__content")}>{editCouncil.yearTopic}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Kỳ học:</span>
                    <span className={cx("details__content")}>{editCouncil.semesterTopic}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên HĐBV:</span>
                    <span className={cx("details__content")}>{editCouncil.protectionCouncil?.nameCouncil}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mô tả:</span>
                    <span className={cx("details__content")}>{editCouncil.protectionCouncil?.describeCouncil}</span>
                  </div>
                </div>
                <div className={cx("wrap__modalDetail1")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Đề tài KLTN:</span>
                    <span className={cx("details__content")}>{editCouncil.nameTopic}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mô tả đề tài:</span>
                    <span className={cx("details__content")}>{editCouncil.describeTopic}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Lịch bảo vệ</span>
                  </div>
                  <div className={cx("details__schedule")}>
                    <div className={cx("details__row", "details__row-margin")}>
                      <span className={cx("details__title")}>Ngày:</span>
                      <span className={cx("details__content")}>
                        {new Date(editCouncil.protectionCouncil?.time).toLocaleDateString("vi-VI", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className={cx("details__row")}>
                      <span className={cx("details__title")}>Ca/Mã phòng:</span>
                      <span className={cx("details__content")}>{editCouncil.protectionCouncil?.shift}/</span>
                      <span className={cx("details__content")}>{editCouncil.protectionCouncil?.roomCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ margin: "15px 0 10px" }}>
                <span className={cx("details__title")}>Thành viên hội đồng bảo vệ</span>
              </div>
              <div className={cx("details__members")}>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Chủ tịch hội đồng:</span>
                  <span className={cx("details__content")}>{editCouncil.protectionCouncil?.members?.chairperson}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Giáo viên hướng dẫn:</span>
                  <span className={cx("details__content")}>{editCouncil.nameTeacher}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Giáo viên phản biện:</span>
                  <span className={cx("details__content")}>{editCouncil.nameCounterTeacher}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Thư ký:</span>
                  <span className={cx("details__content")}>{editCouncil.protectionCouncil?.members?.secretary}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Ủy viên:</span>
                  <span className={cx("details__content")}>{editCouncil.protectionCouncil?.members?.commissioner}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default EstablishCouncil;
