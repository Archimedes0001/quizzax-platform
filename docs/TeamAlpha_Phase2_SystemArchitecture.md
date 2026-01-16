# System Architecture Document
## Quizzax Assessment Platform

**Team Name:** Team Alpha  
**Phase:** 2.1  
**Date:** January 16, 2026

---

## 1. Architecture Overview
Quizzax employs a **3-Tier Client-Server Architecture** to ensure separation of concerns, scalability, and maintainability.

### 1.1 Architectural Diagram
```mermaid
graph TD
    Client[Client Layer<br/>(Browser/SPA)]
    Server[Application Layer<br/>(Node.js/Express)]
    DB[(Data Layer<br/>MongoDB Atlas)]

    Client <-->|REST API (HTTPS)| Server
    Server <-->|Mongoose Driver| DB
```

1.  **Presentation Tier (Client)**: Handles UI rendering and user interactions using Vanilla JavaScript.
2.  **Application Tier (Server)**: Processes business logic, authentication, and scoring algorithms.
3.  **Data Tier (Database)**: Stores persistent data (users, quizzes, history) in MongoDB Cloud.

---

## 2. Technology Stack Selection
| Component | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | **Vanilla JS + HTML5** | Lightweight, zero-build step required, high performance on mobile devices. No framework overhead ensures fast load times (< 2s). |
| **Backend** | **Node.js** | Non-blocking I/O ideal for handling concurrent quiz submissions. Javascript on both ends simplifies development. |
| **Framework** | **Express.js** | Minimalist framework for defining robust REST API endpoints. Easy middleware integration for auth/error handling. |
| **Database** | **MongoDB** | Schema flexibility allows storing nested quiz structures (questions/options) naturally as JSON-like documents. |
| **Hosting** | **Render** | Free tier availability, seamless GitHub integration, and native Node.js support. |

---

## 3. System Components
1.  **Auth Module**:
    *   Validates Matric Numbers against whitelist.
    *   Manages JWT-free session via LocalStorage (simplified for scope).
2.  **Quiz Engine**:
    *   **Seed Manager**: Populates DB with 1000+ questions from JSON.
    *   **Randomizer**: Selects 50 unique IDs per session.
    *   **Grader**: Compares submitted answers against key server-side.
3.  **Data Controller**:
    *   Aggregates student history.
    *   Calculates CA averages on-the-fly.

---

## 4. Data Flow Diagrams (DFD)

### Level 0 DFD (Context Diagram)
[Student] --(Login Request)--> [Quizzax System]
[Quizzax System] --(Auth Token)--> [Student]
[Student] --(Submit Answers)--> [Quizzax System]
[Quizzax System] --(Score Report)--> [Student]

### Level 1 DFD (Quiz Process)
1.  **Request Quiz**: Student selects subject -> Server fetches 50 random Qs.
2.  **Take Quiz**: Student answers -> LocalState updates.
3.  **Submit**: Session Data sent to Server -> Server calculates Score.
4.  **Update DB**: Score saved to History -> User Profile updated.

---

## 5. Deployment Architecture
*   **Production Environment**: Render PaaS (Platform as a Service).
*   **CI/CD Pipeline**: GitHub Main Branch -> Auto-Deploy to Render.
*   **Database**: MongoDB Atlas Cluster (M0 Sandbox) hosted on AWS.
*   **Environment Variables**: `MONGO_URI` (Database Connection), `PORT` (Server Port).
