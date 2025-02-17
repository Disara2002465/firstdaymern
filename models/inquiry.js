import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  id: {
    type: Number, // ✅ Fixed type
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // ✅ Fixed type
    required: true,
    default: Date.now, // ✅ Fixed default value
  },
  response: {
    type: String,
    required: false,
    default: " ", // ✅ Fixed syntax
  },
  isResolved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Inquiry = mongoose.model("Inquiries", inquirySchema);
export default Inquiry;
