"use client";

import { useState, useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { FaCheckCircle, FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CourseContentPage = ({ courseName }) => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your API
    const fetchCourseData = async () => {
      try {
        const response = await fetch("/api/courses/ba");
        const data = await response.json();

        // Add progress/completion fields manually
        const enhancedData = {
          ...data,
          progress: 50, // Overall progress
          weeks: data.weeks.map((week) => ({
            ...week,
            progress: 100, // Week progress
            lectures: week.lectures.map((lecture) => ({
              ...lecture,
              completed: true, // Mark all lectures complete initially
              duration: "10:00", // Dummy duration
            })),
          })),
        };

        setCourseData(enhancedData);

        // Set default video
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
                    {week.assignments.length > 0 ? (
                      week.assignments.map((assignment, idx) => (
                        <div key={idx} className="flex items-center p-2">
                          <FaCheckCircle className="text-green-500 mr-2" />
                          <span className="text-gray-700">{assignment}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic p-2">No assignments</p>
                    )}
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>

        {/* Video Player */}
        <div className="w-full lg:w-2/3 p-6">
          {selectedVideo && (
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
        </div>

      </div>
    </div>
  );
};

export default function Page() {
  return <CourseContentPage courseName="Business Analytics" />;
}






