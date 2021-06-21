const Joi = require('@hapi/joi');

const loginValidation = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required()
});

const registrasiValidation = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(3).required(),
    role: Joi.number().min(3).required()
})

module.exports = {
    login: loginValidation,
    register: registrasiValidation
}