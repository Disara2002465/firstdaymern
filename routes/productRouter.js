import express from "express";
import {
  addProducts,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductByKey,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Define routes
productRouter.post("/", addProducts);
productRouter.get("/", getProducts);
productRouter.put("/:key", updateProduct);
productRouter.delete("/:key", deleteProduct);
productRouter.get("/:key", getProductByKey);

// Correct export
export default productRouter;
