import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ManagerStudents, AssignTeachers } from ".";
import { Home } from "~/components";

function HeadMajor() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/managerStudents" element={<ManagerStudents />} />
      <Route path="/assignTeachers" element={<AssignTeachers />} />
      {/* <Route path="/teachers" element={token ? <Teachers /> : <Navigate to="/" />} />
      <Route path="/CapstoneProjects" element={token ? <CapstoneProjects /> : <Navigate to="/" />} />
      <Route path="/schoolYears" element={token ? <SchoolYears /> : <Navigate to="/" />} /> */}
    </Routes>
  );
}

export default HeadMajor;
