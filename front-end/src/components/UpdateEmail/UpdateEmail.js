import { useState } from "react";
import DefaultLayout from "~/Layout/DefaultLayout";

import classNames from "classnames/bind";
import styles from "./UpdateEmail.module.scss";
import axios from "axios";
import { useEffect } from "react";

const cx = classNames.bind(styles);

function UpdateEmail() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(getEmail, []);
  function getEmail() {
    axios
      .get(`${host}:${port}/api/getEmail`, { withCredentials: true, baseURL: `${host}:${port}` })
      .then((res) => {
        setEmail(res.data);
      })
      .catch((err) => {
        console.log("Get email thất bại");
      });
  }
  const handleUpdateEmail = (e) => {
    e.preventDefault();
    if (!email) return setError("Vui lòng nhập thông tin!");
    axios
      .put(`${host}:${port}/api/updateEmail`, { email }, { withCredentials: true, baseURL: `${host}:${port}` })
      .then((res) => {
        setError(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };
  return (
    <DefaultLayout>
      <div className={cx("title")}>Đăng ký email, số điện thoại để nhận hỗ trợ tốt nhất</div>
      <div className={cx("content")}>
        <div className={cx("content__row")}>
          <label htmlFor="email" className={cx("row__title")}>
            Email:
          </label>

          <input
            id="email"
            className={cx("row__input")}
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        {error && <div className={cx("message")}>{error}</div>}

        <input className={cx("btn")} type="submit" onClick={handleUpdateEmail} value="Cập nhật" />
      </div>
    </DefaultLayout>
  );
}

export default UpdateEmail;
