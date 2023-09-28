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
const approveSuggestTopicRoutes = require("./Instructor/approveSuggestTopicRoutes");
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
};

module.exports = allModules;
