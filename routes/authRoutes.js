const router = require("express").Router();

const {
  createUser,
  verifyEmail,
  login,
  logout,
} = require("../controllers/authController");

const {
  authorizePermission,
  authenticateUser,
} = require("../middleware/authentication-middleware");

router
  .route("/createUser")
  .post(
    authenticateUser,
    authorizePermission("admin", "principal", "HOD", "mentor"),
    createUser
  );

router.route("/verifyEmail").get(verifyEmail);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
