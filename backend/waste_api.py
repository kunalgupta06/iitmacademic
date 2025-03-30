
#done
@pytest.fixture
def valid_user():
    return{
        "name":"New",
        "email":"newuser@ds.study.iitm.ac.in",
        "username":"newuser",
        "password":"Test@123",
        "role":"student"
    }
def test_register_success(valid_user):
    response = requests.post(f"{BASE_URL}/register", json=valid_user)
    assert response.status_code in [200, 201]
    assert "User registered successfully" in response.text   

#done
def test_register_missing_field():
    incomplete_data = {"email": "testuser@ds.study.iitm.ac.in"}  # Missing required fields
    response = requests.post(f"{BASE_URL}/register", json=incomplete_data)
    assert response.status_code == 400
    assert "Missing required field" in response.text

#done
def test_register_invalid_email():
    invalid_email_user = {
        "name": "Invalid User",
        "email": "invalid@random.com",
        "username": "invaliduser",
        "password": "Test@123",
        "role": "student"
    }
    response = requests.post(f"{BASE_URL}/register", json=invalid_email_user)
    assert response.status_code == 400
    assert "Students and TAs must use an email with the domain" in response.text

#done
def test_login_success(valid_user):
    requests.post(f"{BASE_URL}/register", json=valid_user)  # Ensure user is registered
    login_data = {"email": valid_user["email"], "password": valid_user["password"], "role": "student"}
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    assert response.status_code == 200
    assert "Welcome" in response.text

#done
def test_login_invalid_credentials():
    invalid_login_data = {"email": "wrong@ds.study.iitm.ac.in", "password": "WrongPass1!", "role": "student"}
    response = requests.post(f"{BASE_URL}/login", json=invalid_login_data)
    assert response.status_code == 401
    assert "Invalid credentials" in response.text

#done
def test_login_invalid_email():
    invalid_email_login = {"email": "invalid@random.com", "password": "Test@123", "role": "student"}
    response = requests.post(f"{BASE_URL}/login", json=invalid_email_login)
    assert response.status_code == 400
    assert "Students and TAs must use an email with the domain" in response.text


def student_session():
    #Fixture to log in as a student and return session cookies.
    login_data = {
        "email": "student@ds.study.iitm.ac.in",
        "password": "Test@123",
        "role": "student"
    }
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    assert response.status_code == 200
    return response.cookies  # Return session cookies for authentication

def test_student_dashboard(student_session):
    #Test fetching all courses a student is enrolled in.
    response = requests.get(f"{BASE_URL}/student-dashboard", cookies=student_session)
    assert response.status_code == 200
    json_data = response.json()
    assert "enrolled_courses" in json_data
    assert isinstance(json_data["enrolled_courses"], list)


def test_view_assignments(student_session):
    #Test fetching assignments for a student's course.
    subject_id = 1  # Adjust as needed for your test database
    response = requests.get(f"{BASE_URL}/view-assignments/{subject_id}", cookies=student_session)
    assert response.status_code == 200
    json_data = response.json()
    assert "assignments" in json_data
    assert isinstance(json_data["assignments"], list)

#done
def test_unauthorized_student_dashboard():
    #Test unauthorized access to student dashboard.
    response = requests.get(f"{BASE_URL}/student-dashboard")
    assert response.status_code == 403
    assert response.json()["error"] == "Unauthorized access"

def test_unauthorized_view_assignments():
    #Test unauthorized access to assignments.
    subject_id = 1  # Adjust as needed
    response = requests.get(f"{BASE_URL}/view-assignments/{subject_id}")
    assert response.status_code == 403
    assert response.json()["error"] == "Unauthorized access"








@pytest.fixture
def test_client():
    """Fixture to initialize the Flask app test client."""
    return requests.Session()

def test_course_content(test_client):
    """Test fetching course content including lectures and assignments."""
    response = test_client.get(f"{BASE_URL}/course-content")
    assert response.status_code == 200
    json_data = response.json()
    assert "subjects" in json_data
    assert isinstance(json_data["subjects"], list)
    if json_data["subjects"]:
        subject = json_data["subjects"][0]
        assert "subject_name" in subject
        assert "weeks" in subject
        assert isinstance(subject["weeks"], list)

        if subject["weeks"]:
            week_data = subject["weeks"][0]
            assert "week" in week_data
            assert "lectures" in week_data
            assert "assignments" in week_data

            assert isinstance(week_data["lectures"], list)
            assert isinstance(week_data["assignments"], dict)
            assert "graded" in week_data["assignments"]
            assert "non_graded" in week_data["assignments"]
'''
def test_serve_pdf(test_client):
    """Test serving a PDF file from the uploads directory."""
    filename = "sample.pdf"  # Ensure a sample PDF exists in UPLOAD_FOLDER
    response = test_client.get(f"{BASE_URL}/pdfs/{filename}")

    if response.status_code == 200:
        assert response.headers["Content-Type"] == "application/pdf"
    else:
        assert response.status_code == 404  # PDF file might not exist'
        '''




