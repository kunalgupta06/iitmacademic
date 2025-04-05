from flask import request, jsonify
from flask_restful import Resource
from models import subject_questions, db
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
import re


class ProgrammeGuideline(Resource):
    def post(self):
        data = request.get_json()
        query = data.get("question")

        if not query:
            return jsonify({"error": "Missing question"}), 400

        new_ques = subject_questions(question=query)
        db.session.add(new_ques)
        db.session.commit()

        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

        vectorstore = Chroma(
            persist_directory="./chroma_db/programme-guidelines",
            collection_name="programme-guidelines",
            embedding_function=embeddings
        )

        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash-latest",
            verbose=True,
            system_message="You are an academic chatbot. Always provide clear and factual answers based on the retrieved documents."
        )

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



class SubjectQueries(Resource):
    def post(self):
        data = request.get_json()
        query = data.get("question")
        subject = data.get("subject")

        if not query or not subject:
            return jsonify({"error": "Missing question or subject"}), 400

        new_ques = subject_questions(question=query)
        db.session.add(new_ques)
        db.session.commit()

        subject_map = {
            "machine-learning-foundations": "mlf-subject",
            "software-engineering": "se-subject"
        }

        collection_name = subject_map.get(subject)
        if not collection_name:
            return jsonify({"error": "Invalid subject name"}), 400

        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

        vectorstore = Chroma(
            persist_directory=f"./chroma_db/{collection_name}",
            collection_name=collection_name,
            embedding_function=embeddings
        )

        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash-latest",
            verbose=True,
            system_message="You are an academic assistant. Do not directly solve math problems. Instead, provide a guided step-by-step approach based on course materials."
        )

        # Detect if the query looks like a math problem
        math_patterns = [
            r"solve", r"integrate", r"differentiate", r"find\s+(the\s+)?value", r"is\s+continuous", r"is\s+differentiable",
            r"evaluate", r"limit", r"function", r"equation", r"graph", r"expression", r"derivative", r"approximate", r"linearizing"
        ]
        is_math_query = any(re.search(pattern, query.lower()) for pattern in math_patterns)

        if is_math_query:
            wrapped_query = (
                f"A student has asked the following question:\n\n"
                f"\"\"\"\n{query}\n\"\"\"\n\n"
                f"Please do not solve the question directly. Instead:\n"
                f"- Identify the topics or concepts involved.\n"
                f"- Mention which lecture/week from the course material covers them.\n"
                f"- Provide a step-by-step conceptual guide for how the student should solve it themselves.\n"
                f"- Do not compute or evaluate anything.\n"
            )
        else:
            wrapped_query = query

        # Build QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=True
        )

        try:
            result = qa_chain({"query": wrapped_query})
            answer = result["result"]

            # Fallback if answer is unhelpful
            if "I don't know" in answer.lower() or "cannot answer" in answer.lower() or len(answer.strip()) < 30:
                # Fallback: simple Gemini prompt
                fallback_prompt = PromptTemplate.from_template(
                    """A student has asked the following math-related question:

                \"\"\"{question}\"\"\"

                DO NOT solve this question or perform any numeric calculations.

                You are not allowed to provide:
                - Final answers
                - Evaluated expressions
                - Numerical derivatives
                - Boxed answers or choices

                Your job is to:
                - Explain what this type of question is testing (e.g., gradient, partial derivatives)
                - Describe the steps the student should follow to solve it
                - Mention general formulas or symbolic methods only (e.g., ∂f/∂x = ...), without evaluating them

                🚫 Do NOT compute anything or plug in values.
                🚫 Do NOT say "the answer is..."
                ✅ Only guide the student conceptually using symbolic math."""
                )

                fallback_chain = LLMChain(llm=llm, prompt=fallback_prompt)
                fallback_answer = fallback_chain.run(question=wrapped_query)

                return jsonify({
                    "answer": fallback_answer,
                    "sources": [],
                    "lecture": []
                })

            lecture_weeks = [doc.metadata.get("week") for doc in result["source_documents"] if doc.metadata.get("week")]
            return jsonify({
                "answer": answer,
                "sources": [doc.metadata.get("source") for doc in result["source_documents"]],
                "lecture": lecture_weeks
            })

        except Exception as e:
            # Handle errors with fallback
            fallback_prompt = PromptTemplate.from_template(
                """You are an academic tutor. Help answer the following question clearly and thoroughly.

                Question: {question}
                """
            )
            fallback_chain = fallback_prompt | llm | StrOutputParser()
            fallback_answer = fallback_chain.invoke({"question": query})

            return jsonify({
                "answer": fallback_answer,
                "sources": [],
                "lecture": []
            })