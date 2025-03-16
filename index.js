import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

// ✅ Improved JWT Middleware
app.use((req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      req.user = decoded;
    });
  }
  next(); // ✅ Ensure `next()` is always called
});

// ✅ MongoDB Connection with Error Handling
const mongoUrl = process.env.MONGO_URL || "your-default-mongodb-url";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB is connected successfully"))
  .catch((error) => console.error("❌ MongoDB connection failed:", error));

// ✅ Define Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
