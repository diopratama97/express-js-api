const Joi = require("@hapi/joi");
const UUID = Joi.string().guid({ version: ["uuidv4", "uuidv5"] });

const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});

const registrasiValidation = Joi.object({
  username: Joi.string().min(3).max(10).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
  role: Joi.number().min(3).allow("", null).optional(),
});

const getOne = Joi.object().keys({ id: UUID });
const hapus = Joi.object({ id: UUID });

const insertMahasiswa = Joi.object({
  nim: Joi.number().min(3).required(),
  nama: Joi.string().lowercase().required(),
  jurusan: Joi.string().lowercase().required(),
});

const updateMahasiswa = Joi.object({
  nim: Joi.number().min(3).required(),
  nama: Joi.string().lowercase().required(),
  jurusan: Joi.string().lowercase().required(),
});

module.exports = {
  login: loginValidation,
  register: registrasiValidation,
  getOne: getOne,
  hapus: hapus,
  updateMahasiswa: updateMahasiswa,
  insertMahasiswa: insertMahasiswa,
};
