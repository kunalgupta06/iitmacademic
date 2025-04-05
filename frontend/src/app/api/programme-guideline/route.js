import { config } from "dotenv";
config(); // Load .env.local

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RetrievalQAChain } from "langchain/chains";

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const { question } = JSON.parse(bodyText);

    if (!question) {
      throw new Error("Question is missing from the request body.");
    }

    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY, // uncomment if using
    });
    
    console.log(">>> Embeddings instance:", embeddings);
    console.log(">>> Has numDimensions:", embeddings.numDimensions);

    const vectorstore = await Chroma.fromExistingCollection({
      collectionName: "programme-guidelines",
      url: "http://localhost:8000",
      embedding: embeddings,
      collectionMetadata: {
        "hnsw:space": "cosine", // optional, improves accuracy
      },
      // set this explicitly to avoid the numDimensions error
      embeddingFunction: {
        embedQuery: (text) => embeddings.embedQuery(text),
        embedDocuments: (docs) => embeddings.embedDocuments(docs),
      },
    });

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY is not defined.");

    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      apiKey,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever());

    const result = await chain.call({ query: question });

    return new Response(JSON.stringify({ answer: result.text }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in programme-guidelines route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}










  