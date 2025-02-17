import express from "express";
import {
  addProducts,
  getProducts,
  updateProduct,
  deleteProduct, // ✅ Added missing import
} from "../controllers/productController.js";

const productRouter = express.Router();

// Define routes
productRouter.post("/", addProducts);
productRouter.get("/", getProducts);
productRouter.put("/:key", updateProduct);
productRouter.delete("/:key", deleteProduct); // ✅ Now properly imported

// Correct export
export default productRouter;