@pytest.fixture
def test_client():
    """Fixture to initialize the Flask app test client."""
    return requests.Session()

def test_ai_chat(test_client):
    """Test AIChat API for generating responses."""
    data = {"query": "What is the capital of France?"}
    response = test_client.post(f"{BASE_URL}/ai-chat", json=data)
    
    assert response.status_code == 200
    json_data = response.json()
    
    assert "response" in json_data
    assert isinstance(json_data["response"], str)
    assert len(json_data["response"]) > 0  # Ensure the response isn't empty

def test_ai_chat_missing_query(test_client):
    """Test AIChat API when query parameter is missing."""
    data = {}  # Missing query
    response = test_client.post(f"{BASE_URL}/ai-chat", json=data)
    
    assert response.status_code == 400
    json_data = response.json()
    
    assert "error" in json_data
    assert json_data["error"] == "Missing query parameter"

def test_ai_chat_server_error(test_client, monkeypatch):
    """Test AIChat API handling errors from the Gemini API."""
    
    def mock_generate_content(*args, **kwargs):
        raise Exception("Mocked Gemini API error")

    from app import genai  # Import genai from your Flask app module
    monkeypatch.setattr(genai.GenerativeModel, "generate_content", mock_generate_content)

    data = {"query": "Tell me a joke"}
    response = test_client.post(f"{BASE_URL}/ai-chat", json=data)
    
    assert response.status_code == 500
    json_data = response.json()
    
    assert "error" in json_data
    assert "Mocked Gemini API error" in json_data["error"]



@pytest.fixture
def test_client():
    """Fixture to create a Flask test client"""
    with app.test_client() as client:
        with client.session_transaction() as session:
            session["user"] = {"role": "instructor"}  # Simulate instructor login
        yield client  # Provide the client to tests


def test_add_lecture_unauthorized(test_client):
    """Test unauthorized access when adding a lecture"""
    data = {
        "title": "Introduction to AI",
        "video_link": "https://example.com/video.mp4",
        "subject_id": 1
    }
    
    response = test_client.post(f"{BASE_URL}/add-lecture", json=data)
    assert response.status_code == 403
    json_data = response.json()
    assert "error" in json_data
    assert json_data["error"] == "Unauthorized access"



def test_add_lecture_missing_fields(test_client):
    """Test adding a lecture with missing fields"""

    data = {
        "title": "Introduction to AI",
        "video_link": ""  # Missing required field
    }
    
    response = test_client.post("/add-lecture", json=data)  # No need for BASE_URL in Flask client
    assert response.status_code == 400  # Expecting bad request due to missing fields
    
    json_data = response.get_json()  # Use `get_json()` instead of `.json()`
    assert "error" in json_data
    assert json_data["error"] == "Missing required fields"


def test_add_lecture_success(test_client):
    """Test successfully adding a lecture"""
    
   
    with test_client.session_transaction() as session:
        session["user"] = {"role": "instructor"}  

    data = {
        "title": "Introduction to AI",
        "video_link": "https://example.com/video.mp4",
        "subject_id": 1
    }
    
    response = test_client.post("/add-lecture", json=data)  
    assert response.status_code == 200
    
    json_data = response.get_json()  
    assert "message" in json_data
    assert json_data["message"] == "Lecture added successfully"



@pytest.fixture
def test_client():
    """Fixture to create a Flask test client."""
    app.config["TESTING"] = True
    app.config["UPLOAD_FOLDER"] = "test_uploads"
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    with app.app_context():
        db.create_all()
        with app.test_client() as client:
            yield client
        db.session.remove()  # Ensures cleanup happens inside the context




def test_add_assignment_success(test_client):
    """Test successfully adding an assignment with a PDF upload"""

    with test_client.session_transaction() as session:
        session["user"] = {"role": "instructor", "user_id": 1 }

    data = {
        "name": "AI Project",
        "due_date": datetime.strptime('2025-03-30', "%Y-%m-%d").date(),
        "subject_id": 1
    }

    test_file = FileStorage(
        stream=open("test.pdf", "rb"),
        filename="test.pdf",
        content_type="application/pdf"
    )

    response = test_client.post(
        "/add-assignment",
        data={"file": test_file, **data},
        content_type="multipart/form-data"
    )

    assert response.status_code == 200
    assert b"Assignment added successfully" in response.data

def test_add_assignment_missing_fields(test_client):
    """Test adding an assignment with missing fields"""

    with test_client.session_transaction() as session:
        session["user"] = {"role": "instructor"}

    data = {
        "name": "AI Project",
        "due_date": ""  # Missing due date
    }

    response = test_client.post("/add-assignment", data=data)
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data
    assert json_data["error"] == "Missing required fields"

