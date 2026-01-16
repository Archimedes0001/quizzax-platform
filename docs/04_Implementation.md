# Implementation Guide
## Quizzax Assessment Platform

**Version:** 1.0  
**Date:** January 15, 2026  
**Prepared by:** Development Team

---

## 1. Development Setup

### 1.1 Prerequisites
- Node.js v14 or higher
- npm v6 or higher
- MongoDB Atlas account
- Git installed
- Code editor (VS Code recommended)

### 1.2 Installation Steps

#### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/quiz_app.git
cd quiz_app
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Environment Configuration
Create `.env` file in root directory:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_app
PORT=5000
NODE_ENV=development
```

#### Step 4: Seed Database
```bash
# Start server
npm start

# In another terminal, seed data
curl -X POST http://localhost:5000/api/seed
```

#### Step 5: Access Application
Open browser: `http://localhost:5000`

---

## 2. Project Structure

```
quiz_app/
├── client/                    # Frontend files
│   ├── index.html            # Main HTML file
│   ├── app.js                # Client-side JavaScript
│   ├── styles.css            # Styling
│   └── logo.png              # Application logo
├── server/                    # Backend files
│   ├── index.js              # Express server
│   ├── models/               # Mongoose models
│   │   └── User.js
│   ├── middleware/           # Custom middleware
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   └── utils/                # Utility files
│       ├── AppError.js
│       ├── seedData.js       # Quiz questions
│       └── studentData.js    # Authorized students
├── docs/                      # Documentation
│   ├── 01_SRS_Requirements.md
│   ├── 02_SDD_Design.md
│   ├── 03_TestPlan.md
│   └── 04_Implementation.md
├── .env                       # Environment variables (gitignored)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # Project overview
```

---

## 3. Implementation Details

### 3.1 Backend Implementation

#### Server Setup (`server/index.js`)
```javascript
// Core dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    seedUsers(); // Sync authorized students
  });

// Routes
app.post('/api/login', ...);
app.get('/api/quizzes', ...);
app.get('/api/quizzes/:subject', ...);
app.post('/api/save-progress', ...);
app.post('/api/submit', ...);
app.get('/api/performance', ...);
app.get('/api/leaderboard', ...);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### User Model (`server/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  matricNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, default: '100L' },
  history: [{
    subject: String,
    score: Number,
    totalQuestions: Number,
    attemptDate: { type: Date, default: Date.now }
  }],
  activeSession: {
    subject: String,
    currentQuestionIndex: Number,
    score: Number,
    answers: Object,
    timer: Number,
    flaggedQuestions: [Number],
    lastUpdated: Date
  }
}, { timestamps: true });
```

#### Student Seeding (`server/index.js`)
```javascript
const seedUsers = async () => {
  const authorizedMatricNumbers = students.map(s => s.matricNumber);
  
  // Remove unauthorized users
  await User.deleteMany({ 
    matricNumber: { $nin: authorizedMatricNumbers } 
  });
  
  // Sync authorized students
  for (const student of students) {
    await User.findOneAndUpdate(
      { matricNumber: student.matricNumber },
      { name: student.name, department: student.department },
      { upsert: true, new: true }
    );
  }
};
```

### 3.2 Frontend Implementation

#### Application State (`client/app.js`)
```javascript
const AppState = {
  user: null,
  currentPage: 'login',
  quizzes: [],
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  answers: {},
  timer: 900, // 15 minutes
  flaggedQuestions: new Set(),
  selectedOption: null,
  showExplanation: false,
  timerInterval: null
};
```

#### Router Implementation
```javascript
const Router = {
  navigate(page, params = {}) {
    AppState.currentPage = page;
    Storage.savePage(page);
    window.location.hash = page;
    render();
  }
};

