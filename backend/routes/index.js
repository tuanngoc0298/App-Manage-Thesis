const authRoutes = require("./authRoutes");
const statisticsCompletionRoutes = require("./statisticsCompletionRoutes");
const statisticsStudentRoutes = require("./statisticsStudentRoutes");

// Admin
const permissionRoutes = require("./Admin/permissionRoutes");
const managerUserRoutes = require("./Admin/managerUserRoutes");

// Phong Đào Tạo
const departmentRoutes = require("./HeadDepartment/departmentRoutes");
const majorRoutes = require("./HeadDepartment/majorRoutes");
const teacherRoutes = require("./HeadDepartment/teacherRoutes");
const capstoneProjectRoutes = require("./HeadDepartment/capstoneProjectRoutes");
const schoolYearRoutes = require("./HeadDepartment/schoolYearRoutes");
// Trưởng ngành
const establishCouncilRoutes = require("./HeadMajor/establishCouncilRoutes");
const studentRoutes = require("./HeadMajor/studentRoutes");
const assignTeacherRoutes = require("./HeadMajor/assignTeacherRoutes");
const assignCounterTeacherRoutes = require("./HeadMajor/assignCounterTeacherRoutes");
const updateStateRoutes = require("./HeadMajor/updateStateRoutes");
// Sinh viên
const chooseTopicRoutes = require("./Student/chooseTopicRoutes");
const suggestTopicRoutes = require("./Student/suggestTopicRoutes");
const reportProgressRoutes = require("./Student/reportProgressRoutes");
const registerPresentProjectRoutes = require("./Student/registerPresentProjectRoutes");
const protectionScheduleRoutes = require("./Student/protectionScheduleRoutes");
const seeFeedbackRoutes = require("./Student/seeFeedbackRoutes");
const submitFinalReportRoutes = require("./Student/submitFinalReportRoutes");
const seeScoreResultRoutes = require("./Student/seeScoreResultRoutes");

// Giáo viên
const topicRoutes = require("./Instructor/topicRoutes");
const approveSuggestTopicRoutes = require("./Instructor/approveSuggestTopicRoutes");
const instructedStudentRoutes = require("./Instructor/instructedStudentRoutes");
const approveReportProgressRoutes = require("./Instructor/approveReportProgressRoutes");
const approveRegisterPresentRoutes = require("./Instructor/approveRegisterPresentRoutes");
const approveFinalReportRoutes = require("./Instructor/approveFinalReportRoutes");
const approveRevisedFinalReportRoutes = require("./Instructor/approveRevisedFinalReportRoutes");
const updateResultRoutes = require("./Instructor/updateResultRoutes");
const feedbackRoutes = require("./Instructor/feedbackRoutes");

const allModules = {
  statisticsCompletionRoutes,
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
  protectionScheduleRoutes,
  feedbackRoutes,
  seeFeedbackRoutes,
  submitFinalReportRoutes,
  approveRevisedFinalReportRoutes,
  updateResultRoutes,
  seeScoreResultRoutes,
  updateStateRoutes,
  statisticsStudentRoutes,
  permissionRoutes,
  managerUserRoutes,
};

module.exports = allModules;
