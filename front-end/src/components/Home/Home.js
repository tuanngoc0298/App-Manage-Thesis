import { Link } from "react-router-dom";

import DefaultLayout from "~/Layout/DefaultLayout";

import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function Home() {
  return (
    <DefaultLayout>
      <div className={cx("title")}>
        <Link to="/updateEmail">
          Nhấn vào dòng này để cập nhật địa chỉ Email, số điện thoại cá nhân của mình (khi quên mật khẩu, có thể sử dụng
          Email này để lấy lại mật khẩu).
        </Link>
      </div>
    </DefaultLayout>
  );
}

export default Home;
