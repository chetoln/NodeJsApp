const db = require("./connectionDb");

const isRegisteredMember = (memberData, callback) => {
  db.query(
    "SELECT email FROM member_info WHERE email = ?",
    memberData.email,
    callback
  );
};

const registerErr = (result, reject, msg) => {
  result.status = msg.status;
  result.err = msg.err;
  reject(result);
};

module.exports = function register(memberData) {
  let result = {};
  return new Promise((resolve, reject) => {
    //Check the email is registered or not
    isRegisteredMember(memberData, function(err, rows) {
      if (err) {
        console.log(err);
        registerErr(result, reject, {
          status: "Register failed.",
          err: "Server error, try later!"
        });
        return;
      }
      // email已經被注冊過
      if (rows.length >= 1) {
        registerErr(result, reject, {
          status: "Register failed.",
          err: "Deplicate email."
        });
      } else {
        // Ｗrite data into db
        db.query("INSERT INTO member_info SET ?", memberData, function(
          err,
          rows
        ) {
          if (err) {
            console.log(err);
            registerErr(result, reject, {
              status: "Register failed.",
              err: "Server error, try later!"
            });
            return;
          }
          result.registerMember = memberData;
          resolve(result);
        });
      }
    });
  });
};
