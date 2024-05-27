const express = require("express");
const {
  registerController,
  loginController,
  registerLimiter,
  verifyEmailController,
  checkAuthController,
} = require("../controllers/authController");
const registerValidationRules = require("../middleware/registerValidationRules");
const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  registerValidationRules(),
  registerController
);
router.get("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.get("/check-auth", checkAuthController);

module.exports = router;
