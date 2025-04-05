import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf";
import { ChatGemini } from "@langchain/community/chat_models/gemini";
import { RetrievalQAChain } from "langchain/chains";

export async function POST(req) {
  try {
    const { question, subject } = await req.json();

    if (!subject) {
      return new Response(JSON.stringify({ error: "Subject not specified" }), { status: 400 });
    }

    const subjectMap = {
      "machine-learning-foundations": "mlf-subject",
      "software-engineering": "se-subject"
      // Add more mappings as needed
    };

    const collectionName = subjectMap[subject];

    if (!collectionName) {
      return new Response(JSON.stringify({ error: "Invalid subject" }), { status: 400 });
    }

    const vectorstore = await Chroma.fromExistingCollection(
      new HuggingFaceTransformersEmbeddings({
        modelName: "sentence-transformers/all-MiniLM-L6-v2"
      }),
      {
        collectionName,
        url: "http://localhost:8000",
      }
    );

    const model = new ChatGemini({ apiKey: process.env.GEMINI_API_KEY });
    const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever());

    const result = await chain.call({ query: question });

    return new Response(JSON.stringify({ answer: result.text }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}



  