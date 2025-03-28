import os

from flask import   app, jsonify, make_response, request, send_from_directory, session, url_for
from app.models import assignment, lectures, score, subject, User
from app.database import db
from flask_restful import Resource
import google.generativeai as genai
import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings



def get_upload_folder():
    """Get upload folder path from Flask app context"""
    return app.config["UPLOAD_FOLDER"]
# from flask import send_from_directory

class ServePDF(Resource):
    def get(self, filename):
        """Serves PDFs stored in the uploads directory."""
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=False)

# Initialize Gemini API with API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



# Initialize ChromaDB Client
chroma_client = chromadb.PersistentClient(path="./chroma_db")  # Path to store the vector database

# Load Embedding Model
embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Function to Store Lecture Transcripts
def store_transcripts_in_chroma(transcripts):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(transcripts)

    vector_store = Chroma.from_documents(chunks, embedding_model, persist_directory="./chroma_db")
    print("Lecture Transcripts Stored in ChromaDB!")
    return vector_store

# Load Stored Database
vector_db = Chroma(persist_directory="./chroma_db", embedding_function=embedding_model)



class AIChat(Resource):
    def post(self):
        """Handles AI-based responses using Google's Gemini API & ChromaDB"""
        data = request.get_json()
        user_query = data.get("query")

        if not user_query:
            return jsonify({"error": "Missing query parameter"}), 400

        try:
            # Search in ChromaDB (Retrieve Most Relevant Lecture Chunks)
            search_results = vector_db.similarity_search(user_query, k=3)
            retrieved_context = "\n".join([doc.page_content for doc in search_results])

            # Query Gemini API with Retrieved Context
            model = genai.GenerativeModel("gemini-pro")
            full_prompt = f"Context: {retrieved_context}\nUser Question: {user_query}\nAnswer:"
            response = model.generate_content(full_prompt)

            return jsonify({"response": response.text})

        except Exception as e:
            return jsonify({"error": str(e)}), 500