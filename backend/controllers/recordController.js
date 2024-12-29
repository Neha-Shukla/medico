const Prescription = require("../models/Prescription");
const multer = require("multer");
const path = require("path");
const { analyzePrescription } = require("../services/pythonService");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add unique timestamp to filename
  },
});
const upload = multer({ storage });

// Upload Prescription Endpoint
exports.uploadPrescription = [
  upload.single("prescription"), // Expect 'prescription' as file field
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const userId = req.user; // Assuming JWT middleware adds user to req
      const filename = req.file.filename;

      // Save prescription record to MongoDB
      const prescription = new Prescription({
        user: userId,
        filename,
      });
      await prescription.save();

      // Call AI Analysis
      const analysisResult = await analyzePrescription(req.file);

      // Update prescription with AI results
      prescription.department = analysisResult.department;
      // prescription.medicines = analysisResult.medicines;
      await prescription.save();

      res.status(200).json({
        message: "Prescription uploaded and analyzed successfully.",
        data: {
          department: analysisResult.department
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error.", error: err.message });
    }
  },
];
