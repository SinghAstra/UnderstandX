const { body } = require("express-validator");

const registerValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required.")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long."),
    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword()
      .withMessage(
        "Password must be strong (include upper and lower case letters, numbers, and symbols)."
      ),
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email must be a valid email address.")
      .normalizeEmail(),
    body("firstName")
      .notEmpty()
      .withMessage("First name is required.")
      .isAlpha()
      .withMessage("First name must contain only alphabetic characters."),
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required.")
      .isAlpha()
      .withMessage("Last name must contain only alphabetic characters."),
  ];
};

module.exports = registerValidationRules;
