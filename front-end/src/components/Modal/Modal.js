import ComboBox from "../ComboBox/ComboBox";
import classNames from "classnames/bind";
import styles from "./Modal.module.scss";

const cx = classNames.bind(styles);

function Modal({ name, fields, newData, error, handleCancle, handleLogic, handleChangeInput, indexsComboBox }) {
  let newFields = fields.map(([title, key], index) => (
    <div className={cx("row")} key={index}>
      <span className={cx("field")}>
        {title}
        <span style={{ color: "red" }}>*</span>
      </span>
      <div className={cx("wrap-input")}>
        <input
          type="text"
          value={newData[key]}
          onChange={(e) => handleChangeInput({ ...newData, [key]: e.target.value })}
        />
      </div>
    </div>
  ));
  const { nameDepartment } = newData;
  if (indexsComboBox) {
    indexsComboBox.forEach(({ title, index, onSelectionChange, api }) => {
      newFields.splice(
        index,
        0,
        <ComboBox oldData={nameDepartment} title={title} onSelectionChange={onSelectionChange} api={api} />
      );
    });
  }

  return (
    <div>
      <div className={cx("modal")}>
        <div className={cx("title")}>{name}</div>
        <div className={cx("form")}>
          {newFields}
          {error && <div className={cx("message")}>{error}</div>}
          <div className={cx("btns")}>
            <button className={cx("btn")} onClick={handleCancle}>
              Hủy
            </button>
            <button className={cx("btn")} onClick={handleLogic}>
              Lưu
            </button>
          </div>
        </div>
      </div>
      <div className={cx("overlay")}></div>
    </div>
  );
}
export default Modal;
