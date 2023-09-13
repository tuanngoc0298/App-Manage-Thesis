const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT;

const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const majorRoutes = require("./routes/majorRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

// Kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Kết nối MongoDB thất bại!"));
db.once("open", () => {
  console.log("Kết nối MongoDB thành công!");
});

app.use(cors());
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", departmentRoutes);
app.use("/api", majorRoutes);
app.use("/api", teacherRoutes);

app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
