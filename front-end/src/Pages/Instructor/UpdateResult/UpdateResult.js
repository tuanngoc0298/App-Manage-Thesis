import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import classNames from "classnames/bind";
import styles from "./UpdateResult.module.scss";

const cx = classNames.bind(styles);

function UpdateResult() {
  const url = process.env.REACT_APP_URL;

  const nameUser = Cookies.get("token")
    ? jwt_decode(Cookies.get("token")).userInfo.name
    : "";

  const [role, setRole] = useState("");

  const [students, setStudents] = useState([]);

  const [scores, setScores] = useState([]);
  const [scoresTeacher, setScoresTeacher] = useState([]);
  const [scoresCounterTeacher, setScoresCounterTeacher] = useState([]);
  const [scoresChairperson, setScoresChairperson] = useState([]);
  const [scoresCommissioner, setScoresCommissioner] = useState([]);

  const [total, setTotal] = useState();
  const [totalTeacher, setTotalTeacher] = useState();
  const [totalCounterTeacher, setTotalCounterTeacher] = useState();
  const [totalChairperson, setTotalChairperson] = useState();
  const [totalCommissioner, setTotalCommissioner] = useState();

  const [idActiveRow, setIdActiveRow] = useState(null);

  const [editResult, setEditResult] = useState({});

  const [isTabResult, setIsTabResult] = useState(false);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  const [error, setError] = useState("");

  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);
  const wrapperBtnRef = useRef(null);
  const request = [
    ["Hình thức", "2.0"],
    ["Trả lời các câu hỏi của thành viên hội đồng", "2.0"],
    ["Nội dung", "2.0"],
    ["Nắm vững những vấn đề liên quan đề tài", "2.0"],
    ["Độ khó đề tài", "2.0"],
  ];
  const roleTeachers = [
    [
      "Giáo viên hướng dẫn",
      editResult.nameTeacher,
      editResult.scoreResult?.teacher?.total,
    ],
    [
      "Giáo viên phản biện",
      editResult.nameCounterTeacher,
      editResult.scoreResult?.counterTeacher?.total,
    ],
    [
      "Chủ tịch hội đồng",
      editResult.chairperson,
      editResult.scoreResult?.chairperson?.total,
    ],
    ["Thư ký", editResult.secretary, editResult.scoreResult?.secretary?.total],
    [
      "Ủy viên",
      editResult.commissioner,
      editResult.scoreResult?.commissioner?.total,
    ],
  ];
  useEffect(getAllStudents, [filterBySemester, filterByYear, isTabResult]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperBtnRef.current &&
        !wrapperBtnRef.current.contains(event.target)
      ) {
        setIdActiveRow(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    roleUser();
  }, [editResult]);
  useEffect(() => {
    setScores(editResult.scoreResult?.[role]?.scores || []);
    setTotal(editResult.scoreResult?.[role]?.total);
    if (role === "secretary") {
      setScoresTeacher(editResult.scoreResult?.teacher?.scores || []);
      setScoresCounterTeacher(
        editResult.scoreResult?.counterTeacher?.scores || []
      );
      setScoresChairperson(editResult.scoreResult?.chairperson?.scores || []);
      setScoresCommissioner(editResult.scoreResult?.commissioner?.scores || []);

      setTotalTeacher(editResult.scoreResult?.teacher?.total);
      setTotalCounterTeacher(editResult.scoreResult?.counterTeacher?.total);
      setTotalChairperson(editResult.scoreResult?.chairperson?.total);
      setTotalCommissioner(editResult.scoreResult?.commissioner?.total);
    }
  }, [role]);
  function getAllStudents() {
    axios
      .get(
        `/api/updateResult?searchQuery=${searchQuery}${
          isTabResult ? `&isTabResult=${true}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${url}` }
      )
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách hội đồng bảo vệ.");
      });
  }

  const handleUpdateResult = () => {
    axios
      .put(
        `/api/updateResult/${editResult._id}`,
        {
          scores,
          total,
          scoresTeacher,
          totalTeacher,
          scoresCounterTeacher,
          totalCounterTeacher,
          scoresChairperson,
          totalChairperson,
          scoresCommissioner,
          totalCommissioner,
          role,
          editResult,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setEditResult({});
        setIsOpenEditModal(false);
        getAllStudents();
        setErrorEdit("");
      })
      .catch((err) => {
        setErrorEdit(err.response.data.error);
      });
  };

  const handleCancleEdit = () => {
    setIsOpenEditModal(false);
    setRole("");
    setErrorEdit("");
    setEditResult({});
  };
  const handleCancleDetail = () => {
    setIsOpenDetailModal(false);
    setEditResult({});
  };
  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };

  const handleInputChange = (index, value) => {
    // Kiểm tra giá trị nhập vào
    const parsedValue = parseFloat(value);

    setErrorEdit(""); // Xóa thông báo lỗi nếu giá trị hợp lệ

    // Cập nhật giá trị trong mảng scores
    const newScores = [...scores];
    newScores[index] = parsedValue;

    setScores(newScores);
    // Tính lại trung bình
    const totalScore = newScores.reduce((acc, curr) => acc + curr, 0);
    setTotal(+totalScore.toFixed(1));
  };

  const handleInputChangeTeacher = (index, value) => {
    // Kiểm tra giá trị nhập vào
    const parsedValue = parseFloat(value);

    setErrorEdit(""); // Xóa thông báo lỗi nếu giá trị hợp lệ

    // Cập nhật giá trị trong mảng scores
    const newScores = [...scoresTeacher];
    newScores[index] = parsedValue;

    setScoresTeacher(newScores);
    // Tính lại trung bình
    const totalScore = newScores.reduce((acc, curr) => acc + curr, 0);
    setTotalTeacher(+totalScore.toFixed(1));
  };

  const handleInputChangeCounterTeacher = (index, value) => {
    // Kiểm tra giá trị nhập vào
    const parsedValue = parseFloat(value);

    setErrorEdit(""); // Xóa thông báo lỗi nếu giá trị hợp lệ

    // Cập nhật giá trị trong mảng scores
    const newScores = [...scoresCounterTeacher];
    newScores[index] = parsedValue;

    setScoresCounterTeacher(newScores);
    // Tính lại trung bình
    const totalScore = newScores.reduce((acc, curr) => acc + curr, 0);
    setTotalCounterTeacher(+totalScore.toFixed(1));
  };

  const handleInputChangeChairperson = (index, value) => {
    // Kiểm tra giá trị nhập vào
    const parsedValue = parseFloat(value);

    setErrorEdit(""); // Xóa thông báo lỗi nếu giá trị hợp lệ

    // Cập nhật giá trị trong mảng scores
    const newScores = [...scoresChairperson];
    newScores[index] = parsedValue;

    setScoresChairperson(newScores);
    // Tính lại trung bình
    const totalScore = newScores.reduce((acc, curr) => acc + curr, 0);
    setTotalChairperson(+totalScore.toFixed(1));
  };

  const handleInputChangeCommissioner = (index, value) => {
    // Kiểm tra giá trị nhập vào
    const parsedValue = parseFloat(value);

    setErrorEdit(""); // Xóa thông báo lỗi nếu giá trị hợp lệ

    // Cập nhật giá trị trong mảng scores
    const newScores = [...scoresCommissioner];
    newScores[index] = parsedValue;

    setScoresCommissioner(newScores);
    // Tính lại trung bình
    const totalScore = newScores.reduce((acc, curr) => acc + curr, 0);
    setTotalCommissioner(+totalScore.toFixed(1));
  };
  function roleUser() {
    switch (nameUser) {
      case editResult.nameTeacher:
        setRole("teacher");
        break;
      case editResult.nameCounterTeacher:
        setRole("counterTeacher");
        break;
      case editResult.chairperson:
        setRole("chairperson");
        break;
      case editResult.secretary:
        setRole("secretary");
        break;
      case editResult.commissioner:
        setRole("commissioner");
        break;
    }
  }
  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Cập nhật điểm KLTN</h2>
      <div className={cx("tab")}>
        <button
          onClick={() => {
            setIsTabResult(false);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên hoàn thành Bảo vệ
        </button>
        <button
          onClick={() => {
            setIsTabResult(true);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Điểm KLTN
        </button>
      </div>

      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={getAllStudents}
        />
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
              <th>Mã sinh viên</th>
              <th>Tên sinh viên</th>
              <th>Tên HĐBV</th>
              <th>Năm học</th>
              <th>Kỳ học</th>
              {isTabResult && <th>Điểm KLTN</th>}
              <th>Chức năng</th>
            </tr>
          </thead>
          {students.map((student, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{student.codeStudent} </div>
                </td>
                <td>
                  <div>{student.nameStudent} </div>
                </td>
                <td>
                  <div>{student.nameCouncil} </div>
                </td>

                <td>
                  <div>{student.yearTopic} </div>
                </td>
                <td>
                  <div>{student.semesterTopic} </div>
                </td>

                {isTabResult && (
                  <td>
                    <div>{student.scoreResult?.average} </div>
                  </td>
                )}

                {isTabResult ? (
                  <td className={cx("column__functions")}>
                    <button className={cx("btn-more")}>
                      <span
                        className="material-symbols-outlined"
                        onClick={(e) => {
                          setIdActiveRow(student._id);
                          e.stopPropagation();
                        }}
                      >
                        more_horiz
                      </span>
                    </button>

                    {idActiveRow === student._id && (
                      <div ref={wrapperBtnRef} className={cx("wrapper__btn")}>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditResult(student);
                            setIsOpenDetailModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">
                            visibility
                          </span>
                        </button>
                        <button
                          className={cx("btn")}
                          onClick={() => {
                            setEditResult(student);
                            setIsOpenEditModal(true);
                          }}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
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
                          setEditResult(student);

                          setIsOpenEditModal(true);
                        }}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenEditModal && role !== "secretary" && (
        <div>
          <div className={cx("modal")}>
            <div className={cx("modal-close")} onClick={handleCancleEdit}>
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className={cx("title-modal")}>Cập nhật điểm</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mã sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editResult.codeStudent}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên HĐBV:</span>
                    <span className={cx("details__content")}>
                      {editResult.nameCouncil}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editResult.nameStudent}
                    </span>
                  </div>
                </div>
                <table className={cx("data", "data__result")}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Các chi tiết đánh giá</th>
                      <th>Điểm tối đa</th>
                      <th>Điểm đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.map(([request, score], index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className={cx("data__request")}>
                          <div>{request} </div>
                        </td>
                        <td>
                          <div>{score}</div>
                        </td>
                        <td>
                          <input
                            className={cx("data__input")}
                            type="number"
                            value={scores[index] || ""}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td>
                        <div>Kết quả: </div>
                      </td>
                      <td>
                        <div>10</div>
                      </td>
                      <td>{total || -1}</td>
                    </tr>
                  </tbody>
                </table>
                {errorEdit && <div className={cx("message")}>{errorEdit}</div>}
                <div className={cx("btns")}>
                  <button
                    className={cx("btn-modal")}
                    onClick={handleCancleEdit}
                  >
                    Hủy
                  </button>
                  <button
                    className={cx("btn-modal")}
                    onClick={handleUpdateResult}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}

      {isOpenEditModal && role === "secretary" && (
        <div>
          <div className={cx("modal", "modal__secretary")}>
            <div className={cx("modal-close")} onClick={handleCancleEdit}>
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className={cx("title-modal")}>Cập nhật điểm</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mã sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editResult.codeStudent}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên HĐBV:</span>
                    <span className={cx("details__content")}>
                      {editResult.nameCouncil}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editResult.nameStudent}
                    </span>
                  </div>
                </div>
                <div className={cx("details__role")}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Thư ký
                  </h2>
                  <table className={cx("data", "data__result")}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Các chi tiết đánh giá</th>
                        <th>Điểm tối đa</th>
                        <th>Điểm đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.map(([request, score], index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className={cx("data__request")}>
                            <div>{request} </div>
                          </td>
                          <td>
                            <div>{score}</div>
                          </td>
                          <td>
                            <input
                              className={cx("data__input")}
                              type="number"
                              value={scores[index] || ""}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <div>Kết quả: </div>
                        </td>
                        <td>
                          <div>10</div>
                        </td>
                        <td>{total || -1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={cx("details__role")}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Giáo viên hướng dẫn
                  </h2>
                  <table className={cx("data", "data__result")}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Các chi tiết đánh giá</th>
                        <th>Điểm tối đa</th>
                        <th>Điểm đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.map(([request, score], index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className={cx("data__request")}>
                            <div>{request} </div>
                          </td>
                          <td>
                            <div>{score}</div>
                          </td>
                          <td>
                            <input
                              className={cx("data__input")}
                              type="number"
                              value={scoresTeacher[index] || ""}
                              onChange={(e) =>
                                handleInputChangeTeacher(index, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <div>Kết quả: </div>
                        </td>
                        <td>
                          <div>10</div>
                        </td>
                        <td>{totalTeacher || -1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={cx("details__role")}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Giáo viên phản biện
                  </h2>
                  <table className={cx("data", "data__result")}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Các chi tiết đánh giá</th>
                        <th>Điểm tối đa</th>
                        <th>Điểm đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.map(([request, score], index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className={cx("data__request")}>
                            <div>{request} </div>
                          </td>
                          <td>
                            <div>{score}</div>
                          </td>
                          <td>
                            <input
                              className={cx("data__input")}
                              type="number"
                              value={scoresCounterTeacher[index] || ""}
                              onChange={(e) =>
                                handleInputChangeCounterTeacher(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <div>Kết quả: </div>
                        </td>
                        <td>
                          <div>10</div>
                        </td>
                        <td>{totalCounterTeacher || -1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={cx("details__role")}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Chủ tịch hội đồng
                  </h2>
                  <table className={cx("data", "data__result")}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Các chi tiết đánh giá</th>
                        <th>Điểm tối đa</th>
                        <th>Điểm đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.map(([request, score], index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className={cx("data__request")}>
                            <div>{request} </div>
                          </td>
                          <td>
                            <div>{score}</div>
                          </td>
                          <td>
                            <input
                              className={cx("data__input")}
                              type="number"
                              value={scoresChairperson[index] || ""}
                              onChange={(e) =>
                                handleInputChangeChairperson(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <div>Kết quả: </div>
                        </td>
                        <td>
                          <div>10</div>
                        </td>
                        <td>{totalChairperson || -1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={cx("details__role")}>
                  <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Ủy viên
                  </h2>
                  <table className={cx("data", "data__result")}>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Các chi tiết đánh giá</th>
                        <th>Điểm tối đa</th>
                        <th>Điểm đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {request.map(([request, score], index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className={cx("data__request")}>
                            <div>{request} </div>
                          </td>
                          <td>
                            <div>{score}</div>
                          </td>
                          <td>
                            <input
                              className={cx("data__input")}
                              type="number"
                              value={scoresCommissioner[index] || ""}
                              onChange={(e) =>
                                handleInputChangeCommissioner(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td>
                          <div>Kết quả: </div>
                        </td>
                        <td>
                          <div>10</div>
                        </td>
                        <td>{totalCommissioner || -1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {errorEdit && <div className={cx("message")}>{errorEdit}</div>}
                <div className={cx("btns")}>
                  <button
                    className={cx("btn-modal")}
                    onClick={handleCancleEdit}
                  >
                    Hủy
                  </button>
                  <button
                    className={cx("btn-modal")}
                    onClick={handleUpdateResult}
                  >
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
          <div className={cx("modal")}>
            <div className={cx("modal-close")} onClick={handleCancleDetail}>
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className={cx("title-modal")}>Chi tiết điểm</div>
            <div className={cx("form", "form__detail")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mã sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editResult.codeStudent}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên HĐBV:</span>
                    <span className={cx("details__content")}>
                      {editResult.nameCouncil}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editResult.nameStudent}
                    </span>
                  </div>
                </div>

                <table className={cx("data", "data__result")}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Giáo viên</th>
                      <th>Vai trò</th>
                      <th>Điểm đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleTeachers.map(
                      ([roleTeacher, nameTeacher, total], index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div>{nameTeacher} </div>
                          </td>
                          <td>
                            <div>{roleTeacher}</div>
                          </td>
                          <td>
                            <div>{total}</div>
                          </td>
                        </tr>
                      )
                    )}
                    <tr>
                      <td style={{ border: "none" }}></td>
                      <td style={{ border: "none" }}></td>

                      <td style={{ border: "none" }}>
                        <div>Kết quả: </div>
                      </td>

                      <td style={{ border: "none" }}>
                        {editResult.scoreResult?.average}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default UpdateResult;
