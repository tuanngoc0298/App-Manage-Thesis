import React, { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/register", { username, password, role });
      onRegister(response.data.token);
      setError("");
    } catch (err) {
      setError("Đăng ký không thành công.");
    }
  };

  return (
    <div>
      <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Vai trò" value={role} onChange={(e) => setRole(e.target.value)} />
      <button onClick={handleRegister}>Đăng ký</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;
