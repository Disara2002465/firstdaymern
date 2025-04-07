import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req, res) {
  try {
    if (!isItCustomer(req)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = req.body;
    data.email = req.user.email;
    data.phone = req.user.phone;

    // Generate ID
    const lastInquiry = await Inquiry.findOne().sort({ id: -1 });
    const newId = lastInquiry ? lastInquiry.id + 1 : 1;
    data.id = newId;

    const newInquiry = new Inquiry(data);
    const saved = await newInquiry.save();

    return res.json({
      message: "Inquiry added successfully",
      id: saved.id,
    });
  } catch (e) {
    console.error("Add Inquiry Error:", e);
    res.status(500).json({ message: "Failed to add inquiry" });
  }
}

export async function getInquiries(req, res) {
  try {
    if (isItCustomer(req)) {
      const inquiries = await Inquiry.find({ email: req.user.email });
      return res.json(inquiries);
    }

    if (isItAdmin(req)) {
      const inquiries = await Inquiry.find();
      return res.json(inquiries);
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (e) {
    console.error("Get Inquiries Error:", e);
    res.status(500).json({ message: "Failed to get inquiries" });
  }
}

export async function deleteInquiry(req, res) {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findOne({ id });

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    // Admins can delete any
    if (isItAdmin(req)) {
      await Inquiry.deleteOne({ id });
      return res.json({ message: "Inquiry deleted successfully" });
    }

    // Customers can only delete their own
    if (isItCustomer(req) && inquiry.email === req.user.email) {
      await Inquiry.deleteOne({ id });
      return res.json({ message: "Inquiry deleted successfully" });
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (e) {
    console.error("Delete Inquiry Error:", e);
    res.status(500).json({ message: "Failed to delete inquiry" });
  }
}

export async function updateInquiry(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const inquiry = await Inquiry.findOne({ id });

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (isItAdmin(req)) {
      await Inquiry.updateOne({ id }, req.body);
      return res.json({ message: "Inquiry updated successfully" });
    }

    if (isItCustomer(req) && inquiry.email === req.user.email) {
      await Inquiry.updateOne({ id }, { message });
      return res.json({ message: "Inquiry updated successfully" });
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (e) {
    console.error("Update Inquiry Error:", e);
    res.status(500).json({ message: "Failed to update inquiry" });
  }
}
