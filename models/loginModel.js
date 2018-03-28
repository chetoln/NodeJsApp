const db = require("./connectionDb");

module.exports = function memberLogin(memberData) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM member_info WHERE email = ? AND password = ?",
      [memberData.email, memberData.password],
      function(err, rows) {
        if (err) {
          let result = {
            status: "login failed.",
            err: "Server error, try later!"
          };
          reject(result);
          return;
        }
        resolve(rows);
      }
    );
  });
};
