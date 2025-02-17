import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
    default: "uncategorized",
  },

  dimensions: {
    type: Object, // You can change this to an array or a nested schema if needed
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  category: {
    type: [String],
    required: true,
    default: "https://www.shutterstock.com/search/default-profile-image",
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
