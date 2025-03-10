import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Register User
export async function registerUser(req, res) {
  try {
    const { email, password, firstName, lastName, address, phone, role } =
      req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
      phone,
      role,
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
      process.env.JWT_SECRET, // ✅ Use environment variable
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User registration failed", details: error.message });
  }
}

// ✅ Login User
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      process.env.JWT_SECRET, // ✅ Use environment variable
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token: token, role: user.user });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
}

// ✅ Check if User is Admin
export function isItAdmin(req) {
  return req.user && req.user.role === "Admin";
}

// ✅ Check if User is Customer
export function isItCustomer(req) {
  return req.user && req.user.role === "Customer";
}
