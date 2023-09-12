import images from "~/assets/img";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { HeaderContext } from "~/App";

import classNames from "classnames/bind";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);
function Header() {
  const navigate = useNavigate();
  const { username, handleLogout } = useContext(HeaderContext);
  return (
    <header className={cx("header")}>
      <div className={cx("content")}>
        <img src={images.logo} className={cx("logo")} alt="logo" />
        <div className={cx("title")}>Hệ thống quản lý khóa luận tốt nghiệp</div>
        <div className={cx("actions")}>
          <p>
            Chào <span className={cx("actions-name")}>{username}</span> |{" "}
            <button className={cx("changePass")}>Đổi mật khẩu</button> |
            <button
              className={cx("logout")}
              onClick={() => {
                handleLogout();
                navigate("/");
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
            <a href="#">Trang chủ quản lý khóa luận</a>
          </li>
          <li className={cx("link")}>
            <a href="#">Trang chủ nhà trường</a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
