const express = require("express");
const router = express.Router();
const { uploadPrescription } = require("../controllers/recordController");
const  authMiddleware  = require("../middlewares/authMiddleware");

router.post("/uploadPrescription",authMiddleware, uploadPrescription);

module.exports = router;
