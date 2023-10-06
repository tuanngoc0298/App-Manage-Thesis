const authRoutes = require("./authRoutes");
const departmentRoutes = require("./HeadDepartment/departmentRoutes");
const majorRoutes = require("./HeadDepartment/majorRoutes");
const teacherRoutes = require("./HeadDepartment/teacherRoutes");
const capstoneProjectRoutes = require("./HeadDepartment/capstoneProjectRoutes");
const schoolYearRoutes = require("./HeadDepartment/schoolYearRoutes");
const establishCouncilRoutes = require("./HeadMajor/establishCouncilRoutes");
const studentRoutes = require("./HeadMajor/studentRoutes");
const topicRoutes = require("./Instructor/topicRoutes");
const chooseTopicRoutes = require("./Student/chooseTopicRoutes");
const suggestTopicRoutes = require("./Student/suggestTopicRoutes");
const reportProgressRoutes = require("./Student/reportProgressRoutes");
const registerPresentProjectRoutes = require("./Student/registerPresentProjectRoutes");
const approveSuggestTopicRoutes = require("./Instructor/approveSuggestTopicRoutes");
const instructedStudentRoutes = require("./Instructor/instructedStudentRoutes");
const approveReportProgressRoutes = require("./Instructor/approveReportProgressRoutes");
const approveRegisterPresentRoutes = require("./Instructor/approveRegisterPresentRoutes");
const approveFinalReportRoutes = require("./Instructor/approveFinalReportRoutes");
const assignTeacherRoutes = require("./HeadMajor/assignTeacherRoutes");
const assignCounterTeacherRoutes = require("./HeadMajor/assignCounterTeacherRoutes");

const allModules = {
  authRoutes,
  departmentRoutes,
  majorRoutes,
  teacherRoutes,
  capstoneProjectRoutes,
  schoolYearRoutes,
  studentRoutes,
  topicRoutes,
  chooseTopicRoutes,
  suggestTopicRoutes,
  approveSuggestTopicRoutes,
  assignTeacherRoutes,
  instructedStudentRoutes,
  reportProgressRoutes,
  approveReportProgressRoutes,
  registerPresentProjectRoutes,
  approveRegisterPresentRoutes,
  approveFinalReportRoutes,
  assignCounterTeacherRoutes,
  establishCouncilRoutes,
};

module.exports = allModules;
