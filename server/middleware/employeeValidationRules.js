const { body } = require("express-validator");

const employeeValidationRules = () => {
  return [
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
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Email must be a valid email address.")
      .normalizeEmail(),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required.")
      .isMobilePhone()
      .withMessage("Phone number must be a valid mobile phone number."),
    body("jobTitle")
      .notEmpty()
      .withMessage("Job title is required.")
      .isString()
      .withMessage("Job title must be a valid string."),
    body("team")
      .notEmpty()
      .withMessage("Team is required.")
      .isString()
      .withMessage("Team must be a valid string."),
    body("dateOfHire")
      .notEmpty()
      .withMessage("Date of hire is required.")
      .isISO8601()
      .withMessage("Date of hire must be a valid date.")
      .toDate(),
    body("profilePicture")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL."),
  ];
};

module.exports = employeeValidationRules;
