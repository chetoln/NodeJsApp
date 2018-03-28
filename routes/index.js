var express = require("express");
var router = express.Router();

const IndexController = require("../controllers/indexController");

indexController = new IndexController();

/* GET home page. */
router.get("/", indexController.homeController);

module.exports = router;
