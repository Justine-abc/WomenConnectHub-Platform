// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const register = async (req, res) => {
  const { firstName, lastName, email, password, role, gender, country, city, companyName, companyWebsite, contactInfo, profileImage, businessCertificate, secretKey } = req.body;
  console.log("Registering user:", req.body);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "First name, last name, email, and password are required" });
    }

    // Admin secret key validation
    if (role === 'admin' && secretKey !== "12345@#@@@@@@@@!!!!wwwgggh.") {
      return res.status(400).json({ error: "Invalid admin secret key" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "entrepreneur",
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token expires in 7 days, adjust as needed
    );

    // Send user and token back
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send user and token back (exclude password)
    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };
