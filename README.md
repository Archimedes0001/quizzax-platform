# Quizzax - Student Assessment Platform

**Course**: Software Engineering (2025/2026)
**Instructor**: Mr HO Mafua
**Team**: Team Alpha

## Project Overview
Quizzax is a web application designed to help students improve their knowledge in core engineering subjects (Engineering Mathematics, Fluid Mechanics, Applied Electricity, Computer and Software Engineering) through interactive quizzes. It tracks performance history (CA 1 + CA 2) and features a competitive leaderboard.

**Tech Stack**: Vanilla HTML, CSS, JavaScript (Frontend) + Express.js & MongoDB (Backend)

## Project Structure
```
/quiz app
  /client         # Vanilla JS Frontend (HTML, CSS, JS)
  /server         # Express Backend Source
  /docs           # SDLC Documentation (Phases 1-5)
  README.md       # This file
```

## Quick Start Guide

### Prerequisites
-   Node.js installed.
-   MongoDB running locally on port 27017.

### Running the App
1.  **Start the Server**:
    ```bash
    cd server
    npm install
    npm run dev
    ```
2.  **Start the Client** (in a new terminal):
    ```bash
    cd client
    npm run dev
    ```
3.  **Access App**: Open `http://localhost:5173` in your browser.

### Login Credentials (Demo)
-   **Matric Number**: `19/SCI01/001`
-   **Department**: `Computer Science`

## Troubleshooting

### "Site Not Available" / "This site can't be reached"
If you see this error when opening the app:

1.  **Check the Server**:
    -   Ensure the **server terminal** is still running (you should see "Server running on port 5000").
    -   If it stopped, run `npm run dev` in the `server` folder again.

2.  **Check the Client**:
    -   Ensure the **client terminal** is still running.
    -   Address should be `http://127.0.0.1:5173`. Avoid `localhost` if it gives you trouble.

### "Login Failed" (500 Error)
-   Make sure **MongoDB** is running.
-   Check the **Server Terminal** logs. It will show the exact error (e.g., "Connection refused").
-   Restart both terminals if you changed configuration.

## Deliverables
Detailed documentation for each phase can be found in the `docs/` folder:
-   [Phase 1: Planning](docs/Phase1_Planning.md)
-   [Phase 2: Design](docs/Phase2_Design.md)
-   [Phase 3: Implementation](docs/Phase3_Implementation.md)
-   [Phase 4: Testing](docs/Phase4_Testing.md)
-   [Phase 5: Deployment](docs/Phase5_Deployment.md)
