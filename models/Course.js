const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      maxlength: [40, "Course name can contain only 40 characters"],
      unique: true,
    },

    yearsCount: {
      type: Number,
      max: 4,
      required: [true, "Please provide duration of course (years)"],
    },

    departments: {
      type: [mongoose.Types.ObjectId],
      ref: "Department",
      default: [],
    },
  },
  { versionKey: false }
);

const CourseModel = mongoose.model("Course", CourseSchema);

module.exports = CourseModel;
