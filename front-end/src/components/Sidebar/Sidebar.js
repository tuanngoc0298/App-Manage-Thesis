import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import { useContext } from "react";
import { HeaderContext } from "~/App";
const cx = classNames.bind(styles);

function Sidebar() {
  const { userRole } = useContext(HeaderContext);

  let content;
  switch (userRole) {
    case "admin":
      content = <p>Loading...</p>;
      break;
    case "NguoiPhuTrach":
      content = (
        <div className={cx("list")}>
          <h2 className={cx("title")}>Quản lý đào tạo</h2>
          <ul>
            <li className={cx("item")}>
              <Link to="/managerStudents">Quản lý Sinh Viên</Link>
            </li>
          </ul>
        </div>
      );
      break;
    case "SinhVien":
      content = (
        <div className={cx("list")}>
          <h2 className={cx("title")}>Quản lý đào tạo</h2>
          <ul>
            <li className={cx("item")}>
              <Link to="/chooseTopics">Lựa chọn đề tài</Link>
            </li>
          </ul>
        </div>
      );
      break;
    case "GiaoVienHuongDan":
      content = (
        <div className={cx("list")}>
          <h2 className={cx("title")}>Quản lý đào tạo</h2>
          <ul>
            <li className={cx("item")}>
              <Link to="/registerTopics">Đăng ký đề tài</Link>
            </li>
          </ul>
        </div>
      );
      break;
    case "GiaoVienPhanBien":
      content = <p>Error occurred.</p>;
      break;
    case "HoiDongBaoVe":
      content = <p>Error occurred.</p>;
      break;
    case "PhongDaoTao":
      content = (
        <div className={cx("list")}>
          <h2 className={cx("title")}>Quản lý đào tạo</h2>
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
            <li className={cx("item")}>
              <Link to="/capstoneProjects">Quản lý học phần KLTN</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/schoolYears">Quản lý năm học</Link>
            </li>
          </ul>
        </div>
      );
      break;
    default:
      content = <p>Unknown status.</p>;
  }
  return <div className={cx("sidebar")}>{content}</div>;
}
export default Sidebar;
