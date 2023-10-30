import React, { useState } from "react";

import axios from "axios";
import images from "~/assets/img";

import classNames from "classnames/bind";
import styles from "./ForgetPass.module.scss";

const cx = classNames.bind(styles);

function ForgetPass() {
  const host = process.env.REACT_APP_HOST;
  const port = process.env.REACT_APP_PORT;
  // Xử lý input
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [inputValueEmail, setInputValueEmail] = useState("");
  const [inputValueUsername, setInputValueUsername] = useState("");
  //
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleFocusUsername = () => {
    setIsFocusedEmail(true);
  };
  const handleFocusEmail = () => {
    setIsFocusedUsername(true);
  };
  const handleBlurUsername = () => {
    setIsFocusedEmail(false);
  };
  const handleBlurEmail = () => {
    setIsFocusedUsername(false);
  };

  const handleForgetPass = async (e) => {
    e.preventDefault();

    if (email && username) {
      await axios
        .post(`${host}:${port}/api/forgetPassWord`, { username, email })
        .then((res) => {
          alert(res.data);
        })
        .catch((err) => {
          alert(err.response.data);
        });
    } else {
      console.log("Vui lòng điền đầy đủ thông tin!");
    }
  };

  return (
    <div className={cx("login")}>
      <div className={cx("form")}>
        <form onSubmit={handleForgetPass}>
          <span className={cx("logo")}>
            <img src={images.logo} alt="logo"></img>
          </span>
          <span className={cx("title")}>Cấp lại mật khẩu</span>
          <div className={cx("wrap-input")}>
            <input
              type="text"
              placeholder={isFocusedEmail ? "" : "Email"}
              className={cx("input", `${inputValueEmail && !isFocusedEmail ? "hasVal" : ""}`)}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setInputValueEmail(e.target.value);
              }}
              onFocus={handleFocusEmail}
              onBlur={handleBlurEmail}
            ></input>
            <span className={cx("material-symbols-outlined", "focus__icon")}>mail</span>
            <span className={cx("focus-input")}></span>
          </div>

          <div className={cx("wrap-input")}>
            <input
              type="text"
              placeholder={isFocusedUsername ? "" : "Tên đăng nhập"}
              className={cx("input", `${inputValueUsername && !isFocusedUsername ? "hasVal" : ""}`)}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setInputValueUsername(e.target.value);
              }}
              onFocus={handleFocusUsername}
              onBlur={handleBlurUsername}
            ></input>
            <span class={cx("material-symbols-outlined", "focus__icon")}>person</span>
            <span className={cx("focus-input")}></span>
          </div>

          <div className={cx("btn")}>
            <input
              type="submit"
              value="Xin cấp lại mật khẩu"
              name="btnForgetPass"
              id="btnForgetPass"
              className={cx("btn-input")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
