import React, { useState, useEffect } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./ComboBox.module.scss";

const cx = classNames.bind(styles);
function ComboBox({ title, onSelectionChange, api, oldData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/${api}`)
      .then((res) => setData(res.data))
      .catch((error) => console.error(error));
  }, [api]);

  const handleChange = (event) => {
    // console.log(event.target.value);

    onSelectionChange(event.target.value);
  };

  return (
    <div className={cx("row")}>
      <span className={cx("field")}>
        {title}
        <span style={{ color: "red" }}>*</span>
      </span>
      <div className={cx("wrap-input")}>
        <select className={cx("wrap__comboBox")} value={oldData} onChange={handleChange}>
          <option value="">Chọn một mục</option>
          {data.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ComboBox;
