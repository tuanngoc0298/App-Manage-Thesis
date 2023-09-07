import "./Header.scss";
import images from "~/assets/img";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { HeaderContext } from "~/App";

function Header() {
  const navigate = useNavigate();
  const { username, handleLogout } = useContext(HeaderContext);
  return (
    <header id="header">
      <div className="header__content">
        <img src={images.logo} className="header__logo" />
        <div className="header__title">Hệ thống quản lý khóa luận tốt nghiệp</div>
        <div className="header__actions">
          <p>
            Chào <span className="header__actions-name">{username}</span> |{" "}
            <button className="header__changePass">Đổi mật khẩu</button> |
            <button
              className="header__logout"
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
      <div className="header__menu">
        <ul className="header__nav">
          <li className="header__link">
            <a href="#">Trang chủ quản lý khóa luận</a>
          </li>
          <li className="header__link">
            <a href="#">Trang chủ nhà trường</a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
