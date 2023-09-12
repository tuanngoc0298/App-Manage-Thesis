import classNames from "classnames/bind";
import styles from "./DeleteModal.module.scss";

const cx = classNames.bind(styles);

function DeleteModal({ title, isOpenDeleteModal, id, handleCancleDelete, handleDelete }) {
  return (
    <div>
      {isOpenDeleteModal && (
        <div>
          <div className={cx("modal")}>
            <div className={cx("title")}>{title}</div>
            <div className={cx("form")}>
              <div className={cx("btns")}>
                <button className={cx("btn")} onClick={handleCancleDelete}>
                  Hủy
                </button>
                <button className={cx("btn")} onClick={() => handleDelete(id)}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </div>
      )}
    </div>
  );
}
export default DeleteModal;
