var express = require("express");
var router = express.Router();
const yup = require("yup");

const {
  getAll,
  postCreate,
  getSearch,
  getUpdate,
  patchUpdate,
  xoa,
} = require("./controller");
const { validateSchema } = require("../../helper");

/* GET home page. */

router.get("/", getAll);

router.post("/", postCreate);

router.get("/search", getSearch);

// Get one by id
// router.get("/:id", function (req, res, next) {
//   const { id } = req.params;
//   const validationSchema = yup.object().shape({
//     id: yup.number(),
//   });
//   validationSchema
//     .validate({ id })
//     .then(() => {
//       let result = data.find((x) => x.id == id);

//       if (result) {
//         return res.send({ code: 200, payload: result });
//       }

//       return res.send(404, { message: "Not found" });
//     })
//     .catch((err) => res.send(400, { message: "id Loi roi" }));
// });

router.get("/:id", getUpdate);

const updateProductSchema = yup.object({
  params: yup.object({
    id: yup.number(),
  }),
  body: yup.object({
    price: yup.number(),
    name: yup.string(),
  }),
});

router.patch("/:id", validateSchema(updateProductSchema), patchUpdate);

router.delete("/:id", xoa);

module.exports = router;
