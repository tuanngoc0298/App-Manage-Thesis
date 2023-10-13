import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import {
  ChooseTopics,
  SuggestTopic,
  ReportProgress,
  RegisterPresentProject,
  ProtectionSchedule,
  SeeFeedback,
  SubmitFinalReport,
  SeeScoreResult,
} from "./";
import { Home } from "~/components";

function Manager() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/chooseTopics" element={<ChooseTopics />} />
      <Route path="/suggestTopic" element={<SuggestTopic />} />
      <Route path="/reportProgress" element={<ReportProgress />} />
      <Route path="/registerPresent" element={<RegisterPresentProject />} />
      <Route path="/protectionSchedule" element={<ProtectionSchedule />} />
      <Route path="/seeFeedback" element={<SeeFeedback />} />
      <Route path="/submitFinalReport" element={<SubmitFinalReport />} />
      <Route path="/seeScoreResult" element={<SeeScoreResult />} />
    </Routes>
  );
}

export default Manager;
