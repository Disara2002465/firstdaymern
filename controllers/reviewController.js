import Review from "../models/review.js"; // Correct import with capitalized naming
import ADMIN_ROLE from "../constance/userRoleConst.js";

// Function to add a review
export function addReview(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again" });
  }

  const data = {
    ...req.body,
    name: `${req.user.firstName} ${req.user.lastName}`,
    profilePicture: req.user.profilePicture,
    email: req.user.email,
  };

  const newReview = new Review(data);

  newReview
    .save()
    .then(() => res.json({ message: "Review added successfully" }))
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Review addition failed", details: error.message })
    );
}

// Function to get reviews
export async function getReviews(req, res) {
    const user = req.user;

    try{
      if(user.role == "admin"){
      const reviews = await Review.find();
      res.json(reviews);
      }else{
      const reviews = await Review.find(isApproved:true);
      res.json(reviews);
      }
    )catch(error){
      res.status(500).json({error: " Failed to get reviews"});
    }
    }

// Function to delete a review by email
export function deleteReviews(req, res) {
  const { email } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again" });
  }

  if (req.user.role === "admin") {
    // Admin can delete any review
    return Review.deleteOne({ email })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({ error: "No review found for the given email" });
        }
        res.json({ message: "Review deleted successfully" });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ error: "Review deletion failed", details: error.message })
      );
  }

  if (req.user.role === "customer") {
    // Customers can delete only their own reviews
    if (req.user.email !== email) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    return Review.deleteOne({ email })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Review not found" });
        }
        res.json({ message: "Review deleted successfully" });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ error: "Review deletion failed", details: error.message })
      );
  }

  return res.status(403).json({ message: "Unauthorized action" });
}

// Function to approve a review
export function approveReview(req, res) {
  const { email } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Please login and try again" });
  }

  if (req.user.role !== ADMIN_ROLE) {
    return res.status(403).json({ message: "Only admins can approve reviews" });
  }

  return Review.updateOne({ email }, { isApproved: true })
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res
          .status(404)
          .json({ error: "Review not found or already approved" });
      }
      res.json({ message: "Review approved successfully" });
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error: "Review approval failed", details: error.message })
    );
}
