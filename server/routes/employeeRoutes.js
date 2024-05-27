const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
} = require("../controllers/employeeController");
const employeeValidationRules = require("../middleware/employeeValidationRules");
const router = express.Router();

router.post("/add", employeeValidationRules(), createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);

module.exports = router;
