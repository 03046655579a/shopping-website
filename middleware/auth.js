const jwt = require("jsonwebtoken");

module.exports = function (token) {
  // console.log("Auth token passed: ", token);
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};