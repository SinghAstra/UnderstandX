const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
} = require("../controllers/employeeController");
const employeeValidationRules = require("../middleware/employeeValidationRules");
const router = express.Router();

router.post("/add", employeeValidationRules(), createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.delete("/:id", deleteEmployeeById);
router.put("/:id", employeeValidationRules(), updateEmployeeById);

module.exports = router;
