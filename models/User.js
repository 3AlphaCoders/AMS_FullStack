const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {

    // employee id for staff and roll number for students
    id: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name should be of atleast 3 characters"],
      maxlength: [30, "Name should be of maximum 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "User already exists"],
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password should be of atleast 8 characters"],
    },

    role: {
      type: String,
      enum: ["student", "teacher", "mentor", "HOD", "principal", "admin"],
      default: "student",
    },

    applicationsFiled: {
      type: Number,
      default: 0,
    },

    applicationsReceived: {
      type: Number,
      default: 0,
    },

    applicationsApproved: {
      type: Number,
      default: 0,
    },

    applicationsRejected: {
      type: Number,
      default: 0,
    },

    verificationToken: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Date,
    },

    passwordToken: {
      type: String,
    },

    passwordTokenExpirationDate: {
      type: Date,
    },

    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },

    deptId: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
    },

    classId: {
      type: mongoose.Types.ObjectId,
      ref: "Class",
    },
  },
  { versionKey: false }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isPasswordCorrect = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isPasswordCorrect;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
