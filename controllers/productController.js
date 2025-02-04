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

    console.log("Authenticated Admin:", req.user);

    // ✅ Validate required fields
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, price, description" });
    }

    // ✅ Create and save new product
    const newProduct = new Product({ name, price, description });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "Product addition failed", details: error.message });
  }
}
