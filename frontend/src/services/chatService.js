import axios from "axios";

export const sendProgrammeGuidelineQuery = async (question) => {
  try {
    const response = await axios.post("/api/programme-guideline", { question });
    return response.data;
  } catch (error) {
    console.error("Error fetching programme guideline:", error);
    return { error: "Failed to fetch response" };
  }
};

export const sendSubjectQuery = async (question) => {
  try {
    const response = await axios.post("/api/subject-queries", { question });
    return response.data;
  } catch (error) {
    console.error("Error fetching subject query:", error);
    return { error: "Failed to fetch response" };
  }
};
