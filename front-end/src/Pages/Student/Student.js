import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ChooseTopics } from "./";
import { Home } from "~/components";

function Manager() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/chooseTopics" element={<ChooseTopics />} />
      {/* <Route path="/majors" element={token ? <Majors /> : <Navigate to="/" />} />
      <Route path="/teachers" element={token ? <Teachers /> : <Navigate to="/" />} />
      <Route path="/CapstoneProjects" element={token ? <CapstoneProjects /> : <Navigate to="/" />} />
      <Route path="/schoolYears" element={token ? <SchoolYears /> : <Navigate to="/" />} /> */}
    </Routes>
  );
}

export default Manager;
