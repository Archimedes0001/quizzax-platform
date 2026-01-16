# System Design Document (SDD)
## Quizzax Assessment Platform

**Version:** 1.0  
**Date:** January 15, 2026  
**Prepared by:** Development Team

---

## 1. Introduction

### 1.1 Purpose
This document describes the system architecture, design decisions, and technical specifications for the Quizzax Assessment Platform.

### 1.2 Scope
Covers the complete system design including:
- System architecture
- Database design
- API specifications
- User interface design
- Security architecture

---

## 2. System Architecture

### 2.1 Architecture Overview
The Quizzax Platform follows a **3-Tier Client-Server Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Client (Browser)                                     │  │
│  │  - Vanilla JavaScript SPA                            │  │
│  │  - HTML5 + CSS3                                      │  │
│  │  - Local Storage (Session Persistence)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION TIER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Server (Node.js + Express.js)                       │  │
│  │  - RESTful API Endpoints                             │  │
│  │  - Business Logic                                    │  │
│  │  - Session Management                                │  │
│  │  - Data Validation                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                       DATA TIER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas (Cloud Database)                      │  │
│  │  - Users Collection                                  │  │
│  │  - Quizzes Collection                                │  │
│  │  - Automated Backups                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

#### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Styling with custom properties, animations
- **JavaScript (ES6+)**: Client-side logic, SPA routing
- **Local Storage API**: Session persistence

#### Backend
- **Node.js (v14+)**: Runtime environment
- **Express.js (v4.x)**: Web framework
- **Mongoose (v6.x)**: MongoDB ODM
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

#### Database
- **MongoDB Atlas**: Cloud-hosted NoSQL database
- **Collections**: Users, Quizzes

#### DevOps
- **Git**: Version control
- **GitHub**: Repository hosting, CI/CD trigger
- **Render**: Cloud hosting platform
- **npm**: Package management

---

## 3. Database Design

### 3.1 Data Model

