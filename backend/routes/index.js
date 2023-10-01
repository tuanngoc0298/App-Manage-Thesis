const authRoutes = require("./authRoutes");
const departmentRoutes = require("./HeadDepartment/departmentRoutes");
const majorRoutes = require("./HeadDepartment/majorRoutes");
const teacherRoutes = require("./HeadDepartment/teacherRoutes");
const capstoneProjectRoutes = require("./HeadDepartment/capstoneProjectRoutes");
const schoolYearRoutes = require("./HeadDepartment/schoolYearRoutes");
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
const assignTeacherRoutes = require("./HeadMajor/assignTeacherRoutes");

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
};

module.exports = allModules;
