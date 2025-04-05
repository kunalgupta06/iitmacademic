"use client";

import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { FaCheckCircle, FaClipboardList, FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CourseContentPage = ({ courseName }) => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  // Dummy Assignments
  const practiceAssignment = {
    title: "Practice Assignment",
    questions: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Text Makeup Language", "None of the above"],
        correctAnswer: 0,
      },
      {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Rome"],
        correctAnswer: 0,
      },
    ],
  };

  const gradedAssignment = {
    title: "Graded Assignment",
    questions: [
      {
        question: "Which programming language is used for web development?",
        options: ["Python", "C++", "JavaScript", "Java"],
        correctAnswer: 2,
      },
      {
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Pacific", "Arctic"],
        correctAnswer: 2,
      },
    ],
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch("/api/courses/mlf");
        const data = await response.json();

        const enhancedData = {
          ...data,
          progress: 50,
          weeks: data.weeks.map((week) => ({
            ...week,
            progress: 100,
            lectures: week.lectures.map((lecture) => ({
              ...lecture,
              completed: true,
              duration: "10:00",
            })),
          })),
        };

        setCourseData(enhancedData);

        if (enhancedData.weeks.length > 0 && enhancedData.weeks[0].lectures.length > 0) {
          setSelectedVideo({
            title: enhancedData.weeks[0].lectures[0].title,
            url: enhancedData.weeks[0].lectures[0].videoUrl,
          });
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  const toggleWeek = (weekIndex) => {
    setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex);
  };

  const changeVideo = (title, url) => {
    setSelectedVideo({ title, url });
    setSelectedAssignment(null);
  };

  const handleAssignmentClick = (assignmentType) => {
    if (assignmentType === "practice") {
      setSelectedAssignment(practiceAssignment);
    } else if (assignmentType === "graded") {
      setSelectedAssignment(gradedAssignment);
    }
    setUserAnswers({});
  };

  const handleOptionChange = (questionIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: optionIndex });
  };

  const handleSubmit = () => {
    console.log("User Answers:", userAnswers);
    alert("Assignment Submitted!");
  };

  if (loading) return <div className="text-center mt-32 text-xl">Loading...</div>;
  if (!courseData) return <div className="text-center mt-32 text-xl">No Course Data Found</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex flex-col lg:flex-row mt-24">

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-white p-6 shadow-lg rounded-lg">
          <h1 className="text-2xl text-black font-bold mb-4">{courseName}</h1>
          <h4 className="text-xl text-black font-bold mb-4">Course Journey</h4>

          {/* Progress Bar */}
          <div className="mb-4">
            <LinearProgress
              variant="determinate"
              value={courseData.progress ?? 0}
              className="h-3 rounded"
            />
            <p className="text-sm text-gray-600 mt-1">{courseData.progress}% completed</p>
          </div>

          {/* Weeks */}
          {courseData.weeks.map((week, index) => (
            <div key={index} className="mb-4">
              <div
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-100 rounded-lg"
                onClick={() => toggleWeek(index)}
              >
                <span className="font-semibold text-black">{week.title}</span>
                <span className="text-red-500 font-semibold">{week.progress}%</span>
                {expandedWeek === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {expandedWeek === index && (
                <div className="mt-2">
                  {/* Lectures */}
                  {week.lectures.map((lecture, i) => (
                    <div
                      key={i}
                      className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-200"
                      onClick={() => changeVideo(lecture.title, lecture.videoUrl)}
                    >
                      {lecture.completed ? (
                        <FaCheckCircle className="text-green-500 mr-2" />
                      ) : (
                        <FaClock className="text-gray-500 mr-2" />
                      )}
                      <span className="flex-1 text-black">{lecture.title}</span>
                      <span className="text-sm text-gray-500">{lecture.duration}</span>
                    </div>
                  ))}

                  {/* Assignments */}
                  <div className="mt-4">
                    <h4 className="text-black font-semibold">Assignments:</h4>
                    <div className="flex items-center p-2 cursor-pointer" onClick={() => handleAssignmentClick("practice")}>
                    <FaClipboardList className="text-blue-500 mr-2" />
                      <span className="text-gray-700">Practice Assignment</span>
                    </div>
                    <div className="flex items-center p-2 cursor-pointer" onClick={() => handleAssignmentClick("graded")}>
                    <FaClipboardList className="text-blue-500 mr-2" />
                      <span className="text-gray-700">Graded Assignment</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>

        {/* Video Player / Assignment Panel */}
        <div className="w-full lg:w-2/3 p-6">
          {selectedVideo && !selectedAssignment && (
            <>
              <h2 className="text-2xl text-black font-bold mb-4">Now Playing: {selectedVideo.title}</h2>
              <div className="relative w-full h-64 lg:h-96 bg-black rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  allowFullScreen
                ></iframe>
              </div>
            </>
          )}

          {selectedAssignment && (
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-2xl text-black font-bold mb-4">{selectedAssignment.title}</h2>
              {selectedAssignment.questions.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold">{index + 1}. {q.question}</p>
                  {q.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="block mt-1">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex}
                        checked={userAnswers[index] === optionIndex}
                        onChange={() => handleOptionChange(index, optionIndex)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default function Page() {
  return <CourseContentPage courseName="Machine Learning Foundations" />;
}
