# course_analytics.py

from datetime import datetime
import time
import os
import re
import math
from google.auth.exceptions import DefaultCredentialsError

import logging
import threading
import traceback
import uuid
from flask import Response, current_app
from func_timeout import FunctionTimedOut
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict
from google.oauth2 import service_account
from sqlalchemy import func
import vertexai
from vertexai.preview.generative_models import (
    GenerativeModel,
    SafetySetting,
    HarmCategory,
    HarmBlockThreshold
)

import os
import sys
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer

from dotenv import load_dotenv
# Add the directory containing 'models.py' to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))



from models import subject_questions


import threading






# Initialize environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('analytics.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def initialize_vertex() -> GenerativeModel:
    """Initialize Vertex AI with comprehensive validation"""
    try:
        # 1. Load credentials from environment
        credentials_json = os.getenv('GOOGLE_CREDENTIALS_JSON')
        if not credentials_json:
            raise RuntimeError("GOOGLE_CREDENTIALS_JSON environment variable not set")

        # 2. Validate JSON format
        try:
            credentials_info = json.loads(credentials_json)
        except json.JSONDecodeError as e:
            logger.error("Invalid JSON in credentials: %s", str(e))
            raise RuntimeError("Invalid credential format") from e

        # 3. Verify required fields
        required_keys = {
            'type', 'project_id', 'private_key_id',
            'private_key', 'client_email'
        }
        missing_keys = required_keys - credentials_info.keys()
        if missing_keys:
            logger.error("Missing required credential keys: %s", missing_keys)
            raise ValueError(f"Missing credential keys: {missing_keys}")

        # 4. Initialize credentials
        credentials = service_account.Credentials.from_service_account_info(
            credentials_info,
            scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )

        # 5. Configure Vertex AI
        vertexai.init(
            project=credentials_info["project_id"],
            location="us-east4",
            credentials=credentials
        )

        # 6. Configure model safety
        safety_config = {
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        }

        # 7. Create model instance
        model = GenerativeModel(
            model_name="gemini-1.5-pro",
            safety_settings=safety_config,
            generation_config={
                "temperature": 0.3,
                "top_p": 1,
                "top_k": 32,
                "max_output_tokens": 4096,
            }
        )

        logger.info("Vertex AI initialized successfully")
        return model

    except DefaultCredentialsError as e:
        logger.critical("Authentication failed: %s", str(e))
        raise RuntimeError("Google Cloud authentication failed") from e
    except Exception as e:
        logger.critical("Initialization failed: %s", str(e))
        raise
import json

nltk.download('stopwords')
nltk.download('wordnet')
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
class AnalyticsStore:
    def __init__(self):
        self.data = {}
        self.timestamp = None
        self.status = "pending"
        self.lock = threading.Lock()  # Proper initialization


    



    def update(self, data):
        with self.lock:  # Now works correctly
            self.data = self._sanitize_data(data)
            self.timestamp = time.time()
            self.status = "complete"
            self._save_cache()
           

    def to_json(self):
        return {
            'data': self.serialized_data,
            'timestamp': self.timestamp,
            'status': self.status
        }

    @property
    def serialized_data(self):
        return {
            subject: {
                k: self._make_serializable(v)
                for k, v in data.items()
            }
            for subject, data in self.data.items()
        }

    def _sanitize_data(self, data):
        sanitized = {}
        for subject, subj_data in data.items():
            # ✅ Handle dynamic topic format
            if isinstance(subj_data, dict) and 'topic_mapping' in subj_data:
                sanitized_topics = {}
                for topic, terms in subj_data['topic_mapping'].items():
                    sanitized_topics[topic] = [str(term) for term in terms[:10]]  # Limit to top 10 terms
                subj_data['topic_mapping'] = sanitized_topics

        # ✅ Continue with existing sanitization
            distribution = []
            insights = {}

            if isinstance(subj_data, dict):
                raw_distribution = subj_data.get('distribution', [])
                insights = subj_data.get('insights', {})
            elif isinstance(subj_data, list):
                raw_distribution = subj_data
            else:
                raw_distribution = []

            for item in raw_distribution:
                if isinstance(item, dict) and 'percentage' in item:
                    try:
                        distribution.append({**item, 'percentage': float(item['percentage'])})
                    except (ValueError, TypeError):
                        continue

            sanitized[subject] = {
                'distribution': distribution,
                'insights': insights
            }

        return sanitized



    def _make_serializable(self, obj):
        """Recursive serialization with response handling"""
        if isinstance(obj, (int, float, str, bool, type(None))):
            return obj
        if isinstance(obj, Response):  # Handle Flask Response objects
            return {
                '_type': 'FlaskResponse',
                'status': obj.status,
                'data': obj.data.decode('utf-8')[:500]  # Truncate long responses
            }
        if isinstance(obj, (list, tuple)):
            return [self._make_serializable(item) for item in obj]
        if isinstance(obj, dict):
            return {k: self._make_serializable(v) for k, v in obj.items()}
        return str(obj)

    def _save_cache(self):
            
            with open('analytics_cache.json', 'w') as f:
                json.dump({
                    'data': self.serialized_data,
                
                    'status': self.status
                }, f)


