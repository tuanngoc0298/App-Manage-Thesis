import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./ApproveRegisterPresent.module.scss";

const cx = classNames.bind(styles);

function ApproveRegisterPresent() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [registers, setRegisters] = useState([]);

  const [editRegister, setEditRegister] = useState({});
  const [commentFinal, setCommentFinal] = useState("");
  const [isApprove, setIsApprove] = useState("");
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");

  const [errorApprove, setErrorApprove] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getAllRegister, [filterBySemester, filterByYear]);

  function getAllRegister() {
    axios
      .get(
        `${host}:${port}/api/approveRegisterPresent?searchQuery=${searchQuery}&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${host}:${port}` }
      )
      .then((res) => {
        setRegisters(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đăng ký.");
      });
  }

  const handleApproveRegisterPresent = () => {
    if (isApprove) {
      axios
        .put(
          `${host}:${port}/api/approveRegisterPresent/${editRegister._id}`,
          { commentFinal, isApprove, editRegister },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setEditRegister({});
          setCommentFinal("");
          setIsApprove("");
          setIsOpenApproveModal(false);
          getAllRegister();
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
    setCommentFinal("");
    setErrorApprove("");
    setEditRegister({});
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Duyệt đăng ký bảo vệ</h2>

      <div className={cx("function")}>
        <SearchBar setSearchQuery={setSearchQuery} handleSearch={getAllRegister} />
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

          {registers.map((suggestTopic, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{suggestTopic.codeStudent} </div>
                </td>

                <td>
                  <div>{suggestTopic.nameStudent} </div>
                </td>
                <td>
                  <div>{suggestTopic.nameTopic} </div>
                </td>

                <td>
                  <div>{suggestTopic.yearTopic} </div>
                </td>
                <td>
                  <div>{suggestTopic.semesterTopic} </div>
                </td>

                <td className={cx("column__functions")}>
                  <div className={cx("wrapper__btn")}>
                    <button
                      className={cx("btn")}
                      onClick={() => {
                        setEditRegister(suggestTopic);
                        setIsOpenApproveModal(true);
                      }}
                    >
                      Duyệt
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>

      {isOpenApproveModal && (
        <div>
          <div className={cx("modal")}>
            <div className={cx("title-modal")}>Phê duyệt đăng ký</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__linkDownload")}>
                    <span className={cx("details__title")}>Tệp tin:</span>
                    <span className="material-symbols-outlined">folder_zip</span>
                    <a
                      className={cx("linkDownload")}
                      href={`${host}:${port}/api/approveRegisterPresent/${editRegister._id}`}
                      download={editRegister.fileFinal.nameFile}
                    >
                      {editRegister.fileFinal.nameFile}
                    </a>
                  </div>
                </div>
                <div className={cx("form__comment")}>
                  <span className={cx("details__title")}>Nhận xét:</span>
                  <div>
                    <textarea
                      className={cx("form__textArea")}
                      onChange={(e) => {
                        setCommentFinal(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className={cx("details__checkBox")}>
                  <label>
                    <input type="radio" checked={isApprove === "Duyệt"} onChange={() => setIsApprove("Duyệt")} /> Phê
                    duyệt
                  </label>
                  <label>
                    <input type="radio" checked={isApprove === "Từ chối"} onChange={() => setIsApprove("Từ chối")} /> Từ
                    chối
                  </label>
                </div>
              </div>
              {errorApprove && <div className={cx("message")}>{errorApprove}</div>}
              <div className={cx("btns")}>
                <button className={cx("btn-modal")} onClick={handleCancleApprove}>
                  Hủy
                </button>
                <button className={cx("btn-modal")} onClick={handleApproveRegisterPresent}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default ApproveRegisterPresent;
