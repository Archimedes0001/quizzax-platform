# Phase 5: Deployment & Documentation

## 5.1 Deployment Guide

### Prerequisites
-   Node.js (v16+) installed.
-   MongoDB installed locally OR connection string for Atlas.

### Installation Steps
1.  **Clone Repository**:
    ```bash
    git clone <repo_url>
    cd quiz-app
    ```
2.  **Setup Server**:
    ```bash
    cd server
    npm install
    # Create .env file with MONGO_URI=...
    npm run dev
    ```
    *Note: Server runs on port 5000.*

3.  **Setup Client**:
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    *Note: Client runs on port 5173.*

4.  **Seed Database** (First time only):
    -   Send POST request to `http://localhost:5000/api/seed` to populate Quizzes.

## 5.2 User Manual

### Getting Started
1.  Open the App in your browser.
2.  **Login Screen**: Enter your Matriculation Number and Department.
3.  **Home Screen**: Browse subjects. Swipe or scroll to see more.
4.  **Taking a Quiz**:
    -   Tap a Subject.
    -   Select an answer for each question.
    -   Read the explanation if you get it wrong!
    -   Click "Next" to proceed.
5.  **Results**:
    -   View your score immediately.
    -   Check the Leaderboard to compare with peers.

## 5.3 Maintenance
-   **Backup**: Regular `mongodump` of the database.
-   **Future Enhancements**: Add Teacher Dashboard for uploading custom questions.
