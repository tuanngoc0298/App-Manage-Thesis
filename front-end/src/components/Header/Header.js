import images from "~/assets/img";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { HeaderContext } from "~/App";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);
function Header() {
  const navigate = useNavigate();
  const { userName, handleLogout } = useContext(HeaderContext);
  const url = process.env.REACT_APP_URL;

  const [changePassword, setChangePassword] = useState(false);
  const [errorChangePassword, setErrorChangePassword] = useState("");

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");

  const [curPasswordVisible, setCurPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

  const handleChangePassword = () => {
    if (currentPass && newPass && repeatPass) {
      if (newPass !== repeatPass) {
        return setErrorChangePassword("Nhập lại mật khẩu không chính xác!");
      }
      axios
        .put(
          `${url}/api/changePassword`,
          { currentPass, newPass },
          { withCredentials: true, baseURL: `${url}` }
        )
        .then((res) => {
          setErrorChangePassword("Cập nhật thành công");
        })
        .catch((err) => {
          // console.log(err);
          setErrorChangePassword(err.response.data);
        });
    } else {
      setErrorChangePassword("Vui lòng điền đầy đủ thông tin!");
    }
  };
  const handleCancleChangePassword = () => {
    setChangePassword(false);
    setCurrentPass("");
    setNewPass("");
    setRepeatPass("");
    setErrorChangePassword("");
  };

  const toggleCurPasswordVisibility = () => {
    setCurPasswordVisible(!curPasswordVisible);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };
  const toggleRePasswordVisibility = () => {
    setRePasswordVisible(!rePasswordVisible);
  };
  return (
    <header className={cx("header")}>
      <div className={cx("content")}>
        <img src={images.logo} className={cx("logo")} alt="logo" />
        <div className={cx("title")}>Hệ thống quản lý khóa luận tốt nghiệp</div>
        <div className={cx("actions")}>
          <p>
            Chào <span className={cx("actions-name")}>{userName}</span> |{" "}
            <button
              className={cx("changePass")}
              onClick={() => {
                setChangePassword(true);
              }}
            >
              Đổi mật khẩu
            </button>{" "}
            |
            <button
              className={cx("logout")}
              onClick={() => {
                handleLogout();
                navigate("/login");
              }}
            >
              Đăng xuất
            </button>
          </p>
        </div>
      </div>
      <div className={cx("menu")}>
        <ul className={cx("nav")}>
          <li className={cx("link")}>
            <a
              href="#!"
              onClick={() => {
                navigate("/");
              }}
            >
              Trang chủ quản lý khóa luận
            </a>
          </li>
          <li className={cx("link")}>
            <a href="https://thanglong.edu.vn/vi/node/1" target="_blank">
              Trang chủ nhà trường
            </a>
          </li>
        </ul>
      </div>
      {changePassword && (
        <div>
          <div className={cx("modal")}>
            <div
              className={cx("modal-close")}
              onClick={handleCancleChangePassword}
            >
              <span className="material-symbols-outlined">close</span>
            </div>
            <div className={cx("title-modal")}>Đổi mật khẩu</div>
            <div className={cx("form")}>
              <div>
                <div className={cx("details__input")}>
                  <input
                    type={curPasswordVisible ? "text" : "password"}
                    onChange={(e) => {
                      setCurrentPass(e.target.value);
                    }}
                    placeholder="Mật khẩu hiện tại"
                  />
                  <button
                    className={cx("btn")}
                    onClick={toggleCurPasswordVisibility}
                  >
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                </div>
                <div className={cx("details__input")}>
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    onChange={(e) => {
                      setNewPass(e.target.value);
                    }}
                    placeholder="Mật khẩu mới"
                  />
                  <button
                    className={cx("btn")}
                    onClick={toggleNewPasswordVisibility}
                  >
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                </div>

                <div className={cx("details__input")}>
                  <input
                    type={rePasswordVisible ? "text" : "password"}
                    onChange={(e) => {
                      setRepeatPass(e.target.value);
                    }}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    className={cx("btn")}
                    onClick={toggleRePasswordVisibility}
                  >
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                </div>
                {errorChangePassword && (
                  <div className={cx("message")}>{errorChangePassword}</div>
                )}
                <div className={cx("btns")}>
                  <button
                    className={cx("btn-modal")}
                    onClick={handleCancleChangePassword}
                  >
                    Hủy
                  </button>
                  <button
                    className={cx("btn-modal")}
                    onClick={handleChangePassword}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
    </header>
  );
}

export default Header;
