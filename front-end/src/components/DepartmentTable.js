// src/components/DepartmentTable.js
import React from "react";

function DepartmentTable({ departments, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Tên khoa</th>
          <th>Mã khoa</th>
          <th>Trưởng khoa</th>
          <th>Số sinh viên</th>
          <th>Chức năng</th>
        </tr>
      </thead>
      <tbody>
        {departments.map((department, index) => (
          <tr key={index}>
            <td>{department.name}</td>
            <td>{department.code}</td>
            <td>{department.head}</td>
            <td>{department.students}</td>
            <td>
              <button onClick={() => onEdit(department)}>Sửa</button>
              <button onClick={() => onDelete(department._id)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DepartmentTable;
