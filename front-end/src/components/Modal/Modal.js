import ComboBox from "../ComboBox/ComboBox";
import classNames from "classnames/bind";
import styles from "./Modal.module.scss";

const cx = classNames.bind(styles);

function Modal({
  name,
  fields,
  details,
  newData,
  error,
  handleCancle,
  handleLogic,
  handleChangeInput,
  indexsComboBox,
  handleApproveTopic,
  handleFileChange,
}) {
  let newFields;
  if (fields) {
    newFields = fields.map(([title, key], index) => (
      <div className={cx("row")} key={index}>
        <span className={cx("field")}>
          {title}
          <span style={{ color: "red" }}>*</span>
        </span>
        <div className={cx("wrap-input")}>
          <input
            type="text"
            value={newData && newData[key]}
            onChange={(e) => handleChangeInput({ ...newData, [key]: e.target.value })}
          />
        </div>
      </div>
    ));
    if (indexsComboBox) {
      indexsComboBox.forEach((item) => {
        newFields.splice(item.index, 0, <ComboBox {...item} />);
      });
    }
  }

  if (details) {
    newFields = (
      <div>
        <div className={cx("wrap-details")}>
          {details.map(([key, value], index) => (
            <div key={index}>
              <span className={cx("details__title")}>{key}:</span> {value}
            </div>
          ))}
        </div>
        {indexsComboBox ? (
          <div>
            <ComboBox {...indexsComboBox} />
          </div>
        ) : (
          <div className={cx("details__checkBox")}>
            <label>
              <input
                type="radio"
                checked={handleApproveTopic.isApprove === "Duyệt"}
                onChange={() => handleApproveTopic.setIsApprove("Duyệt")}
              />{" "}
              Phê duyệt
            </label>
            <label>
              <input
                type="radio"
                checked={handleApproveTopic.isApprove === "Từ chối"}
                onChange={() => handleApproveTopic.setIsApprove("Từ chối")}
              />{" "}
              Từ chối
            </label>
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      <div className={cx("modal", `${details ? "custom" : ""}`)}>
        <div className={cx("title")}>{name}</div>
        <div className={cx("form")}>
          {newFields}
          {handleFileChange && (
            <div id="formUpload" className={cx("uploadFile")}>
              <span>Tải lên: </span>
              <input type="file" accept=".zip" onChange={handleFileChange} />
            </div>
          )}
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
