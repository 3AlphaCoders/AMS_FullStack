const UserModel = require("../models/User");
const CourseModel = require("../models/Course");
const DepartmentModel = require("../models/Department");

const crypto = require("crypto");
require("dotenv").config();

const connectDB = require("../db/connect");

async function addAdmin(name, email, password) {
  const existingAdmin = await UserModel.findOne({ role: "admin" });
  if (existingAdmin) {
    throw new Error("An admin already exists!");
  }

  const role = "admin";
  const isVerified = true;
  const verified = new Date();
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    verificationToken,
    verified,
    isVerified,
  });

  console.log(user);
  return user;
}

async function addHOD(name, email, password, courseId) {
  const courseExists = await CourseModel.findById(courseId);
  if (!courseExists) {
    throw new Error(`No course found with id: ${courseId}`);
  }

  const role = "HOD";
  const isVerified = true;
  const verified = new Date();
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    verificationToken,
    verified,
    isVerified,
    courseId,
  });

  console.log(user);
  return user;
}

async function addMentor(name, email, password, courseId, deptId) {
  const deptExists = await DepartmentModel.findOne({ courseId, _id: deptId });
  if (!deptExists) {
    throw new Error(`No department found with id: ${deptId}`);
  }

  const role = "mentor";
  const isVerified = true;
  const verified = new Date();
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    verificationToken,
    verified,
    isVerified,
    courseId,
    deptId,
  });

  console.log(user);
  return user;
}

async function testAddAdmin(name, email, password) {
  await connectDB(process.env.MONGO_URI);
  return await addAdmin(name, email, password);
}

async function testAddHOD(name, email, password, courseId) {
  await connectDB(process.env.MONGO_URI);
  return await addHOD(name, email, password, courseId);
}

async function testAddMentor(name, email, password, courseId, deptId) {
  await connectDB(process.env.MONGO_URI);
  return await addMentor(name, email, password, courseId, deptId);
}

// testAddAdmin("Admin", "admin@gmail.com", "#1#@Admin#");

// testAddHOD("IT HOD", "it_hod@gmail.com", "#1#@IT_HOD#", "63ad6f0aefb7c76346740356");

// testAddMentor("CSE 2A Mentor", "cse2a_mentor@gmail.com", "#1#@CSE2A_Mentor#","63ad6f0aefb7c76346740356", "63ad777f8a1f199710aaa523")