// Hash change listener
window.addEventListener('hashchange', () => {
  const page = window.location.hash.slice(1) || 'login';
  if (page !== AppState.currentPage) {
    Router.navigate(page);
  }
});
```

#### Local Storage Management
```javascript
const Storage = {
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  saveQuizProgress(data) {
    localStorage.setItem('quizProgress', JSON.stringify(data));
  },
  getQuizProgress() {
    const data = localStorage.getItem('quizProgress');
    return data ? JSON.parse(data) : null;
  },
  clearQuizProgress() {
    localStorage.removeItem('quizProgress');
  }
};
```

#### Quiz Session Persistence
```javascript
function triggerSave() {
  if (!AppState.user || !AppState.currentQuiz) return;

  const sessionData = {
    subject: AppState.currentQuiz.subject,
    currentQuestionIndex: AppState.currentQuestionIndex,
    score: AppState.score,
    answers: AppState.answers,
    timer: AppState.timer,
    flaggedQuestions: Array.from(AppState.flaggedQuestions)
  };

  // Instant local backup
  Storage.saveQuizProgress(sessionData);

  // Background server sync
  API.saveProgress(AppState.user.matricNumber, sessionData);
}
```

### 3.3 UI Components

#### Login Page
```javascript
function LoginPage() {
  return `
    <div class="login-page-refined">
      <div class="login-logo-container">
        <img src="/logo.png" alt="Logo" class="login-logo" />
      </div>
      <div class="login-form-refined">
        <h1>Hello,</h1>
        <p>Sign in to start.</p>
        <form id="loginForm">
          <input type="text" id="matricNumber" 
                 placeholder="Enter your Matric Number" required />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  `;
}
```

#### Quiz Page
```javascript
function QuizPage() {
  const quiz = AppState.currentQuiz;
  const question = quiz.questions[AppState.currentQuestionIndex];
  
  return `
    <div class="quiz-container">
      <div class="quiz-header">
        <div class="timer-badge">${formatTime(AppState.timer)}</div>
        <button class="flag-btn" onclick="toggleFlag()">
          ${Icons.Flag}
        </button>
      </div>
      <h2>${quiz.subject}</h2>
      <div class="question-text">${question.questionText}</div>
      <div class="options">
        ${question.options.map((opt, i) => `
          <button class="option-btn ${AppState.selectedOption === i ? 'selected' : ''}"
                  onclick="selectOption(${i})">
            <span class="option-letter">${String.fromCharCode(65 + i)}</span>
            <span class="option-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-footer">
        <button onclick="handlePrev()">Prev</button>
        <button onclick="handleNext()">Next</button>
      </div>
    </div>
  `;
}
```

---

## 4. Key Features Implementation

### 4.1 Authentication
```javascript
async function handleLogin(e) {
  e.preventDefault();
  const matricNumber = document.getElementById('matricNumber').value;
  
  try {
    const data = await API.login(matricNumber);
    Storage.saveUser(data);
    AppState.user = data;
    AppState.quizzes = await API.getQuizzes();
    
    if (!checkResumeSession(data)) {
      Router.navigate('home');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}
```

### 4.2 Quiz Timer
```javascript
function startTimer() {
  AppState.timerInterval = setInterval(() => {
    AppState.timer--;
    updateTimerDisplay();
    
    if (AppState.timer <= 0) {
      clearInterval(AppState.timerInterval);
      showToast("Time's up! Submitting quiz.", 'error');
      submitQuiz();
    }
    
    triggerSave(); // Auto-save every second
  }, 1000);
}
```

### 4.3 Auto-Save
```javascript
// Debounced auto-save (every 5 seconds)
let saveTimeout;
function debouncedSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(triggerSave, 5000);
}
```

### 4.4 Session Restoration
```javascript
async function init() {
  const savedUser = Storage.getUser();
  
  if (savedUser) {
    AppState.user = savedUser;
    
    // Check for local quiz progress
    const localProgress = Storage.getQuizProgress();
    if (localProgress) {
      if (confirm(`Resume your ${localProgress.subject} quiz?`)) {
        await restoreSession(localProgress.subject, localProgress);
        return;
      }
    }
    
    // Check server-side session
    if (checkResumeSession(savedUser)) return;
    
    Router.navigate('home');
  } else {
    Router.navigate('login');
  }
}
```

---

## 5. Database Operations

### 5.1 User Operations
```javascript
// Find or create user (deprecated - now strict validation)
const user = await User.findOne({ matricNumber });

// Update quiz history
user.history.push({ subject, score, totalQuestions });
await user.save();

// Save active session
user.activeSession = sessionData;
await user.save();
```

### 5.2 Quiz Operations
```javascript
// Get all quizzes
const quizzes = await Quiz.find({}, 'subject icon description color');

// Get specific quiz with random questions
const quiz = await Quiz.findOne({ subject });
const shuffled = quiz.questions.sort(() => 0.5 - Math.random());
const selectedQuestions = shuffled.slice(0, 50);
```

---

## 6. Deployment Process

### 6.1 GitHub Setup
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/quiz_app.git
git push -u origin main
```

### 6.2 Render Deployment
1. Create account on Render.com
2. Connect GitHub repository
3. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `NODE_ENV=production`
5. Deploy

### 6.3 MongoDB Atlas Setup
1. Create cluster
2. Create database user
3. Whitelist IP (0.0.0.0/0 for Render)
4. Get connection string
5. Add to `.env`

---

## 7. Maintenance

### 7.1 Adding New Students
1. Edit `server/utils/studentData.js`
2. Add student object:
   ```javascript
   { matricNumber: "U24XXX1234", name: "Name", department: "Dept" }
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Add new student"
   git push origin main
   ```
4. Render auto-deploys and syncs database

### 7.2 Adding New Quiz Questions
1. Edit `server/utils/seedData.js`
2. Add question to appropriate subject:
   ```javascript
   { 
     questionText: "Question?", 
     options: ["A", "B", "C", "D"], 
     correctOption: 1, 
     explanation: "Explanation" 
   }
   ```
3. Re-seed database:
   ```bash
   curl -X POST https://your-app.onrender.com/api/seed
   ```

### 7.3 Removing Students
1. Edit `server/utils/studentData.js`
2. Delete student line
3. Commit and push (same as adding)
4. Server auto-removes from database on restart

---

## 8. Troubleshooting

### 8.1 Common Issues

#### Issue: "Cannot connect to MongoDB"
**Solution**: Check `MONGO_URI` in `.env`, verify network access in MongoDB Atlas

#### Issue: "Quiz progress lost on refresh"
**Solution**: Check browser console for localStorage errors, verify `triggerSave()` is called

#### Issue: "Unauthorized user can login"
**Solution**: Verify `seedUsers()` runs on server start, check `studentData.js`

#### Issue: "Scrollbar flicker on login page"
**Solution**: Verify `login-active` class applied to `<html>` and `<body>`

---

## 9. Best Practices

### 9.1 Code Quality
- Use meaningful variable names
- Comment complex logic
- Follow DRY principle
- Modularize functions

### 9.2 Security
- Never commit `.env` file
- Validate all user inputs
- Use HTTPS in production
- Sanitize database queries

### 9.3 Performance
- Minimize DOM manipulations
- Use debouncing for frequent operations
- Optimize database queries
- Implement caching where appropriate

---

## 10. Future Development

### 10.1 Planned Features
- Admin dashboard for quiz management
- Real-time leaderboard with WebSockets
- Export performance data to CSV
- Email notifications for quiz results

### 10.2 Technical Debt
- Add unit tests (Jest)
- Implement TypeScript
- Add ESLint/Prettier
- Dockerize application

---

**Document Version**: 1.0  
**Last Updated**: January 15, 2026  
**Maintained by**: Development Team
