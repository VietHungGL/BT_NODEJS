const yup = require("yup");

const categoriesPutSchema = yup.object({
  body: yup.object({
    name: yup.string().max(500).required(),
    isDeleted: yup.bool(),
    description: yup.string().max(500),
  }),
}); //Put update all

const categoriesPatchSchema = yup.object({
  body: yup.object({
    name: yup.string().max(500),
    isDeleted: yup.bool(),
    description: yup.string().max(500),
  }),
}); //patch update one
module.exports = {
  categoriesPutSchema,
  categoriesPatchSchema,
};
