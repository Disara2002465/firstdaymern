import express from "express";
import {
  blockOrUnblockUser,
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
  sendOTP,
  verifyOTP,
  loginWithGoogle,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/all", getAllUsers);

userRouter.put("/block/:email", blockOrUnblockUser);

userRouter.get("/sendOTP", sendOTP);

userRouter.post("/verifyEmail", verifyOTP);
userRouter.post("/google", loginWithGoogle);

userRouter.get("/", getUser);

export default userRouter;
