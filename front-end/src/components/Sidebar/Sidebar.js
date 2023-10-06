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
            <li className={cx("item")}>
              <Link to="/assignTeachers">Phân công giáo viên hướng dẫn</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/assignCounterTeachers">Phân công giáo viên phản biện</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/establishCouncil">Thành lập HĐBV</Link>
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
            <li className={cx("item")}>
              <Link to="/suggestTopic">Đề tài đề xuất</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/reportProgress">Báo cáo tiến độ</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/registerPresent">Đăng ký bảo vệ</Link>
            </li>
          </ul>
        </div>
      );

      break;
    case "GiaoVien":
      content = (
        <div className={cx("list")}>
          <h2 className={cx("title")}>Quản lý đào tạo</h2>
          <ul>
            <li className={cx("item")}>
              <Link to="/registerTopics">Đăng ký đề tài</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/approveSuggestTopics">Duyệt đề tài đề xuất</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/instructedStudents">Danh sách sinh viên hướng dẫn</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/approveReportProgess">Kiểm tra tiến độ</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/approveRegisterPresent">Duyệt đăng ký bảo vệ</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/approveFinalReport">Duyệt báo cáo</Link>
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
