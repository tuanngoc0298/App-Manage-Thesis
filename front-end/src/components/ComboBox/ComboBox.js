import "./ComboBox.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
function ComboBox({ onSelectionChange }) {
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/departments") // Điều này phải trùng với đường dẫn API bạn đã định nghĩa ở phía Node.js
      .then((res) => setData(res.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
    onSelectionChange(event.target.value);
  };

  return (
    <select className="wrap__comboBox" value={selectedValue} onChange={handleChange}>
      <option value="">Chọn một mục</option>
      {data.map((item) => (
        <option key={item._id} value={item.code}>
          {item.code}
        </option>
      ))}
    </select>
  );
}

export default ComboBox;
