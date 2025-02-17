import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "Customer",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
      default: "https://www.shutterstock.com/search/default-profile-image",
    },
  },
  { timestamps: true } // Optional: Adds createdAt and updatedAt timestamps
);

const User = mongoose.model("User", userSchema);
export default User;

// "email": "admin@admin.com",

// "password": "secret123", Admin Login

// "email": "emma.wilson@example.com",
//"password": "secret456" (customer)
