const jwt = require("jsonwebtoken");
const config = require("../config/developConfig");
const httpStatus = require("http-status-codes");

//Check the validity of token
module.exports = function verifyToken(token) {
  let result = {};
  const time = Math.floor(Date.now() / 1000);
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          //invalid token
          result.status = httpStatus.UNAUTHORIZED;
          result.err = "Invalid token";
        } else if (decoded.exp <= time) {
          //token expired
          result.status = httpStatus.UNAUTHORIZED;
          result.err = "Token expired";
        } else {
          // valid token
          result.status = httpStatus.OK;
          result.data = decoded.data;
        }
      });
    } else {
      result.status = httpStatus.UNAUTHORIZED;
      result.err = "Invalid token";
    }
    resolve(result);
  });
};
