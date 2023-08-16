var express = require("express");
var router = express.Router();
const yup = require("yup");

const data = require("../../data/suppliers.json");
const { writeFileSync, generationID, validateSchema } = require("../../helper");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send(data);
});

router.post("/", async function (req, res, next) {
  const { name, price } = req.body;

  const newP = { name, price, id: generationID() };
  if (data?.length > 0) {
    await writeFileSync("data/suppliers.json", [...data, newP]);
  } else {
    await writeFileSync("data/suppliers.json", [newP]);
  }

  res.send(200, {
    payload: newP,
    message: "Tạo thành công",
  });
});

router.get("/search", function (req, res, next) {
  const { price } = req.query;
  const filter = data.filter((item) => item.price >= price);
  res.send(filter);
});

// Get one by id
router.get("/:id", function (req, res, next) {
  const { id } = req.params;

  const validationSchema = yup.number();

  validationSchema
    .validate(id)
    .then(() => {
      let result = data.find((x) => x.id == id);

      if (result) {
        return res.send({ code: 200, payload: result });
      }
      return res.send(404, { message: "Not found" });
    })
    .catch((err) => res.send(400, { message: "Bad request" }));
});

const updateProductSchema = yup.object({
  params: yup.object({
    id: yup.number(),
  }),
  body: yup.object({
    price: yup.number(),
    name: yup.string(),
  }),
});

router.patch(
  "/:id",
  validateSchema(updateProductSchema),
  function (req, res, next) {
    try {
      const { id } = req.params;

      const patchData = req.body;

      let found = data.find((x) => x.id == id);

      if (found) {
        for (let propertyName in patchData) {
          found[propertyName] = patchData[propertyName];
        }
        res.send({ ok: true, message: "Updated" });
      }
      res.send({ ok: false, message: "Updated fail" });
    } catch (error) {
      res.send({ ok: false, message: "Updated fail" });
    }
  }
);

router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  data = data.filter((x) => x.id.toString() !== id.toString());

  console.log("««««« data »»»»»", data);

  res.send({ ok: true, message: "Deleted" });
});

module.exports = router;
