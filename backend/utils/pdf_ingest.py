import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


# Load environment variables
load_dotenv()

# Initialize Google Generative AI Embeddings
embedding_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# Set up text splitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

# Function to load and ingest PDFs from a folder
def ingest_pdf_folder(folder_path, collection_name):
    all_docs = []

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(folder_path, file_name))
            docs = loader.load()
            all_docs.extend(docs)

    print(f"📄 Loaded {len(all_docs)} documents from {folder_path}")

    split_docs = splitter.split_documents(all_docs)

    vectorstore = Chroma.from_documents(
        documents=split_docs,
        embedding=embedding_model,
        collection_name=collection_name,
        persist_directory=f"./chroma_db/{collection_name}"
    )

    print(f"✅ Stored {len(split_docs)} chunks in collection '{collection_name}'")

# Re-ingest PDFs with the new embedding model
ingest_pdf_folder("pdfs/programme", "programme-guidelines")
ingest_pdf_folder("pdfs/mlf", "mlf-subject")
ingest_pdf_folder("pdfs/se", "se-subject")




