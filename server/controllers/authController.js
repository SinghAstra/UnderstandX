const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Validator middleware
const registerValidationRules = () => {
  return [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long."),
    body("password")
      .isStrongPassword()
      .withMessage(
        "Password must be strong (include upper and lower case letters, numbers, and symbols)."
      ),
    body("email").isEmail().withMessage("Email must be a valid email address."),
    body("firstName")
      .isAlpha()
      .withMessage("First name must contain only alphabetic characters.")
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    body("lastName")
      .isAlpha()
      .withMessage("Last name must contain only alphabetic characters.")
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
  ];
};

const registerController = async (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;

  // Check for missing fields
  if (!username || !password || !firstName || !lastName || !email) {
    let missingFields = [];

    if (!username) missingFields.push("username");
    if (!password) missingFields.push("password");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!email) missingFields.push("email");

    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // Check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Create the new user
    const user = await User.create({
      username,
      password,
      firstName,
      lastName,
      email,
    });

    // Respond with the new user data
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  registerValidationRules,
};
