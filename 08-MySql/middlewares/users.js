import {body} from 'express-validator'

export const loginValidator = [
  body('email', 'Invalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]

export const createValidator = [
  body('user.username', 'username does not Empty').not().isEmpty(),
  body('user.email', 'Invalid email').isEmail(),
  body('user.age', 'username must be Alphanumeric').isAlphanumeric(),
  body('user.birthday', 'Invalid birthday').isISO8601(), // check date is ISOString
  body('user.password', 'password does not Empty').not().isEmpty(),
  body('user.password', 'The minimum password length is 6 characters').isLength({min: 6}),
]