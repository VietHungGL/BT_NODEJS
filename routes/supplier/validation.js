const yup = require("yup");

const suppliersPutSchema = yup.object({
  body: yup.object({
    name: yup.string().max(500).required(),
    isDeleted: yup.bool(),
    description: yup.string().max(500),
  }),
}); //Put update all

const suppliersPatchSchema = yup.object({
  body: yup.object({
    name: yup.string().max(500),
    isDeleted: yup.bool(),
    description: yup.string().max(500),
  }),
}); //patch update one
module.exports = {
  suppliersPutSchema,
  suppliersPatchSchema,
};
