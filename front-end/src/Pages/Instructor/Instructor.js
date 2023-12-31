import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import {
  RegisterTopics,
  ApproveSuggestTopics,
  InstructedStudents,
  ApproveReportProgress,
  ApproveRegisterPresent,
  ApproveFinalReport,
  Feedback,
  ApproveRevisedFinalReport,
  UpdateResult,
  StatisticsCompletion,
  StatisticsStudent,
} from "./";
import { ErrorPage } from "~/Pages";

function Instructor() {
  return (
    <Routes>
      <Route path="/registerTopics" element={<RegisterTopics />} />
      <Route path="/approveSuggestTopics" element={<ApproveSuggestTopics />} />
      <Route path="/instructedStudents" element={<InstructedStudents />} />
      <Route path="/approveReportProgess" element={<ApproveReportProgress />} />
      <Route path="/approveRegisterPresent" element={<ApproveRegisterPresent />} />
      <Route path="/approveFinalReport" element={<ApproveFinalReport />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/approveRevisedFinalReport" element={<ApproveRevisedFinalReport />} />
      <Route path="/updateResult" element={<UpdateResult />} />
      <Route path="/statisticsCompletion" element={<StatisticsCompletion />} />
      <Route path="/statisticsStudent" element={<StatisticsStudent />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default Instructor;
