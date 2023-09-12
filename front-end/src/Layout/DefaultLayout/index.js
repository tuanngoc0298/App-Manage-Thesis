import { Header, Sidebar } from "~/components";

import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className={cx("wrapper")}>
        <Sidebar />
        <div className={cx("wrapper__content")}>{children}</div>
      </div>
    </div>
  );
}
export default DefaultLayout;
