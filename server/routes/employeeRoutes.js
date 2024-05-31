const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
  assignTeam,
} = require("../controllers/employeeController");
const employeeValidationRules = require("../middleware/employeeValidationRules");
const upload = require("../middleware/upload");
const router = express.Router();

router.post(
  "/add",
  upload.single("profilePicture"),
  employeeValidationRules(),
  createEmployee
);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.delete("/:id", deleteEmployeeById);
router.put("/assign-team", assignTeam);
router.put(
  "/:id",
  upload.single("profilePicture"),
  employeeValidationRules(),
  updateEmployeeById
);

module.exports = router;
