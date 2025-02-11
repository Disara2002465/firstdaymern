import express from "express";
import {
  addReview,
  deleteReviews,
  getReviews,
  approveReview, // ✅ Added missing import
} from "../controllers/reviewController.js"; // Fixed import

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/", getReviews);
reviewRouter.delete("/:email", deleteReviews);
reviewRouter.put("/approve/:email", approveReview); // ✅ Now it works correctly

export default reviewRouter; // ✅ Ensure it's exported for use in other files

// // Fixed /email route
// reviewRouter.get("/email", (req, res) => {
//   console.log("This is the approved route.");
// });

// // Fixed /approved route
// reviewRouter.get("/approved", (req, res) => {
//   console.log("This is email route");
// });
