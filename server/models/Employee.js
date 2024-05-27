const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jobTitle: { type: String, required: true },
  team: { type: String, required: true },
  contactInfo: { type: String, required: true },
  dateOfHire: { type: Date, required: true },
  profilePicture: { type: String },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
