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
    case "Admin":
      content = (
        <div className={cx("list")}>
          <h2 className={cx("title")}>Quản lý đào tạo</h2>
          <ul>
            <li className={cx("item")}>
              <Link to="/permissions">Quản lý Nhóm quyền</Link>
              <Link to="/managerUsers">Quản lý Người dùng</Link>
            </li>
            {/* <li className={cx("item")}>
          <Link to="/assignTeachers">Phân công giáo viên hướng dẫn</Link>
        </li> */}
          </ul>
        </div>
      );
      break;
    case "Người phụ trách":
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
            <li className={cx("item")}>
              <Link to="/updateState">Cập nhật trạng thái KLTN</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/statisticsCompletion">Thống kê tỷ lệ hoàn thành KLTN</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/statisticsStudent">Thống kê số lượng SV hướng dẫn</Link>
            </li>
          </ul>
        </div>
      );
      break;
    case "Sinh viên":
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
            <li className={cx("item")}>
              <Link to="/protectionSchedule">Xem lịch bảo vệ</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/seeFeedback">Xem nhận xét bảo vệ</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/submitFinalReport">Nộp báo cáo cuối</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/seeScoreResult">Xem điểm KLTN</Link>
            </li>
          </ul>
        </div>
      );

      break;
    case "Giáo viên":
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
            <li className={cx("item")}>
              <Link to="/feedback">Nhận xét bảo vệ</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/approveRevisedFinalReport">Duyệt báo cáo cuối</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/updateResult">Cập nhật điểm KLTN</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/statisticsCompletion">Thống kê tỷ lệ hoàn thành KLTN</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/statisticsStudent">Thống kê số lượng SV hướng dẫn</Link>
            </li>
          </ul>
        </div>
      );
      break;

    case "Phòng đào tạo":
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
            <li className={cx("item")}>
              <Link to="/statisticsCompletion">Thống kê tỷ lệ hoàn thành KLTN</Link>
            </li>
            <li className={cx("item")}>
              <Link to="/statisticsStudent">Thống kê số lượng SV hướng dẫn</Link>
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
