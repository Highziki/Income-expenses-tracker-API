const { AppErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = (req, _res, next) => {
  // Get token from req header
  const token = getTokenFromHeader(req);

  // Verify
  const decodedUser = verifyToken(token);

  // Save the user into req obj
  req.user = decodedUser.id;

  if (!decodedUser)
    return next(new AppErr("Invalid/Expired Token, Please login again", 401));

  next();
};

module.exports = isLoggedIn;
