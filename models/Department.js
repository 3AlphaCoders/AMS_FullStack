const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Course",
    },

    deptName: {
      type: String,
      required: true,
      trim: true,
    },

    HOD: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide Head of Department"],
    },

    classes: {
      type: [mongoose.Types.ObjectId],
      ref: "Class",
      default: [],
    },
  },
  { versionKey: false }
);

DepartmentSchema.index({ courseId: 1, deptName: 1 }, { unique: true });

const DepartmentModel = mongoose.model("Department", DepartmentSchema);

module.exports = DepartmentModel;
