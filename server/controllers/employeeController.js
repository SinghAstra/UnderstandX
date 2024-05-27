const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");

const createEmployee = async (req, res) => {
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

  try {
    // Check if the email or phone number already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingEmployee) {
      if (existingEmployee.email === email) {
        return res.status(400).json({ message: "Email already registered!" });
      }
      if (existingEmployee.phoneNumber === phoneNumber) {
        return res
          .status(400)
          .json({ message: "Phone number already registered!" });
      }
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

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json({ success: true, employees });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching employees",
        error: error.message,
      });
  }
};

module.exports = { createEmployee, getEmployees };
