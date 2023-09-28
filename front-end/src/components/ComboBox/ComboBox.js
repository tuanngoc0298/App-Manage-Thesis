import React, { useState, useEffect } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./ComboBox.module.scss";

const cx = classNames.bind(styles);
function ComboBox({
  title,
  onSelectionChange,
  api,
  selfData,
  oldData,
  isRequired = true,
  nameData = "name",
  onGetInitialValue,
  hasTitle = true,
  customStyle,
  defaultDisplay = "Chọn một mục",
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (api) {
      axios
        .get(`http://localhost:3001/api/${api}`, {
          withCredentials: true,
          baseURL: "http://localhost:3001",
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => console.error(error));
    } else {
      setData(selfData);
      if (onGetInitialValue) onGetInitialValue(oldData);
    }
  }, [api]);

  const handleChange = (event) => {
    onSelectionChange(event.target.value);
  };
  const uniqueValues = new Set();
  return (
    <div className={cx("row")} style={customStyle}>
      {hasTitle && (
        <span className={cx("field")}>
          {title}
          {isRequired && <span style={{ color: "red" }}>*</span>}
        </span>
      )}
      <div className={cx("wrap-input")}>
        <select className={cx("wrap__comboBox")} value={oldData} onChange={handleChange}>
          <option value="">{defaultDisplay}</option>
          {data.map((item, index) => {
            const value = item[nameData];
            if (!uniqueValues.has(value)) {
              uniqueValues.add(value); // Thêm giá trị vào Set để đánh dấu đã sử dụng
              return (
                <option value={value} key={index}>
                  {value}
                </option>
              );
            }
          })}
        </select>
      </div>
    </div>
  );
}

export default ComboBox;
