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
} = require("./routes");

// Kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Kết nối MongoDB thất bại!"));
db.once("open", () => {
  console.log("Kết nối MongoDB thành công!");
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions));
// app.use(
//   session({
//     secret: "your-secret-key", // Thay thế bằng một khóa bí mật thực tế
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// PhongDaoTao
app.use("/api", authRoutes);
app.use("/api", departmentRoutes);
app.use("/api", majorRoutes);
app.use("/api", teacherRoutes);
app.use("/api", capstoneProjectRoutes);
app.use("/api", schoolYearRoutes);
// Nguoi Phu Trach
app.use("/api", studentRoutes);
app.use("/api", assignTeacherRoutes);

// GiaoVienHuongDan
app.use("/api", topicRoutes);
app.use("/api", approveSuggestTopicRoutes);
// Sinh vien
app.use("/api", chooseTopicRoutes);
app.use("/api", suggestTopicRoutes);

app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
