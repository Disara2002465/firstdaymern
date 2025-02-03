import express from 'express';
import { addProduct } from '../controllers/productController.js';

const productRouter = express.Router();

// Define routes
productRouter.post("/", addProduct);

// Correct export
export default productRouter;
