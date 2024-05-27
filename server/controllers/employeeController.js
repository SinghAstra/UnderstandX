const Employee = require("../models/Employee");

const employeeValidationRules = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .isAlpha()
      .withMessage("First name must contain only letters"),
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .isAlpha()
      .withMessage("Last name must contain only letters"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("jobTitle").notEmpty().withMessage("Job title is required"),
    body("team").optional().notEmpty().withMessage("Team cannot be empty"),
    //   body('contactInfo')
    //     .optional()
    //     .isObject()
    //     .withMessage('Contact info must be an object')
    //     .custom((value) => {
    //       const phonePattern = /^[0-9]{10}$/;
    //       const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //       if (value.phone && !phonePattern.test(value.phone)) {
    //         throw new Error('Invalid phone number');
    //       }
    //       if (value.email && !emailPattern.test(value.email)) {
    //         throw new Error('Invalid contact email address');
    //       }
    //       return true;
    //     }),
    body("dateOfHire")
      .notEmpty()
      .withMessage("Date of hire is required")
      .isISO8601()
      .withMessage("Date of hire must be a valid date"),
    body("profilePicture")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL"),
  ];
};
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      jobTitle,
      team,
      contactInfo,
      dateOfHire,
      profilePicture,
    } = req.body;

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      jobTitle,
      team,
      contactInfo,
      dateOfHire,
      profilePicture,
    });

    await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding employee", error: error.message });
  }
};

module.exports = { createEmployee };
