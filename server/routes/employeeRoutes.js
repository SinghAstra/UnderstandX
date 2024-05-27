const express = require("express");
const { createEmployee } = require("../controllers/employeeController");
const router = express.Router();

router.post("/add", createEmployee);

module.exports = router;
