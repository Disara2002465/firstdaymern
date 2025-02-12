import Product from "../models/product.js";

export async function addProduct(req, res) {
  try {
    // ✅ Ensure user is logged in
    if (!req.user) {
      return res.status(401).json({ message: "Please log in and try again" });
    }

    // ✅ Check admin privileges
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const data = req.body;
    const newProduct = new Product(data);

    try {
      await newProduct.save();
      return res.json({
        message: "Product registered successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Product registration failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "An unexpected error occurred",
    });
  }
}
