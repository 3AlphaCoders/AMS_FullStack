const UserModel = require("../models/User");
const ApplicationModel = require("../models/Application");

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { userId } = req.user;

  if (!oldPassword?.trim() || !newPassword?.trim()) {
    throw new CustomAPIError.BadRequestError("Required fields are missing!");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new CustomAPIError.NotFoundError(`No user found with id: ${userId}`);
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Incorrect old password!");
  }

  if (newPassword != confirmPassword) {
    throw new CustomAPIError.BadRequestError("Both passwords should match!");
  }

  user.password = newPassword;
  await user.save();

  res.cookie("accessToken", "", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Password updated!" });
};

const getApplications = async (req, res) => {
  const requesterId = req.user.userId;
  const { userId } = req.params;
  const page = req.query.page;
  const status = req.query?.status?.trim()?.toLowerCase();

  if (!status?.trim()) {
    throw new CustomAPIError.BadRequestError(`Status is required!`);
  }

  if (status != "accepted" && status != "rejected") {
    throw new CustomAPIError.BadRequestError(`${status} is an invalid status!`);
  }

  let filter;
  if (status == "accepted") {
    filter = { acceptedBy: userId };
  } else if (status == "rejected") {
    filter = { rejectedBy: userId };
  }

  const user = await UserModel.findById(userId);
  const requester = await UserModel.findById(requesterId);

  if (!user) {
    throw new CustomAPIError.NotFoundError(
      `No user found with user id: ${userId}`
    );
  }

  if (checkApplicationPermission(user, requester)) {
    const totalApplications =
      status == "accepted"
        ? user.applicationsApproved
        : user.applicationsRejected;

    const limit = 10;
    const totalPages = Math.ceil(totalApplications / limit);
    const skip = (page - 1) * limit;

    if (page > totalPages) {
      throw new CustomAPIError.NotFoundError(
        `Exceeded the maximum page limit: ${totalPages}`
      );
    }

    const applications = await ApplicationModel.find(filter)
      .sort("-updatedAt")
      .skip(skip)
      .limit(limit);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Applications ${status} by ${user.name}!`,
      applications,
      totalPages,
      page,
    });
  } else {
    throw new CustomAPIError.UnauthorizedError(
      "You aren't authorized to access this resource"
    );
  }
};

const showMe = async (req, res) => {
  const userId = req.user?.userId;
  const user = await UserModel.findById(userId).select(
    "-password -isVerified -verified -verificationToken -passwordToken -passwordTokenExpirationDate"
  ).populate({
    path: "courseId",
    select: "courseName"
  }).populate({
    path: "deptId",
    select: "deptName"
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Found user with id: ${userId}`,
    user,
  });
};

function checkApplicationPermission(user, requester) {
  if (user._id == requester._id) return true;

  // admin can access anything
  if (requester.role == "admin") return true;

  // non-admins can't access admin's resources (requester.role != "admin")
  if (user.role == "admin") return false;

  // user.role != "admin", so principal can access anything
  if (requester.role == "principal") return true;

  if (user.role == "principal") return false;

  if (requester.role == "HOD") {
    console.log('helo', user.deptId, requester.deptId);
    if (user.deptId.toString() == requester.deptId.toString()) return true;
    return false;
  }

  return false;
}

module.exports = {
  changePassword,
  getApplications,
  showMe,
};