class CourseAnalyzer:
    def __init__(self, model: GenerativeModel):  # Enforce type
        if not isinstance(model, GenerativeModel):
            raise ValueError("Invalid model type")
        self.model = model
        self.store = None
        self.keyword_model = self._build_keyword_model()
        self.concept_vectors = {}


    def _build_keyword_model(self):
        """Train a TF-IDF model for keyword extraction"""
        return TfidfVectorizer(
            stop_words=list(stop_words),
            ngram_range=(1, 2),
            max_features=100,
            tokenizer=self._tokenize_and_lemmatize,
            token_pattern=None
        )

    def _tokenize_and_lemmatize(self, text):
        tokens = re.findall(r'\b[a-z]{4,}(?:-[a-z]{3,})?\b', text.lower())
        return [lemmatizer.lemmatize(token) for token in tokens if token not in stop_words]
    
    def extract_keywords(self, questions):
        """Extract keywords from a list of questions using TF-IDF"""
        try:
            # Preprocess questions
            cleaned_questions = [' '.join(self._tokenize_and_lemmatize(q)) for q in questions]
            
            # Fit TF-IDF model and transform questions
            tfidf_matrix = self.keyword_model.fit_transform(cleaned_questions)
            
            # Get feature names and their aggregated scores
            feature_names = self.keyword_model.get_feature_names_out()
            scores = np.sum(tfidf_matrix, axis=0).A1  # Sum TF-IDF scores per term
            
            # Create sorted dictionary of terms and scores
            return dict(sorted(
                zip(feature_names, scores),
                key=lambda x: x[1],
                reverse=True
            ))
        except Exception as e:
            logger.error(f"Keyword extraction failed: {str(e)}")
            return {}

        

    def analyze_questions(self, questions, subjects):
        try:
            # Preprocess questions
            cleaned_questions = [' '.join(self._tokenize_and_lemmatize(q)) for q in questions]
            
            # Train/update TF-IDF model
            self.keyword_model.fit(cleaned_questions)
            tfidf_matrix = self.keyword_model.transform(cleaned_questions)
            feature_names = self.keyword_model.get_feature_names_out()
            
            # Get top keywords
            dense_matrix = tfidf_matrix.todense()
            keyword_scores = dense_matrix.sum(axis=0).tolist()[0]
            concept_frequency = dict(sorted(
                zip(feature_names, keyword_scores),
                key=lambda x: x[1], 
                reverse=True
            )[:15])

            # Enhanced categorization using keywords
            subject_mapping = self._categorize_by_keywords(questions, subjects, concept_frequency)

            concept_frequency = defaultdict(int)
        
            # 2. Process questions for concept frequency
            for subject, subj_questions in subject_mapping.items():
                for question in subj_questions:
                    # Simple NLP processing with improved regex
                    tokens = re.findall(r'\b[a-z]{4,}(?:-[a-z]{3,})?\b', question.lower())  # Handle hyphenated words
                    for token in tokens:
                        concept_frequency[token] += 1

            # 3. Process other analytics
            topic_analysis = {}
            question_stats = []
            

            for subject, subj_questions in subject_mapping.items():
                concept_frequency = defaultdict(int)
                for subject, subj_questions in subject_mapping.items():
                    for question in subj_questions:
                        tokens = re.findall(r'\b[a-z]{4,}(?:-[a-z]{3,})?\b', question.lower())
                        for token in tokens:
                            concept_frequency[token] += 1

                # ... rest of existing analysis code ...
                # In analyze_questions method, after building concept_frequency:
                common_interrogatives = {'what', 'when', 'where', 'why', 'how', 'which', 'who', 'whom', 'whose', 'explain', 'describe'}
                common_words_frequency = {k: v for k, v in concept_frequency.items() if k in common_interrogatives}
                technical_concept_frequency = {k: v for k, v in concept_frequency.items() if k not in common_interrogatives}

            # 4. Create result AFTER processing
                result = self._final_sanitization({
                    'subject_mapping': subject_mapping,
                    'topic_analysis': topic_analysis,
                    'insights': self._generate_comprehensive_insights(topic_analysis),
                    'concept_frequency': concept_frequency,
                    'keyword_matrix': tfidf_matrix.todense().tolist(),
                    'common_words_frequency': common_words_frequency,  # Common words for second graph
                    'keyword_matrix': tfidf_matrix.todense().tolist(),
                })

            # Store results
            if hasattr(self, 'store') and self.store:
                self.store.update(result)

            return result

        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}", exc_info=True)
            return {
                'status': 'error',
                'message': str(e),
                'error_type': e.__class__.__name__
            }

    def _cluster_questions(self, questions):
        """Cluster questions into concepts using TF-IDF and similarity analysis"""
        try:
        # Preprocess questions
            cleaned = [' '.join(self._tokenize_and_lemmatize(q)) for q in questions]
        
        # Create TF-IDF matrix
            tfidf = self.keyword_model.fit_transform(cleaned)
        
        # Convert CSR matrix to dense array properly
            cosine_sim = (tfidf * tfidf.T).toarray()  # Changed .A to .toarray()
        
        # Rest of clustering logic remains the same
            clusters = []
            visited = set()
        
            for i in range(len(questions)):
                if i not in visited:
                    cluster = [questions[i]]
                    for j in range(i+1, len(questions)):
                        if cosine_sim[i][j] > 0.6:  # Access as 2D array
                            cluster.append(questions[j])
                            visited.add(j)
                    clusters.append(cluster)
                
            return clusters
            
        except Exception as e:
            logger.error(f"Clustering failed: {str(e)}")
            return [[q] for q in questions]  # Fallback to individual questions
        
    def _name_concept(self, cluster):
        """Generate concept name using Gemini"""
        try:
            prompt = f"""
            Generate a concise technical concept name that groups these questions.
            Respond ONLY with the name, no explanations.
            
            Questions:
            {chr(10).join(cluster[:3])}  # Show first 3 for context
            """
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Concept naming failed: {str(e)}")
            return " ".join(self._tokenize_and_lemmatize(cluster[0]))[:40] + "..."
        

    


    
    def _categorize_by_keywords(self, questions, subjects, concept_frequency):
        """Improved categorization using keyword matching"""
        subject_keywords = {
            'software-engineering': {'sdlc', 'agile', 'testing', 'architecture', 'devops'},
            'machine-learning-foundations': {'neural', 'regression', 'classification', 'nlp', 'clustering'}
        }
        
        subject_map = defaultdict(list)
        for q in questions:
            question_keywords = set(self._tokenize_and_lemmatize(q))
            scores = {
                subject: len(question_keywords & keywords)
                for subject, keywords in subject_keywords.items()
            }
            best_subject = max(scores, key=scores.get) if max(scores.values()) > 0 else 'other'
            subject_map[best_subject].append(q)
        
        return subject_map

    def _merge_similar_questions(self, questions):
        """Dynamic concept grouping with question tracking"""
        clusters = self._cluster_questions(questions)
        concepts = defaultdict(lambda: {"count": 0, "questions": []})
        
        for cluster in clusters:
            concept_name = self._name_concept(cluster)
            concepts[concept_name]["count"] += len(cluster)
            concepts[concept_name]["questions"].extend(cluster)
            
        return concepts

    def _sanitized_categorize_questions(self, questions, subjects):
        """Categorize questions with response validation"""
        subject_map = defaultdict(list)
        for question in questions:
            try:
                # Extract pure text from potential response objects
                if hasattr(question, 'text'):
                    question_text = str(question.text)
                else:
                    question_text = str(question)

                prompt = f"Categorize this question into one of {subjects}. Respond ONLY with the subject name.\nQuestion: {question_text}"
                response = self.model.generate_content(prompt)
            
                # Extract text content safely
                if hasattr(response, 'text'):
                    subject = str(response.text).strip()
                else:
                    subject = str(response).strip()  # Fallback for unexpected response types
                
                subject_map[subject].append(question_text)
            except Exception as e:
                logger.warning(f"Question categorization failed: {str(e)}")
        return subject_map

    def _generate_dynamic_topics(self, questions):
        """Dynamically generate topics using both TF-IDF and Gemini"""
        try:
            # Get TF-IDF keywords
            cleaned_questions = [' '.join(self._tokenize_and_lemmatize(q)) for q in questions]
            self.keyword_model.fit(cleaned_questions)
            feature_names = self.keyword_model.get_feature_names_out()
            keywords = list(feature_names[:20])  # Top 20 keywords
            
            # Use Gemini to group into broader topics
            prompt = f"""
            Group these technical terms into broader topics for software engineering and machine learning.
            Provide output in this format:
            [Topic Name | keyword1, keyword2, keyword3]
            
            Keywords: {", ".join(keywords)}
            """
            
            response = self.model.generate_content(prompt)
            return self._parse_dynamic_topics(response.text)
            
        except Exception as e:
            logger.error(f"Dynamic topic generation failed: {str(e)}")
            return defaultdict(list)

    def _parse_dynamic_topics(self, text):
        """Parse Gemini's response into topic structure"""
        topics = defaultdict(list)
        pattern = r"\[(.*?)\|(.*?)\]"
        
        for line in text.split('\n'):
            match = re.search(pattern, line)
            if match:
                topic = match.group(1).strip()
                terms = [t.strip() for t in match.group(2).split(',')]
                topics[topic] = terms
                
        return topics


    def _safe_topic_distribution(self, questions, topics):
        """Count number of questions containing each topic"""
        keyword_counts = defaultdict(int)
        topics_set = set(topics)  # Faster lookups
        for q in questions:
            question_terms = set(self._tokenize_and_lemmatize(q))  # Unique terms per question
            present_terms = question_terms & topics_set
            for term in present_terms:
                keyword_counts[term] += 1  # Count once per question
        total = sum(keyword_counts.values())
        return [{
            'topic': term,
            'count': count,
            'percentage': (count / total * 100) if total > 0 else 0
        } for term, count in sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)]


    def _analyze_question_complexity(self, questions, subject):
        """Analyze question complexity with sanitization"""
        stats = []
        for q in questions:
            try:
                question_text = str(q)
                word_count = len(question_text.split())
                stats.append({
                    'question': question_text[:500],  # Truncate long questions
                    'subject': str(subject),
                    'length': int(word_count),
                    'complexity': 'High' if word_count > 15 else 'Medium' if word_count > 8 else 'Low'
                })
            except Exception as e:
                logger.warning(f"Question complexity analysis failed: {str(e)}")
        return stats

    def _calculate_question_stats(self, question_stats, subject):
        """Calculate statistics with validation"""
        try:
            subject_stats = [q for q in question_stats if q.get('subject') == subject]
            complexity_counts = pd.Series([q.get('complexity', 'Unknown') for q in subject_stats]).value_counts()
            
            return {
                'total': int(len(subject_stats)),
                'complexity': complexity_counts.to_dict(),
                'avg_length': float(round(np.mean([q.get('length', 0) for q in subject_stats]), 1)) if subject_stats else 0.0
            }
        except Exception as e:
            logger.error(f"Question stats calculation failed: {str(e)}")
            return {
                'total': 0,
                'complexity': {},
                'avg_length': 0.0
            }

    def _generate_comprehensive_insights(self, topic_analysis):
        insights = {}
        for subject, data in topic_analysis.items():
            total_questions = data['question_stats']['total']
        
            # Basic insights even with no topics
            insights[subject] = {
                "total_questions": total_questions,
                "most_common_word": max(
                    self.concept_frequency.items(),
                    key=lambda x: x[1],
                    default=("none", 0)
                )[0],
                "complexity_distribution": data['question_stats']['complexity']
            }
        return insights

    def _sanitize_topics(self, topics):
        """Ensure topic data is serializable"""
        return [
            {
                'name': str(t.get('name', 'Unknown'))[:100],
                'characteristics': [str(c)[:50] for c in t.get('characteristics', [])][:10]
            }
            for t in topics
        ]

    def _sanitize_question_stats(self, stats):
        """Convert statistics to safe types"""
        return {
            'total': int(stats.get('total', 0)),
            'complexity': {str(k): int(v) for k, v in stats.get('complexity', {}).items()},
            'avg_length': float(stats.get('avg_length', 0.0))
        }

    def _final_sanitization(self, data):
        """Recursive final sanitization pass"""
        if isinstance(data, dict):
            return {k: self._final_sanitization(v) for k, v in data.items()}
        if isinstance(data, (list, tuple)):
            return [self._final_sanitization(item) for item in data]
        if isinstance(data, (int, np.integer)):
            return int(data)
        if isinstance(data, (float, np.floating)):
            return float(data)
        if isinstance(data, (str, bool, type(None))):
            return data
        return str(data)
    
    


