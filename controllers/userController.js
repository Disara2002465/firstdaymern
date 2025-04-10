import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
dotenv.config();
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "disarahasandi575@gmail.com",
    pass: "uvyn aomc yrsl icgo",
  },
});

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

    sendOTP(newUser, undefined);
    // Generate JWT Token
    const token = jwt.sign(
      {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        emailVerified: true,
      },
      process.env.JWT_SECRET,
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
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ error: "Your account is blocked. Please contact the admin." });
    }

    // Compare passwords
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        emailVerified: user.emailVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
}

// ✅ Middleware to Verify Token
export function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid Token" });
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

// ✅ Get All Users (Admin Only)
export async function getAllUsers(req, res) {
  if (!req.user || !isItAdmin(req)) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get users", details: error.message });
  }
}

// ✅ Block or Unblock User (Admin Only)
export async function blockOrUnblockUser(req, res) {
  const email = req.params.email;

  if (!isItAdmin(req)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: "User blocked/unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update user status", details: error.message });
  }
}

export function getUser(req, res) {
  if (req.user != null) {
    res.json(req.user);
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
}

export async function sendOTP(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  //generate number between 1000 and 9999
  const otp = Math.floor(Math.random() * 9000) + 1000;
  //save otp in database
  const newOTP = new OTP({
    email: req.user.email,
    otp: otp,
  });
  await newOTP.save();

  const message = {
    from: "disarahasandi575@gmail.com",
    to: req.user.email,
    subject: "Validating OTP",
    text: "Your otp code is " + otp,
  };

  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log(info);
      res.json({ message: "OTP sent successfully" });
    }
  });
}

export async function verifyOTP(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  const code = req.body.code;

  const otp = await OTP.findOne({
    email: req.user.email,
    otp: code,
  });

  if (otp == null) {
    res.status(404).json({ error: "Invalid OTP" });
    return;
  } else {
    await OTP.deleteOne({
      email: req.user.email,
      otp: code,
    });

    await User.updateOne(
      {
        email: req.user.email,
      },
      {
        emailVerified: true,
      }
    );

    res.status(200).json({ message: "Email verified successfully" });
  }
}
