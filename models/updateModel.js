const db = require("./connectionDb");

module.exports = function updateData(id, updData) {
  let result = {};
  return new Promise((resolve, reject) => {
    db.query("UPDATE member_info SET ? WHERE id = ?", [updData, id], function(
      err,
      rows
    ) {
      if (err) {
        console.log(err);
        result.status = "Update data failed";
        result.err = "Server error, try later~";
        reject(result);
        return;
      }
      result.status = "User data updated.";
      result.memberUpdateData = updData;
      resolve(result);
    });
  });
};