class CourseAnalyzerManager:
    def __init__(self, question_model, analyzer: CourseAnalyzer, store: AnalyticsStore):
        self.question_model = question_model
        self.analyzer = analyzer
        self.store = store

    def _filter_keywords(self, keywords_dict):
        """Filter and validate keywords with type checking"""
        filtered = {}
        COMMON_QUESTION_WORDS = {
            "what", "when", "how", "why", "is", "are", "can",
            "could", "would", "should", "explain", "define", "give", "with"
        }
        
        if isinstance(keywords_dict, dict):
            for word, freq in keywords_dict.items():
                try:
                    str_word = str(word).strip().lower()
                    if (len(str_word) > 2 and 
                        str_word not in COMMON_QUESTION_WORDS and 
                        isinstance(freq, (int, float))):
                        filtered[str_word] = float(freq)
                except Exception as e:
                    logger.debug(f"Keyword filter error: {str(e)}")
        
        return dict(sorted(filtered.items(), key=lambda x: x[1], reverse=True))

    def _safe_get_most_frequent(self, keyword_dict):
        """Safely get most frequent keyword from dictionary"""
        try:
            if not isinstance(keyword_dict, dict):
                return "N/A"
            
            valid_items = {k: v for k, v in keyword_dict.items() 
                         if isinstance(v, (int, float))}
            
            return max(valid_items, key=valid_items.get) if valid_items else "N/A"
        except Exception as e:
            logger.warning(f"Most frequent keyword error: {str(e)}")
            return "N/A"



    def generate_report(self):
        """Generate analytics report with guaranteed structure and error handling"""
        # Base structure with required keys
        base_structure = {
            "status": "success",
            "data": {
                "subject_mapping": {},
                "topic_analysis": {"keywords": {}},
                "insights": {
                    "total_concepts": 0,
                    "most_frequent_keyword": "N/A",
                    "total_questions": 0
                }
            }
        }

        try:
            # Step 1: Fetch questions with safety
            all_questions = []
            try:
                all_questions = self.question_model.query.all()
                if not all_questions:
                    raise ValueError("Database returned empty question set")
            except Exception as fetch_error:
                logger.error(f"Question fetch error: {fetch_error}")
                base_structure["status"] = "error"
                base_structure["error"] = str(fetch_error)
                return base_structure

            # Step 2: Process subjects with nested safety
            structured_subjects = {}
            try:
                subject_mapping = defaultdict(list)
                for q in all_questions:
                    if hasattr(q, 'subject') and q.subject:
                        subject_mapping[q.subject].append(q.question)

                for subject, questions in subject_mapping.items():
                    try:
                        concepts = self.analyzer._merge_similar_questions(questions)
                        structured_subjects[subject] = {
                            "question_count": len(questions),
                            "concepts": [
                                {
                                    "name": name,
                                    "count": data["count"],
                                    "sample_questions": data["questions"][:3]
                                }
                                for name, data in concepts.items()
                            ]
                        }
                    except Exception as subject_error:
                        logger.error(f"Subject {subject} error: {subject_error}")
                        structured_subjects[subject] = {
                            "error": str(subject_error),
                            "question_count": len(questions)
                        }

            except Exception as process_error:
                logger.error(f"Subject processing failed: {process_error}")
                structured_subjects = {}

            # Step 3: Keyword analysis with fallback
            filtered_keywords = {}
            try:
                if all_questions:
                    raw_keywords = self.analyzer.extract_keywords(
                        [q.question for q in all_questions]
                    )
                    filtered_keywords = self._filter_keywords(raw_keywords)
            except Exception as keyword_error:
                logger.error(f"Keyword error: {keyword_error}")
                filtered_keywords = {"error": str(keyword_error)}

            # Step 4: Safe insight calculation
            try:
                total_concepts = sum(
                    len(subj.get("concepts", [])) 
                    for subj in structured_subjects.values()
                )
                most_freq = self._safe_get_most_frequent(filtered_keywords)
                total_questions = sum(
                    subj.get("question_count", 0)
                    for subj in structured_subjects.values()
                )
            except Exception as insight_error:
                logger.error(f"Insight error: {insight_error}")
                total_concepts = 0
                most_freq = "N/A"
                total_questions = 0

            # Build final response
            report_data = {
                "status": "success",
                "data": {
                    "subject_mapping": structured_subjects,
                    "topic_analysis": {"keywords": filtered_keywords},
                    "insights": {
                        "total_concepts": total_concepts,
                        "most_frequent_keyword": most_freq,
                        "total_questions": total_questions
                    }
                }
            }

            return self._validate_report(report_data)

        except Exception as global_error:
            logger.critical(f"Global failure: {global_error}")
            base_structure["status"] = "error"
            base_structure["error"] = {
                "type": type(global_error).__name__,
                "details": str(global_error)
            }
            return base_structure

    def _validate_report(self, report):
        """Validate report structure with type-safe checks"""
        required_structure = {
            "data": {
                "subject_mapping": dict,
                "topic_analysis": {"keywords": dict},
                "insights": {
                    "total_concepts": int,
                    "most_frequent_keyword": (str, type(None)),
                    "total_questions": int
                }
            }
        }

        def check_structure(data, template):
            """Recursive structure validation with proper type handling"""
            for key, expected in template.items():
                # Key existence check
                if key not in data:
                    return False

                # Handle nested dictionaries
                if isinstance(expected, dict):
                    if not isinstance(data[key], dict):
                        return False
                    if not check_structure(data[key], expected):
                        return False
                # Handle type tuples (multiple allowed types)
                elif isinstance(expected, tuple):
                    if not isinstance(data[key], expected):
                        return False
                # Handle single type requirements
                else:
                    if not isinstance(data[key], expected):
                        return False
            return True

        if not check_structure(report, required_structure):
            logger.error("Structure validation failed, returning safe format")
            return {
                "status": "error",
                "data": {
                    "subject_mapping": {},
                    "topic_analysis": {"keywords": {}},
                    "insights": {
                        "total_concepts": 0,
                        "most_frequent_keyword": "N/A",
                        "total_questions": 0
                    }
                },
                "error": "Invalid report structure"
            }
        
        return report


    def _get_topic_mapping(self, questions):
        """Get dynamic topic mapping for all questions"""
        return self.analyzer._generate_dynamic_topics(questions)

    def _detect_emerging_topics(self, keywords):
        """Identify rapidly growing topics"""
        try:
            # Compare with previous analysis
            prev_data = self.store.data.get('topic_analysis', {})
            emerging = []
            
            for term, score in keywords.items():
                prev_score = prev_data.get(term, 0)
                if score > prev_score * 1.5:  # 50% growth threshold
                    emerging.append({
                        "term": term,
                        "growth": f"{(score/prev_score if prev_score else '∞')}x",
                        "current_score": score
                    })
                    
            return sorted(emerging, key=lambda x: x['current_score'], reverse=True)[:5]
            
        except Exception as e:
            logger.error(f"Emerging topic detection failed: {str(e)}")
            return []

    # def _merge_similar_questions(self, questions):
    #     """Dynamic question grouping using generated topics"""
    #     try:
    #         # Generate topics dynamically
    #         topics = self._generate_dynamic_topics(questions)
    #         merged = defaultdict(int)
            
    #         # Create regex patterns for each topic
    #         topic_patterns = {
    #             topic: re.compile(r'\b(' + '|'.join(terms) + r')\b', re.IGNORECASE)
    #             for topic, terms in topics.items()
    #         }

    #         for q in questions:
    #             matched = False
    #             q_lower = q.lower()
                
    #             # Check against all dynamic topics
    #             for topic, pattern in topic_patterns.items():
    #                 if pattern.search(q_lower):
    #                     merged[topic] += 1
    #                     matched = True
    #                     break
                        
    #             if not matched:
    #                 # Fallback to individual keywords
    #                 merged[q_lower] += 1
                    
    #         return merged
            
    #     except Exception as e:
    #         logger.error(f"Dynamic merging failed: {str(e)}")
    #         return defaultdict(int, {q: 1 for q in questions})

   


    def _filter_keywords(self, keywords_dict):
        """Safe keyword filtering with type checking"""
        if not isinstance(keywords_dict, dict):
            logger.warning("Invalid keywords input type")
            return {}

        COMMON_QUESTION_WORDS = {
            "what", "when", "how", "why", "is", "are", "can",
            "could", "would", "should", "explain", "define", "give", "with"
        }
    
        return {
            str(word): float(freq) 
            for word, freq in keywords_dict.items()
            if (
                isinstance(word, (str, int, float)) and 
                str(word).lower() not in COMMON_QUESTION_WORDS and 
                len(str(word).strip()) > 2
            )
        }



