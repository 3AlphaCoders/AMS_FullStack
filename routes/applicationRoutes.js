const router = require("express").Router();

const {
  createApplication,
  applicationAction,
  getMyApplications,
  getPendingApplications,
  getApplicationDetails,
} = require("../controllers/applicationController");

const {
  authorizePermission,
} = require("../middleware/authentication-middleware");

router
  .route("/")
  .post(
    authorizePermission("principal", "HOD", "mentor", "teacher", "student"),
    createApplication
  );

router
  .route("/:applicationId/action")
  .patch(
    authorizePermission("admin", "principal", "HOD", "mentor"),
    applicationAction
  );

router.route("/").get(getMyApplications);

router
  .route("/pending")
  .get(
    authorizePermission("admin", "principal", "HOD", "mentor"),
    getPendingApplications
  );

router.route("/:applicationId").get(getApplicationDetails);

module.exports = router;
