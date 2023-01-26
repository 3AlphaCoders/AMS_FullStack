const ApplicationModel = require("../models/Application");
const UserModel = require("../models/User");
const DepartmentModel = require("../models/Department");
const ClassModel = require("../models/Class");

const { fileUpload } = require("../utils");

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");

const createApplication = async (req, res) => {
  const { applicationTitle } = req.body;
  const applicationFile = req?.files?.applicationFile;

  if (!applicationTitle?.trim() || !applicationFile) {
    throw new CustomAPIError.BadRequestError(
      "Application Title or File is missing"
    );
  }

  const { fileURL } = await fileUpload(applicationFile, "applications");

  const { userId: submittedBy, role } = req.user;

  const currentHolder = await findNextHolder(submittedBy, role);
  // const applicationLife = [{ user: currentHolder, status: "pending" }];

  const application = await ApplicationModel.create({
    applicationTitle,
    applicationFile: fileURL,
    submittedBy,
    currentHolder,
    // applicationLife,
  });

  const applicationFiler = await UserModel.findById(submittedBy);
  applicationFiler.applicationsFiled += 1;
  await applicationFiler.save();

  const applicationReceiver = await UserModel.findById(currentHolder);
  applicationReceiver.applicationsReceived += 1;
  await applicationReceiver.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
};

/*
  PATCH
  URL: /api/v1/application/:applicationId/action?action=forwarded
*/
const applicationAction = async (req, res) => {
  const { applicationId } = req.params;
  const action = req.query?.action;

  const application = await ApplicationModel.findById(applicationId);
  if (!application) {
    throw new CustomAPIError.NotFoundError(
      `No application found with id: ${applicationId}`
    );
  }

  if (application.status == "accepted" || application.status == "rejected") {
    throw new CustomAPIError.BadRequestError(
      `Application has been already ${application.status}!`
    );
  }

  if (action != "accepted" && action != "rejected" && action != "forwarded") {
    throw new CustomAPIError.BadRequestError("Invalid action!");
  }

  const { userId: actionTaker, role } = req.user;

  if (application.currentHolder != actionTaker) {
    throw new CustomAPIError.UnauthorizedError(
      "Not allowed to take any action!"
    );
  }

  if (action == "accepted") {
    application.status = "accepted";
    application.acceptedBy = actionTaker;
    application.currentHolder = null;
    const applicationApprover = await UserModel.findById(actionTaker);
    applicationApprover.applicationsApproved += 1;
    await applicationApprover.save();
  } else if (action == "rejected") {
    application.status = "rejected";
    application.rejectedBy = actionTaker;
    application.currentHolder = null;
    const applicationRejecter = await UserModel.findById(actionTaker);
    applicationRejecter.applicationsRejected += 1;
    await applicationRejecter.save();
  } else if (action == "forwarded") {
    application.applicationLife.push({
      user: application.currentHolder,
      status: "forwarded",
    });
    const nextHolder = await findNextHolder(actionTaker, role);
    application.currentHolder = nextHolder;
    const applicationReciever = await UserModel.findById(nextHolder);
    applicationReciever.applicationsReceived += 1;
    await applicationReciever.save();
  }

  await application.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Action successful!",
    application,
  });
};

const getMyApplications = async (req, res) => {
  const { userId: submittedBy } = req.user;

  const applications = await ApplicationModel.find({ submittedBy }).populate({
    path: "currentHolder",
    select: "name"
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Applications submitted by user: ${submittedBy}`,
    applications,
  });
};

const getPendingApplications = async (req, res) => {
  const { userId: currentHolder } = req.user;

  const applications = await ApplicationModel.find({
    currentHolder,
    status: "pending",
  }).populate({
    path: "submittedBy",
    select: "name email",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Applications pending for user: ${currentHolder}`,
    applications,
  });
};

const getApplicationDetails = async (req, res) => {
  const { applicationId } = req.params;
  const application = await ApplicationModel.findById(applicationId).populate({
    path: "submittedBy currentHolder acceptedBy rejectedBy applicationLife.user",
    select: "name email",
  });

  if (!application) {
    throw new CustomAPIError.NotFoundError(
      `No application found with id: ${applicationId}`
    );
  }

  const userId = req.user.userId;
  if (
    application.currentHolder?._id != userId &&
    application.submittedBy._id != userId
  ) {
    throw new CustomAPIError.UnauthorizedError(
      "You aren't authorized to access this resource!"
    );
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Application Details found!",
    application,
  });
};

async function findNextHolder(userId, role) {
  if (role == "student" || role == "mentor" || role == "teacher") {
    const user = await UserModel.findById(userId);

    if (role == "student") {
      const studentClass = await ClassModel.findById(user.classId);
      return studentClass.mentor;
    } else if (role == "teacher" || role == "mentor") {
      const department = await DepartmentModel.findById(user.deptId);
      return department.HOD;
    }
  } else if (role == "HOD") {
    const principal = await UserModel.findOne({ role: "principal" });
    return principal._id;
  } else if (role == "principal") {
    const admin = await UserModel.findOne({ role: "admin" });
    return admin._id;
  }
}

module.exports = {
  createApplication,
  applicationAction,
  getMyApplications,
  getPendingApplications,
  getApplicationDetails,
};
