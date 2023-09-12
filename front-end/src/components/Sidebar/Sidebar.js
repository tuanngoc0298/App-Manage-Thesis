import "./Sidebar.scss";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__list">
        <h2 className="list__title">Chức năng</h2>
        <ul>
          <li className="list__item">
            <Link to="/departments">Quản lý khoa</Link>
          </li>
          <li className="list__item">
            <Link to="/majors">Quản lý ngành</Link>
          </li>

          <li className="list__item">
            <Link to="/majors">Quản lý ngành</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Sidebar;
