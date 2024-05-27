const Employee = require("../models/Employee");

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
