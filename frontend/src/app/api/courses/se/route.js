let courseData = {
    title: "Software Engineering",
    weeks: [
      {
        title: "Week 1",
        lectures: [
          { title: "Introduction to Course", videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ" },
          { title: "Agile Methodologies", videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        ],
        assignments: [],
      },
      {
        title: "Week 2",
        lectures: [
          { title: "Software Testing", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
        assignments: [],
      },
    ],
  };
  
  export async function GET() {
    return new Response(JSON.stringify(courseData), { status: 200 });
  }
  
  export async function POST(req) {
    const newData = await req.json();
    courseData = newData;
    return new Response(JSON.stringify({ message: "Updated successfully!" }), { status: 200 });
  }