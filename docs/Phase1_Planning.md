# Phase 1: Planning & Requirements Analysis

## 1.1 Project Charter

**Project Title**: Quizzax - Interactive Assessment Platform
**Project Team**: Team Alpha (Substitute with actual name)
**Date**: October 2025

### Project Objectives and Scope
**Objective**: To develop a web-based "Quizzax" application that allows students to take subject-based quizzes (Maths, Physics, Chemistry, Geometry) and track their CA scores.
**Scope**: 
-   **In Scope**: Student authentication (Matric/Dept), Quiz interface, Score calculation, Leaderboard, Responsive Mobile UI.
-   **Out of Scope**: Professor admin panel, Question editing (hardcoded/seeded for MVP), Complex auth (Auth0/OAuth).

### Stakeholders
-   **Primary**: Students (End users), Course Instructor (Mr HO Mafua).
-   **Secondary**: Department Faculty.

### Success Criteria
-   Functional MERN stack deployment.
-   UI matches the provided high-fidelity design.
-   Responsive on mobile (iPhone SE/14 dimensions) and Desktop.
-   Backend reliably stores history of attempts.

---

## 1.2 Requirements Specification

### Functional Requirements
1.  **FR-01**: System shall accept Student Matric Number and Department for Login.
2.  **FR-02**: System shall display a list of available subjects (Maths, Physics, etc.).
3.  **FR-03**: System shall present questions one by one.
4.  **FR-04**: System shall provide immediate feedback (Correct/Incorrect) with explanation.
5.  **FR-05**: System shall calculate final score upon completion.
6.  **FR-06**: System shall save attempts to the database.
7.  **FR-07**: System shall display a leaderboard of top scores.
8.  **FR-08**: User can search for subjects (search bar UI).
9.  **FR-09**: User can skip questions.
10. **FR-10**: System shall prevent taking the same quiz twice (Optional constraint, currently allowed).

### Non-Functional Requirements
1.  **Performance**: API response time < 200ms.
2.  **Usability**: UI must follow "Glassmorphism" and "Clean" aesthetic with < 3 clicks to start quiz.
3.  **Reliability**: 99.9% uptime during testing.
4.  **Compatibility**: Chrome, Firefox, Safari (Mobile & Desktop).

### Use Case: Take Quiz
**Actor**: Student
1.  Student logs in.
2.  Selects "Physics".
3.  Answers questions.
4.  Submits quiz.
5.  System displays score.
