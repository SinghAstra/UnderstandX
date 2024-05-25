const express = require("express");
const {
  registerController,
  loginController,
  registerValidationRules,
  registerLimiter,
  verifyEmailController,
} = require("../controllers/authController");
const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  registerValidationRules(),
  registerController
);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);

module.exports = router;
