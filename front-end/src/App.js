import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { Home, Login, Departments } from "./Pages";

import Register from "./components/Register/Register";
import Department from "./components/Department";

export const HeaderContext = createContext();

function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = (newToken, username) => {
    setToken(newToken);
    setUsername(username);
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <Router>
      <div className="App">
        <HeaderContext.Provider value={{ username, handleLogout, token }}>
          <Routes>
            <Route exact path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/majors" element={<Departments />} />
          </Routes>
        </HeaderContext.Provider>
      </div>
    </Router>
  );
}

export default App;
