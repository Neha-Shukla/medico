import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF for PDF text extraction
import pytesseract  # Tesseract OCR for image text extraction
from PIL import Image
from flask_cors import CORS

pytesseract.pytesseract.tesseract_cmd = r"C:\Users\neha\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

# Initialize the Flask application
app = Flask(__name__)
CORS(app)
# Configure upload folder and allowed extensions
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size: 16MB

# Function to check if file has allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# Function to extract text from images using Tesseract OCR
def extract_text_from_image(image_path):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text

# Function to classify medical department
def classify_department(text):
    departments = {
        "dental": ["tooth", "teeth", "dental", "cavity", "gum"],
        "brain": ["neuro", "brain", "migraine", "seizure", "headache"],
        "bone": ["orthopedic", "bone", "fracture", "joint", "spine"],
        "eye":["eye","eyes","netra","netralaya","nayan"],
        "ent": ["ear", "nose", "throat", "sinus", "ENT"],
        "cardiology": ["heart", "cardiac", "cardio", "ECG", "cholesterol"],
        "dermatology": ["skin", "rash", "eczema", "acne", "derma"],
        "pediatrics": ["child", "pediatric", "infant", "baby", "children"],
        
        # Add more departments and keywords as needed
    }
    
    for department, keywords in departments.items():
        for keyword in keywords:
            if keyword.lower() in text.lower():
                return department
    
    return "unknown"

# Upload endpoint
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Secure the filename and save it
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Extract text based on file type
        if filename.lower().endswith('.pdf'):
            extracted_text = extract_text_from_pdf(filepath)
        elif filename.lower().endswith(('png', 'jpg', 'jpeg')):
            extracted_text = extract_text_from_image(filepath)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        # Classify the medical department
        department = classify_department(extracted_text)
        
        return jsonify({"department": department}), 200
    else:
        return jsonify({"error": "Invalid file type. Allowed types: PDF, PNG, JPG, JPEG."}), 400

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    # Run the Flask app
    app.run(debug=True)
