const router = require('express').Router();
const authController = require('../controllers/auth/authController');
const joi = require('joi');
const validator = require('express-joi-validation').createValidator({});
const auth = require('../middleware/auth') 

const registerSchema = joi.object({
  username: joi.string().min(3).max(12).required(),
  password: joi.string().min(6).max(12).required(),
  mail: joi.string().email().required()
})

const loginSchema = joi.object({
  password: joi.string().min(6).max(12).required(),
  mail: joi.string().email().required()
})

router.post('/register', validator.body(registerSchema), authController.controller.postRegister);
router.post('/login', validator.body(loginSchema), authController.controller.postLogin);



module.exports = router