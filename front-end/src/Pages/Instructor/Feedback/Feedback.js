import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./Feedback.module.scss";

const cx = classNames.bind(styles);

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  const [idActiveRow, setIdActiveRow] = useState(null);

  const [editFeedback, setEditFeedback] = useState({});

  const [isTabFeedback, setIsTabFeedback] = useState(false);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");
  const [error, setError] = useState("");

  const [errorEdit, setErrorEdit] = useState("");

  useEffect(getAllStudents, [filterBySemester, filterByYear, isTabFeedback]);

  function getAllStudents() {
    axios
      .get(
        `http://localhost:3001/api/feedback?searchQuery=${searchQuery}${
          isTabFeedback ? `&isTabFeedback=${true}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: "http://localhost:3001" }
      )
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách hội đồng bảo vệ.");
      });
  }

  const handleEditFeedback = () => {
    if (editFeedback.feedback?.fileFeedback && editFeedback.feedback?.stateFeedback) {
      const file = editFeedback.feedback?.fileFeedback?.data;
      const formData = new FormData();
      formData.append("stateFeedback", editFeedback.feedback?.stateFeedback);
      formData.append("nameFile", editFeedback.feedback?.fileFeedback?.nameFile);
      formData.append("file", file);
      axios
        .put(`http://localhost:3001/api/feedback/${editFeedback._id}`, formData, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          setIsOpenEditModal(false);

          setErrorEdit("");
          getAllStudents();
        })
        .catch((err) => {
          // setErrorEdit(err.response.data);
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleCancleEdit = () => {
    setIsOpenEditModal(false);

    setErrorEdit("");
    setEditFeedback({});
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };
  const handleChangeStateFeedback = (value) => {
    console.log(value);
    setEditFeedback({
      ...editFeedback,
      feedback: {
        ...editFeedback.feedback,
        stateFeedback: value,
      },
    });
  };
  const handleFileChange = (e) => {
    setEditFeedback({
      ...editFeedback,
      feedback: {
        ...editFeedback.feedback,
        fileFeedback: { nameFile: e.target.files[0].name, data: e.target.files[0] },
      },
    });
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Nhận xét bảo vệ</h2>
      <div className={cx("tab")}>
        <button
          onClick={() => {
            setIsTabFeedback(false);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên bảo vệ KL
        </button>
        <button
          onClick={() => {
            setIsTabFeedback(true);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên đã nhận xét
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
              <th>Mã sinh viên</th>
              <th>Tên sinh viên</th>
              {isTabFeedback && <th>Tên HĐ</th>}
              {!isTabFeedback && <th>Tên HĐBV</th>}
              {isTabFeedback && <th>Trạng thái đánh giá</th>}
              {isTabFeedback && (
                <th>
                  <span className="material-symbols-outlined">folder_zip</span>
                </th>
              )}

              <th>Năm học</th>
              <th>Kỳ học</th>
              <th>Chức năng</th>
            </tr>
          </thead>

          {feedbacks.map((feedback, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>

                <td>
                  <div>{feedback.codeStudent} </div>
                </td>

                <td>
                  <div>{feedback.nameStudent} </div>
                </td>
                {isTabFeedback && (
                  <td>
                    <div>{feedback.protectionCouncil?.nameCouncil} </div>
                  </td>
                )}
                {!isTabFeedback ? (
                  <td>
                    <div>{feedback.protectionCouncil?.nameCouncil} </div>
                  </td>
                ) : (
                  <td>
                    <div>{feedback.feedback?.stateFeedback} </div>
                  </td>
                )}

                {isTabFeedback && (
                  <td>
                    <a
                      className={cx("linkDownload")}
                      href={`http://localhost:3001/api/feedback/${feedback._id}`}
                      download={feedback.feedback?.fileFeedback?.nameFile}
                    >
                      {feedback.feedback?.fileFeedback?.nameFile}
                    </a>
                  </td>
                )}

                <td>
                  <div>{feedback.yearTopic} </div>
                </td>
                <td>
                  <div>{feedback.semesterTopic} </div>
                </td>

                {isTabFeedback ? (
                  <td className={cx("column__functions")}>
                    <div className={cx("wrapper__btn-approve")}>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setEditFeedback(feedback);
                          setIsOpenEditModal(true);
                        }}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  </td>
                ) : (
                  <td className={cx("column__functions")}>
                    <div className={cx("wrapper__btn-approve")}>
                      <button
                        className={cx("btn-approve")}
                        onClick={() => {
                          setEditFeedback(feedback);
                          setIsOpenEditModal(true);
                        }}
                      >
                        Nhận xét
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
            <div className={cx("title-modal")}>Nhận xét</div>
            <div className={cx("form")}>
              <div>
                <div id="formUpload" className={cx("uploadFile")}>
                  <span>
                    Tải lên:<span style={{ color: "red" }}>*</span>{" "}
                  </span>
                  <input type="file" onChange={handleFileChange} />
                </div>
                <ComboBox
                  title="Trạng thái đánh giá KL"
                  selfData={[{ name: "Cần chỉnh sửa" }, { name: "Tốt" }]}
                  onSelectionChange={handleChangeStateFeedback}
                  oldData={editFeedback.feedback?.stateFeedback}
                  customStyle={{ justifyContent: "flex-start" }}
                />

                {errorEdit && <div className={cx("message")}>{errorEdit}</div>}
                <div className={cx("btns")}>
                  <button className={cx("btn-modal")} onClick={handleCancleEdit}>
                    Hủy
                  </button>
                  <button className={cx("btn-modal")} onClick={handleEditFeedback}>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
      {/* 
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
                    <span className={cx("details__content")}>{editFeedback.nameStudent}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Năm học:</span>
                    <span className={cx("details__content")}>{editFeedback.yearTopic}</span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Kỳ học:</span>
                    <span className={cx("details__content")}>{editFeedback.semesterTopic}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên HĐBV:</span>
                    <span className={cx("details__content")}>{editFeedback.protectionCouncil?.nameCouncil}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mô tả:</span>
                    <span className={cx("details__content")}>{editFeedback.protectionCouncil?.describeCouncil}</span>
                  </div>
                </div>
                <div className={cx("wrap__modalDetail1")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Đề tài KLTN:</span>
                    <span className={cx("details__content")}>{editFeedback.nameTopic}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mô tả đề tài:</span>
                    <span className={cx("details__content")}>{editFeedback.describeTopic}</span>
                  </div>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Lịch bảo vệ</span>
                  </div>
                  <div className={cx("details__schedule")}>
                    <div className={cx("details__row", "details__row-margin")}>
                      <span className={cx("details__title")}>Ngày:</span>
                      <span className={cx("details__content")}>
                        {new Date(editFeedback.protectionCouncil?.time).toLocaleDateString("vi-VI", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className={cx("details__row")}>
                      <span className={cx("details__title")}>Ca/Mã phòng:</span>
                      <span className={cx("details__content")}>{editFeedback.protectionCouncil?.shift}/</span>
                      <span className={cx("details__content")}>{editFeedback.protectionCouncil?.roomCode}</span>
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
                  <span className={cx("details__content")}>{editFeedback.protectionCouncil?.members?.chairperson}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Giáo viên hướng dẫn:</span>
                  <span className={cx("details__content")}>{editFeedback.nameTeacher}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Giáo viên phản biện:</span>
                  <span className={cx("details__content")}>{editFeedback.nameCounterTeacher}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Thư ký:</span>
                  <span className={cx("details__content")}>{editFeedback.protectionCouncil?.members?.secretary}</span>
                </div>
                <div className={cx("details__row")}>
                  <span className={cx("details__title")}>Ủy viên:</span>
                  <span className={cx("details__content")}>
                    {editFeedback.protectionCouncil?.members?.commissioner}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )} */}
    </DefaultLayout>
  );
}

export default Feedback;
