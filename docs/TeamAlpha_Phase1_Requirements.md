# Requirements Specification Document
## Quizzax Assessment Platform

**Team Name:** Team Alpha  
**Phase:** 1.2  
**Date:** January 16, 2026

---

## 1. Introduction and Purpose
The **Quizzax Assessment Platform** is web-based software designed to evaluate the academic performance of engineering students through automated quizzes. Its purpose is to replace paper-based assessments with a secure, efficient, and data-driven digital solution that provides instant feedback and longitudinal performance tracking.

## 2. Target Users/Stakeholders
*   **Students (Primary)**: Use the app to take quizzes, view results, and track progress.
*   **Administrator (Secondary)**: Manages the student database and question banks.
*   **Instructors**: View aggregated performance data to identify knowledge gaps.

---

## 3. Functional Requirements
*Priority Levels: (M) Must-have, (S) Should-have, (C) Could-have*

### Authentication & User Management
1.  **[M]** System shall accept login only from valid Matriculation Numbers present in the database.
2.  **[M]** System shall maintain user sessions across page reloads (Session Persistence).
3.  **[S]** System shall allow users to log out and clear their session data.
4.  **[C]** System could allow students to update their display profile picture.

### Quiz Engine
5.  **[M]** System shall generate a unique quiz session by selecting 50 random questions from the subject pool.
6.  **[M]** System shall enforce a strict 15-minute countdown timer for each session.
7.  **[M]** System shall auto-submit the quiz when the timer reaches 00:00.
8.  **[M]** System shall calculate the score immediately upon submission (Correct/Total * 100).
9.  **[S]** System shall provide immediate "Correct/Incorrect" feedback with an explanation after each question.
10. **[S]** System shall allow marking questions as "Flagged" for later review.

### Performance & Data
11. **[M]** System shall save quiz attempts to the database with a timestamp and subject tag.
12. **[S]** System shall calculate the Continuous Assessment (CA) average for each subject.
13. **[S]** System shall display a global leaderboard ranking students by total score.
14. **[C]** System could visualize performance trends using line charts (Chart.js).

### Navigation & UI
15. **[M]** System shall provide a bottom navigation bar for switching between Home, Performance, and Leaderboard.

---

## 4. Use Case Descriptions

### UC-01: Student Takes a Quiz
*   **Actor**: Student
*   **Precondition**: Student is logged in.
*   **Flow**:
    1.  Student selects "Engineering Mathematics" from Home Dashboard.
    2.  System retrieves 50 random questions and starts timer.
    3.  Student answers questions, navigating with "Next"/"Prev".
    4.  Student clicks "Submit".
    5.  System calculates score and displays Result Page.
*   **Postcondition**: Quiz attempt is saved to database; CA average is updated.

### UC-02: Auto-Save Recovery
*   **Actor**: System (Automated)
*   **Precondition**: Student is actively taking a quiz.
*   **Flow**:
    1.  Student accidentally closes browser tab or refreshes page.
    2.  Student re-opens the application.
    3.  System detects active session in Local Storage.
    4.  System restores Question Index, Selected Answers, and Timer value.
*   **Postcondition**: Student resumes quiz without data loss.

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
*   **Response Time**: API responses for questions must be < 200ms.
*   **Throughput**: System must support 100 concurrent users without degradation.
*   **Resource Usage**: Client app size should not exceed 5MB.

### 5.2 Security Requirements
*   **Authentication**: No password required, but Matric Number must be validated against a whitelist.
*   **Data Integrity**: Quiz scores are calculated server-side to check against client-side tampering.
*   **Transport**: All data transmission must occur over HTTPS.

### 5.3 Usability Requirements
*   **Learnability**: First-time users should be able to start a quiz within 3 clicks.
*   **Accessibility**: Color contrast must meet WCAG AA standards (for dark mode).
*   **Responsiveness**: UI must adapt seamlessly to screens from 320px (iPhone SE) to 1920px (Desktop).

### 5.4 Compatibility Requirements
*   **Browsers**: Chrome (80+), Safari (13+), Edge, Firefox.
*   **OS**: Windows, macOS, iOS, Android.

---

## 6. Constraints and Assumptions
*   **Constraint**: The project must use the MERN stack (as per course requirement).
*   **Constraint**: Hosting must be on a zero-cost platform (Render/Vercel).
*   **Assumption**: Students will have reliable internet access during the assessment.
*   **Assumption**: Matric numbers provided by the department are accurate and final.

---

## 7. Glossary of Terms
*   **CA (Continuous Assessment)**: A score derived from the average of multiple quiz attempts.
*   **SPA (Single Page Application)**: A web app that loads a single HTML page and dynamically updates content.
*   **Seed Data**: Initial set of data (students, questions) populated into the database for testing.
*   **Matric Number**: Unique identification number assigned to each student (e.g., U24ICE1001).
