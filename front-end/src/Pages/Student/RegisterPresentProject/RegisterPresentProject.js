import DefaultLayout from "~/Layout/DefaultLayout";
import { Modal } from "~/components";

import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./RegisterPresentProject.module.scss";

const cx = classNames.bind(styles);

function RegisterPresentProject() {
  const url = process.env.REACT_APP_URL;

  const [topic, setTopic] = useState({});

  const [reportFile, setReportFile] = useState(null);

  const [isOpenReportModal, setIsOpenReportModal] = useState(false);

  const [errorEdit, setErrorEdit] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getTopic, [token]);

  function getTopic() {
    axios
      .get(`/api/registerPresent`, {
        withCredentials: true,
        baseURL: `${url}`,
      })
      .then((res) => {
        setTopic(res.data);
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
        .put(`/api/registerPresent/${topic._id}`, formData, {
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
      <h2 className={cx("title")}>Đăng ký bảo vệ</h2>
      <div className={cx("function")}>
        <div className={cx("function__allow")}>
          <button
            className={cx("btn", "btn-add")}
            onClick={() => setIsOpenReportModal(true)}
          >
            Đăng ký bảo vệ
          </button>
        </div>
      </div>

      <div>
        <table className={cx("data")}>
          <thead>
            <tr>
              <th>Trạng thái</th>
              <th>
                <span className="material-symbols-outlined">folder_zip</span>
              </th>
              <th>Nhận xét</th>
            </tr>
          </thead>

          {topic?.statePresentProject && (
            <tbody>
              <tr>
                <td>
                  <div>{topic.statePresentProject} </div>
                </td>
                <td>
                  <a
                    className={cx("linkDownload")}
                    href={`/api/approveRegisterPresent/${topic._id}`}
                    download={topic.fileFinal.nameFile}
                  >
                    {topic.fileFinal.nameFile}
                  </a>
                </td>
                <td>
                  <div>{topic.commentFinal} </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {isOpenReportModal && (
        <Modal
          name="Đăng ký"
          error={errorEdit}
          handleCancle={handleCancleReport}
          handleLogic={handleUploadReport}
          handleFileChange={handleFileChange}
        />
      )}
    </DefaultLayout>
  );
}

export default RegisterPresentProject;
