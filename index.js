import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";

const app = express();

// ✅ Use body-parser middleware
app.use(bodyParser.json());

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
            next(); // ✅ Proceed to next middleware
        });
    } else {
        next(); // ✅ Proceed if no token (optional: block access if auth is required)
    }
});

// ✅ MongoDB connection with error handling
const mongoUrl = "mongodb+srv://meishusama:meishusama@cluster0.f72vz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
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
