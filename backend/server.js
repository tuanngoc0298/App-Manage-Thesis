const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const port = process.env.PORT;

const {
  permissionRoutes,
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
  statisticsCompletionRoutes,
  statisticsStudentRoutes,
  managerUserRoutes,
} = require("./routes");

// Kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Kết nối MongoDB thất bại!"));
db.once("open", () => {
  console.log("Kết nối MongoDB thành công!");
});

// app.use(express.json());
// app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(cors());

app.use("/api", authRoutes);
app.use("/api", statisticsCompletionRoutes);
app.use("/api", statisticsStudentRoutes);

// Admin
app.use("/api", permissionRoutes);
app.use("/api", managerUserRoutes);

// PhongDaoTao
app.use("/api", departmentRoutes);
app.use("/api", majorRoutes);
app.use("/api", teacherRoutes);
app.use("/api", capstoneProjectRoutes);
app.use("/api", schoolYearRoutes);
// Nguoi Phu Trach
app.use("/api", studentRoutes);
app.use("/api", assignTeacherRoutes);
app.use("/api", assignCounterTeacherRoutes);
app.use("/api", instructedStudentRoutes);
app.use("/api", establishCouncilRoutes);
app.use("/api", updateStateRoutes);

// GiaoVienHuongDan
app.use("/api", topicRoutes);
app.use("/api", approveSuggestTopicRoutes);
app.use("/api", approveReportProgressRoutes);
app.use("/api", approveRegisterPresentRoutes);
app.use("/api", approveRevisedFinalReportRoutes);
app.use("/api", updateResultRoutes);

// GiaoVienPhanBien
app.use("/api", approveFinalReportRoutes);
// Thư ký
app.use("/api", feedbackRoutes);

// Sinh vien
app.use("/api", chooseTopicRoutes);
app.use("/api", suggestTopicRoutes);
app.use("/api", reportProgressRoutes);
app.use("/api", registerPresentProjectRoutes);
app.use("/api", protectionScheduleRoutes);
app.use("/api", seeFeedbackRoutes);
app.use("/api", submitFinalReportRoutes);
app.use("/api", seeScoreResultRoutes);

app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
