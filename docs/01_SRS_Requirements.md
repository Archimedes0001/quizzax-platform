# Software Requirements Specification (SRS)
## Quizzax Assessment Platform

**Version:** 1.0  
**Date:** January 15, 2026  
**Prepared by:** Development Team

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for the Quizzax Assessment Platform, a web-based quiz management system designed for engineering students.

### 1.2 Scope
The Quizzax Assessment Platform is a comprehensive online assessment system that:
- Provides secure student authentication
- Delivers randomized engineering quizzes
- Tracks student performance across multiple attempts
- Generates detailed performance analytics
- Supports multiple engineering disciplines

### 1.3 Naming Convention
The name **"Quizzax"** is derived from a technical portmanteau of **"Quiz"** and **"Syntax"**.
- **Quiz**: Represents the core assessment functionality.
- **Syntax**: Represents the code-based, structural precision of the MERN stack architecture.
- **-ax Suffix**: Also alludes to "Parallax" (multi-angle learning) and "Maximize" (maximizing student potential).
- **Full Meaning**: **"Quiz Automation & eXcellence"**.

### 1.4 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **UI**: User Interface
- **CA**: Continuous Assessment
- **MERN**: MongoDB, Express.js, React (vanilla JS), Node.js

### 1.4 References
- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- MongoDB Documentation
- Express.js Documentation
- Node.js Documentation

---

## 2. Overall Description

### 2.1 Product Perspective
The Quizzax Assessment Platform is a standalone web application that operates in a client-server architecture:
- **Frontend**: Vanilla JavaScript SPA (Single Page Application)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Hosting**: Render (Production), Local (Development)

### 2.2 Product Functions
1. **User Authentication**
   - Secure login with matric number validation
   - Session management with persistence
   - Automatic logout on session expiry

2. **Quiz Management**
   - Random selection of 50 questions per quiz
   - Multiple quiz subjects (Engineering Mathematics, Fluid Mechanics, etc.)
   - Timer-based quiz sessions (15 minutes)
   - Question flagging for review

3. **Performance Tracking**
   - Individual quiz attempt history
   - CA1, CA2, CA3... tracking per subject
   - Average score calculation
   - Department-wide performance analytics

4. **Student Management**
   - Authorized student database (200+ students)
   - Department categorization
   - Real-time student list viewing

### 2.3 User Classes and Characteristics
1. **Students** (Primary Users)
   - Engineering students (100 Level)
   - Technical proficiency: Basic to Intermediate
   - Access: Quiz taking, performance viewing

2. **Administrator** (Secondary User)
   - System management access
   - Student database management
   - Quiz content management

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome, Firefox, Edge, Safari)
- **Server**: Node.js v14+ runtime
- **Database**: MongoDB Atlas (Cloud-hosted)
- **Network**: Internet connection required

### 2.5 Design and Implementation Constraints
- Must support 200+ concurrent users
- Mobile-responsive design required
- Session persistence across page refreshes
- Maximum quiz time: 15 minutes
- Questions must be randomized per attempt

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR1: User Authentication
- **FR1.1**: System shall validate matric numbers against authorized student database
- **FR1.2**: System shall reject unauthorized matric numbers with error message
- **FR1.3**: System shall create user session upon successful login
- **FR1.4**: System shall persist user session in local storage
- **FR1.5**: System shall display user name and department after login

#### FR2: Quiz Delivery
- **FR2.1**: System shall randomly select 50 questions from quiz pool
- **FR2.2**: System shall display one question at a time
- **FR2.3**: System shall provide 4 multiple-choice options per question
- **FR2.4**: System shall allow students to flag questions for review
- **FR2.5**: System shall enable navigation between questions
- **FR2.6**: System shall display question counter (e.g., "Question 5 of 50")

#### FR3: Timer Management
- **FR3.1**: System shall start 15-minute timer when quiz begins
- **FR3.2**: System shall display remaining time in MM:SS format
- **FR3.3**: System shall show warning when time < 60 seconds
- **FR3.4**: System shall auto-submit quiz when timer reaches 00:00
- **FR3.5**: System shall persist timer state across page refreshes

#### FR4: Answer Submission
- **FR4.1**: System shall allow students to select one answer per question
- **FR4.2**: System shall save answers in real-time to local storage
- **FR4.3**: System shall sync answers to server every 5 seconds
- **FR4.4**: System shall display submission confirmation modal
- **FR4.5**: System shall show answered/unanswered question counts before submission

