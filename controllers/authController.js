const UserModel = require("../models/User");
const CourseModel = require("../models/Course");
const DepartmentModel = require("../models/Department");
const ClassModel = require("../models/Class");

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");

const crypto = require("crypto");

const {
  attachCookiesToResponse,
  sendVerificationEmail,
  checkHierarchy,
} = require("../utils");

const createUser = async (req, res) => {
  const {
    id,
    name,
    email,
    password,
    confirmPassword,
    courseId,
    deptId,
    classId,
  } = req.body;
  const role = req.body?.role || "student";

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw new CustomAPIError.BadRequestError("User details are missing.");
  }

  if (password != confirmPassword) {
    throw new CustomAPIError.BadRequestError("Both passwords should match!");
  }

  if (role == "admin") {
    throw new CustomAPIError.UnauthorizedError("Not allowed to add admins!");
  } else if (role == "principal") {
    const principalExists = await UserModel.findOne({ role: "principal" });
    if (principalExists) {
      throw new CustomAPIError.BadRequestError("A principal already exists");
    }
  }

  if (!checkHierarchy(role, req.user.role)) {
    throw new CustomAPIError.UnauthorizedError(
      "Not allowed to perform this action!"
    );
  }

  // Course is required for HoD, teacher, mentor & student
  if (role != "principal") {
    if (!courseId?.trim())
      throw new CustomAPIError.BadRequestError("courseId is required");

    const courseExists = await CourseModel.findById(courseId);

    if (!courseExists)
      throw new CustomAPIError.NotFoundError("Invalid courseId!");
  }

  // Department is required for mentor, teacher & student
  if (role != "principal" && role != "HOD") {
    if (!deptId?.trim())
      throw new CustomAPIError.BadRequestError("deptId is required");

    const deptExists = await DepartmentModel.findById(deptId);

    if (!deptExists) throw new CustomAPIError.NotFoundError("Invalid deptId!");

    if (!deptExists?.HOD)
      throw new CustomAPIError.BadRequestError(
        "Please nominate department HOD first!"
      );

    if (req.user.role == "HOD" && deptExists.HOD != req.user.userId)
      throw new CustomAPIError.UnauthorizedError(
        "Not allowed to perform this action!"
      );
  }

  let classExists;
  if (role == "student") {
    if (!classId?.trim())
      throw new CustomAPIError.BadRequestError("classId is required!");

    classExists = await ClassModel.findById(classId);

    if (!classExists)
      throw new CustomAPIError.NotFoundError("Invalid classId!");

    if (!classExists?.mentor)
      throw new CustomAPIError.BadRequestError(
        "Please nominate class mentor before adding students!"
      );

    if (classExists.strength === classExists.seats)
      throw new CustomAPIError.BadRequestError("Class strength is full!");

    if (req.user.role == "mentor" && classExists.mentor != req.user.userId)
      throw new CustomAPIError.UnauthorizedError(
        "Not allowed to perform this action!"
      );
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await UserModel.create({
    id,
    name,
    email,
    password,
    role,
    verificationToken,
    courseId,
    deptId,
    classId,
  });

  if (classExists && user?.role == "student") {
    classExists.strength++;
    await classExists.save();
  }

  await sendVerificationEmail(user.name, user.email, user.verificationToken);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Please ask user to verify using email!",
    user,
  });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.query;

  const user = await UserModel.findOne({ email });

  if (!user || user.verificationToken != verificationToken) {
    throw new CustomAPIError.BadRequestError(`Verification Failed`);
  }

  user.isVerified = true;
  user.verified = new Date(Date.now());
  await user.save();

  attachCookiesToResponse(res, user);

  res.status(StatusCodes.OK).json({ success: true, message: "User Verified" });
  // redirect to change password
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new CustomAPIError.BadRequestError("Email and Password are required");
  }

  const user = await UserModel.findOne({ email });

  if (!user || !user.isVerified) {
    throw new CustomAPIError.UnauthenticatedError(
      "User not found or not verified"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Invalid credentials");
  }

  attachCookiesToResponse(res, user);

  const role = user.role;
  const permissions = getUserPermissions(role);

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logged in!", role, permissions });
};

const logout = async (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "logged out successfully" });
};

function getUserPermissions(role) {
  if (role == "admin") {
    return {
      user: ["principal", "HOD", "teacher", "mentor", "student"],
      course: ["course", "dept", "class"],
      application: ["pendingApplication"],
    };
  } else if (role == "principal") {
    return {
      user: ["HOD", "teacher", "mentor", "student"],
      course: ["course", "dept", "class"],
      application: ["pendingApplication", "submitApplication"],
    };
  } else if (role == "HOD") {
    return {
      user: ["teacher", "mentor", "student"],
      course: ["dept", "class"],
      application: ["pendingApplication", "submitApplication"],
    };
  } else if (role == "mentor") {
    return {
      user: ["student"],
      course: ["class"],
      application: ["pendingApplication", "submitApplication"],
    };
  } else if (role == "student" || role == "teacher") {
    return {
      application: ["submitApplication"],
    };
  }
}

module.exports = {
  createUser,
  verifyEmail,
  login,
  logout,
};
