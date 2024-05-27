const User = require("../models/User");
const { validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Rate limiter middleware to prevent brute force attacks
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after 15 minutes",
});

const registerController = async (req, res) => {
  const { username, password, firstName, lastName, email, role } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ success: false, message: "Username already taken!" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered!" });
      }
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create the new user
    const user = await User.create({
      username,
      password,
      firstName,
      lastName,
      email,
      verificationToken,
      role: role || "user",
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: http://localhost:3000/verify-email?token=${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with the new user data
    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginController = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both username and password" });
  }

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      req.session.user = {
        _id: user._id,
        username: user.username,
      };
      res.json({
        _id: user._id,
        username: user.username,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmailController = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token after verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkAuthController = (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};
module.exports = {
  registerController,
  loginController,
  registerLimiter,
  verifyEmailController,
  checkAuthController,
};
