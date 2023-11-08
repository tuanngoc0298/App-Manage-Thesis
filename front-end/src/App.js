import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { HeadDepartment, HeadMajor, Instructor, Student, Admin } from "./Pages";
import { Home, ForgetPass, Login, UpdateEmail } from "~/components";

import { PrivateRoute } from "~/utils";

import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Register from "./components/Register/Register";

export const HeaderContext = createContext();

function App() {
  const [token, setToken] = useState(Cookies.get("token"));

  const hasName = Cookies.get("token") ? jwt_decode(Cookies.get("token")).userInfo.name : "";
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
    case "Admin":
      content = <Admin />;
      break;
    case "Người phụ trách":
      content = <HeadMajor />;
      break;
    case "Sinh viên":
      content = <Student />;
      break;
    case "Giáo viên":
      content = <Instructor />;
      break;
    case "Phòng đào tạo":
      content = <HeadDepartment />;
      break;
    default:
  }

  return (
    <Router>
      <div className="App">
        <HeaderContext.Provider value={{ userName, handleLogout, token, userRole, PrivateRoute }}>
          <Routes>
            <Route path="/forgetPassWord" element={<ForgetPass />} />
            <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route element={<PrivateRoute />}>
              <Route index element={<Home />} />
              <Route path="/updateEmail" element={<UpdateEmail />} />
              <Route path="/*" element={content} />
            </Route>
          </Routes>
        </HeaderContext.Provider>
        {/* <Register /> */}
      </div>
    </Router>
  );
}

export default App;
