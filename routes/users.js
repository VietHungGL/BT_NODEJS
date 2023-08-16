var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("Đây là trang user");
});

router.get("/1", function (req, res, next) {
  res.send("Đây là trang user số 1");
});

module.exports = router;
