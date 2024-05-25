const express = require("express");
const {
  registerController,
  loginController,
  registerValidationRules,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerValidationRules(), registerController);
router.post("/login", loginController);

module.exports = router;
