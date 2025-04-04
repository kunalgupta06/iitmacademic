import axios from "axios";

// Point to Flask backend (assume it's running at localhost:5000)
const FLASK_API_URL = "http://localhost:5000";

export const sendProgrammeGuidelineQuery = async (question) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/programme-guideline`, { question });
    return response.data;
  } catch (error) {
    console.error("Error fetching programme guideline:", error);
    return { error: "Failed to fetch response" };
  }
};

export const sendSubjectQuery = async (question, subject) => {
  try {
    // This still points to your Next.js API route for now (unless you also move this to Flask)
    const response = await axios.post("/api/subject-queries", {
      question,
      subject,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching subject query:", error);
    return { error: "Failed to fetch response" };
  }
};