#### Users Collection
```javascript
{
  _id: ObjectId,
  matricNumber: String (unique, required),
  name: String (required),
  department: String (required),
  level: String (default: "100L"),
  history: [
    {
      quizId: ObjectId (ref: Quiz),
      subject: String,
      score: Number,
      totalQuestions: Number,
      attemptDate: Date (default: now)
    }
  ],
  activeSession: {
    subject: String,
    currentQuestionIndex: Number,
    score: Number,
    answers: Object,
    timer: Number,
    flaggedQuestions: [Number],
    lastUpdated: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Quizzes Collection
```javascript
{
  _id: ObjectId,
  subject: String (required),
  icon: String,
  color: String,
  description: String,
  questions: [
    {
      questionText: String (required),
      options: [String] (4 options),
      correctOption: Number (0-3),
      explanation: String,
      image: String (optional)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 Indexing Strategy
- **Users**: Index on `matricNumber` (unique)
- **Quizzes**: Index on `subject`

### 3.3 Data Relationships
- **One-to-Many**: User → Quiz History
- **Reference**: Quiz History → Quiz (via quizId)

---

## 4. API Design

### 4.1 RESTful Endpoints

#### Authentication
```
POST /api/login
Request Body: { matricNumber: String }
Response: { matricNumber, name, department, level, history, activeSession }
Status: 200 OK | 403 Forbidden | 400 Bad Request
```

#### Quiz Management
```
GET /api/quizzes
Response: [{ subject, icon, description, color }]
Status: 200 OK

GET /api/quizzes/:subject
Response: { subject, questions: [50 random questions] }
Status: 200 OK | 404 Not Found
```

#### Progress Management
```
POST /api/save-progress
Request Body: { matricNumber, sessionData }
Response: { message: "Progress saved" }
Status: 200 OK | 404 Not Found

POST /api/submit
Request Body: { matricNumber, subject, score, totalQuestions }
Response: { message: "Score saved", history }
Status: 200 OK | 404 Not Found
```

#### Analytics
```
GET /api/leaderboard
Response: [{ name, matricNumber, department, level, score, avatar }]
Status: 200 OK

GET /api/performance
Response: [{ matricNumber, name, department, performance: [...] }]
Status: 200 OK
```

#### Seeding
```
POST /api/seed
Response: { message: "Seeded successfully" }
Status: 200 OK
```

### 4.2 Error Handling
All endpoints use centralized error handling middleware:
```javascript
{
  status: Number,
  message: String,
  isOperational: Boolean
}
```

---

## 5. Frontend Design

### 5.1 Component Architecture

```
App (Root)
├── Router
│   ├── LoginPage
│   ├── HomePage
│   ├── QuizPage
│   │   ├── QuizHeader (Timer, Flag, Subject)
│   │   ├── QuestionDisplay
│   │   ├── OptionButtons
│   │   ├── QuizSidebar (Navigator)
│   │   └── QuizFooter (Prev, Next, Submit)
│   ├── ResultPage
│   ├── PerformancePage
│   ├── LeaderboardPage
│   └── ProfilePage
└── Navigation (Bottom Nav Bar)
```

### 5.2 State Management
```javascript
AppState = {
  user: Object | null,
  currentPage: String,
  quizzes: Array,
  currentQuiz: Object | null,
  currentQuestionIndex: Number,
  score: Number,
  answers: Object,
  timer: Number,
  flaggedQuestions: Set,
  selectedOption: Number | null,
  showExplanation: Boolean,
  timerInterval: Number | null
}
```

### 5.3 Routing System
Client-side routing using hash-based navigation:
- `#login` → LoginPage
- `#home` → HomePage
- `#quiz` → QuizPage
- `#result` → ResultPage
- `#performance` → PerformancePage
- `#leaderboard` → LeaderboardPage
- `#profile` → ProfilePage

### 5.4 Storage Strategy
**Local Storage**:
- `user`: User object (persistent login)
- `currentPage`: Last visited page
- `quizProgress`: Active quiz state (auto-save)

**Session Storage**: Not used (all in localStorage for persistence)

---

## 6. Security Design

### 6.1 Authentication
- **Matric Number Validation**: Server-side check against authorized database
- **Session Management**: User object stored in localStorage
- **Auto-logout**: Clear session on explicit logout

### 6.2 Authorization
- **Access Control**: Only authorized matric numbers can login
- **Student Database**: Seeded from `studentData.js` on server startup
- **Unauthorized Removal**: Deleted from database during seeding

### 6.3 Data Protection
- **Environment Variables**: Sensitive credentials in `.env`
- **HTTPS**: Enforced in production (Render)
- **CORS**: Configured for allowed origins

### 6.4 Input Validation
- **Client-side**: Form validation before submission
- **Server-side**: Mongoose schema validation
- **Sanitization**: Trim whitespace, validate types

---

## 7. Performance Optimization

### 7.1 Frontend Optimization
- **Lazy Loading**: Load quiz data only when needed
- **Local Caching**: Store quiz progress locally
- **Debouncing**: Auto-save with 5-second intervals
- **Minification**: (Future) Minify CSS/JS for production

### 7.2 Backend Optimization
- **Database Indexing**: Fast lookups on matricNumber and subject
- **Query Optimization**: Select only required fields
- **Connection Pooling**: MongoDB driver handles connection reuse

### 7.3 Network Optimization
- **Compression**: (Future) Gzip compression
- **CDN**: (Future) Static asset delivery via CDN

---

## 8. Deployment Architecture

### 8.1 Development Environment
```
Local Machine
├── MongoDB (Local instance or Atlas)
├── Node.js Server (Port 5000)
└── Client (Served via Express static)
```

### 8.2 Production Environment
```
Render (Cloud Platform)
├── Web Service (Auto-deploy from GitHub)
├── Environment Variables (Secure storage)
└── MongoDB Atlas (Cloud database)
```

### 8.3 CI/CD Pipeline
```
Developer → Git Commit → GitHub Push → Render Webhook → Auto-Deploy
```

---

## 9. Scalability Considerations

### 9.1 Horizontal Scaling
- **Stateless Server**: No session storage on server
- **Load Balancing**: (Future) Multiple server instances

### 9.2 Vertical Scaling
- **Database**: MongoDB Atlas auto-scaling
- **Server**: Render auto-scaling based on traffic

### 9.3 Caching Strategy
- **Client-side**: LocalStorage for quiz progress
- **Server-side**: (Future) Redis for session management

---

## 10. Monitoring and Logging

### 10.1 Error Logging
- **Server Errors**: Console logging with timestamps
- **Client Errors**: (Future) Error tracking service

### 10.2 Performance Monitoring
- **Render Dashboard**: Server metrics
- **MongoDB Atlas**: Database performance metrics

---

## 11. Design Patterns Used

### 11.1 Architectural Patterns
- **MVC (Model-View-Controller)**: Separation of concerns
- **Repository Pattern**: Data access abstraction (Mongoose)
- **Singleton Pattern**: AppState management

### 11.2 Code Patterns
- **Module Pattern**: Encapsulation of functionality
- **Observer Pattern**: Event-driven UI updates
- **Factory Pattern**: Component rendering functions

---

## 12. Future Enhancements

### 12.1 Planned Features
- **Real-time Leaderboard**: WebSocket integration
- **Admin Dashboard**: Quiz management interface
- **Analytics Dashboard**: Advanced performance metrics
- **Mobile App**: React Native version

### 12.2 Technical Improvements
- **TypeScript**: Type safety
- **Testing**: Unit and integration tests
- **Docker**: Containerization
- **Microservices**: Service decomposition

---

## Appendix A: Database Schema Diagrams
See ER diagrams in `/docs/diagrams/` folder.

## Appendix B: API Documentation
Full API documentation available at `/docs/API.md`.

## Appendix C: UI/UX Mockups
Design mockups available in `/docs/mockups/` folder.
