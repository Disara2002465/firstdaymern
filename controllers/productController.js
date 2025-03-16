import Product from "../models/product.js";
import { isItAdmin as isAdmin } from "./userController.js";

// ✅ Add Product
export async function addProducts(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const data = req.body;
    const newProduct = new Product(data);

    await newProduct.save();
    return res.status(201).json({
      message: "Product registered successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Product registration failed",
      details: error.message,
    });
  }
}

// ✅ Get Products
export async function getProducts(req, res) {
  try {
    let products = isAdmin(req)
      ? await Product.find()
      : await Product.find({ availability: true });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
}

// ✅ Update Product
export async function updateProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const key = req.params.key;
    const data = req.body;

    const updatedProduct = await Product.findOneAndUpdate({ key: key }, data, {
      new: true, // Return the updated document
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
}

export async function deleteProduct(req, res) {
  try {
    if (isAdmin(req)) {
      const key = req.params.key;
      await Product.deleteOne({ key: key });
      res.json({
        message: "Product deleted successfully",
      });
    } else {
      res.status(403).json({
        message: "You are not authorized to perform this action",
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      message: "Failed to delete product",
    });
  }
}

export async function getProductByKey(req, res) {
  try {
    const key = req.params.key;
    const product = await Product.findOne({ key: key });
    if (product == null) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }
    res.json(product);
    return;
  } catch (e) {
    res.status(500).json({
      message: "Failed to get product",
    });
  }
}
