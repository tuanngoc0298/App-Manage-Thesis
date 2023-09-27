import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { HeadDepartment, HeadMajor, Instructor, Student } from "./Pages";

import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Register from "./components/Register/Register";
import { Login } from "~/components";

export const HeaderContext = createContext();

function App() {
  const [token, setToken] = useState(Cookies.get("token"));

  const hasName = Cookies.get("token") ? jwt_decode(Cookies.get("token")).nameUser : "";
  const hasRole = Cookies.get("token") ? jwt_decode(Cookies.get("token")).role : "";

  const [userName, setUserName] = useState(hasName);
  const [userRole, setUserRole] = useState(hasRole);

  const handleLogin = (newToken, userName, role) => {
    setToken(newToken);
    setUserName(userName);
    setUserRole(role);
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUserName(null);
    setUserRole(null);
    Cookies.remove("token");
  };

  let content;
  switch (userRole) {
    case "admin":
      content = <p>Loading...</p>;
      break;
    case "NguoiPhuTrach":
      content = <HeadMajor />;
      break;
    case "SinhVien":
      content = <Student />;
      break;
    case "GiaoVien":
      content = <Instructor />;
      break;
    case "PhongDaoTao":
      content = <HeadDepartment />;
      break;
  }
  return (
    <Router>
      <div className="App">
        {!token && <Login onLogin={handleLogin} />}
        <HeaderContext.Provider value={{ userName, handleLogout, token, userRole }}>{content}</HeaderContext.Provider>
        {/* <Register /> */}
      </div>
    </Router>
  );
}

export default App;
