const router = require("express").Router();

const {
  changePassword,
  getApplications,
  showMe,
} = require("../controllers/userController");

const {
  authorizePermission,
} = require("../middleware/authentication-middleware");

router.route("/changePassword").patch(changePassword);
router.route("/showMe").get(showMe);
router
  .route("/applications/:userId")
  .get(authorizePermission("admin", "principal", "HOD", "mentor"), getApplications);

module.exports = router;
