const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployeeById,
} = require("../controllers/employeeController");
const employeeValidationRules = require("../middleware/employeeValidationRules");
const upload = require("../middleware/upload");
const router = express.Router();

const testController = (req, res) => {
  console.log("req.body is ", req.body);
  console.log("req.file is ", req.file);
  res.status(200).json({
    message: "This is a test route",
  });
};

router.post(
  "/add",
  upload.single("profilePicture"),
  employeeValidationRules(),
  createEmployee
);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.delete("/:id", deleteEmployeeById);
router.put("/:id", employeeValidationRules(), updateEmployeeById);

module.exports = router;
