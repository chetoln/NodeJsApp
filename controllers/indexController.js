const IndexModel = require("../models/indexModel");
const indexModel = new IndexModel();

module.exports = class IndexController {
  homeController(req, res, next) {
    indexModel.homeModel(req, res, next);
  }
};
