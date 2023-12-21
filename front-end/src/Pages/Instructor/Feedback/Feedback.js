import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./Feedback.module.scss";

const cx = classNames.bind(styles);

function Feedback() {
  const url = process.env.REACT_APP_URL;

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
        `${url}/api/feedback?searchQuery=${searchQuery}${
          isTabFeedback ? `&isTabFeedback=${true}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${url}` }
      )
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách hội đồng bảo vệ.");
      });
  }

  const handleEditFeedback = () => {
    if (
      editFeedback.feedback?.fileFeedback &&
      editFeedback.feedback?.stateFeedback
    ) {
      const file = editFeedback.feedback?.fileFeedback?.data;
      const formData = new FormData();
      formData.append("stateFeedback", editFeedback.feedback?.stateFeedback);
      formData.append(
        "nameFile",
        editFeedback.feedback?.fileFeedback?.nameFile
      );
      formData.append("file", file);
      axios
        .put(`${url}/api/feedback/${editFeedback._id}`, formData, {
          withCredentials: true,
          baseURL: `${url}`,
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
        fileFeedback: {
          nameFile: e.target.files[0].name,
          data: e.target.files[0],
        },
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
                      href={`${url}/api/feedback/${feedback._id}`}
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
                  selfData={[
                    { name: "Cần chỉnh sửa" },
                    { name: "Không cần chỉnh sửa" },
                  ]}
                  onSelectionChange={handleChangeStateFeedback}
                  oldData={editFeedback.feedback?.stateFeedback}
                  customStyle={{ justifyContent: "flex-start" }}
                />

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
                    onClick={handleEditFeedback}
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
    </DefaultLayout>
  );
}

export default Feedback;
