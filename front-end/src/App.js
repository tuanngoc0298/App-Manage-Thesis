import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HeadDepartment, Manager, Instructor, Student } from "./Pages";

import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Register from "./components/Register/Register";
import { Login } from "~/components";

export const HeaderContext = createContext();

function App() {
  const [token, setToken] = useState(Cookies.get("token"));

  const hasName = Cookies.get("token") ? jwt_decode(Cookies.get("token")).userInfo.name : "";
  const hasRole = Cookies.get("token") ? jwt_decode(Cookies.get("token")).role : "";

  const [username, setUsername] = useState(hasName);
  const [userRole, setUserRole] = useState(hasRole);

  const handleLogin = (newToken, username, role) => {
    setToken(newToken);
    setUsername(username);
    setUserRole(role);
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setUserRole(null);
    Cookies.remove("token");
  };

  let content;
  switch (userRole) {
    case "admin":
      content = <p>Loading...</p>;
      break;
    case "NguoiPhuTrach":
      content = <Manager />;
      break;
    case "SinhVien":
      content = <Student />;
      break;
    case "GiaoVienHuongDan":
      content = <Instructor />;
      break;
    case "GiaoVienPhanBien":
      content = <p>Error occurred.</p>;
      break;
    case "HoiDongBaoVe":
      content = <p>Error occurred.</p>;
      break;
    case "PhongDaoTao":
      content = <HeadDepartment />;
      break;
    default:
      content = <p>Unknown status.</p>;
  }
  return (
    <Router>
      <div className="App">
        {!token && <Login onLogin={handleLogin} />}
        <HeaderContext.Provider value={{ username, handleLogout, token, userRole }}>{content}</HeaderContext.Provider>
        <Register />
      </div>
    </Router>
  );
}

export default App;
