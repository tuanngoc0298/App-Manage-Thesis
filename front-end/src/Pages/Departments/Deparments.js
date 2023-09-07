import "./Departments.scss";
import DefaultLayout from "~/Layout/DefaultLayout";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { HeaderContext } from "~/App";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: "", code: "", head: "", students: "" });
  const [editDepartment, setEditDepartment] = useState(null);
  const [error, setError] = useState("");

  const { token } = useContext(HeaderContext);

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
      .then((res) => {
        // Cập nhật danh sách khoa
        setDepartments([...departments, res.data]);
        console.log(departments);

        setNewDepartment({ name: "", code: "", head: "", students: "" });
        setError("");
      })
      .catch((err) => {
        setError("Không thể thêm khoa mới.");
      });
  };

  const handleEditDepartment = () => {
    console.log(editDepartment);
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
        console.log(updatedDepartments);
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
    <DefaultLayout>
      <div className="departments">
        <div>
          <h2 className="departments__title">Quản lý khoa</h2>
          <table className="departments__db">
            <thead>
              <tr>
                <th>Tên khoa</th>
                <th>Mã khoa</th>
                <th>Trưởng khoa</th>
                <th>Số sinh viên</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            {console.log(departments)}
            {departments.map((department, index) => (
              <tbody key={index}>
                {editDepartment && editDepartment._id === department._id ? (
                  <tr key={index}>
                    <td>
                      <input
                        className="departments__input"
                        type="text"
                        value={editDepartment.name}
                        onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="departments__input"
                        type="text"
                        value={editDepartment.code}
                        onChange={(e) => setEditDepartment({ ...editDepartment, code: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="departments__input"
                        type="text"
                        value={editDepartment.head}
                        onChange={(e) => setEditDepartment({ ...editDepartment, head: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="departments__input"
                        type="text"
                        value={editDepartment.students}
                        onChange={(e) => setEditDepartment({ ...editDepartment, students: e.target.value })}
                      />
                    </td>
                    <td>
                      <button className="departments__btn" onClick={handleEditDepartment}>
                        Lưu
                      </button>
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
                    <td className="departments__wrap-btn">
                      <button
                        className="departments__btn"
                        onClick={() => {
                          setEditDepartment(department);
                          console.log(department);
                        }}
                      >
                        Sửa
                      </button>
                      <button className="departments__btn" onClick={() => handleDeleteDepartment(department._id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </table>

          <button className="departments__btn departments__btn-add" onClick={handleAddDepartment}>
            Thêm khoa
          </button>
          <table>
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
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Departments;
