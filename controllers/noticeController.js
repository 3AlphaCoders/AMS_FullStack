const UserModel = require("../models/User");
const NoticeModel = require("../models/Notice");

const { fileUpload, checkHierarchy } = require("../utils");

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");

const createNotice = async (req, res) => {
  let { noticeTitle, visibility } = req.body;
  const noticeFile = req?.files?.noticeFile;

  visibility = JSON.parse(visibility);
  console.log(visibility);

  if (
    !noticeTitle?.trim() ||
    !Array.isArray(visibility) ||
    visibility?.length < 1 ||
    !noticeFile
  ) {
    throw new CustomAPIError.BadRequestError(
      "Please fill all the mandatory details!"
    );
  }

  const { userId: submittedBy, role } = req.user;
  const validRoles = ["HOD", "mentor", "teacher", "student"];

  for (let receiverRole of visibility) {
    if (
      !validRoles.includes(receiverRole) ||
      !checkHierarchy(receiverRole, role)
    ) {
      throw new CustomAPIError.BadRequestError(
        "Invalid receivers!"
      );
    }
  }

  const { fileURL } = await fileUpload(noticeFile, "notices");

  const notice = await NoticeModel.create({
    noticeTitle,
    noticeFile: fileURL,
    postedBy: {
      user: submittedBy,
      role,
    },
    visibility,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Notice created!",
    notice,
  });
};

const getMyNotices = async (req, res) => {
  const { userId } = req.user;

  const user = await UserModel.findById(userId);

  const notices = await NoticeModel.aggregate(prepareAggregation(user));
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Found notices!",
    notices,
  });
};

function prepareAggregation(user) {
  const { deptId, classId, role } = user;

  let aggregate;

  if (role == "HOD") {
    aggregate = [
      {
        $match: {
          "postedBy.role": "principal",
          visibility: role,
        },
      },
      {
        $project: {
          visibility: 0,
        },
      },
    ];
  } else if (role == "mentor" || role == "teacher") {
    aggregate = [
      {
        $match: {
          $or: [
            {
              "postedBy.role": "principal",
            },
            {
              "postedBy.role": "HOD",
            },
          ],
          visibility: role,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy.user",
          foreignField: "_id",
          as: "posterDetails",
        },
      },
      {
        $match: {
          $or: [
            {
              "postedBy.role": "principal",
            },
            {
              "posterDetails.deptId": deptId,
            },
          ],
        },
      },
      {
        $project: {
          posterDetails: 0,
          visibility: 0,
        },
      },
    ];
  } else if (role == "student") {
    aggregate = [
      {
        $match: {
          $or: [
            {
              "postedBy.role": "principal",
            },
            {
              "postedBy.role": "HOD",
            },
            {
              "postedBy.role": "mentor",
            },
          ],
          visibility: "student",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "postedBy.user",
          foreignField: "_id",
          as: "posterDetails",
        },
      },
      {
        $match: {
          $or: [
            {
              "postedBy.role": "principal",
            },
            {
              "postedBy.role": "HOD",
              "posterDetails.deptId": deptId,
            },
            {
              "postedBy.role": "mentor",
              "posterDetails.classId": classId,
            },
          ],
        },
      },
      {
        $project: {
          posterDetails: 0,
          visibility: 0,
        },
      },
    ];
  }
  return aggregate;
}

module.exports = {
  createNotice,
  getMyNotices,
};
