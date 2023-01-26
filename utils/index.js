const { fileUpload } = require("./fileUpload");
const { attachCookiesToResponse } = require("./jwt");
const { sendVerificationEmail } = require("./sendEmail");
const { checkHierarchy } = require("./heirarchy");

module.exports = {
  fileUpload,
  attachCookiesToResponse,
  sendVerificationEmail,
  checkHierarchy,
};
