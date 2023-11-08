import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Permissions, ManagerUsers } from ".";
import { ErrorPage } from "~/Pages";

function Admin() {
  return (
    <Routes>
      <Route path="/permissions" element={<Permissions />} />
      <Route path="/managerUsers" element={<ManagerUsers />} />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default Admin;
