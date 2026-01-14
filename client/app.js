// ========== APP STATE ==========
const AppState = {
    currentPage: 'login',
    user: null,
    quizzes: [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    selectedOption: null,
    showExplanation: false,
    score: 0,
    answers: {},
    leaderboardData: [],
    timer: 0,
    timerInterval: null
};

// ========== TOAST NOTIFICATION SYSTEM ==========
function showToast(message, type = 'error') {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Choose icon
    const icon = type === 'success' ? Icons.CheckCircleSmall : Icons.XCircle;

    toast.innerHTML = `
        ${icon}
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// ========== API UTILITIES ==========
const API = {
    baseURL: '/api',

    async request(endpoint, options = {}) {
        try {
            const res = await fetch(`${this.baseURL}${endpoint}`, options);

            // Try to parse JSON
            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = { message: await res.text() };
            }

            if (!res.ok) {
                // Throw error with server message or default
                throw new Error(data.message || data.error || `Error ${res.status}: ${res.statusText}`);
            }

            return data;
        } catch (error) {
            // Network errors or other fetch issues
            console.error(`API Error (${endpoint}):`, error);
            throw error; // Re-throw to be handled by caller
        }
    },

    async login(matricNumber, department, level) {
        return this.request('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricNumber, department, level })
        });
    },

    async getQuizzes() {
        return this.request('/quizzes');
    },

    async getQuiz(subject) {
        return this.request(`/quizzes/${subject}`);
    },

    async submitQuiz(matricNumber, subject, score, totalQuestions) {
        return this.request('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricNumber, subject, score, totalQuestions })
        });
    },

    async saveProgress(matricNumber, sessionData) {
        return this.request('/save-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricNumber, sessionData })
        });
    },

    async getLeaderboard() {
        return this.request('/leaderboard');
    },

    async getPerformance() {
        return this.request('/performance');
    }
};

// ========== ROUTER ==========
const Router = {
    navigate(page, data = {}) {
        AppState.currentPage = page;
        Storage.savePage(page);

        // Reset quiz state when navigating away from quiz
        if (page !== 'quiz') {
            AppState.currentQuiz = null;
            AppState.currentQuestionIndex = 0;
            AppState.selectedOption = null;
            AppState.showExplanation = false;
            AppState.score = 0;
            AppState.answers = {};
            if (AppState.timerInterval) clearInterval(AppState.timerInterval);
        }

        // Store any navigation data
        if (data.subject) AppState.currentSubject = data.subject;
        if (data.resultData) AppState.resultData = data.resultData;

        // Fetch data for specific pages
        if (page === 'leaderboard') loadLeaderboard();
        if (page === 'performance') loadPerformance();

        render();
    }
};

// ========== LOCAL STORAGE ==========
const Storage = {
    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    clearUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('currentPage');
    },

    savePage(page) {
        localStorage.setItem('currentPage', page);
    },

    getPage() {
        return localStorage.getItem('currentPage');
    }
};

// ========== ICON COMPONENTS ==========
const Icons = {
    // Subject Icons
    Box: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',

    Atom: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"></path><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"></path></svg>',

    FlaskConical: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path><path d="M8.5 2h7"></path><path d="M7 16h10"></path></svg>',

    Calculator: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="14.01"></line><line x1="12" y1="14" x2="12" y2="14.01"></line><line x1="8" y1="14" x2="8" y2="14.01"></line><line x1="16" y1="18" x2="16" y2="18.01"></line><line x1="12" y1="18" x2="12" y2="18.01"></line><line x1="8" y1="18" x2="8" y2="18.01"></line></svg>',

    // Navigation Icons
    Home: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',

    BarChart: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',

    Heart: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',

    User: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',

    // Other Icons
    ChevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',

    Search: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',

    CheckCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',

    CheckCircleSmall: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',

    XCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',

    Share: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>',

    Flag: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>',

    // New Icons for Navigation
    Users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',

    Activity: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',

    Spinner: '<svg class="spinner spin" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'
};

// ========== HELPER: PERSISTENCE ==========
function triggerSave() {
    if (!AppState.user || !AppState.currentQuiz) return;

    // Convert Set to Array for storage
    const flaggedArr = AppState.flaggedQuestions ? Array.from(AppState.flaggedQuestions) : [];

    const sessionData = {
        subject: AppState.currentQuiz.subject,
        currentQuestionIndex: AppState.currentQuestionIndex,
        score: AppState.score,
        answers: AppState.answers,
        timer: AppState.timer,
        flaggedQuestions: flaggedArr
    };

    API.saveProgress(AppState.user.matricNumber, sessionData);
}

function checkResumeSession(user) {
    if (user.activeSession && user.activeSession.subject) {
        const { subject, currentQuestionIndex, score, answers, timer, flaggedQuestions } = user.activeSession;

        if (confirm(`You have an unfinished ${subject} quiz. Do you want to resume?`)) {
            restoreSession(subject, { currentQuestionIndex, score, answers, timer, flaggedQuestions });
            return true;
        }
    }
    return false;
}

async function restoreSession(subject, sessionData) {
    try {
        const quizData = await API.getQuiz(subject);
        AppState.currentQuiz = quizData;
        AppState.currentQuestionIndex = sessionData.currentQuestionIndex || 0;
        AppState.score = sessionData.score || 0;
        AppState.answers = sessionData.answers || {};
        AppState.timer = sessionData.timer || 900;
        AppState.flaggedQuestions = new Set(sessionData.flaggedQuestions || []);

        AppState.selectedOption = null;
        AppState.showExplanation = false;

        // Restart Timer
        if (AppState.timerInterval) clearInterval(AppState.timerInterval);
        AppState.timerInterval = setInterval(() => {
            AppState.timer--;
            // Simple timer logic (duplicated)
            const minutes = Math.floor(AppState.timer / 60);
            const seconds = AppState.timer % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            const badge = document.querySelector('.timer-badge');
            if (badge) {
                badge.textContent = timeString;
                if (AppState.timer < 60) badge.classList.add('warning');
            }

            if (AppState.timer % 30 === 0) triggerSave(); // Periodic save

            if (AppState.timer <= 0) {
                clearInterval(AppState.timerInterval);
                showToast("Time's up! Submitting quiz.", 'error');
                submitQuiz();
            }
        }, 1000);

        Router.navigate('quiz', { subject });
        triggerSave();
    } catch (err) {
        showToast("Failed to resume session: " + err.message, 'error');
    }
}

// Icon mapping
const iconMap = {
    'Engineering Mathematics': Icons.Calculator,
    'Fluid Mechanics': Icons.FlaskConical,
    'Applied Electricity': Icons.Atom,
    'Computer and Software Engineering': Icons.Box
};

// ========== PAGE COMPONENTS ==========

// RESTORE LOGO HELPER
function PageLogo() {
    return `
        <div class="logo-container" style="padding-top: 1rem; margin-bottom: 0px; display: flex; justify-content: center;">
            <img src="./logo.png" alt="Logo" class="app-logo" style="height: 90px; width: auto;" />
        </div>
    `;
}

// LOGIN PAGE
function LoginPage() {
    return `
        <div class="container container-login">
            <div class="login-page-refined fade-in">
                <div class="login-logo-container">
                    <img src="/logo.png" alt="Logo" class="login-logo" />
                </div>

                <div class="login-form-refined">
                    <h1 class="login-title">Hello,</h1>
                    <p class="login-subtitle">Sign in to start.</p>

                    <form id="loginForm">
                        <div class="form-group-refined">
                            <label>Matric Number</label>
                            <input
                                type="text"
                                id="matricNumber"
                                class="login-input"
                                placeholder="e.g. 19/SCI01/001"
                                required
                            />
                        </div>

                        <div class="form-group-refined">
                            <label>Department</label>
                            <input
                                type="text"
                                id="department"
                                class="login-input"
                                placeholder="e.g. Computer Science"
                                required
                            />
                        </div>

                        <div class="form-group-refined">
                            <label>Level</label>
                            <input
                                type="text"
                                id="level"
                                class="login-input"
                                placeholder="e.g. 100L"
                                required
                            />
                        </div>

                        <button type="submit" class="btn-login-refined" id="loginButton">
                            <span id="loginText">Sign In</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// HOME PAGE
function HomePage() {
    const user = AppState.user;

    return `
        <div class="container container-wide">
            ${PageLogo()}
            <div class="home-page fade-in" style="padding-top: 0;">
                <div class="home-header" style="margin-top: 0.5rem;">
                    <div class="user-info" style="margin-bottom: 2rem;">
                        <p style="color: var(--text-muted); margin: 0; font-size: 0.875rem;">Hello,</p>
                        <h2 style="font-size: 1.5rem; margin: 0; font-weight: 700; color: white;">${AppState.user ? AppState.user.matricNumber : 'Guest'}</h2>
                    </div>

                    <h1 class="home-title" style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">Select Course</h1>
                    
                    <div class="search-container scale-in">
                        ${Icons.Search}
                        <input 
                            type="text" 
                            id="courseSearch"
                            class="search-input" 
                            placeholder="Search here"
                        />
                    </div>
                </div>
                
                <div class="quiz-grid">
                    ${AppState.quizzes.map((quiz, i) => {
        const icon = iconMap[quiz.icon] || Icons.Box;
        const cardClass = i % 2 === 0 ? 'dark' : 'light';
        return `
                            <div class="quiz-card ${cardClass} scale-in" onclick="navigateToQuiz('${quiz.subject}')" style="animation-delay: ${i * 0.1}s;">
                                ${icon}
                                <h3>${quiz.subject}</h3>
                            </div>
                        `;
    }).join('')}
                </div>
            </div>
            ${BottomNav()}
        </div>
    `;
}

// RESULT PAGE
function ResultPage() {
    const data = AppState.resultData;
    if (!data) return '<div class="container"><div style="padding: 2rem;">No result data.</div></div>';

    const { score, total, subject } = data;
    const percentage = Math.round((score / total) * 100);

    return `
        <div class="container container-wide">
            ${PageLogo()}
            <div class="result-page-refined fade-in">
                <div class="internal-header" style="margin-bottom: 1.5rem; width: 100%;">
                    <button class="back-button-white" onclick="Router.navigate('home')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <h1 style="color: white; margin: 0; font-size: 1.5rem; font-weight: 700;">Result</h1>
                </div>

                <div class="result-card-premium scale-in">
                    <div class="result-icon-lg">
                        ${Icons.CheckCircle}
                    </div>

                    <h1 class="result-title-main">Quiz Completed!</h1>
                    <p class="result-subject-tag">${subject}</p>

                    <div class="result-stats-refined">
                        <div class="result-stat-card">
                            <span class="result-stat-label">Score</span>
                            <span class="result-stat-value">${score}/${total}</span>
                        </div>
                        <div class="result-stat-card">
                            <span class="result-stat-label">Accuracy</span>
                            <span class="result-stat-value">${percentage}%</span>
                        </div>
                    </div>

                    <div class="result-history-summary">
                        <span class="history-text-sm">Your attempts are recorded.</span>
                        <div class="history-item-row">
                            <span class="history-item-label">Current Attempt</span>
                            <span class="history-item-pts">${score} pts</span>
                        </div>
                    </div>

                    <button class="btn-result-home" onclick="Router.navigate('home')">
                        ${Icons.Home}
                        Back Home
                    </button>
                </div>
            </div>
            ${BottomNav()}
        </div>
    `;
}

// PROFILE PAGE
function ProfilePage() {
    const user = AppState.user;

    // Calculate total score and quizzes taken
    const totalScore = user.history ? user.history.reduce((acc, curr) => acc + curr.score, 0) : 0;
    const quizzesTaken = user.history ? user.history.length : 0;

    return `
        <div class="container container-wide">
            ${PageLogo()}
            <div class="profile-page-refined fade-in">
                <div class="internal-header" style="margin-bottom: 1.5rem;">
                    <button class="back-button-white" onclick="Router.navigate('home')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                </div>

                <div class="profile-header-new">
                    <div class="profile-avatar-circle">
                        ${Icons.User}
                    </div>
                    <div class="profile-title-group">
                        <h1 class="profile-name-bold">${user.name || 'Student'}</h1>
                        <span class="profile-badge-pill">Student</span>
                    </div>
                </div>

                <div class="profile-stats-grid">
                    <div class="profile-stat-unit">
                        <span class="profile-stat-val">${user.level || '400L'}</span>
                        <span class="profile-stat-lbl">Level</span>
                    </div>
                    <div class="profile-stat-divider"></div>
                    <div class="profile-stat-unit">
                        <span class="profile-stat-val">${quizzesTaken}</span>
                        <span class="profile-stat-lbl">Quizzes</span>
                    </div>
                    <div class="profile-stat-divider"></div>
                    <div class="profile-stat-unit">
                        <span class="profile-stat-val">${totalScore}</span>
                        <span class="profile-stat-lbl">Points</span>
                    </div>
                </div>

                <div class="profile-info-blocks">
                    <div class="info-block-item">
                        <div class="info-icon-sq">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div class="info-text-pair">
                            <span class="info-label-tiny">Matric Number</span>
                            <span class="info-value-med">${user.matricNumber}</span>
                        </div>
                    </div>

                    <div class="info-block-item">
                        <div class="info-icon-sq">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10v6" /><path d="M22 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l20-12v6Z" /><path d="M6 10V2H4v8zM20 10V2h2v8z" /></svg>
                        </div>
                        <div class="info-text-pair">
                            <span class="info-label-tiny">Department</span>
                            <span class="info-value-med">${user.department}</span>
                        </div>
                    </div>
                </div>
                <button class="logout-btn-fancy" onclick="handleLogout()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Log Out
                </button>
            </div>
            ${BottomNav()}
        </div>
    `;
}

// QUIZ PAGE with TIMER
function QuizPage() {
    const quiz = AppState.currentQuiz;
    if (!quiz) return '<div class="container"><div style="padding: 2rem; text-align: center;">Loading...</div></div>';

    const currentQuestion = quiz.questions[AppState.currentQuestionIndex];
    const isLastQuestion = AppState.currentQuestionIndex === quiz.questions.length - 1;

    // Format timer
    const minutes = Math.floor(AppState.timer / 60);
    const seconds = AppState.timer % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const isFlagged = AppState.flaggedQuestions ? AppState.flaggedQuestions.has(AppState.currentQuestionIndex) : false;

    // Generate Navigator HTML Grid
    const navigatorHTML = quiz.questions.map((q, i) => {
        let classes = 'nav-cell';
        if (i === AppState.currentQuestionIndex) classes += ' current';

        // Check answered state
        const answer = AppState.answers[i];
        if (answer && answer.selected !== null) classes += ' answered';

        if (AppState.flaggedQuestions && AppState.flaggedQuestions.has(i)) classes += ' flagged';

        return `<div class="${classes}" onclick="jumpToQuestion(${i})">${i + 1}</div>`;
    }).join('');

    return `
        <div class="container container-wide">
            <div class="quiz-page">
                <div class="quiz-layout">
                    <!-- Sidebar Navigator -->
                    <div class="quiz-sidebar">
                        <h3 class="sidebar-title">Questions</h3>
                        <div class="nav-legend">
                            <div class="legend-item"><span class="legend-dot current"></span> Current</div>
                            <div class="legend-item"><span class="legend-dot answered"></span> Done</div>
                            <div class="legend-item"><span class="legend-dot flagged"></span> Flag</div>
                        </div>
                        <div class="nav-grid">
                            ${navigatorHTML}
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="quiz-main">
                        <div class="quiz-header" style="flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-bottom: 2.5rem;">
                            <div style="display: flex; gap: 1.5rem; align-items: center;">
                                <div class="timer-badge ${AppState.timer < 60 ? 'warning' : ''}" style="font-size: 1.25rem; font-weight: 700; background: transparent; padding: 0;">
                                    ${timeString}
                                </div>
                                <button class="flag-btn ${isFlagged ? 'active' : ''}" onclick="toggleFlag()" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem 1rem; color: #94a3b8;">
                                    ${Icons.Flag}
                                    <span style="font-size: 0.875rem; font-weight: 500;">Flag</span>
                                </button>
                            </div>

                            <div class="quiz-info-block">
                                <div class="subject-tag" style="font-size: 1rem; font-weight: 600; color: #3b82f6; margin-bottom: 0.5rem;">${quiz.subject}</div>
                                <h1 class="question-text" style="font-size: 1.75rem; font-weight: 700; color: white; margin: 0; line-height: 1.3;">${currentQuestion.questionText}</h1>
                            </div>
                        </div>

                        <div class="quiz-content" style="margin-bottom: 3rem;">
                            ${currentQuestion.image ? `
                                <div class="question-image-container" style="margin-bottom: 2rem;">
                                    <img src="${currentQuestion.image}" alt="Question Diagram" style="width: 100%; border-radius: 1rem;">
                                </div>
                            ` : ''}

                            <div class="options-container" style="display: flex; flex-direction: column; gap: 0.75rem;">
                                ${currentQuestion.options.map((option, idx) => {
        let className = 'option-block-refined';
        if (AppState.showExplanation) {
            if (idx === currentQuestion.correctOption) className += ' correct';
            else if (idx === AppState.selectedOption) className += ' incorrect';
        } else if (AppState.selectedOption === idx) {
            className += ' selected';
        }

        return `
                                    <button class="${className}" onclick="selectOption(${idx})" ${AppState.showExplanation ? 'disabled' : ''}>
                                        <span class="option-letter-refined">${String.fromCharCode(65 + idx)}.</span>
                                        <span class="option-text-refined">${option}</span>
                                    </button>
                                `;
    }).join('')}
                            </div>
                        </div>

                        <div class="quiz-controls-refined" style="display: flex; gap: 1rem; align-items: center;">
                            <button class="btn-nav-simple" onclick="handlePrev()" ${AppState.currentQuestionIndex === 0 ? 'disabled' : ''}>
                                Prev
                            </button>
                            <button class="btn-nav-simple" onclick="handleNextSequential()" ${isLastQuestion ? 'disabled' : ''}>
                                Next
                            </button>
                            <button class="btn-primary-refined" onclick="handleNext()" style="padding: 0.75rem 2rem; border-radius: 999px; background: #3b82f6; color: white; border: none; font-weight: 600; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); cursor: pointer;">
                                ${AppState.showExplanation ? (isLastQuestion ? 'Finish' : 'Next Question') : 'Check Answer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// STUDENT LIST PAGE (Replaces Leaderboard)
function LeaderboardPage() {
    const users = AppState.leaderboardData;

    return `
        <div class="container container-wide">
            ${PageLogo()}
            <div class="leaderboard-page fade-in">
                <div class="internal-header">
                    <button class="back-button-white" onclick="Router.navigate('home')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <h1>Student List</h1>
                </div>

                <div class="leaderboard-list" style="display: flex; flex-direction: column; gap: 0.75rem; padding: 0 0.5rem 8rem 0.5rem;">
                    ${users.length === 0 ? '<div style="text-align:center; opacity:0.6; padding: 2rem;">No students found</div>' : ''}
                    ${users.map((user, i) => {
        const avatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.matricNumber}`;
        return `
                        <div class="leaderboard-item-refined">
                            <img src="${avatar}" class="leaderboard-avatar-lg" alt="avatar" />
                            <div class="leaderboard-info-refined">
                                <h4 style="margin: 0; color: white; font-size: 1.125rem; font-weight: 700;">${user.matricNumber}</h4>
                                <p style="margin: 2px 0 0 0; color: #64748b; font-size: 0.875rem; font-weight: 500;">
                                    ${user.department} • ${user.level}
                                </p>
                            </div>
                        </div>
                    `;
    }).join('')}
                </div>
                ${BottomNav()}
            </div>
        </div>
    `;
}

// PERFORMANCE PAGE
function PerformancePage() {
    const report = AppState.performanceData || [];

    return `
        <div class="container container-wide">
            ${PageLogo()}
            <div class="performance-page fade-in">
                <div class="internal-header">
                    <button class="back-button-white" onclick="Router.navigate('home')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <h1>Performance</h1>
                </div>

                <div class="performance-list" style="padding: 0 1rem 8rem 1rem;">
                    ${report.length === 0 ? '<div style="text-align:center; opacity:0.6; padding: 2rem;">No data available</div>' : ''}
                    ${report.map(student => {
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.matricNumber}`;

        return `
            <div class="student-performance-card" style="margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <img src="${avatar}" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid var(--primary);" alt="avatar" />
                    <div>
                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: white;">${student.name}</h4>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--text-muted);">${student.matricNumber}</p>
                    </div>
                </div>

                ${student.performance.length > 0 ? `
                    <div class="performance-table-container" style="background: rgba(30, 41, 59, 0.4); border-radius: 1rem; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05);">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                    <th style="text-align: left; padding: 1rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Subject</th>
                                    <th style="padding: 1rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Attempts</th>
                                    <th style="text-align: right; padding: 1rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Avg (CA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${student.performance.map(p => `
                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                        <td style="padding: 1rem; font-weight: 600; color: white;">${p.subject}</td>
                                        <td style="padding: 1rem; text-align: center;">
                                            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                                                ${p.attempts.map((score, i) => `
                                                    <span style="font-size: 0.875rem; color: #94a3b8;">
                                                        CA${i + 1}: <span style="color: white; font-weight: 600;">${score}</span>
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </td>
                                        <td style="padding: 1rem; text-align: right; font-weight: 700; color: var(--primary);">
                                            ${p.average}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<div style="padding: 1rem; color: var(--text-muted); font-style: italic;">No quiz attempts recorded yet.</div>'}
            </div>
        `;
    }).join('')}
                </div>
                ${BottomNav()}
            </div>
        </div>
    `;
}

// BOTTOM NAVIGATION
function BottomNav() {
    const currentPath = AppState.currentPage;

    const navItems = [
        { icon: 'Home', label: 'Home', path: 'home' },
        { icon: 'Users', label: 'Leaderboard', path: 'leaderboard' },
        { icon: 'Activity', label: 'Performance', path: 'performance' },
        { icon: 'User', label: 'Profile', path: 'profile' }
    ];

    return `
        <div class="bottom-nav">
            ${navItems.map(item => {
        const isActive = currentPath === item.path;
        return `
                    <button class="nav-item ${isActive ? 'active' : ''}" onclick="Router.navigate('${item.path}')">
                        ${Icons[item.icon]}
                        ${isActive ? `<span class="nav-label">${item.label === 'Leaderboard' ? 'Students' : item.label}</span>` : ''}
                    </button>
                `;
    }).join('')
        }
        </div>
    `;
}

// ========== EVENT HANDLERS ==========

async function handleLogin(e) {
    e.preventDefault();

    const matricNumber = document.getElementById('matricNumber').value;
    const department = document.getElementById('department').value;
    const level = document.getElementById('level').value;
    const loginButton = document.getElementById('loginButton');
    const loginText = document.getElementById('loginText');

    loginButton.disabled = true;
    loginText.innerHTML = Icons.Spinner;

    try {
        const data = await API.login(matricNumber, department, level);
        if (data.matricNumber) {
            Storage.saveUser(data);
            AppState.user = data;

            // Load quizzes
            AppState.quizzes = await API.getQuizzes();

            showToast('Login successful', 'success');

            // Check for resume
            if (!checkResumeSession(data)) {
                Router.navigate('home');
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        if (loginButton) {
            loginButton.disabled = false;
            loginText.textContent = 'Sign In';
        }
    }
}

function handleLogout() {
    Storage.clearUser();
    AppState.user = null;
    showToast('Logged out successfully', 'success');
    Router.navigate('login');
}

async function navigateToQuiz(subject) {
    // Confirmation Prompt
    if (!confirm(`Are you sure you want to start the ${subject} quiz?`)) return;

    try {
        const quizData = await API.getQuiz(subject);
        AppState.currentQuiz = quizData;
        AppState.currentQuestionIndex = 0;
        AppState.selectedOption = null;
        AppState.showExplanation = false;
        AppState.score = 0;
        AppState.answers = {}; // Store as object { index: { ... } }
        AppState.flaggedQuestions = new Set(); // Initialize flags

        // Timer Logic
        const calculationSubjects = ['Maths', 'Physics', 'Chemistry'];
        const isCalculation = calculationSubjects.includes(subject);
        AppState.timer = isCalculation ? 20 * 60 : 15 * 60; // seconds

        // Start Timer Interval
        if (AppState.timerInterval) clearInterval(AppState.timerInterval);
        AppState.timerInterval = setInterval(() => {
            AppState.timer--;

            // Update Timer UI
            const minutes = Math.floor(AppState.timer / 60);
            const seconds = AppState.timer % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            const badge = document.querySelector('.timer-badge');
            if (badge) {
                badge.textContent = timeString;
                if (AppState.timer < 60) badge.classList.add('warning');
            }

            if (AppState.timer <= 0) {
                clearInterval(AppState.timerInterval);
                showToast("Time's up! Submitting quiz.", 'error');
                submitQuiz();
            }
        }, 1000);

        Router.navigate('quiz', { subject });
    } catch (err) {
        showToast('Failed to load quiz: ' + err.message, 'error');
    }
}

function toggleFlag() {
    const idx = AppState.currentQuestionIndex;
    if (AppState.flaggedQuestions.has(idx)) {
        AppState.flaggedQuestions.delete(idx);
    } else {
        AppState.flaggedQuestions.add(idx);
    }
    triggerSave();
    render();
}

function jumpToQuestion(index) {
    if (index >= 0 && index < AppState.currentQuiz.questions.length) {
        AppState.currentQuestionIndex = index;

        // Restore state if previously answered
        const prevAnswer = AppState.answers[index];

        if (prevAnswer) {
            AppState.selectedOption = prevAnswer.selected;
            AppState.showExplanation = prevAnswer.selected !== null; // Show if they already committed
        } else {
            AppState.selectedOption = null;
            AppState.showExplanation = false;
        }
        triggerSave();
        render();
    }
}

function selectOption(index) {
    if (AppState.showExplanation) return;
    AppState.selectedOption = index;
    render();
}

function handleNextSequential() {
    if (AppState.currentQuestionIndex < AppState.currentQuiz.questions.length - 1) {
        AppState.currentQuestionIndex++;

        // Restore state
        const nextAnswer = AppState.answers[AppState.currentQuestionIndex];
        if (nextAnswer) {
            AppState.selectedOption = nextAnswer.selected;
            AppState.showExplanation = nextAnswer.selected !== null;
        } else {
            AppState.selectedOption = null;
            AppState.showExplanation = false;
        }

        triggerSave();
        render();
    }
}

function handleNext() {
    if (AppState.showExplanation) {
        // Move to next question or finish
        if (AppState.currentQuestionIndex < AppState.currentQuiz.questions.length - 1) {
            AppState.currentQuestionIndex++;

            // Restore state
            const nextAnswer = AppState.answers[AppState.currentQuestionIndex];
            if (nextAnswer) {
                AppState.selectedOption = nextAnswer.selected;
                AppState.showExplanation = nextAnswer.selected !== null;
            } else {
                AppState.selectedOption = null;
                AppState.showExplanation = false;
            }

            triggerSave();
            render();
        } else {
            submitQuiz();
        }
    } else {
        // Check answer
        if (AppState.selectedOption === null) {
            showToast('Please select an option', 'error');
            return;
        }

        const currentQuestion = AppState.currentQuiz.questions[AppState.currentQuestionIndex];
        const isCorrect = AppState.selectedOption === currentQuestion.correctOption;

        // Save as indexed entry
        AppState.answers[AppState.currentQuestionIndex] = {
            question: currentQuestion.questionText,
            selected: AppState.selectedOption,
            correct: currentQuestion.correctOption,
            isCorrect
        };

        AppState.showExplanation = true;
        triggerSave();
        render();
    }
}

function handlePrev() {
    if (AppState.currentQuestionIndex > 0) {
        AppState.currentQuestionIndex--;

        // Restore state
        const prevAnswer = AppState.answers[AppState.currentQuestionIndex];
        if (prevAnswer) {
            AppState.selectedOption = prevAnswer.selected;
            AppState.showExplanation = prevAnswer.selected !== null;
        } else {
            AppState.selectedOption = null;
            AppState.showExplanation = false;
        }

        triggerSave();
        render();
    }
}

function skipQuestion() {
    const currentQuestion = AppState.currentQuiz.questions[AppState.currentQuestionIndex];

    // Save as skipped
    AppState.answers[AppState.currentQuestionIndex] = {
        question: currentQuestion.questionText,
        selected: null,
        correct: currentQuestion.correctOption,
        isCorrect: false
    };

    if (AppState.currentQuestionIndex < AppState.currentQuiz.questions.length - 1) {
        AppState.currentQuestionIndex++;

        // Check if next exists
        const nextAnswer = AppState.answers[AppState.currentQuestionIndex];
        if (nextAnswer) {
            AppState.selectedOption = nextAnswer.selected;
            AppState.showExplanation = nextAnswer.selected !== null;
        } else {
            AppState.selectedOption = null;
            AppState.showExplanation = false;
        }

        triggerSave();
        render();
    } else {
        submitQuiz();
    }
}

function submitQuiz() {
    const total = AppState.currentQuiz.questions.length;
    const answeredCount = Object.values(AppState.answers).filter(a => a.selected !== null).length;
    const unansweredCount = total - answeredCount;

    AppState.showSubmitConfirm = {
        answered: answeredCount,
        unanswered: unansweredCount,
        total: total
    };
    render();
}

async function confirmSubmit() {
    // Calculate final score dynamically from unique answers
    const finalScore = Object.values(AppState.answers).filter(a => a.isCorrect).length;
    const total = AppState.currentQuiz.questions.length;
    const subject = AppState.currentQuiz.subject;

    AppState.showSubmitConfirm = null;
    render();

    // Clear timer
    if (AppState.timerInterval) clearInterval(AppState.timerInterval);

    showToast('Submitting score...', 'success');

    try {
        await API.submitQuiz(AppState.user.matricNumber, subject, finalScore, total);

        Router.navigate('result', {
            resultData: { score: finalScore, total, subject }
        });
    } catch (err) {
        showToast('Failed to submit score: ' + err.message, 'error');
    }
}

function closeConfirmModal() {
    AppState.showSubmitConfirm = null;
    render();
}


async function loadLeaderboard() {
    try {
        AppState.leaderboardData = await API.getLeaderboard();
        render();
    } catch (err) {
        showToast('Failed to load students: ' + err.message, 'error');
    }
}

async function loadPerformance() {
    try {
        AppState.performanceData = await API.getPerformance();
        render();
    } catch (err) {
        showToast('Failed to load performance data: ' + err.message, 'error');
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.quiz-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========== RENDER FUNCTION ==========
function render() {
    const app = document.getElementById('app');

    // Manage login-active class for clean layout
    if (AppState.currentPage === 'login') {
        document.body.classList.add('login-active');
    } else {
        document.body.classList.remove('login-active');
    }

    let html = '';

    switch (AppState.currentPage) {
        case 'login':
            html = LoginPage();
            break;
        case 'home':
            html = HomePage();
            break;
        case 'quiz':
            html = QuizPage();
            break;
        case 'result':
            html = ResultPage();
            break;
        case 'leaderboard':
            html = LeaderboardPage();
            break;
        case 'profile':
            html = ProfilePage();
            break;
        case 'performance':
            html = PerformancePage();
            break;
        default:
            html = HomePage();
    }

    app.innerHTML = html;

    // Show Modal if needed
    if (AppState.showSubmitConfirm) {
        const { answered, unanswered, total } = AppState.showSubmitConfirm;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fade-in';
        modal.innerHTML = `
            <div class="confirm-modal scale-in">
                <div class="modal-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <h2 class="modal-title">Ready to Submit?</h2>
                <p class="modal-text">Please review your progress before final submission. You can still go back and answer skipped questions.</p>
                
                <div class="stats-summary">
                    <div class="stat-box">
                        <span class="stat-box-val">${answered}</span>
                        <span class="stat-box-label">Answered</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-box-val highlight">${unanswered}</span>
                        <span class="stat-box-label">Left</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-box-val muted">${total}</span>
                        <span class="stat-box-label">Total</span>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-modal-secondary" onclick="closeConfirmModal()">Go Back</button>
                    <button class="btn-modal-primary" onclick="confirmSubmit()">Submit Quiz</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        const existing = document.querySelector('.modal-overlay');
        if (existing) existing.remove();
    }

    // Attach event listeners after render
    attachEventListeners();
}

function attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// ========== INITIALIZATION ==========
async function init() {
    // Check if user is already logged in
    const savedUser = Storage.getUser();

    if (savedUser) {
        AppState.user = savedUser;

        // Load quizzes
        try {
            AppState.quizzes = await API.getQuizzes();
            const lastPage = Storage.getPage();
            Router.navigate(lastPage && lastPage !== 'login' ? lastPage : 'home');
        } catch (err) {
            showToast('Session expired or server error. Please login again.', 'error');
            Storage.clearUser();
            Router.navigate('login');
        }
    } else {
        Router.navigate('login');
    }

    // Pre-load leaderboard data
    if (AppState.user) {
        loadLeaderboard();
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
