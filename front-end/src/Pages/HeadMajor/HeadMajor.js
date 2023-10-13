import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ManagerStudents, AssignTeachers, AssignCounterTeachers, EstablishCouncil, UpdateState } from ".";
import { Home } from "~/components";

function HeadMajor() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/managerStudents" element={<ManagerStudents />} />
      <Route path="/assignTeachers" element={<AssignTeachers />} />
      <Route path="/assignCounterTeachers" element={<AssignCounterTeachers />} />
      <Route path="/establishCouncil" element={<EstablishCouncil />} />
      <Route path="/updateState" element={<UpdateState />} />
    </Routes>
  );
}

export default HeadMajor;
