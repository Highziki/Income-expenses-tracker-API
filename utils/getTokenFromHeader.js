const getTokenFromHeader = req => {
  // How to get the token from header
  const headerObj = req.headers;

  const token = headerObj["authorization"].split(" ")[1];

  if (!token)
    return {
      status: "failed",
      message: "There is no token attached to the header",
    };

  return token;
};

module.exports = getTokenFromHeader;
