const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true }, // Uploaded file name
  uploadDate: { type: Date, default: Date.now },
  summary: { type: String, default: null },   // AI Summary of the document
  department: { type: String },             // List of extracted medicines
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
