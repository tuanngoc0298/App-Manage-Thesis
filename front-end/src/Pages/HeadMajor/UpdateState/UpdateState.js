import DefaultLayout from "~/Layout/DefaultLayout";
import { SearchBar, ComboBox } from "~/components";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./UpdateState.module.scss";

const cx = classNames.bind(styles);

function UpdateState() {
  const url = process.env.REACT_APP_URL;

  const [students, setStudents] = useState([]);

  const [editStudent, setStudent] = useState({});

  const [isApprove, setIsApprove] = useState("");
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);
  const [isFilterApproved, setIsFilterApproved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterByYear, setFilterByYear] = useState("");
  const [filterBySemester, setFilterBySemester] = useState("");

  const [error, setError] = useState("");

  const [errorApprove, setErrorApprove] = useState("");

  const { token } = useContext(HeaderContext);

  useEffect(getAllRegister, [filterBySemester, filterByYear, isFilterApproved]);

  function getAllRegister() {
    axios
      .get(
        `/api/updateState?searchQuery=${searchQuery}${
          isFilterApproved ? `&isTabComplete=${true}` : ""
        }&year=${filterByYear}&semester=${filterBySemester}`,
        { withCredentials: true, baseURL: `${url}` }
      )
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách đăng ký.");
      });
  }

  const handleUpdateState = () => {
    if (isApprove) {
      axios
        .put(
          `/api/updateState/${editStudent._id}`,
          { isApprove },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setStudent({});

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

    setErrorApprove("");
    setStudent({});
  };

  const handleChangeFilterYear = (value) => {
    setFilterByYear(value);
  };

  const handleChangeFilterSemester = (value) => {
    setFilterBySemester(value);
  };

  return (
    <DefaultLayout>
      <h2 className={cx("title")}>Cập nhật trạng thái KLTN</h2>
      <div className={cx("tab")}>
        <button
          onClick={() => {
            setIsFilterApproved(false);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên đăng ký làm KLTN
        </button>
        <button
          onClick={() => {
            setIsFilterApproved(true);
            setFilterBySemester("");
            setFilterByYear("");
          }}
        >
          Sinh viên đã kết thúc KLTN
        </button>
      </div>

      <div className={cx("function")}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          handleSearch={getAllRegister}
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

              {isFilterApproved ? <th>Trạng thái</th> : <th>Điểm KLTN</th>}
              <th>Năm học</th>
              <th>Kỳ học</th>

              {!isFilterApproved && <th>Chức năng</th>}
            </tr>
          </thead>

          {students.map((register, index) => (
            <tbody key={index}>
              <tr>
                <td className={cx("table__index")}>{index + 1}</td>
                <td>
                  <div>{register.codeStudent} </div>
                </td>

                <td>
                  <div>{register.nameStudent} </div>
                </td>
                {isFilterApproved ? (
                  <td>
                    <div>{register.state} </div>
                  </td>
                ) : (
                  <td>
                    <div>{register.score} </div>
                  </td>
                )}

                <td>
                  <div>{register.yearTopic} </div>
                </td>
                <td>
                  <div>{register.semesterTopic} </div>
                </td>
                {!isFilterApproved && (
                  <td className={cx("column__functions")}>
                    <div className={cx("wrapper__btn")}>
                      <button
                        className={cx("btn")}
                        onClick={() => {
                          setStudent(register);
                          setIsOpenApproveModal(true);
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

      {isOpenApproveModal && (
        <div>
          <div className={cx("modal")}>
            <div className={cx("title-modal")}>Cập nhật trạng thái KLTN</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("wrap-details")}>
                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Mã sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editStudent.codeStudent}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Điểm KLTN:</span>
                    <span className={cx("details__content")}>
                      {editStudent.score}
                    </span>
                  </div>

                  <div className={cx("details__row")}>
                    <span className={cx("details__title")}>Tên sinh viên:</span>
                    <span className={cx("details__content")}>
                      {editStudent.nameStudent}
                    </span>
                  </div>
                </div>

                <div className={cx("details__checkBox")}>
                  <label>
                    <input
                      type="radio"
                      checked={isApprove === "Duyệt"}
                      onChange={() => setIsApprove("Duyệt")}
                    />{" "}
                    Hoàn thành KLTN
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={isApprove === "Từ chối"}
                      onChange={() => setIsApprove("Từ chối")}
                    />{" "}
                    Không hoàn thành KLTN
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
                <button className={cx("btn-modal")} onClick={handleUpdateState}>
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

export default UpdateState;
