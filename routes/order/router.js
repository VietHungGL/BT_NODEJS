var express = require("express");
var router = express.Router();

const {
  getDetailSchema,
  createSchema,
  updateEmployeeSchema,
  updateShippingDateSchema,
  updateStatusSchema,
} = require("./validation");

const { validateSchema } = require("../../helper");
const {
  getAll,
  postCreate,
  getDetail,
  updateStatus,
  updateShippingDate,
  updateEmployee,
} = require("./controller");

/* GET home page. */

router.route("/").get(getAll).post(validateSchema(createSchema), postCreate);

router.route("/:id").get(validateSchema(getDetailSchema), getDetail);

router
  .route("/status/:id")
  .patch(validateSchema(updateStatusSchema), updateStatus);

router
  .route("/shipping/:id")
  .patch(validateSchema(updateShippingDateSchema), updateShippingDate);

router
  .route("/employee/:id")
  .patch(validateSchema(updateEmployeeSchema), updateEmployee);
module.exports = router;
