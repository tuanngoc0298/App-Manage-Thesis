import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HeadDepartment, Manager, Instructor } from "./Pages";

import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Register from "./components/Register/Register";
import { Login } from "~/components";

export const HeaderContext = createContext();

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function App() {
  const [token, setToken] = useState(Cookies.get("token"));

  const hasName = Cookies.get("token") ? jwt_decode(Cookies.get("token")).username : "";
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
      content = <p>Error occurred.</p>;
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
