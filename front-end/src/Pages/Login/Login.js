import "./Login.scss";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import images from "~/assets/img";

function Login({ onLogin }) {
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
      const response = await axios.post("http://localhost:3001/api/login", { username, password });
      onLogin(response.data.token, username);
      setError("");
      navigate("/home");
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="container__login">
      <div className="container__form">
        <form onSubmit={handleLogin}>
          <span className="form__logo">
            <img src={images.logo}></img>
          </span>
          <span className="form__title">Đăng nhập</span>
          <div className="form__wrap-input">
            <input
              type="text"
              placeholder={isFocusedName ? "" : "Tên đăng nhập"}
              className={`form__input ${inputValueName && !isFocusedName ? "hasVal" : ""}`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setInputValueName(e.target.value);
              }}
              onFocus={handleFocusName}
              onBlur={handleBlurName}
            ></input>
            <span className="material-symbols-outlined focus__icon">person</span>
            <span className="focus-input"></span>
          </div>

          <div className="form__wrap-input">
            <input
              type="password"
              placeholder={isFocusedPass ? "" : "Mật khẩu"}
              className={`form__input ${inputValuePass && !isFocusedPass ? "hasVal" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setInputValuePass(e.target.value);
              }}
              onFocus={handleFocusPass}
              onBlur={handleBlurPass}
            ></input>
            <span className="material-symbols-outlined focus__icon">lock</span>
            <span className="focus-input"></span>
          </div>
          {error && <div className="message">{error}</div>}
          <div className="form__btn">
            <input type="submit" value="Đăng nhập" name="btnLogin" id="btnLogin" className="form__btn-input" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
