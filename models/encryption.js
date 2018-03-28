const crypto = require("crypto");

module.exports = function getSecretPassword(pwd) {
  //Encrypt
  let hashPwd = crypto.createHash("sha256");
  hashPwd.update(pwd);
  const secredPwd = hashPwd.digest("hex");
  //console.log("secredPwd: " + secredPwd);
  return secredPwd;
};
