# Phase 2: System Design

## 2.1 System Architecture

**Stack Selection**:
-   **Frontend**: React (Vite) - Fast HMR, Component efficiency.
-   **Styling**: Tailwind CSS - Rapid UI development, Utility-first.
-   **Backend**: Node.js + Express - Non-blocking I/O, JavaScript everywhere.
-   **Database**: MongoDB - Flexible schema for Quizzes/History.

**Architecture Diagram (Conceptual)**:
[Client (React)] <--> [API Layer (Express)] <--> [Data Layer (Mongoose)] <--> [MongoDB]

## 2.2 Database Design

### Entity-Relationship
-   **User**: `_id`, `matricNumber`, `department`, `history[]`
-   **Quiz**: `_id`, `subject`, `questions[]`

### Schema Details
**User Table**:
-   `matricNumber` (String, PK)
-   `history` (Array of Objects: `{ subject, score, date }`)

**Quiz Table**:
-   `subject` (String, Unique)
-   `questions` (Array of Objects: `{ text, options, correctIndex, explanation }`)

## 2.3 User Interface Design

**Design Rationale**:
-   **Mobile First**: Layout designed for vertical scrolling on phones.
-   **Color Palette**: Pastel Green (#efffdb) for calmness/focus, Dark Teal (#0f3e3e) for contrast/action.
-   **Feedback**: Immediate visual color changes (Green/Red) reduce cognitive load.
