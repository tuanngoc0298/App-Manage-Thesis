import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DepartmentTable from "./DepartmentTable";

function Department({ token }) {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: "", code: "", head: "", students: 0 });
  const [editDepartment, setEditDepartment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Gọi API để lấy danh sách khoa
    axios
      .get("http://localhost:3001/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((err) => {
        setError("Không thể tải danh sách khoa.");
      });
  }, [token]);

  const handleAddDepartment = () => {
    // Gọi API để thêm khoa mới
    axios
      .post("http://localhost:3001/api/departments", newDepartment, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách khoa
        setDepartments([...departments, newDepartment]);
        setNewDepartment({});
        setError("");
      })
      .catch((err) => {
        setError("Không thể thêm khoa mới.");
      });
  };

  const handleEditDepartment = () => {
    // Gọi API để sửa khoa
    axios
      .put(`http://localhost:3001/api/departments/${editDepartment._id}`, editDepartment, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách khoa
        const updatedDepartments = departments.map((department) => {
          if (department._id === editDepartment._id) {
            return { ...department, ...editDepartment };
          }
          return department;
        });
        setDepartments(updatedDepartments);
        setEditDepartment(null);
        setError("");
      })
      .catch((err) => {
        setError("Không thể sửa khoa.");
      });
  };

  const handleDeleteDepartment = (id) => {
    // Gọi API để xóa khoa
    axios
      .delete(`http://localhost:3001/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Cập nhật danh sách khoa
        const updatedDepartments = departments.filter((department) => department._id !== id);
        setDepartments(updatedDepartments);
        setError("");
      })
      .catch((err) => {
        setError("Không thể xóa khoa.");
      });
  };
  return (
    <div>
      <h2>Quản lý khoa</h2>
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

        {departments.map((department, index) => (
          <tbody>
            {editDepartment && editDepartment._id === department._id ? (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={editDepartment.name}
                    onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editDepartment.code}
                    onChange={(e) => setEditDepartment({ ...editDepartment, code: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editDepartment.head}
                    onChange={(e) => setEditDepartment({ ...editDepartment, head: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editDepartment.students}
                    onChange={(e) => setEditDepartment({ ...editDepartment, students: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={handleEditDepartment}>Lưu</button>
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>
                  <div>{department.name} </div>
                </td>
                <td>
                  <div>{department.code} </div>
                </td>
                <td>
                  <div>{department.head} </div>
                </td>
                <td>
                  <div>{department.students} </div>
                </td>
                <td>
                  <button onClick={() => setEditDepartment(department)}>Sửa</button>
                  <button onClick={() => handleDeleteDepartment(department._id)}>Xóa</button>
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>

      {/* <table>
        <thead>
          <tr>
            <th>Tên Khoa</th>
            <th>Mã Khoa</th>
            <th>Trưởng Khoa</th>
            <th>Số Sinh Viên</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newDepartment.code}
                onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newDepartment.head}
                onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newDepartment.students}
                onChange={(e) => setNewDepartment({ ...newDepartment, students: e.target.value })}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleAddDepartment}>Thêm khoa</button> */}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Department;
