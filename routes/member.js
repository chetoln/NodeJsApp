var express = require("express");
var router = express.Router();

const MemberModifyMethod = require("../controllers/modifyController");
const memberModifyMethod = new MemberModifyMethod();

router.get("/", function(req, res, next) {
  res.status(200).send("Member");
});

router.post("/register", memberModifyMethod.postRegister);
router.post("/login", memberModifyMethod.postLogin);
router.put("/update/info", memberModifyMethod.putUpdateInfo);
router.put("/update/password", memberModifyMethod.putUpdatePassword);

module.exports = router;
