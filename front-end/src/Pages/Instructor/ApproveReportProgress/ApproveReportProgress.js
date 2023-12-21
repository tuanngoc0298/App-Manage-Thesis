import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ApproveReportProgress.module.scss";

const cx = classNames.bind(styles);

function ApproveReportProgress() {
  const url = process.env.REACT_APP_URL;

  const [reports, setReports] = useState([]);
  const [reportsDetail, setReportsDetail] = useState([]);

  const [detail, setDetail] = useState();
  const [editReport, setEditReport] = useState({});
  const [comment, setComment] = useState("");
  const [isApprove, setIsApprove] = useState("");
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);

  const [isFilterApproved, setIsFilterApproved] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");

  const [errorApprove, setErrorApprove] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getAllReports, [filterBySemester, filterByYear, isFilterApproved]);
  useEffect(getAllReportsDetail, [detail]);

  function formatTime(date) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function getAllReports() {
    axios
      .get(
        `${url}/api/approveReportProgess?searchQuery=${searchQuery}${
          isFilterApproved ? `&stateApprove=${true}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${url}` }
      )
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách báo cáo.");
      });
  }

  function getAllReportsDetail() {
    if (detail) {
      axios
        .get(`${url}/api/approveReportDetail/${detail._id}`, {
          withCredentials: true,
          baseURL: `${url}`,
        })
        .then((res) => {
          setReportsDetail(res.data);
        })
        .catch((err) => {
          setError("Không thể tải danh sách báo cáo.");
        });
    }
  }

  const handleApproveReportProgress = () => {
    if (isApprove) {
      axios
        .put(
          `${url}/api/approveReportProgess/${editReport._id}`,
          { comment, isApprove, editReport },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setEditReport({});
          setComment("");
          setIsApprove("");
          setIsOpenApproveModal(false);
          getAllReports();
          setErrorApprove("");
        })
        .catch((err) => {
          setErrorApprove(err.response.data);
        });
    } else {
      setErrorApprove("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleCancleApprove = () => {
    setIsOpenApproveModal(false);
    setIsApprove("");
    setComment("");
    setErrorApprove("");
    setEditReport({});
  };
  const handleCancleDetail = () => {
    setIsOpenDetailModal(false);
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Duyệt báo cáo</h2>
      <div className={cx("tab")}>
        <button
          onClick={() => {
            setIsFilterApproved(false);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên nộp báo cáo
        </button>
        <button
          onClick={() => {
            setIsFilterApproved(true);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên đã duyệt báo cáo
        </button>
      </div>

      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={getAllReports}
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
              <th>Tên đề tài</th>
              <th>Năm học</th>
              <th>Kỳ học</th>

              <th>Chức năng</th>
            </tr>
          </thead>

          {reports.map((report, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{report.codeStudent} </div>
                </td>

                <td>
                  <div>{report.nameStudent} </div>
                </td>
                <td>
                  <div>{report.nameTopic} </div>
                </td>

                <td>
                  <div>{report.yearTopic} </div>
                </td>
                <td>
                  <div>{report.semesterTopic} </div>
                </td>

                {isFilterApproved ? (
                  <td className={cx("column__functions")}>
                    <div className={cx("wrapper__btn-approve")}>
                      <button
                        className={cx("btn-approve")}
                        onClick={() => {
                          setDetail(report);
                          setIsOpenDetailModal(true);
                        }}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </td>
                ) : (
                  <td className={cx("column__functions")}>
                    <div className={cx("wrapper__btn-approve")}>
                      <button
                        className={cx("btn-approve")}
                        onClick={() => {
                          setEditReport(report);
                          setIsOpenApproveModal(true);
                        }}
                      >
                        Duyệt
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenApproveModal && (
        <div>
          <div className={cx("modal")}>
            <div className={cx("title-modal")}>Phê duyệt báo cáo</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__linkDownload")}>
                    <span className={cx("details__title")}>Tệp tin:</span>
                    <span className="material-symbols-outlined">
                      folder_zip
                    </span>
                    <a
                      className={cx("linkDownload")}
                      href={`${url}/api/approveReportProgess/${editReport._id}`}
                      download={editReport.file.nameFile}
                    >
                      {editReport.file.nameFile}
                    </a>
                  </div>

                  <div>
                    <span className={cx("details__title")}>
                      Mức độ hoàn thành:
                    </span>{" "}
                    {editReport.completeLevel}
                  </div>
                </div>
                <div>
                  <span className={cx("details__title")}>Thời gian:</span>{" "}
                  {formatTime(new Date(editReport.time))}
                </div>
                <div className={cx("form__comment")}>
                  <span className={cx("details__title")}>Nhận xét:</span>
                  <div>
                    <textarea
                      className={cx("form__textArea")}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className={cx("details__checkBox")}>
                  <label>
                    <input
                      type="radio"
                      checked={isApprove === "Duyệt"}
                      onChange={() => setIsApprove("Duyệt")}
                    />{" "}
                    Phê duyệt
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={isApprove === "Từ chối"}
                      onChange={() => setIsApprove("Từ chối")}
                    />{" "}
                    Từ chối
                  </label>
                </div>
              </div>
              {errorApprove && (
                <div className={cx("message")}>{errorApprove}</div>
              )}
              <div className={cx("btns")}>
                <button
                  className={cx("btn-modal")}
                  onClick={handleCancleApprove}
                >
                  Hủy
                </button>
                <button
                  className={cx("btn-modal")}
                  onClick={handleApproveReportProgress}
                >
                  Lưu
                </button>
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
            <div className={cx("title-modal")}>Chi tiết báo cáo</div>
            <div className={cx("form", "form-detail")}>
              {reportsDetail.map((report, index) => (
                <div className={cx("detail-item")}>
                  <div className={cx("detail-title")}>
                    Lần báo cáo thứ {index + 1}
                  </div>
                  <table className={cx("detail-table")}>
                    <tr>
                      <th>Tệp tin</th>
                      <th>
                        <a
                          className={cx("linkDownload")}
                          href={`${url}/api/approveReportProgess/${report._id}`}
                          download={report.file.nameFile}
                        >
                          {report.file.nameFile}
                        </a>
                      </th>
                    </tr>
                    <tr>
                      <td>Thời gian báo cáo</td>
                      <td>{formatTime(new Date(report.time))}</td>
                    </tr>
                    <tr>
                      <td>Mức độ hoàn thành</td>
                      <td>{report.completeLevel}</td>
                    </tr>
                    <tr>
                      <td>Trạng thái</td>
                      <td>{report.stateReportProgress}</td>
                    </tr>
                    <tr>
                      <td>Nhận xét</td>
                      <td>{report.comment}</td>
                    </tr>
                  </table>
                </div>
              ))}
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default ApproveReportProgress;
