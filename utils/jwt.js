const jwt = require("jsonwebtoken");

const createJWT = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const isTokenValid = (userToken) =>
  jwt.verify(userToken, process.env.JWT_SECRET);

const createUserToken = (user) => {
  return { userId: user._id, name: user.name, role: user.role };
};

const attachCookiesToResponse = (res, user) => {
  const tokenUser = createUserToken(user);
  const accessTokenJWT = createJWT(tokenUser);

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  createUserToken,
  attachCookiesToResponse,
};
