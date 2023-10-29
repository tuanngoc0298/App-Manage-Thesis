import styles from "./ErrorPage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ErrorPage = () => {
  return (
    <>
      <div className={cx("header")}>
        <h1>Server Error</h1>
      </div>
      <div className={cx("content")}>
        <div className={cx("content__container")}>
          <fieldset>
            <h2>404 - File or directory not found.</h2>
            <h3>
              The resource you are looking for might have been removed, had its name changed, or is temporarily
              unavailable.
            </h3>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
