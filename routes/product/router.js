var express = require("express");
var router = express.Router();
const passport = require("passport");

const { productsPutSchema, validationQuerySchema } = require("./validation");

const { validateSchema, checkIdSchema } = require("../../helper");
const {
  getAll,
  getList,
  postCreate,
  getSearch,
  getDetail,
  update,
  deteFun,
} = require("./controller");

/* GET home page. */
router.route("/all").get(getAll);

router
  .route("/")
  .get(getList)
  .post(
    passport.authenticate("jwt", { session: false }),
    validateSchema(productsPutSchema),
    postCreate
  );

router.get("/search", validateSchema(validationQuerySchema), getSearch);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(
    passport.authenticate("jwt", { session: false }),
    validateSchema(checkIdSchema),
    validateSchema(productsPutSchema),
    update
  )
  // .patch(
  //   validateSchema(checkIdSchema),
  //   validateSchema(productsPatchSchema),
  //   update
  // )
  .delete(
    passport.authenticate("jwt", { session: false }),
    validateSchema(checkIdSchema),
    deteFun
  );
module.exports = router;
