const router = require("express").Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getDeptDetails,
  getClassDetails,
  addDepartment,
  addClass,
  getDeptTeachers,
  getClassStudents,
  getHODs,
  getMentors,
} = require("../controllers/courseController");

const {
  authorizePermission,
} = require("../middleware/authentication-middleware");

// all routes use authMiddleware

router.route("/").post(authorizePermission("admin", "principal"), createCourse);

router
  .route("/:courseId/addDept")
  .post(authorizePermission("admin", "principal"), addDepartment);

router
  .route("/:courseId/:deptId/addClass")
  .post(authorizePermission("admin", "principal", "HOD"), addClass);

router.route("/").get(authorizePermission("admin", "principal"), getAllCourses);

router
  .route("/:courseId/")
  .get(authorizePermission("admin", "principal"), getCourseDetails);

router
  .route("/:courseId/HODs")
  .get(authorizePermission("admin", "principal"), getHODs);

router
  .route("/:courseId/:deptId")
  .get(authorizePermission("admin", "principal", "HOD"), getDeptDetails);

router
  .route("/:courseId/:deptId/mentors")
  .get(authorizePermission("admin", "principal", "HOD"), getMentors);

router
  .route("/:courseId/:deptId/teachers")
  .get(authorizePermission("admin", "principal", "HOD"), getDeptTeachers);

router
  .route("/:courseId/:deptId/:classId")
  .get(
    authorizePermission("admin", "principal", "HOD", "mentor"),
    getClassDetails
  );

router
  .route("/:courseId/:deptId/:classId/students")
  .get(
    authorizePermission("admin", "principal", "HOD", "mentor"),
    getClassStudents
  );

module.exports = router;
