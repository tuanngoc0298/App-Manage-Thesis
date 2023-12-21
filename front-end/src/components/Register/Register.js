import React, { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {
  const url = process.env.REACT_APP_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${url}/api/register`, {
        username,
        password,
        role,
        userCode,
      });

      setError("Đăng ký thành công");
    } catch (err) {
      setError("Đăng ký không thành công.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mã người dùng"
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Vai trò"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={handleRegister}>Đăng ký</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;
