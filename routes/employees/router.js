var express = require("express");
var router = express.Router();

const { employeesPutSchema, employeesPatchSchema } = require("./validation");
const { validateSchema, checkIdSchema } = require("../../helper");
const {
  getAll,
  postCreate,
  getSearch,
  getDetail,
  update,
  deteFun,
} = require("./controller");

/* GET home page. */

router.get("/search", getSearch);

router
  .route("/")
  .get(getAll)
  .post(validateSchema(employeesPutSchema), postCreate);

router
  .route("/:id")
  .get(validateSchema(checkIdSchema), getDetail)
  .put(
    validateSchema(checkIdSchema),
    validateSchema(employeesPutSchema),
    update
  )
  .patch(
    validateSchema(checkIdSchema),
    validateSchema(employeesPatchSchema),
    update
  )
  .delete(validateSchema(checkIdSchema), deteFun);

module.exports = router;
