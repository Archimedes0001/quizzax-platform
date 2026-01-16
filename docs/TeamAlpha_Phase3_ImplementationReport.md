# Implementation Report
## Quizzax Assessment Platform

**Team Name:** Team Alpha  
**Phase:** 3.2  
**Date:** January 16, 2026

---

## 1. Technologies and Tools Used
| Category | Tool/Tech | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Vanilla JavaScript | Core application logic and component rendering. |
| **Styling** | CSS3 (Grid/Flexbox) | Responsive layout and Glassmorphism effects. |
| **Backend** | Node.js / Express | Server-side runtime and REST API framework. |
| **Database** | MongoDB / Mongoose | Data persistence and object modeling. |
| **Version Control** | Git / GitHub | Code collaboration and history tracking. |
| **Deployment** | Render | Automated cloud hosting triggered by Git push. |
| **Testing** | Postman | API endpoint verification. |

## 2. Key Algorithms & Design Patterns

### 2.1 Fisher-Yates Shuffle Algorithm
To ensure fairness and prevent cheating, no two students receive questions in the same order. We implemented the **Fisher-Yates Shuffle** algorithm to randomize the question array before sending it to the client.
```javascript
// Located in server/utils/quizHelper.js
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

### 2.2 Singleton Pattern (AppState)
On the client side, we used a **Singleton Pattern** to manage the global application state. The `AppState` object serves as the single source of truth for the current user session, quiz progress, and timer value, ensuring consistency across different views.

### 2.3 Debouncing for Auto-Save
To reduce server load, we implemented a **Debounce** pattern for the auto-save feature. Instead of saving progress after every single click, the system waits for 5 seconds of inactivity before syncing with the backend.

## 3. Challenges Faced and Solutions

### Challenge 1: Scrollbar Flicker on Login
**Issue**: Upon loading the login page, a vertical scrollbar would appear and disappear rapidly due to the CSS fade-in animation, causing a jarring visual shift.
**Solution**: We implemented a robust CSS fix targeting `html`, `body`, and the `.container` class with `overflow: hidden !important` specifically when the `.login-active` class is present. This forced the viewport to lock dimensions, eliminating the flicker.

### Challenge 2: "Not a Git Repository" Error
**Issue**: During deployment, we attempted to push changes from a subdirectory (`/server`), resulting in a fatal git error.
**Solution**: We corrected our workflow to always execute `git` commands from the project root directory. We also established a standard procedure: `Stage -> Commit -> Push`.

### Challenge 3: Maintaining Metric Accuracy
**Issue**: Initially, the performance dashboard showed all seeded students, making it hard to find active users.
**Solution**: We refactored the `/api/performance` endpoint to filter users based on their `history.length`. Now, only students who have actually attempted a quiz appear in the analytics.

## 4. Deviation from Original Design
*   **Authentication**: Originally planned to use JWT (JSON Web Tokens).
    *   **Justification**: Switched to matric-number-only validation (Session ID stored in Database) to simplify the "No Password" requirement for 100L students.
*   **Admin Panel**: Originally scoped for Phase 1.
    *   **Justification**: De-scoped to "Future Enhancement" to focus resources on perfecting the student-facing experience and mobile responsiveness.