#### FR5: Performance Tracking
- **FR5.1**: System shall calculate score as (correct answers / total questions) × 100
- **FR5.2**: System shall store each quiz attempt with timestamp
- **FR5.3**: System shall label attempts as CA1, CA2, CA3, etc.
- **FR5.4**: System shall calculate average score per subject
- **FR5.5**: System shall display performance history in tabular format

#### FR6: Student Management
- **FR6.1**: System shall maintain authorized student database
- **FR6.2**: System shall categorize students by department
- **FR6.3**: System shall display student list with avatars
- **FR6.4**: System shall show only students who have taken quizzes in performance page

### 3.2 Non-Functional Requirements

#### NFR1: Performance
- **NFR1.1**: Page load time shall not exceed 3 seconds
- **NFR1.2**: Quiz question navigation shall respond within 200ms
- **NFR1.3**: System shall support 200+ concurrent users
- **NFR1.4**: Database queries shall complete within 1 second

#### NFR2: Usability
- **NFR2.1**: Interface shall be intuitive for first-time users
- **NFR2.2**: System shall be fully responsive (mobile, tablet, desktop)
- **NFR2.3**: Error messages shall be clear and actionable
- **NFR2.4**: Navigation shall be consistent across all pages

#### NFR3: Reliability
- **NFR3.1**: System uptime shall be 99.5% or higher
- **NFR3.2**: Quiz progress shall never be lost due to page refresh
- **NFR3.3**: System shall auto-save quiz state every 5 seconds
- **NFR3.4**: Database backups shall occur daily

#### NFR4: Security
- **NFR4.1**: Only authorized matric numbers shall access the system
- **NFR4.2**: User sessions shall expire after 24 hours of inactivity
- **NFR4.3**: Environment variables shall store sensitive credentials
- **NFR4.4**: HTTPS shall be enforced in production

#### NFR5: Maintainability
- **NFR5.1**: Code shall follow consistent style guidelines
- **NFR5.2**: Functions shall be modular and reusable
- **NFR5.3**: Database schema shall support easy modifications
- **NFR5.4**: System shall log errors for debugging

#### NFR6: Scalability
- **NFR6.1**: System shall support addition of new quiz subjects
- **NFR6.2**: Student database shall accommodate 500+ students
- **NFR6.3**: Quiz question pool shall support 1000+ questions per subject

---

## 4. System Features

### 4.1 Login Page
**Description**: Secure authentication interface  
**Priority**: High  
**Functional Requirements**: FR1.1 - FR1.5

### 4.2 Home Page (Quiz Selection)
**Description**: Dashboard displaying available quizzes  
**Priority**: High  
**Functional Requirements**: FR2.1

### 4.3 Quiz Page
**Description**: Interactive quiz-taking interface  
**Priority**: High  
**Functional Requirements**: FR2.1 - FR4.5

### 4.4 Result Page
**Description**: Quiz score display with detailed breakdown  
**Priority**: Medium  
**Functional Requirements**: FR5.1

### 4.5 Performance Page
**Description**: Historical performance analytics  
**Priority**: Medium  
**Functional Requirements**: FR5.1 - FR5.5

### 4.6 Student List Page
**Description**: Directory of all students  
**Priority**: Low  
**Functional Requirements**: FR6.1 - FR6.4

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- **Login Screen**: Single input field for matric number
- **Quiz Interface**: Question display, options, navigation buttons, timer
- **Performance Dashboard**: Tabular data with CA scores
- **Navigation**: Floating bottom navigation bar with icons

### 5.2 Hardware Interfaces
- **Client Device**: Any device with modern web browser
- **Network**: Stable internet connection (minimum 1 Mbps)

### 5.3 Software Interfaces
- **MongoDB Atlas**: Cloud database service
- **Render**: Cloud hosting platform
- **GitHub**: Version control and CI/CD

### 5.4 Communications Interfaces
- **HTTP/HTTPS**: RESTful API communication
- **WebSocket**: (Future) Real-time updates

---

## 6. Other Requirements

### 6.1 Database Requirements
- **Users Collection**: Store student data, quiz history, active sessions
- **Quizzes Collection**: Store quiz subjects, questions, answers, explanations

### 6.2 Legal Requirements
- **Data Privacy**: Comply with student data protection regulations
- **Academic Integrity**: Prevent cheating through randomization

---

## Appendix A: Glossary
- **Matric Number**: Unique student identifier (e.g., U24ICE1001)
- **CA**: Continuous Assessment quiz attempt
- **Session Persistence**: Maintaining quiz state across page reloads

## Appendix B: Analysis Models
See System Design Document for UML diagrams and data flow diagrams.
