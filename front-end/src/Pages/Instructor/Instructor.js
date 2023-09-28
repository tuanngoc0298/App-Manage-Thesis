import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { RegisterTopics, ApproveSuggestTopics } from "./";
import { Home } from "~/components";

function Instructor() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/registerTopics" element={<RegisterTopics />} />
      <Route path="/approveSuggestTopics" element={<ApproveSuggestTopics />} />
      {/* <Route path="/teachers" element={token ? <Teachers /> : <Navigate to="/" />} />
      <Route path="/CapstoneProjects" element={token ? <CapstoneProjects /> : <Navigate to="/" />} />
      <Route path="/schoolYears" element={token ? <SchoolYears /> : <Navigate to="/" />} /> */}
    </Routes>
  );
}

export default Instructor;
