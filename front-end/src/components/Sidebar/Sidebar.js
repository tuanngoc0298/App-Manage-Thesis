import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

function Sidebar() {
  return (
    <div className={cx("sidebar")}>
      <div className={cx("list")}>
        <h2 className={cx("title")}>Chức năng</h2>
        <ul>
          <li className={cx("item")}>
            <Link to="/departments">Quản lý khoa</Link>
          </li>
          <li className={cx("item")}>
            <Link to="/majors">Quản lý ngành</Link>
          </li>
          <li className={cx("item")}>
            <Link to="/teachers">Quản lý giáo viên</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Sidebar;
