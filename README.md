# ASKIVA - AI-Powered Academic Chatbot  

ASKIVA is an **AI-driven academic chatbot** designed to assist students and instructors by providing instant responses, subject-specific insights, and academic guidance.  

This is a **full-stack** project consisting of a **Next.js** frontend and a **Flask-based** backend.  

## Features  
**Role-Based Access:** Separate dashboards for students and instructors.  
**AI-Powered Chatbot:** Uses **LangChain** and **Google AI** to provide academic assistance.  
**Secure Authentication:** JWT-based authentication.  
**Interactive UI:** Built with **Next.js** and **Tailwind CSS**.  
**Data Storage:** Backend powered by **Flask, SQLAlchemy, and ChromaDB**.  



## Getting Started  

### Prerequisites  
Ensure you have the following installed:  
- **Frontend:** [Node.js](https://nodejs.org/) (LTS version recommended)  
- **Backend:** Python 3.8+  



## Installation & Setup  

### **1️Clone the Repository**  
```sh
git clone https://github.com/PaleshaRiya/soft-engg-project-jan-2025-se-Jan-30.git
cd soft-engg-project-jan-2025-se-Jan-30
```

### **Set Up the Backend**  
1. Navigate to the backend directory:  
   ```sh
   cd backend
   ```
2. Create a virtual environment and activate it:  
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:  
   ```sh
   pip install -r requirements.txt
   ```
4. Run the backend server:  
   ```sh
   python app.py
   ```
   The backend will start at `http://localhost:5000`.  



### **Set Up the Frontend**  
1. Navigate to the frontend directory:  
   ```sh
   cd frontend
   ```
2. Install dependencies:  
   ```sh
   npm install  # or yarn install
   ```
3. Start the frontend development server:  
   ```sh
   npm run dev  # or yarn dev
   ```
4. Open your browser and navigate to:  
   ```sh
   http://localhost:3000
   ```



## Project Structure  
```
project-root/
│── backend/                # Flask-based backend
│   ├── app.py              # Main backend application
│   ├── models.py           # Database models
│   ├── routes/             # API endpoints
│   ├── config.py           # Configuration files
│   │── requirements.txt    # Backend dependencies
│   ├── .env                # Environment variables
│── frontend/               # Next.js frontend
│   ├── src/                # React components and pages
│   ├── public/             # Static assets
│   ├── styles/             # Tailwind CSS styles
│── README.md               # Project documentation
```


## Usage Instructions
1. Open `http://localhost:3000` to view the **Home Page**.
2. Click on the **Login** button on the Home Page or navigate directly to `/login` to sign in as a **Student** or **Instructor**.
3. After logging in, access the **Chatbot** through the respective portals for Students and Instructors.
 



## Technologies Used  

### **Frontend:**  
**Next.js**  
**React**  
**Tailwind CSS**  

### **Backend:**  
**Flask**  
**Flask-RESTful**  
**Flask-CORS**  
**Flask-JWT-Extended**  
**SQLAlchemy**  
**ChromaDB**  
**LangChain**  
**Google AI Generative Models**  

### **Other Tools:**  
**Streamlit** (for AI-based analytics)  
**Pandas & NumPy** (for data handling)  



##License  
This project is developed for **academic purposes**.  

