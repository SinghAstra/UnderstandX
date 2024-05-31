const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");
const { default: mongoose } = require("mongoose");

const createEmployee = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    jobTitle,
    team,
    dateOfHire,
  } = req.body;

  const profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

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
      profilePicture: profilePictureUrl,
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
  const { page = 1, limit = 10, sort = "createdAt", order = "asc" } = req.query;

  try {
    const employees = await Employee.find({})
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalEmployees = await Employee.countDocuments();

    res.status(200).json({
      success: true,
      employees,
      pagination: {
        total: totalEmployees,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalEmployees / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: error.message,
    });
  }
};

const deleteEmployeeById = async (req, res) => {
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: error.message,
    });
  }
};

const updateEmployeeById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if the provided ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Check if the email or phone number already exists for another employee
    const existingEmployee = await Employee.findOne({
      $or: [
        { email: updateData.email, _id: { $ne: id } },
        { phoneNumber: updateData.phoneNumber, _id: { $ne: id } },
      ],
    });

    if (existingEmployee) {
      if (existingEmployee.email === updateData.email) {
        return res.status(400).json({ message: "Email already registered!" });
      }
      if (existingEmployee.phoneNumber === updateData.phoneNumber) {
        return res
          .status(400)
          .json({ message: "Phone number already registered!" });
      }
    }
    const employee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error updating employee",
      error: error.message,
    });
  }
};

const assignTeam = async (req, res) => {
  console.log("req.body is ", req.body);

  const { employeeIds, team } = req.body;

  console.log("employeeIds : ", employeeIds);

  if (!employeeIds || !team) {
    return res
      .status(400)
      .json({ message: "Employee IDs and team are required" });
  }

  try {
    // Update team for all employees whose IDs are in the employeeIds array
    await Employee.updateMany({ _id: { $in: employeeIds } }, { team });

    res.status(200).json({ message: "Team assigned successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning team", error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
  assignTeam,
};
