const CourseModel = require("../models/Course");
const DepartmentModel = require("../models/Department");
const ClassModel = require("../models/Class");
const UserModel = require("../models/User");

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");

const createCourse = async (req, res) => {
  const { courseName, yearsCount } = req.body;

  if (!courseName?.trim() || !yearsCount) {
    throw new CustomAPIError.BadRequestError(
      "courseName and yearsCount is required"
    );
  }

  const createdCourse = await CourseModel.create({ courseName, yearsCount });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Course created!",
    course: createdCourse,
  });
};

const addDepartment = async (req, res) => {
  const courseId = req.params?.courseId;

  if (!courseId?.trim()) {
    throw new CustomAPI.BadRequestError("Course Id is required");
  }

  const { deptName, HOD } = req.body;

  if (!deptName?.trim() || !HOD?.trim()) {
    throw new CustomAPI.BadRequestError("Invalid department details");
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new CustomAPI.NotFoundError(`No course found with id: ${courseId}`);
  }

  const HODExists = await UserModel.findOne({ _id: HOD, role: "HOD" });
  if (!HODExists)
    throw new CustomAPI.NotFoundError(`No HOD found with id: ${HOD}`);

  if (HODExists?.deptId)
    throw new CustomAPIError.BadRequestError(
      `HOD with id: ${HOD} is already assigned a department`
    );

  const department = await DepartmentModel.create({ courseId, deptName, HOD });
  await UserModel.findByIdAndUpdate(HOD, { deptId: department._id });

  course.departments.push(department._id);
  await course.save();

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Department added", department });
};

const addClass = async (req, res) => {
  const { courseId, deptId } = req.params;

  if (!courseId?.trim() || !deptId?.trim()) {
    throw new CustomAPIError.BadRequestError("Course Id & Dept Id is required");
  }

  const department = await DepartmentModel.findOne({
    _id: deptId,
    courseId,
  });

  if (!department) {
    throw new CustomAPIError.NotFoundError(
      `Invalid department with id: ${deptId} for course with id: ${courseId}`
    );
  }

  if (req.user.role == "HOD" && department.HOD != req.user.userId) {
    throw new CustomAPIError.UnauthorizedError(
      "Not allowed to perform this action"
    );
  }

  const { mentor, year, section, seats } = req.body;

  if (!mentor?.trim() || !year || !section?.trim() || !seats) {
    throw new CustomAPIError.BadRequestError("Invalid class details");
  }

  const mentorExists = await UserModel.findOne({
    _id: mentor,
    role: "mentor",
    deptId,
  });

  if (!mentorExists) {
    throw new CustomAPIError.NotFoundError(
      `No mentor found with id: ${mentor}`
    );
  }

  if (mentor?.classId)
    throw new CustomAPIError.BadRequestError(
      `Mentor with id: ${mentor} is already assigned a class!`
    );

  const newClass = await ClassModel.create({
    courseId,
    deptId,
    mentor,
    HOD: department.HOD,
    seats,
    year,
    section,
  });

  department.classes.push(newClass._id);
  await department.save();
  mentorExists.classId = newClass._id;
  await mentorExists.save();

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Class added!", class: newClass });
};

const getAllCourses = async (req, res) => {
  const courses = await CourseModel.find({});

  const departmentsCount = await DepartmentModel.countDocuments({});
  const teachersCount = await UserModel.countDocuments({
    $or: [{ role: "teacher", role: "mentor" }],
  });
  const studentsCount = await UserModel.countDocuments({ role: "student" });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Found all courses!",
    courses,
    departmentsCount,
    teachersCount,
    studentsCount,
  });
};

const getCourseDetails = async (req, res) => {
  const courseId = req.params?.courseId;
  if (!courseId?.trim()) {
    throw new CustomAPIError.BadRequestError("Course Id is requried");
  }

  const courseDetails = await CourseModel.findById(courseId).populate(
    "departments"
  );

  if (!courseDetails) {
    throw new CustomAPIError.NotFoundError(
      `No course found with id: ${courseId}`
    );
  }

  const totalDepartments = courseDetails?.departments?.length;
  const totalTeachers = await UserModel.countDocuments({
    courseId,
    $or: [{ role: "teacher" }, { role: "mentor" }],
  });
  const totalStudents = await UserModel.countDocuments({
    role: "student",
    courseId,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    course: {
      ...courseDetails._doc,
      totalDepartments,
      totalTeachers,
      totalStudents,
    },
  });
};

