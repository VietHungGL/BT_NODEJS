const yup = require("yup");

const data = require("../../data/products.json");
const { writeFileSync, generationID } = require("../../helper");

const getAll = (req, res, next) => {
  res.send(data);
};

const postCreate = async (req, res, next) => {
  const { name, price } = req.body;

  const newP = { name, price, id: generationID() };
  if (data?.length > 0) {
    await writeFileSync("data/products.json", [...data, newP]);
  } else {
    await writeFileSync("data/products.json", [newP]);
  }

  res.send(200, {
    payload: newP,
    message: "Tạo thành công",
  });
};

const getSearch = (req, res, next) => {
  const { price } = req.query;
  const filter = data.filter((item) => item.price >= price);
  res.send(filter);
};

const getUpdate = (req, res, next) => {
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
};

const patchUpdate = (req, res, next) => {
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
};

const xoa = (req, res, next) => {
  const { id } = req.params;
  data = data.filter((x) => x.id.toString() !== id.toString());

  console.log("««««« data »»»»»", data);

  res.send({ ok: true, message: "Deleted" });
};

module.exports = {
  getAll,
  postCreate,
  getSearch,
  getUpdate,
  patchUpdate,
  xoa,
};