class AnalyticsEngine:
    def __init__(self,question_model):
        self.store = AnalyticsStore()
        self.vertex_model = None
        self.manager = None  # Initialize later
        self.running = False
        self.thread = None
        self._init_lock = threading.Lock()
        self._analysis_lock = threading.Lock()
        self.shutdown_event = threading.Event()
        self.question_model = question_model




    def initialize(self, vertex_model: GenerativeModel):
        if not isinstance(vertex_model, GenerativeModel):
            raise TypeError("Invalid Vertex AI model type")

        with self._init_lock:
            self.vertex_model = vertex_model

            analyzer = CourseAnalyzer(vertex_model)  # ✅ this wraps the model
            store = AnalyticsStore()

        # ✅ Use CourseAnalyzer, NOT vertex_model, for keyword_extractor
            self.manager = CourseAnalyzerManager(
                question_model=self.question_model,
                analyzer=analyzer,
                store=store
            )


    
    def shutdown(self):
        """Orderly shutdown procedure"""
        self.running = False
        self.shutdown_event.set()
        if self.thread:
            self.thread.join(timeout=30)

    def initialize_vertex(self):
        """Initialize Vertex AI configuration"""
        with self._init_lock:
            if self.vertex_model is None:
                try:
                    credentials = service_account.Credentials.from_service_account_info(
                        current_app.config['GOOGLE_CONFIG']
                    )
                    vertexai.init(
                        project=current_app.config['GOOGLE_CONFIG']["project_id"],
                        location="us-central1",
                        credentials=credentials
                    )
                    self.vertex_model = GenerativeModel("gemini-1.5-pro")
                    self.analyzer = CourseAnalyzer(self.vertex_model)
                except Exception as e:
                    logger.error(f"Vertex AI init failed: {str(e)}")
                    raise

    def start_background_analysis(self, app):
        """Start the background analysis thread"""
        if not self.running and os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
            self.running = True
            self.thread = threading.Thread(
                target=self._analysis_loop,
                daemon=True,
                kwargs={'app': app}
            )
            self.thread.start()
            logger.info("Background analysis thread started")

    def _analysis_loop(self, app):
        """Continuous analysis loop with proper app context"""
        with app.app_context():
            while self.running:
                try:
                    logger.info("Starting analysis cycle")
                    self._run_analysis()
                    logger.info("Analysis completed successfully")
                    time.sleep(300)  # 5 minutes between cycles
                except Exception as e:
                    logger.error(f"Analysis cycle failed: {str(e)}")
                    time.sleep(60)

    def _run_analysis(self):
        """Thread-safe analysis iteration with enhanced validation"""
        with self._analysis_lock:
            try:
                # Validate core dependencies
                if not self.analyzer or not hasattr(self.analyzer, 'analyze_questions'):
                    raise RuntimeError("Analyzer not properly initialized")

                # Subject configuration with fallbacks
                subject_map = current_app.config.get('SUBJECT_MAPPING', {
                    "software-engineering": "SE",
                    "machine-learning-foundations": "ML"
                })

                # Batch process questions to prevent memory issues
                results = {}
                batch_size = 100
                offset = 0
            
                while True:
                    questions = subject_questions.query.offset(offset).limit(batch_size).all()
                    if not questions:
                        break

                    subject_data = defaultdict(list)
                    for q in questions:
                        try:
                            # Validate subject field exists
                            if not q.subject:
                                logger.warning("Question with ID %d has no subject", q.id)
                                continue
                            
                            clean_subject = str(q.subject).strip().lower().replace(' ', '-')
                            frontend_subject = subject_map.get(clean_subject, clean_subject)
                            subject_data[frontend_subject].append(str(q.question))
                        except Exception as e:
                            logger.error("Question processing failed (ID %d): %s", q.id, str(e))

                    offset += batch_size

                    # Process subjects with error boundaries
                    for subject, questions_list in subject_data.items():
                        if not questions_list:
                            logger.debug("Skipping empty subject: %s", subject)
                            continue

                        try:
                            # Analyze and validate response structure
                            analysis = self.analyzer.analyze_questions(questions_list, [subject])
                        
                            # Handle analyzer errors
                            if isinstance(analysis, dict) and analysis.get('status') == 'error':
                                results[subject] = {
                                    "error": analysis.get('message', 'Analysis failed'),
                                    "code": analysis.get('error_type', 'UnknownError')
                                }
                                continue

                            # Safely extract distribution data
                            distribution = analysis.get('topic_analysis', {}).get(subject, {}).get('distribution', [])
                            sanitized_dist = [
                                {str(k): float(v) if isinstance(v, (int, float)) else str(v)
                                for k, v in item.items()}
                                for item in distribution
                            ]

                            # Safely extract insights
                            insights = analysis.get('topic_analysis', {}).get(subject, {}).get('insights', {})
                            sanitized_insights = {
                                str(k): str(v)[:500]  # Limit insight length
                                for k, v in insights.items()
                            }

                            results[subject] = {
                                "distribution": sanitized_dist,
                                "insights": sanitized_insights
                            }

                        except Exception as e:
                            logger.error("Subject analysis failed for %s: %s", subject, str(e))
                            results[subject] = {
                                "error": str(e),
                                "stack": traceback.format_exc(limit=3)
                            }

                # Store results with versioning
                if results:
                    self.store.update({
                        "version": uuid.uuid4().hex,
                    
                        "data": results
                    })
                else:
                    logger.warning("Analysis completed with empty results")

            except Exception as e:
                logger.critical("Critical analysis failure: %s", str(e))
                raise


# Singleton instance
# analytics_engine = AnalyticsEngine()

def initialize_analytics(app):
    """Proper initialization flow"""
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' or not app.debug:
        with app.app_context():
            try:
                if not hasattr(app, 'analytics_engine'):
                    raise RuntimeError("Analytics engine not attached to app")
                    
                # Start background thread only if not already running
                if not app.analytics_engine.running:
                    app.analytics_engine.start_background_analysis(app)
                    
                logger.info("Analytics initialized successfully.")
            except Exception as e:
                logger.error(f"Analytics initialization failed: {e}")


from flask import current_app

def shutdown_analytics(exception=None):
    """Clean up analytics resources using app context"""
    try:
        if hasattr(current_app, 'analytics_engine'):
            engine = current_app.analytics_engine
            if engine.running:
                logger.info("Shutting down analytics engine")
                engine.running = False
                if engine.thread:
                    engine.thread.join(timeout=10)
                logger.info("Analytics shutdown complete")
    except Exception as e:
        logger.error(f"Error during analytics shutdown: {str(e)}")