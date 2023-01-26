const { isTokenValid } = require("../utils/jwt");
const CustomAPIError = require("../errors");

const authenticateUser = async (req, res, next) => {
  try {
    const { accessToken } = req.signedCookies;

    if (!accessToken) {
      throw new CustomAPIError.UnauthenticatedError("Authentication Failed");
    }

    const userPayload = isTokenValid(accessToken, process.env.JWT_SECRET);
    console.log(userPayload);

    req.user = userPayload;

    next();
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError("Authentication Failed");
  }
};

const authorizePermission = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomAPIError.UnauthorizedError(
        "Not authorized to access this resource!"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
