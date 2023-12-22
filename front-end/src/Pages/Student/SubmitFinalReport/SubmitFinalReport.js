import DefaultLayout from "~/Layout/DefaultLayout";
import { Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./SubmitFinalReport.module.scss";

const cx = classNames.bind(styles);

function SubmitFinalReport() {
  const url = process.env.REACT_APP_URL;

  const [reports, setReports] = useState([]);

  const [reportFile, setReportFile] = useState(null);

  const [isOpenReportModal, setIsOpenReportModal] = useState(false);

  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getTopic, [token]);

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

  function getTopic() {
    axios
      .get(`/api/submitFinalReport`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUploadReport = () => {
    if (reportFile) {
      const formData = new FormData();

      formData.append("nameFile", reportFile.name);
      formData.append("file", reportFile);

      axios
        .post(`/api/submitFinalReport`, formData, {
          withCredentials: true,
          baseURL: `${url}`,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          setIsOpenReportModal(false);

          setReportFile(null);
          setErrorEdit("");
          getTopic();
        })
        .catch((err) => {
          setErrorEdit(err.response.data);
        });
    } else {
      setErrorEdit("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleCancleReport = () => {
    setIsOpenReportModal(false);

    setReportFile(null);
    setErrorEdit("");
  };

  const handleFileChange = (e) => {
    setReportFile(e.target.files[0]);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Nộp báo cáo cuối</h2>
      <div className={cx("function")}>
        <div className={cx("function__allow")}>
          <button
            className={cx("btn", "btn-add")}
            onClick={() => setIsOpenReportModal(true)}
          >
            Nộp báo cáo
          </button>
        </div>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Trạng thái</th>

              <th>
                <span className="material-symbols-outlined">folder_zip</span>
              </th>
              <th>Nhận xét</th>
              <th>Thời gian báo cáo</th>
            </tr>
          </thead>

          {reports.map((report, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{report.stateReportProgress} </div>
                </td>

                <td>
                  <a
                    className={cx("linkDownload")}
                    href={`/api/approveFinalReport/${report._id}`}
                    download={report.file.nameFile}
                  >
                    {report.file.nameFile}
                  </a>
                </td>
                <td>
                  <div>{report.comment} </div>
                </td>
                <td>
                  <div>{formatTime(new Date(report.time))} </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenReportModal && (
        <Modal
          name="Nộp báo cáo cuối"
          error={errorEdit}
          handleCancle={handleCancleReport}
          handleLogic={handleUploadReport}
          handleFileChange={handleFileChange}
        />
      )}
    </DefaultLayout>
  );
}

export default SubmitFinalReport;
