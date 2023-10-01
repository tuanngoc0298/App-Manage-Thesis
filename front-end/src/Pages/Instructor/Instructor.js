import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import {
  RegisterTopics,
  ApproveSuggestTopics,
  InstructedStudents,
  ApproveReportProgress,
  ApproveRegisterPresent,
} from "./";
import { Home } from "~/components";

function Instructor() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/registerTopics" element={<RegisterTopics />} />
      <Route path="/approveSuggestTopics" element={<ApproveSuggestTopics />} />
      <Route path="/instructedStudents" element={<InstructedStudents />} />
      <Route path="/approveReportProgess" element={<ApproveReportProgress />} />
      <Route path="/approveRegisterPresent" element={<ApproveRegisterPresent />} />
    </Routes>
  );
}

export default Instructor;
