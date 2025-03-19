let courseData = {
    title: "Business Analytics",
    weeks: [
      {
        title: "Week 1",
        lectures: [
          { title: "Introduction to Course", videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ" },
          { title: "Basic Concepts", videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        ],
        assignments: [],
      },
      {
        title: "Week 2",
        lectures: [
          { title: "Advanced Topics", videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY" },
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
  