const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Course",
    },

    deptId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Department",
    },

    mentor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide mentor"],
    },

    year: {
      type: Number,
      max: 4,
      required: [true, "Please provide year"],
    },

    HOD: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    section: {
      type: String,
    },

    seats: {
      type: Number,
      required: true,
    },

    strength: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

ClassSchema.index(
  { courseId: 1, deptId: 1, year: 1, section: 1 },
  { unique: true }
);

const ClassModel = mongoose.model("Class", ClassSchema);

module.exports = ClassModel;
