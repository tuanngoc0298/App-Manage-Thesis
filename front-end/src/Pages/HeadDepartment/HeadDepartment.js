import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import {
  Departments,
  Majors,
  Teachers,
  CapstoneProjects,
  SchoolYears,
  StatisticsCompletion,
  StatisticsStudent,
} from ".";
import { Home } from "~/components";

function HeadDepartment() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/majors" element={<Majors />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/CapstoneProjects" element={<CapstoneProjects />} />
      <Route path="/schoolYears" element={<SchoolYears />} />
      <Route path="/statisticsCompletion" element={<StatisticsCompletion />} />
      <Route path="/statisticsStudent" element={<StatisticsStudent />} />
    </Routes>
  );
}

export default HeadDepartment;