const getHODs = async (req, res) => {
  const courseId = req.params.courseId;
  const q = req.query?.q;
  let filter;

  if (q && q == "all") {
    filter = { role: "HOD", courseId };
  } else {
    filter = { role: "HOD", courseId, deptId: null };
  }

  if (!courseId?.trim()) {
    throw new CustomAPIError.BadRequestError(`course Id is required`);
  }

  const courseExists = await CourseModel.findById(courseId);
  if (!courseExists) {
    throw new CustomAPIError.NotFoundError(
      `No course found with courseId; ${courseId}`
    );
  }

  const HODs = await UserModel.find(filter).select("name");

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Found all HODs for course id: ${courseId}!`,
    HODs,
  });
};

const getDeptDetails = async (req, res) => {
  const { courseId, deptId } = req.params;

  if (!courseId?.trim() || !deptId?.trim()) {
    throw new CustomAPIError.BadRequestError("Course Id & Dept Id is required");
  }

  const departmentDetails = await DepartmentModel.findOne({
    courseId,
    _id: deptId,
  })
    .populate({
      path: "HOD",
      select: "name email",
    })
    .populate("classes");

  if (!departmentDetails) {
    throw new CustomAPIError.NotFoundError(
      `No department found with id: ${deptId} under course id: ${courseId}`
    );
  }

  if (
    req.user.role == "HOD" &&
    departmentDetails?.HOD?._id != req.user.userId
  ) {
    throw new CustomAPIError.UnauthorizedError(
      "You aren't authorized to access this resource!"
    );
  }

  const totalClasses = departmentDetails?.classes.length;
  const totalTeachers = await UserModel.countDocuments({
    deptId,
    $or: [{ role: "teacher" }, { role: "mentor" }],
  });
  const totalStudents = await UserModel.countDocuments({
    role: "student",
    deptId,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    department: {
      ...departmentDetails._doc,
      totalClasses,
      totalTeachers,
      totalStudents,
    },
  });
};

const getMentors = async (req, res) => {
  const { courseId, deptId } = req.params;
  const q = req.query?.q;
  let filter;

  if (q && q == "all") {
    filter = { role: "mentor", courseId, deptId };
  } else {
    filter = { role: "mentor", courseId, deptId, classId: null };
  }

  if (!deptId?.trim() || !deptId?.trim()) {
    throw new CustomAPIError.BadRequestError(`courseId & deptId are required`);
  }

  const deptExists = await DepartmentModel.findOne({ courseId, _id: deptId });
  if (!deptExists) {
    throw new CustomAPIError.NotFoundError(
      `No department found with deptId: ${deptId} in course with id: ${courseId}`
    );
  }

  const mentors = await UserModel.find(filter).select("name");

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Found all mentors in dept id: ${deptId} in course id: ${courseId}!`,
    mentors,
  });
};

const getDeptTeachers = async (req, res) => {
  const { courseId, deptId } = req.params;
  if (!deptId?.trim()) {
    throw new CustomAPIError.BadRequestError("Dept Id is required!");
  }

  const department = await DepartmentModel.findById(deptId);
  if (!department) {
    throw new CustomAPIError.BadRequestError(
      `No department found with id: ${deptId}`
    );
  }

  if (req.user.role == "HOD" && department?.HOD != req.user.userId) {
    throw new CustomAPIError.UnauthorizedError(
      "You aren't authorized to access this resource!"
    );
  }

  const page = parseInt(req.query?.page) || 1;
  const limit = 10;
  const teachersCount = await UserModel.countDocuments({
    deptId,
    $or: [{ role: "mentor" }, { role: "teacher" }],
  });

  const totalPages = Math.ceil(teachersCount / limit);
  const skip = (page - 1) * limit;

  if (page > totalPages) {
    throw new CustomAPIError.NotFoundError(
      `Exceeded the maximum page number: ${totalPages}`
    );
  }

  const teachers = await UserModel.find({
    deptId,
    $or: [{ role: "mentor" }, { role: "teacher" }],
  })
    .sort("name")
    .select("name email")
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Teachers found for department with id: ${deptId}`,
    teachers,
    totalPages,
    page,
  });
};

const getClassDetails = async (req, res) => {
  const { courseId, deptId, classId } = req.params;

  if (!courseId?.trim() || !deptId?.trim() || !classId?.trim()) {
    throw new CustomAPIError.BadRequestError(
      "Course Id, Dept Id & Class Id is required"
    );
  }

  const classDetails = await ClassModel.findOne({
    courseId,
    deptId,
    _id: classId,
  }).populate({
    path: "mentor",
    select: "name email",
  });

  if (!classDetails) {
    throw new CustomAPIError.NotFoundError(
      `No class found with id: ${deptId} under department id: ${deptId} in course with id: ${courseId}`
    );
  }

  if (!checkClassPermission(req.user, classDetails)) {
    throw new CustomAPIError.UnauthorizedError(
      "Not allowed to access this resouce"
    );
  }

  const totalStudents = await UserModel.countDocuments({
    classId,
    role: "student",
  });

  res
    .status(StatusCodes.OK)
    .json({ success: true, class: { ...classDetails._doc, totalStudents } });
};

const getClassStudents = async (req, res) => {
  const classId = req.params?.classId;
  if (!classId?.trim()) {
    throw new CustomAPIError.BadRequestError("Class Id is required");
  }

  const existingClass = await ClassModel.findById(classId);
  if (!existingClass) {
    throw new CustomAPIError.NotFoundError(
      `No class found with id: ${classId}`
    );
  }

  if (!checkClassPermission(req.user, existingClass)) {
    throw new CustomAPIError.UnauthorizedError(
      "Not allowed to access this resouce"
    );
  }

  const page = parseInt(req.query?.page) || 1;
  const limit = 10;
  const studentsCount = await UserModel.countDocuments({
    classId,
    role: "student",
  });
  const totalPages = Math.ceil(studentsCount / limit);
  const skip = (page - 1) * limit;

  if (page > totalPages) {
    throw new CustomAPIError.NotFoundError(
      `Exceeded the maximum page number: ${totalPages}`
    );
  }

  const students = await UserModel.find({ role: "student", classId })
    .sort("name")
    .select("name email")
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Students found for class with id: ${classId}`,
    students,
    totalPages,
    page,
  });
};

function checkClassPermission(reqUser, classDetails) {
  const { userId, role } = reqUser;
  if (role == "HOD" && userId != classDetails.HOD) return false;
  if (role == "mentor" && userId != classDetails.mentor) return false;
  return true;
}

module.exports = {
  createCourse,
  addDepartment,
  addClass,
  getAllCourses,
  getCourseDetails,
  getDeptDetails,
  getClassDetails,
  getDeptTeachers,
  getClassStudents,
  getHODs,
  getMentors,
};
