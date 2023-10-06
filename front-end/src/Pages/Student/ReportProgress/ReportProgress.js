import DefaultLayout from "~/Layout/DefaultLayout";
import { Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ReportProgress.module.scss";

const cx = classNames.bind(styles);

function ReportProgress() {
  const [topics, setTopics] = useState([]);
  const [completeLevel, setCompleteLevel] = useState("");
  const [reportFile, setReportFile] = useState(null);

  const [isOpenReportModal, setIsOpenReportModal] = useState(false);

  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getTopic, [token]);

  function getTopic() {
    axios
      .get("http://localhost:3001/api/reportProgress", { withCredentials: true, baseURL: "http://localhost:3001" })
      .then((res) => {
        setTopics(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleUploadReport = () => {
    if (reportFile && completeLevel.completeLevel) {
      const formData = new FormData();
      formData.append("valCompleteLevel", completeLevel.completeLevel);
      formData.append("nameFile", reportFile.name);
      formData.append("file", reportFile);

      axios
        .post(`http://localhost:3001/api/reportProgress`, formData, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // Cập nhật danh sách đề tài
          setIsOpenReportModal(false);
          setCompleteLevel("");
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
    setCompleteLevel("");
    setReportFile(null);
    setErrorEdit("");
  };

  const handleFileChange = (e) => {
    setReportFile(e.target.files[0]);
  };
  const handleChangeEditCompleteLevel = (value) => {
    setCompleteLevel(value);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Báo cáo tiến độ</h2>
      <div className={cx("function")}>
        <div className={cx("function__allow")}>
          <button className={cx("btn", "btn-add")} onClick={() => setIsOpenReportModal(true)}>
            Báo cáo
          </button>
        </div>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Trạng thái</th>
              <th>Mức độ hoàn thành</th>
              <th>
                <span className="material-symbols-outlined">folder_zip</span>
              </th>
              <th>Nhận xét</th>
              <th>Thời gian báo cáo</th>
            </tr>
          </thead>

          {topics.map((topic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{topic.stateReportProgress} </div>
                </td>
                <td>
                  <div>{topic.completeLevel} </div>
                </td>
                <td>
                  <a
                    className={cx("linkDownload")}
                    href={`http://localhost:3001/api/approveReportProgess/${topic._id}`}
                    download={topic.file.nameFile}
                  >
                    {topic.file.nameFile}
                  </a>
                </td>
                <td>
                  <div>{topic.comment} </div>
                </td>
                <td>
                  <div>{topic.time} </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenReportModal && (
        <Modal
          name="Báo cáo tiến độ"
          fields={[["Mức độ hoàn thành (%)", "completeLevel"]]}
          error={errorEdit}
          handleCancle={handleCancleReport}
          handleLogic={handleUploadReport}
          handleChangeInput={handleChangeEditCompleteLevel}
          handleFileChange={handleFileChange}
        />
      )}
    </DefaultLayout>
  );
}

export default ReportProgress;
