# backend/utils/dummy_assignments.py

practice_assignment = {
    "title": "Practice Assignment",
    "questions": [
        "The acceptance testing conducted by a group of selected end users in a real-live environment is called_?",
        "An EdTech company got a contract to build an E-learning system for a school. It decides to first focus on the key feature that the school requires - i.e. to create an online attendance module. The team develops, tests and delivers this module to the school, and then starts working on the next module. The software development process followed in this case is similar to?",
        "Approximate the value of e 0.011 by linearizing e x around x=0.",
        "Regression and classification are two types of supervised machine learning techniques while clustering and density estimation are two types of unsupervised learning. True or False?"
    ]
}

graded_assignment = {
    "title": "Graded Assignment",
    "questions": [
        "A software company wants to build a website for employee wellfare to cater services to its own employees, and thus requires to interact with the employees from different departments. In this case which type of clients are we dealing with?",
        "Which of the following tests ensures that the requirements given by the clients are actually met?",
        "The linear approximation of tan(x) around  x = 0 is?",
        "What is the gradient of f(x,y)=x  2  y at (1, 3)?"

    ]
}

def get_all_assignment_questions():
    return practice_assignment["questions"] + graded_assignment["questions"]