"use client";

import { useState, useEffect } from "react";

export default function EditCourse({ courseName }) {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch("/api/courses/se")
      .then((res) => res.json())
      .then((data) => setCourseData(data));
  }, []);

  const handleLectureChange = (weekIndex, lectureIndex, field, value) => {
    const updatedWeeks = [...courseData.weeks];
    updatedWeeks[weekIndex].lectures[lectureIndex][field] = value;
    setCourseData({ ...courseData, weeks: updatedWeeks });
  };

  const handleAddLecture = (weekIndex) => {
    const updatedWeeks = [...courseData.weeks];
    updatedWeeks[weekIndex].lectures.push({ title: "", videoUrl: "" });
    setCourseData({ ...courseData, weeks: updatedWeeks });
  };

  const handleAssignmentUpload = (weekIndex, e) => {
    const updatedWeeks = [...courseData.weeks];
    updatedWeeks[weekIndex].assignments.push(e.target.files[0].name);
    setCourseData({ ...courseData, weeks: updatedWeeks });
  };

  const handleSubmit = () => {
    fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData),
    }).then(() => alert("Course content updated!"));
  };

  if (!courseData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl text-black font-bold mt-16 mb-6">Edit {courseName} Course</h1>

      {courseData.weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="mb-6">
          <h2 className="text-xl text-black font-semibold mb-4">{week.title}</h2>

          {week.lectures.map((lecture, lectureIndex) => (
            <div key={lectureIndex} className="mb-4">
              <label className="block mb-2 text-black font-semibold">Lecture Title:</label>
              <input
                type="text"
                value={lecture.title}
                onChange={(e) => handleLectureChange(weekIndex, lectureIndex, "title", e.target.value)}
                className="border p-2 w-2/3 mb-2"
              />
              <label className="block mb-2 text-black font-semibold">YouTube Lecture Link:</label>
              <input
                type="text"
                value={lecture.videoUrl}
                onChange={(e) => handleLectureChange(weekIndex, lectureIndex, "videoUrl", e.target.value)}
                className="border p-2 w-2/3"
              />
            </div>
          ))}

          <button
            onClick={() => handleAddLecture(weekIndex)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Add New Lecture
          </button>

          <div className="mb-6">
            <label className="block mb-2 text-black font-semibold">Upload Assignment:</label>
            <input
              type="file"
              onChange={(e) => handleAssignmentUpload(weekIndex, e)}
              className="border p-2"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Submit
      </button>
    </div>
  );
}

