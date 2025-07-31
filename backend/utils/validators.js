// utils/validators.js

const Joi = require("joi");

const registerSellerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  businessCertificate: Joi.string().uri().required(),
});

const registerInvestorSchema = Joi.object({
  companyName: Joi.string().required(),
  profileImage: Joi.string().uri().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  website: Joi.string().uri().optional(),
});

const projectUploadSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  email: Joi.string().email().required(),
  projectImage: Joi.string().uri().required(),
  location: Joi.string().required(),
  video: Joi.string().uri().optional(),
});

module.exports = {
  registerSellerSchema,
  registerInvestorSchema,
  projectUploadSchema,
};
