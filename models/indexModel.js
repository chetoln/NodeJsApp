module.exports = class IndexModel {
  homeModel(req, res, next) {
    // do something
    res.render("index", { title: "Ark home" });
  }
};
