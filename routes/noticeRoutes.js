const router = require("express").Router();

const {
  createNotice,
  getMyNotices,
} = require("../controllers/noticeController");

const {
  authorizePermission,
} = require("../middleware/authentication-middleware");

router
  .route("/")
  .post(authorizePermission("principal", "HOD", "mentor"), createNotice);

router
  .route("/")
  .get(
    authorizePermission("HOD", "mentor", "teacher", "student"),
    getMyNotices
  );

module.exports = router;
