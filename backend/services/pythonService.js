const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.analyzePrescription = async (file) => {
  try {
    console.log("file", file);

    // Create a FormData object to send the file as multipart/form-data
    const form = new FormData();
    form.append("file", fs.createReadStream(file.path), file.filename);

    // Send POST request with file in form-data
    const response = await axios.post("http://127.0.0.1:5000/upload", form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return response.data; // Return summary and medicines from Python service
  } catch (err) {
    console.error("Error calling Python AI service:", err.message);
    throw new Error("Failed to analyze prescription.");
  }
};
