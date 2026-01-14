# Phase 3: Implementation

## 3.1 Source Code Structure
The solution is implemented as a Monorepo with two main directories:
-   **client/**: React Frontend (Vite, Tailwind CSS).
-   **server/**: Node.js Backend (Express, Mongoose).

### Key Files
-   `server/models/Quiz.js`: Defines the schema for Subjects and Questions.
-   `server/routes/api.js`: Contains all RESTful endpoints.
-   `client/src/pages/Quiz.jsx`: Core logic for taking the quiz, handling state, and scoring.
-   `client/src/index.css`: Custom Tailwind directives for the "Glassmorphism" design.

## 3.2 Implementation Report

### Technologies Used
-   **Frontend**: React 18, Vite 4, TailwindCSS 3, Framer Motion (Animations), Lucide React (Icons).
-   **Backend**: Node.js 18, Express 4, MongoDB (Mongoose 7).
-   **Tools**: Postman (API Testing), Git (Version Control).

### Key Algorithms & Patterns
1.  **State Management**: React `useState` and `useEffect` are used for handling user sessions and quiz progress. LocalStorage is used for persisting "Login" state across reloads.
2.  **Randomization**: (Future enhancement) Questions are currently stored in fixed order but can be shuffled using Fisher-Yates algorithm in the `api/quizzes/:subject` endpoint.
3.  **Score Calculation**:
    -   Score is calculated incrementally on the client for immediate feedback.
    -   Final verification happens on submission to the backend to prevent tampering (basic validation).

### Challenges & Solutions
-   **Challenge**: Implementing the specific "Glassmorphism" UI requested in the assignment without making it look "forced".
-   **Solution**: Used Tailwind's `backdrop-blur` and semi-transparent white backgrounds (`bg-white/40`) to achieve the effect naturally.
-   **Challenge**: Handling "Next" vs "Check Answer" flow.
-   **Solution**: Implemented a two-step state in `Quiz.jsx` (`showExplanation` boolean) to toggle between showing the result and moving to the next question.

### Deviations
-   **Auth**: Implemented simplified "Matric Number" login instead of full Email/Password auth to reduce friction for the demo, as allowed by the MVP scope.
