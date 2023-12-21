import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import images from "~/assets/img";

import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import Cookies from "js-cookie";

const cx = classNames.bind(styles);

function Login({ onLogin }) {
  const url = process.env.REACT_APP_URL;

  const navigate = useNavigate();
  // Xử lý input
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [inputValueName, setInputValueName] = useState("");
  const [inputValuePass, setInputValuePass] = useState("");
  //
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleFocusName = () => {
    setIsFocusedName(true);
  };
  const handleFocusPass = () => {
    setIsFocusedPass(true);
  };
  const handleBlurName = () => {
    setIsFocusedName(false);
  };
  const handleBlurPass = () => {
    setIsFocusedPass(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(`${url}/api/login`, { username, password })
        .then((res) => {
          const {
            token,
            userInfo: { name },
            role,
          } = res?.data;

          Cookies.set("token", token, { expires: 1 / 4 });
          onLogin(token, name, role);
          navigate("/");
        });
      setError("");
    } catch (err) {
      // console.log(err);
      setError(err.response.data);
    }
  };

  return (
    <div className={cx("login")}>
      <div className={cx("form")}>
        <form onSubmit={handleLogin}>
          <span className={cx("logo")}>
            <img src={images.logo} alt="logo"></img>
          </span>
          <span className={cx("title")}>Đăng nhập</span>
          <div className={cx("wrap-input")}>
            <input
              type="text"
              placeholder={isFocusedName ? "" : "Tên đăng nhập"}
              className={cx(
                "input",
                `${inputValueName && !isFocusedName ? "hasVal" : ""}`
              )}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setInputValueName(e.target.value);
              }}
              onFocus={handleFocusName}
              onBlur={handleBlurName}
            ></input>
            <span className={cx("material-symbols-outlined", "focus__icon")}>
              person
            </span>
            <span className={cx("focus-input")}></span>
          </div>

          <div className={cx("wrap-input")}>
            <input
              type="password"
              placeholder={isFocusedPass ? "" : "Mật khẩu"}
              className={cx(
                "input",
                `${inputValuePass && !isFocusedPass ? "hasVal" : ""}`
              )}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setInputValuePass(e.target.value);
              }}
              onFocus={handleFocusPass}
              onBlur={handleBlurPass}
            ></input>
            <span className={cx("material-symbols-outlined", "focus__icon")}>
              lock
            </span>
            <span className={cx("focus-input")}></span>
          </div>
          {error && <div className={cx("message")}>{error}</div>}
          <div className={cx("btn")}>
            <input
              type="submit"
              value="Đăng nhập"
              name="btnLogin"
              id="btnLogin"
              className={cx("btn-input")}
            />
          </div>
          <div className={cx("forgetPass")}>
            <Link to="/forgetPassWord">Quên mật khẩu?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
