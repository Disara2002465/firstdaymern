import express from "express";
import {
  addReview,
  deleteReviews,
  getReviews,
} from "../controllers/reviewController.js"; // Fixed import

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/", getReviews);
reviewRouter.delete("/:email", deleteReviews);

// // Fixed /email route
// reviewRouter.get("/email", (req, res) => {
//   console.log("This is the approved route.");
// });

// // Fixed /approved route
// reviewRouter.get("/approved", (req, res) => {
//   console.log("This is email route");
// });

reviewRouter.put("/approve/:email", approveReview);
