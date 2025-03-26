from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt
import pdfplumber
import re
import os
from models.assignment import MCQ
from database import db  # Make sure you import db

assignments_bp = Blueprint("assignments_bp", __name__)

# --- Extract MCQs ---
def extract_text_from_pdf(pdf_file):
    text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def parse_mcqs(text):
    mcq_pattern = re.compile(
        r"(\d+)\.\s*(.*?)\nA\.\s(.*?)\nB\.\s(.*?)\nC\.\s(.*?)\nD\.\s(.*?)\nAnswer:\s(.*?)\n",
        re.S
    )
    mcqs = []
    for match in mcq_pattern.findall(text):
        question_number, question, option1, option2, option3, option4, correct_answer = match
        mcqs.append((
            question.strip(),
            option1.strip(),
            option2.strip(),
            option3.strip(),
            option4.strip(),
            correct_answer.strip()
        ))
    return mcqs

def store_mcqs_in_db(mcqs):
    for mcq in mcqs:
        question, option1, option2, option3, option4, correct_answer = mcq
        new_mcq = MCQ(
            question=question,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            correct_answer=correct_answer
        )
        db.session.add(new_mcq)
    db.session.commit()

# --- Upload Route ---
@assignments_bp.route('/upload-assignment', methods=['POST'])
@jwt_required()
def upload_assignment():
    claims = get_jwt()
    role = claims.get("role")
    if role != "instructor":
        return jsonify({"error": "Only instructors can upload assignments"}), 403

    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf']
    
    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save temporarily
    temp_path = os.path.join("temp", pdf_file.filename)
    os.makedirs("temp", exist_ok=True)
    pdf_file.save(temp_path)

    try:
        text = extract_text_from_pdf(temp_path)
        mcqs = parse_mcqs(text)
        store_mcqs_in_db(mcqs)
        os.remove(temp_path)
        return jsonify({"message": f"Extracted and stored {len(mcqs)} MCQs successfully!"}), 201

    except Exception as e:
        os.remove(temp_path)
        return jsonify({"error": str(e)}), 500



