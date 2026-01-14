# Quizzax: Interactive Assessment Platform
## Project Presentation - Team Alpha

---

# Slide 1: Project Title & Team
*   **Project Name**: Quizzax
*   **Course**: Software Engineering (2025/2026)
*   **Instructor**: Mr. HO Mafua
*   **Team**: Team Alpha
*   **Date**: January 2026

---

# Slide 2: Project Overview & Objectives
**The Problem**: Students need a modern, engaging way to test their knowledge in Engineering subjects.

**Our Solution**: A mobile-first, web-based assessment platform (Quizzax) that provides:
- Immediate feedback with detailed explanations.
- Real-time score tracking and performance history.
- Competitive social element via a global leaderboard.

---

# Slide 3: SDLC Phase 1 - Planning & Requirements
### Key Requirements (SRS)
- **Functional**: Secure login (Matric No), Subject selection, Interactive quiz interface, Real-time score calculation, Persistence of attempts in DB.
- **Non-Functional**: Under 200ms API response, High-fidelity "Glassmorphism" UI, Mobile & Desktop compatibility.
- **Scope**: Focused on student interface and score reliability for core Engineering courses.

---

# Slide 4: Our Technology Stack - What is MERN?
MERN is a powerful collection of JavaScript-based technologies used to build modern web applications.

-   **M (MongoDB)**: Our **Database**. It stores all student records, quiz questions, and scores in a flexible, high-speed format.
-   **E (Express.js)**: Our **Server Framework**. It acts as the brain of the backend, routing user requests and handling logic.
-   **R (React.js)**: Our **Frontend Library**. It powers the user interface, creating the smooth, interactive "Glassmorphism" experience.
-   **N (Node.js)**: Our **Runtime Environment**. It allows us to run JavaScript on the server, ensuring the app is fast and scalable.

---

# Slide 5: Why we chose the MERN Stack?
-   **Single Language (JavaScript)**: We use one language across the entire project, making development faster and more consistent.
-   **Real-Time Data**: MongoDB handles our complex quiz data naturally, allowing for instant feedback and scoring.
-   **Scalability**: The stack is designed to handle hundreds of students simultaneously without slowing down.
-   **Modern User Experience**: React ensures the app feels "alive" with smooth transitions and zero-page reloads.

---

# Slide 6: SDLC Phase 2 - Database Design
### Data Modeling
- **User Schema**: Managed via Matric Number primary key. Stores a history array of all past attempts per subject (Subject, Score, Total, Date).
- **Quiz Schema**: Stores subject-specific metadata (Icon, Color, Description) and a nested array of high-quality engineering questions.
- **ERD Logic**: One-to-Many relationship between User and History entries.

---

# Slide 7: UI/UX Design Rationale
### Aesthetics that WOW
- **Theme**: "Glassmorphism" — Using `backdrop-filter: blur`, semi-transparent layers, and vibrant gradients.
- **Principles**: 
  - **Mobile-First**: Optimized for vertical handheld usage.
  - **Low Friction**: < 3 clicks from login to starting a quiz.
  - **Feedback Loop**: Instant Green/Red color shifts and explanation modals minimize cognitive load.

---

# Slide 8: SDLC Phase 3 - Implementation
### Technical Highlights
- **Monorepo Structure**: Separate `/client` and `/server` directories for clean separation of concerns.
- **Key Features**:
  - **Dynamic Score Logic**: Scores are calculated on-the-fly to prevent answer tampering.
  - **Check Answer Flow**: A two-step validation process (Check -> Explanation -> Next) ensures learning happens immediately.
  - **Persistence**: Usage of `localStorage` and `auto-save` to prevent data loss on browser refresh.

---

# Slide 9: SDLC Phase 4 - Testing & Quality Assurance
### Testing Strategy
- **Unit Testing**: Verified individual API endpoints using Postman.
- **Integration Testing**: End-to-end testing of the "Happy Path" (Login -> Select Quiz -> Answer Qs -> Result).
- **UI Verification**: Manual visual regression testing across different screen sizes (iPhone SE, iPad, Desktop).
- **Result**: 100% Pass rate on all 7 core functional test cases.

---

# Slide 10: Live Demonstration
### [DEMO TIME]
**Guided Tour**:
1. **The Entry**: Quick login with a Matric Number.
2. **The Portal**: Subject selection with smooth animations.
3. **The Challenge**: Taking a sample Engineering Quiz (Check answer & Flagging).
4. **The Result**: Immediate scoring and history recording.
5. **The Rankings**: Checking the global Student Leaderboard.

---

# Slide 11: SDLC Phase 5 - Deployment & Documentation
### Readiness
- **Deployment Guide**: Comprehensive step-by-step setup for local and server-side deployment.
- **User Manual**: Clear visual instructions for first-time users.
- **Maintenance**: Automated seeding scripts (`POST /api/seed`) and database backup procedures.
- **Scalability**: Designed to handle 100+ simultaneous students using Node's non-blocking I/O.

---

# Slide 12: Challenges & Lessons Learned
### What we overcame
- **Challenge**: Blending the Air Force Institute logo with dark themes.
  - **Solution**: Developed a "Pure Burn" CSS multiplication technique.
- **Challenge**: Persisting answers during accidental refreshes.
  - **Solution**: Implemented an `auto-save` session recovery system.
- **Lesson**: The importance of early requirements clarity in avoiding "Feature Creep" during implementation.

---

# Slide 13: Conclusion & Future Enhancements
**Future Roadmap**:
- **Admin Dashboard**: For instructors to upload new question banks via Excel/PDF.
- **AI Integration**: To generate customized explanations and mock questions.
- **Native Notifications**: Reminders for CA schedule.

**Final Thought**: Quizzax is not just an app; it's a complete student success ecosystem built with SDLC precision.

---

# Slide 14: Q&A Session
### Thank You!
**Team Alpha**
- Open for questions...
