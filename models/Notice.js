const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
  {
    noticeTitle: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: [150, "Please limit the title to 150 characters"],
    },

    noticeFile: {
      type: String,
      required: [true, "Notice file is required"],
    },

    postedBy: {
      type: {
        user: {
          type: mongoose.Types.ObjectId,
          required: [true, "Notice sender is required!"],
          ref: "User",
        },
        role: {
          type: String,
          enum: ["principal", "HOD", "mentor"],
          required: true,
        },
      },
    },

    visibility: {
      type: [String], // ["mentor", "teacher", "student"]
    },
  },
  { timestamps: true }
);

const NoticeModel = mongoose.model("Notice", NoticeSchema);

module.exports = NoticeModel;
