import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Use body-parser middleware
app.use(bodyParser.json());

app.use(cors());

// ✅ Improved JWT Middleware
app.use((req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    token = token.replace("Bearer ", ""); // ✅ Remove "Bearer " prefix properly

    jwt.verify(token, "kv-secret-891", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" }); // ✅ Stop request if token is invalid
      }
      req.user = decoded; // ✅ Only assign if verification is successful
    });
  }
  next();
});

// ✅ MongoDB connection with error handling
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((error) => console.log("MongoDB connection failed:", error));

// ✅ Ensure `userRouter` and `productRouter` are defined
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
