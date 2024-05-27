const express = require("express");
const { createEmployee } = require("../controllers/employeeController");
const employeeValidationRules = require("../middleware/employeeValidationRules");
const router = express.Router();

router.post("/add", employeeValidationRules(), createEmployee);

module.exports = router;