def test_add_assignment_unauthorized(test_client):
    """Test unauthorized access (non-instructors)"""
    
    with test_client.session_transaction() as session:
        session["user"] = {"role": "student"}  # ❌ Wrong role

    data = {
        "name": "AI Project",
        "due_date": "2025-03-30",
        "subject_id": "1"
    }

    response = test_client.post("/add-assignment", data=data)
    assert response.status_code == 403
    json_data = response.get_json()
    assert "error" in json_data
    assert json_data["error"] == "Unauthorized access"





def test_serve_nonexistent_pdf(client):
    """Test requesting a non-existent PDF file."""
    response = client.get("/serve-pdf/missing_file.pdf") 
    assert response.status_code == 404  

def test_serve_pdf(client, tmp_path):
    """Test serving a PDF file from the uploads directory."""
    upload_folder = tmp_path / "uploads"
    upload_folder.mkdir()

    with app.app_context():  # Ensure the app context is active
        app.config["UPLOAD_FOLDER"] = str(upload_folder)

    # Create a test PDF file
    test_pdf = upload_folder / "test_file.pdf"
    test_pdf.write_bytes(b"%PDF-1.4\n%Fake PDF Content")

    # Make a request to the ServePDF endpoint
    response = client.get("/pdfs/test_file.pdf")

    assert response.status_code == 200
    assert response.mimetype == "application/pdf"

\



@pytest.fixture
def test_client():
    """Fixture to set up test client."""
    with app.test_client() as client:
        yield client

def test_get_upload_folder(monkeypatch):
    """Test fetching the upload folder path."""
    mock_upload_folder = "/mock/uploads"
    
    with app.app_context():
      
        app.config["SERVER_NAME"] = "localhost"
        monkeypatch.setitem(app.config, "UPLOAD_FOLDER", mock_upload_folder)
        assert user_auth.get_upload_folder() == mock_upload_folder
def test_course_content(test_client):
    """Test fetching course content including lectures and assignments."""
    print(type(test_client))
    response = test_client.get(f"{BASE_URL}/course-content")
    assert response.status_code == 200
    
    json_data = response.json()
    print(type(json_data))
    assert "subjects" in json_data
    assert isinstance(json_data["subjects"], list)

    if json_data["subjects"]:
        first_subject = json_data["subjects"][0]  # Renamed variable
        assert "subject_name" in first_subject
        assert "weeks" in first_subject
        assert isinstance(first_subject["weeks"], list)

        if first_subject["weeks"]:
            week_data = first_subject["weeks"][0]
            assert "week" in week_data
            assert "lectures" in week_data
            assert "assignments" in week_data

            assert isinstance(week_data["lectures"], list)
            assert isinstance(week_data["assignments"], dict)
            assert "graded" in week_data["assignments"]
            assert "non_graded" in week_data["assignments"]





@pytest.fixture
def test_client():
    """Fixture for Flask test client with app context."""
    with app.test_client() as client:
        with app.app_context():
            yield client

@pytest.fixture
def setup_test_db():
    """Setup test database and clean up after."""
    db.create_all()
    yield
    db.session.remove()
    db.drop_all()

@pytest.fixture
def test_client():
    """Fixture to create a test client for API requests."""
    with app.test_client() as client:
        yield client

@pytest.fixture
def instructor_session(test_client):
    """Log in as an instructor for session-based authentication."""
    with test_client.session_transaction() as sess:
        sess["user"] = {"role": "instructor"}

@pytest.fixture
def setup_test_uploads():
    """Setup a test uploads directory and create mock submissions."""
    os.makedirs("uploads", exist_ok=True)
    test_files = ["student_1_assignment_101.pdf", "student_2_assignment_102.docx"]
    for file in test_files:
        with open(os.path.join("uploads", file), "w") as f:
            f.write("Test content")

    yield  # Run the test

    # Cleanup after test
    for file in test_files:
        os.remove(os.path.join("uploads", file))
    os.rmdir("uploads")

def test_view_submitted_assignments_unauthorized(test_client):
    """Test unauthorized access to the submissions API."""
    response = test_client.get("/submitted-assignments/1")
    assert response.status_code == 403
    assert response.json["error"] == "Unauthorized access"

def test_view_submitted_assignments_success(test_client, instructor_session, setup_test_uploads):
    """Test successful retrieval of submitted assignments."""
    response = test_client.get("/submitted-assignments/1")
    assert response.status_code == 200
    
    submissions = response.json["submissions"]
    assert isinstance(submissions, list)
    assert "student_1_assignment_101.pdf" in submissions
    assert "student_2_assignment_102.docx" in submissions

def test_view_submitted_assignments_empty_folder(test_client, instructor_session):
    """Test when no submissions exist in the uploads folder."""
    os.makedirs("test_uploads", exist_ok=True)  # Ensure uploads folder exists
    response = test_client.get("/submitted-assignments/1")
    
    assert response.status_code == 200
    assert response.json["submissions"] == []

    os.rmdir("test_uploads")  # Clean up empty folder