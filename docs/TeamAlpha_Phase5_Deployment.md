# Deployment & Documentation
## Quizzax Assessment Platform

**Team Name:** Team Alpha  
**Phase:** 5.1 - 5.3  
**Date:** January 16, 2026

---

## 5.1 Deployment Guide

### System Requirements
*   **Hosting**: Server utilizing Node.js v18+ Runtime (e.g., Render, Vercel, DigitalOcean).
*   **Storage**: MongoDB Atlas Instance (M0 Free Tier or higher).
*   **Environment Variables**:
    *   `MONGO_URI`: `mongodb+srv://...`
    *   `PORT`: `5000` (or host assigned)

### Installation Instructions (Step-by-Step)
1.  **Clone Repository**:
    ```bash
    git clone https://github.com/your-repo/quiz_app.git
    cd quiz_app
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Seed Database**:
    *   Ensure server is running (`npm run start:dev`).
    *   Execute: `curl -X POST http://localhost:5000/api/seed`
4.  **Production Build**:
    *   Render.com automatically runs `npm install` and `npm start` upon push.

### Troubleshooting
*   **Error**: `EADDRINUSE: address already in use`
    *   **Fix**: Kill existing node process or change `PORT` in `.env`.
*   **Error**: `MongoServerError: bad auth`
    *   **Fix**: Verify database username/password in `MONGO_URI`.

---

## 5.2 User Manual

### Getting Started
1.  **Login**: Access URL -> Enter Matric No -> Click "Sign In".
2.  **Dashboard**: You will see a list of subject cards.
3.  **Start Quiz**: Tap any subject to begin instructions -> Click "Start".

### Feature Descriptions
*   **Quiz Timer**: Shows remaining time. Turns red at 1 minute left.
*   **Flagging**: Tap the flag icon to mark a question for review.
*   **Navigation**: Use "Prev/Next" buttons to browse questions.
*   **Submission**: Click "Submit Quiz" on last question or use Auto-Submit.

### FAQ
*   **Q: Can I pause the timer?**
    *   *A: No, the assessment mimics real exam conditions.*
*   **Q: What if my internet disconnects?**
    *   *A: The app auto-saves your progress locally. Reconnect and refresh to resume.*

---

## 5.3 Maintenance & Future Enhancements

### Known Limitations
*   Currently only supports Mobile & Desktop (No Tablet-specific layout).
*   Student pictures rely on DiceBear API (external dependency).

### Planned Future Features
*   **Phase 2**: Instructor Admin Dashboard for uploading questions via Excel.
*   **Phase 3**: Real-time WebSocket Leaderboard updates.
*   **Phase 4**: Native Mobile App (React Native).

### Maintenance Schedule
*   **Weekly**: Database backup (Automated via Atlas).
*   **Bi-Weekly**: Code dependency updates (`npm audit fix`).
*   **Monthly**: Student list review and unauthorized account purge.

### Scalability Considerations
The application is designed to scale horizontally. The Node.js server is stateless, meaning multiple instances can be spun up on Render behind a load balancer to handle increased traffic (e.g., during final exams).
