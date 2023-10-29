import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import {
  ManagerStudents,
  AssignTeachers,
  AssignCounterTeachers,
  EstablishCouncil,
  UpdateState,
  StatisticsCompletion,
  StatisticsStudent,
} from ".";
import { ErrorPage } from "~/Pages";

function HeadMajor() {
  return (
    <Routes>
      <Route path="/managerStudents" element={<ManagerStudents />} />
      <Route path="/assignTeachers" element={<AssignTeachers />} />
      <Route path="/assignCounterTeachers" element={<AssignCounterTeachers />} />
      <Route path="/establishCouncil" element={<EstablishCouncil />} />
      <Route path="/updateState" element={<UpdateState />} />
      <Route path="/statisticsCompletion" element={<StatisticsCompletion />} />
      <Route path="/statisticsStudent" element={<StatisticsStudent />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default HeadMajor;
