const { body } = require("express-validator");

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be 3-50 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("username")
    .exists()
    .withMessage("Username is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty"),
];

const customerValidation = [
  body("full_name")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Full name must be 2-150 characters"),
  body("contact_number")
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage("Contact number must be 7-20 valid characters"),
  body("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
  body("internet_plan")
    .trim()
    .notEmpty()
    .withMessage("Internet plan is required"),
  body("status")
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive"),
];

const planValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Plan name must be 2-100 characters"),
  body("speed_mbps")
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage("Speed must be a positive number"),
];

module.exports = {
  registerValidation,
  loginValidation,
  customerValidation,
  planValidation,
};
