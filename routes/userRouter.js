import express from "express";
import {
  blockOrUnblockUser,
  getAllUsers,
  loginUser,
  registerUser,
  getUser,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/all", getAllUsers);
router.put("/block/:email", blockOrUnblockUser);
router.get("/", getUser);

export default router;
