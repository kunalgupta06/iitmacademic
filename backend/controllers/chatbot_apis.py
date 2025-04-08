from flask import request, jsonify
from flask_restful import Resource
from models import subject_questions, db
from utils.assignments import get_all_assignment_questions
from langchain.chains import RetrievalQA, ConversationalRetrievalChain, LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
import re
import numpy as np


class ProgrammeGuideline(Resource):
    def post(self):
        data = request.get_json()
        query = data.get("question")

        if not query:
            return jsonify({"error": "Missing question"}), 400


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

        new_ques = subject_questions(question=query, subject=subject)
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
            system_message="You are an academic assistant. Do not directly solve math problems. Provide guided explanations instead."
        )

        # 👉 Detect if user wants a study plan
        study_plan_patterns = [
            r"study plan",
            r"how (should|can) i study",
            r"plan.*cover.*topics",
            r"prepare.*topics",
            r"study.*schedule",
        ]
        is_study_plan_request = any(re.search(pattern, query.lower()) for pattern in study_plan_patterns)

        if is_study_plan_request:
            study_plan_prompt = PromptTemplate.from_template(
                """
                The user wants to create a study plan.

                Their request: "{question}"

                Based on this, generate a weekly study schedule that:
                - Breaks down the requested topics into manageable chunks.
                - Assigns topics to specific days or weeks.
                - Includes suggestions for review sessions, practice problems, and rest.
                - Is realistic and adaptable for a student with moderate availability (e.g., 2-3 hours per day).

                Speak directly to the user. Use "You should..." rather than "The student should..."

                Format the plan clearly using bullet points or sections.
                """
            )

            study_plan_chain = LLMChain(llm=llm, prompt=study_plan_prompt)
            plan = study_plan_chain.run(question=query)

            return jsonify({
                "answer": plan,
                "sources": [],
                "lecture": []
            })


         # 📌 Detect resource request
        resource_patterns = [
            r"(online resources|youtube|video tutorial|external links|learn more|good (videos|articles|links))",
            r"(where can i learn|can you suggest.resources|recommend.(articles|videos|youtube))",
        ]
        is_resource_request = any(re.search(pattern, query.lower()) for pattern in resource_patterns)

        if is_resource_request:
            resource_prompt = PromptTemplate.from_template(
                """
                A student is looking for online resources for the following topic:

                "{question}"

                Suggest 2-3 high-quality online resources such as:
                - YouTube videos
                - Online tutorials or blog posts
                - Free course material (if available)

                Be concise. Format as a bullet list with clickable links and short descriptions. Prioritize reputable sources like Khan Academy, MIT OCW, or university content.
                """
            )

            resource_chain = LLMChain(llm=llm, prompt=resource_prompt)
            resource_links = resource_chain.run(question=query)

            return jsonify({
                "answer": f"Here are some useful online resources:\n\n{resource_links}",
                "sources": [],
                "lecture": [],
                "external_links": resource_links
            })

            

        # 📌 Regular flow
        math_patterns = [
            r"solve", r"integrate", r"differentiate", r"find\s+(the\s+)?value", r"is\s+continuous", r"is\s+differentiable",
            r"evaluate", r"limit", r"function", r"equation", r"graph", r"expression", r"derivative", r"approximate", r"linearizing", r"linear approximation", r"compute", r"gradient", r"inequality"
        ]
        is_math_query = any(re.search(pattern, query.lower()) for pattern in math_patterns)


        # 🧠 Programming-related logic
        programming_patterns = [
            r"\b(def|class|import|for|while|if|elif|else|try|except|print|return)\b",
            r"(syntax error|runtime error|traceback|undefined variable|indentation error)",
            r"(python|code|function|loop|recursion|debug)"
        ]
        is_programming_query = any(re.search(pattern, query.lower()) for pattern in programming_patterns)

        debug_patterns = [
            r"debug this", r"fix this", r"correct this", r"what is wrong", r"why.*not working", r"find the bug"
        ]
        is_debug_request = any(re.search(pattern, query.lower()) for pattern in debug_patterns)



        assignment_questions = get_all_assignment_questions()
        query_lower = query.lower()
        matched_assignment = any(assignment.lower() in query_lower for assignment in assignment_questions)


        if is_math_query:
            # For ANY math question, even from assignments
            wrapped_query = (
                f"You have asked the following question:\n\n"
                f"\"\"\"\n{query}\n\"\"\"\n\n"
                f"Please do not solve the question directly. Instead:\n"
                f"- Identify the topics or concepts involved.\n"
                f"- Mention which lecture/week from the course material covers them (if available).\n"
                f"- Provide a step-by-step conceptual guide for how you should solve it yourself.\n"
                f"- Do not compute or evaluate anything.\n"
                f"- Do not provide a final answer.\n"
                f"- Speak to the student in a helpful and academic tone.\n"
            )
        elif matched_assignment:
        # For non-math assignment questions
            wrapped_query = (
                f"You have asked an assignment question:\n\n"
                f"\"\"\"\n{query}\n\"\"\"\n\n"
                f"Do NOT provide the direct answer.\n"
                f"This is from a graded assignment.\n"
                f"Instead, explain the underlying concept(s) behind the question, such as:\n"
                f"- What knowledge or skill this question is testing\n"
                f"- Why it’s important\n"
                f"- How you should think through choosing the correct answer\n"
                f"- Provide guidance, not answers.\n"
            )
        elif is_programming_query and is_debug_request:
            wrapped_query = (
                f"A student has asked for help debugging a programming question.\n\n"
                f"\"\"\"\n{query}\n\"\"\"\n\n"
                f"Do NOT give the corrected code directly.\n"
                f"Instead:\n"
                f"- Identify common mistakes or patterns that could cause this kind of issue.\n"
                f"- Suggest debugging strategies (e.g., print statements, isolating variables).\n"
                f"- Mention which concepts are likely involved (e.g., recursion, loops, scoping).\n"
                f"- Help the student think through the problem instead of giving the answer.\n"
            )
        elif is_programming_query:
            wrapped_query = (
                f"A student has asked a programming-related question:\n\n"
                f"\"\"\"\n{query}\n\"\"\"\n\n"
                f"Please provide an explanation focused on the logic, syntax, or structure involved.\n"
                f"If it is about writing code, explain the approach clearly.\n"
                f"If it is about debugging or understanding code, guide them conceptually, without solving it entirely.\n"
            )
        else:
            wrapped_query = query


        try:
            # 🧠 Relevance check using the same embedding model
            docs = retriever.get_relevant_documents(wrapped_query)
            doc_texts = [doc.page_content for doc in docs]
            query_embedding = embeddings.embed_query(wrapped_query)
            doc_embeddings = embeddings.embed_documents(doc_texts)

            def cosine_similarity(vec1, vec2):
                vec1, vec2 = np.array(vec1), np.array(vec2)
                return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

            similarities = [cosine_similarity(query_embedding, d) for d in doc_embeddings]
            if all(score < 0.6 for score in similarities):
                return jsonify({
                    "answer": "Sorry, this question doesn't appear to be related to the course materials. Please ask something covered in the lectures or provided PDFs.",
                    "sources": [],
                    "lecture": []
                })

            
            qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                retriever=retriever,
                return_source_documents=True
            )

            result = qa_chain({"query": wrapped_query})
            answer = result["result"]
            source_docs = result["source_documents"]

            no_sources = len(source_docs) == 0
            weak_answer = any(
                phrase in answer.lower()
                for phrase in [
                    "i don't know", "cannot answer", "not provided", "not mentioned", "not discussed",
                    "not detailed", "not included", "no information", "text does not", "doesn’t detail",
                    "is not explained", "provided later"
                ]
            ) or len(answer.strip()) < 50

            if no_sources or weak_answer:
                fallback_prompt = PromptTemplate.from_template(
                    """A student has asked the following question:

                    \"\"\"{question}\"\"\"

                    DO NOT solve this question or perform any numeric calculations.

                    You are not allowed to provide:
                    - Final answers
                    - Evaluated expressions
                    - Numerical derivatives
                    - Boxed answers or choices

                    Your job is to:
                    - Explain what this type of question is testing (e.g., gradient, partial derivatives)
                    - Describe the steps you should follow to solve it
                    - Mention general formulas or symbolic methods only (e.g., ∂f/∂x = ...), without evaluating them

                    🚫 Do NOT compute anything or plug in values.
                    🚫 Do NOT say "the answer is..."
                    ✅ Only guide the user conceptually using symbolic math.
                    """
                )

                fallback_chain = LLMChain(llm=llm, prompt=fallback_prompt)
                fallback_answer = fallback_chain.run(question=query)

                return jsonify({
                    "answer": fallback_answer,
                    "sources": [],
                    "lecture": []
                })

            lecture_weeks = [doc.metadata.get("week") for doc in source_docs if doc.metadata.get("week")]
            return jsonify({
                "answer": answer,
                "sources": [doc.metadata.get("source") for doc in source_docs],
                "lecture": lecture_weeks
            })

        except Exception as e:
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