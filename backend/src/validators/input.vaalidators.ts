
import joi from 'joi';

export const loginSchema = joi.object({
  email: joi.string().required().email().messages({
    'string.empty': 'amail is required',
    'string.email': 'Please enter a valid email'
  }),
  password: joi.string().required().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&*.!])[a-zA-z\\d@#$&*.!]{8,30}$')).required().messages({
    'string.empty': 'password is reqired',
    'string.pattern.base': 'password should contain atleast one lower, uppercase,, number and special character',
    'string.min': 'password should be at least 8 characters',
    'string.max': 'password should be at most 30 characters'
  })
});

export const userSchema = joi.object({
  fullname: joi.string().min(5).required().max(30).messages({
    'string.empty': 'fullname is required',
    'string.min': 'fullname should be at least 5 characters',
    'string.max': 'fullname should be at most 30 characters'
  }),
  id_number: joi.number().required().min(10).max(10).messages({
    'number.empty': 'id_number is required',
    'number.min': 'id_number should be at least 10',
    'number.max': 'id_number should be at most 10'
  }),
  country: joi.string().required().messages({
    'string.empty': 'country is required'
  }),
  county: joi.string().required().messages({
    'string.empty': 'county is required'
  }),
  ward: joi.string().required().messages({
    'string.empty': 'ward is required'
  }),
  email: joi.string().email().required().messages({
    'string.empty': 'email is required',
    'string.email': 'Please enter a valid email'
  }),
  phone_number: joi.string().min(10).max(10).required().messages({
    'string.empty': 'phone_number is required',
    'string.min': 'phone_number should be at least 10 characters',
    'string.max': 'phone_number should be at most 10 characters'
  }),
  role: joi.string().required().messages({
    'string.empty': 'role is required'
  }),
  profile_image: joi.string().required().messages({
    'string.empty': 'profile_image is required'
  }),
  password: joi.string().required().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&*.!])[a-zA-z\\d@#$&*.!]{8,30}$')).required().messages({
    'string.empty': 'password is reqired',
    'string.pattern.base': 'password should contain atleast one lower, uppercase,, number and special character',
    'string.min': 'password should be at least 8 characters',
    'string.max': 'password should be at most 30 characters'
  })
});