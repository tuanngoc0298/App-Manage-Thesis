import "./ComboBox.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
function ComboBox({ onSelectionChange, api }) {
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/${api}`)
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
        <option key={item._id} value={item.name}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

export default ComboBox;
