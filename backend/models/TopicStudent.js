const mongoose = require("mongoose");

const topicStudentSchema = new mongoose.Schema({
  codeStudent: {
    type: String,
    required: true,
    unique: true,
  },
  nameTopic: {
    type: String,
    required: true,
  },
  nameTeacher: {
    type: String,
    required: true,
  },
  nameCounterTeacher: {
    type: String,
  },
  yearTopic: {
    type: String,
    required: true,
  },
  semesterTopic: {
    type: String,
    required: true,
  },
  commentFinal: {
    type: String,
  },
  fileFinal: {
    nameFile: String,
    data: Buffer,
  },

  statePresentProject: {
    type: String,
    enum: ["Đang chờ duyệt", "Đã được phê duyệt", "Không phê duyệt", "Được bảo vệ khóa luận"],
  },
  stateApproveProject: {
    type: String,
    enum: ["Đang chờ duyệt", "Đã được phê duyệt", "Không phê duyệt"],
  },

  protectionCouncil: {
    nameCouncil: {
      type: String,
    },

    describeCouncil: {
      type: String,
    },
    members: {
      chairperson: String,
      secretary: String,
      commissioner: String,
    },
    shift: {
      type: String,
    },
    time: {
      type: String,
    },
    roomCode: {
      type: String,
    },
    stateProtection: {
      type: String,
      enum: ["Chưa bảo vệ", "Đã bảo vệ"],
    },
  },
  feedback: {
    fileFeedback: {
      nameFile: String,
      data: Buffer,
    },
    stateFeedback: {
      type: String,
      enum: ["Cần chỉnh sửa", "Không cần chỉnh sửa"],
    },
    timeFeedback: {
      type: String,
    },
  },
  scoreResult: {
    teacher: {
      scores: {
        type: [Number],
        default: undefined,
      },
      total: Number,
    },
    counterTeacher: {
      scores: {
        type: [Number],
        default: undefined,
      },
      total: Number,
    },
    chairperson: {
      scores: {
        type: [Number],
        default: undefined,
      },
      total: Number,
    },
    secretary: {
      scores: {
        type: [Number],
        default: undefined,
      },
      total: Number,
    },
    commissioner: {
      scores: {
        type: [Number],
        default: undefined,
      },
      total: Number,
    },
    average: Number,
  },
});

module.exports = mongoose.model("TopicStudent", topicStudentSchema);
