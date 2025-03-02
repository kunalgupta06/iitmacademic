"use client";
import { useState } from "react";
import { LinearProgress } from "@mui/material";
import { FaCheckCircle, FaClock, FaFileAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CourseContentPage = ({ courseName }) => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState({
    title: "Introduction to Course",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Default video
  });

  const toggleWeek = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const changeVideo = (title, url) => {
    setSelectedVideo({ title, url });
  };

  // Sample Course Data
  const courseData = {
    title: courseName,
    progress: 67,
    weeks: [
      {
        title: "Week 1",
        progress: 100,
        modules: [
          { title: "Introduction to Course", duration: "15:00", attachments: 3, completed: true, videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ" },
          { title: "Basic Concepts", duration: "20:00", attachments: 2, completed: true, videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        ],
      },
      {
        title: "Week 2",
        progress: 0,
        modules: [
          { title: "Advanced Topics", duration: "25:00", attachments: 1, completed: false, videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 mt-16"> {/* Increased top margin */}
      
      {/* Course Journey Sidebar */}
      <div className="w-full lg:w-1/3 bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Business Data Management</h1>
        <h4 className="text-3x2 font-bold mb-4">Course Journey</h4>
        <LinearProgress variant="determinate" value={courseData.progress} className="mb-4" />

        {courseData.weeks.map((week, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer p-3 bg-gray-100 rounded-lg"
              onClick={() => toggleWeek(index)}
            >
              <span className="font-semibold">{week.title}</span>
              <span className="text-red-500 font-semibold">{week.progress}%</span>
              {expandedWeek === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {expandedWeek === index && (
              <div className="mt-2">
                {week.modules.map((module, i) => (
                  <div
                    key={i}
                    className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-200"
                    onClick={() => changeVideo(module.title, module.videoUrl)}
                  >
                    {module.completed ? (
                      <FaCheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <FaClock className="text-gray-500 mr-2" />
                    )}
                    <span className="flex-1">{module.title}</span>
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Video Player Section */}
      <div className="w-full lg:w-2/3 p-6">
        <h2 className="text-2xl font-bold mb-4">Now Playing: {selectedVideo.title}</h2>
        <div className="relative w-full h-64 lg:h-96 bg-black rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={selectedVideo.url}
            title={selectedVideo.title}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

// Render SE or BDM based on the file
export default function Page() {
  return <CourseContentPage courseName="Business Data Management" />; 
}
