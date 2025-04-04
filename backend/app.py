import os
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from database import db
from config import Config
from controllers.user_auth import AIChat, AddAssignment, AddLecture, CourseContent, GradeAssignment, InstructorDashboard, Login, Register, ServePDF, StudentDashboard, SubmitAssignment, ViewAssignments, ViewScores, ViewSubmittedAssignments
from flask import Flask, session
from models import db, subject_questions
from flask_session import Session
from flask import Flask, request, jsonify
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


app = Flask(__name__)
app.config.from_object(Config)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER  
ALLOWED_EXTENSIONS = {"pdf"}

api = Api(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE"],
     supports_credentials=True)  # Ensure credentials are supported
db.init_app(app)

app.config["SESSION_TYPE"] = "filesystem"  # Store session data in files
app.config["SECRET_KEY"] = "supersecretkey"  # Needed for session encryption
Session(app) 

# Load API Routes
api.add_resource(Login, "/login")
api.add_resource(Register, "/register")
api.add_resource(StudentDashboard, "/student-dashboard")
api.add_resource(InstructorDashboard, "/instructor-dashboard")
api.add_resource(CourseContent, "/course-content")
api.add_resource(AIChat, "/ai-chat")
api.add_resource(ViewAssignments, "/student-assignments/<int:subject_id>")
api.add_resource(SubmitAssignment, "/submit-assignment")
api.add_resource(ViewScores, "/student-scores")
api.add_resource(AddLecture, "/add-lecture")
api.add_resource(AddAssignment, "/add-assignment")
api.add_resource(ViewSubmittedAssignments, "/submitted-assignments/<int:subject_id>")
api.add_resource(GradeAssignment, "/grade-assignment")
api.add_resource(ServePDF, "/pdfs/<path:filename>")
print(app.url_map)
print("UPLOAD_FOLDER Path:", os.path.abspath(UPLOAD_FOLDER))
print("Files in UPLOAD_FOLDER:", os.listdir(UPLOAD_FOLDER))



@app.route("/programme-guideline", methods=["POST"])
def programme_guideline():
    data = request.get_json()
    query = data.get("question")
    #print(query)
    #new_query=subject_questions(query)
    #print(new_query)
    #db.session.add(new_query)
    #db.session.commit()

    if not query:
        return jsonify({"error": "Missing question"}), 400

    # ✅ Save to database
    new_ques = subject_questions(question=query)
    db.session.add(new_ques)
    db.session.commit()

    # ✅ Use Google Generative AI Embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

    vectorstore = Chroma(
        persist_directory="./chroma_db/programme-guidelines",
        collection_name="programme-guidelines",
        embedding_function=embeddings
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    # ✅ Updated model to `gemini-1.5-flash-latest`
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", verbose=True, system_message="You are an academic chatbot. Always provide clear and factual answers based on the retrieved documents.")

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True
    )

    result = qa_chain({"query": query})
    
    return jsonify({
        "answer": result["result"],
        "sources": [doc.metadata.get("source") for doc in result["source_documents"]]
    })




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
