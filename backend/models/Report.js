const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  codeStudent: {
    type: String,
    required: true,
  },

  completeLevel: {
    type: String,
  },
  comment: {
    type: String,
  },
  file: {
    nameFile: String,
    data: Buffer,
  },
  stateReportProgress: {
    type: String,
    enum: ["Đang chờ duyệt", "Đã được phê duyệt", "Không phê duyệt"],
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
