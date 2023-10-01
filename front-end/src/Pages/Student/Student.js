import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ChooseTopics, SuggestTopic, ReportProgress, RegisterPresentProject } from "./";
import { Home } from "~/components";

function Manager() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/chooseTopics" element={<ChooseTopics />} />
      <Route path="/suggestTopic" element={<SuggestTopic />} />
      <Route path="/reportProgress" element={<ReportProgress />} />
      <Route path="/registerPresent" element={<RegisterPresentProject />} />
      {/* <Route path="/schoolYears" element={token ? <SchoolYears /> : <Navigate to="/" />} /> */}
    </Routes>
  );
}

export default Manager;
