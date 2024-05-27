const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");

const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      jobTitle,
      team,
      dateOfHire,
      profilePicture,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phoneNumber,
      jobTitle,
      team,
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
