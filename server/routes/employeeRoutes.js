const express = require("express");
const {
  createEmployee,
  getEmployees,
} = require("../controllers/employeeController");
const employeeValidationRules = require("../middleware/employeeValidationRules");
const router = express.Router();

router.post("/add", employeeValidationRules(), createEmployee);
router.get("/", getEmployees);

module.exports = router;
