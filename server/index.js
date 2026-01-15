require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const User = require('./models/User');
const Quiz = require('./models/Quiz');
const AppError = require('./utils/AppError');
const asyncHandler = require('./middleware/asyncHandler');
const errorHandler = require('./middleware/errorHandler');
const students = require('./utils/studentData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB Connected');
        seedUsers(); // Run user sync on connect
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Seeding Function for Users
const seedUsers = async () => {
    try {
        console.log('[Seeding] Synchronizing student database...');

        // Get all authorized matric numbers
        const authorizedMatricNumbers = students.map(s => s.matricNumber);

        // Remove ALL unauthorized users
        const deleteResult = await User.deleteMany({
            matricNumber: { $nin: authorizedMatricNumbers }
        });
        console.log(`[Seeding] Removed ${deleteResult.deletedCount} unauthorized users`);

        // Sync authorized students
        for (const student of students) {
            await User.findOneAndUpdate(
                { matricNumber: student.matricNumber },
                {
                    name: student.name,
                    department: student.department,
                    level: '100L' // Default level
                },
                { upsert: true, new: true }
            );
        }
        console.log(`[Seeding] Synchronized ${students.length} authorized students.`);
    } catch (err) {
        console.error('[Seeding] Error synchronizing students:', err);
    }
};

// ...

// Routes

// 1. Login (Strict validation against student database)
app.post('/api/login', asyncHandler(async (req, res, next) => {
    const { matricNumber } = req.body;
    if (!matricNumber) {
        return next(new AppError('Matric number is required', 400));
    }

    // Find user in the synchronized database
    const user = await User.findOne({ matricNumber });

    if (!user) {
        return next(new AppError('Unauthorized: Matric number not found in student database.', 403));
    }

    console.log(`[Login] Authorized access for: ${user.name} (${user.matricNumber})`);
    res.json(user);
}));

// 2. Get All Quizzes (Subjects)
app.get('/api/quizzes', asyncHandler(async (req, res, next) => {
    const quizzes = await Quiz.find({}, 'subject icon description color');
    res.json(quizzes);
}));

const seedData = require('./utils/seedData');

// ... (previous lines)

// 3. Get Specific Quiz (Random 50 Questions)
app.get('/api/quizzes/:subject', asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findOne({ subject: req.params.subject });
    if (!quiz) return next(new AppError('Quiz not found', 404));

    // Shuffle questions and select top 50
    const shuffled = quiz.questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 50);

    // Create a temporary object to return (don't save to DB)
    const responseQuiz = quiz.toObject();
    responseQuiz.questions = selectedQuestions;

    res.json(responseQuiz);
}));

// 4. Submit Quiz Score
app.post('/api/submit', asyncHandler(async (req, res, next) => {
    const { matricNumber, subject, score, totalQuestions } = req.body;
    // user update
    const user = await User.findOne({ matricNumber });
    if (!user) return next(new AppError('User not found', 404));

    user.history.push({ subject, score, totalQuestions });

    // Clear active session on submit
    user.activeSession = undefined;

    await user.save();

    res.json({ message: "Score saved", history: user.history });
}));

// 4.5 Save Progress (Generic)
app.post('/api/save-progress', asyncHandler(async (req, res, next) => {
    const { matricNumber, sessionData } = req.body;
    const user = await User.findOne({ matricNumber });
    if (!user) return next(new AppError('User not found', 404));

    user.activeSession = {
        ...sessionData,
        lastUpdated: new Date()
    };
    await user.save();
    res.json({ message: "Progress saved" });
}));

// 5. Get Leaderboard (Student List)
app.get('/api/leaderboard', asyncHandler(async (req, res, next) => {
    // Return all users for the student list
    const users = await User.find({}).sort({ matricNumber: 1 });
    const studentList = users.map(u => ({
        name: u.name || u.matricNumber, // Use name if available
        matricNumber: u.matricNumber,
        department: u.department,
        level: u.level || 'N/A',
        score: u.history.reduce((acc, curr) => acc + curr.score, 0),
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u.matricNumber
    }));

    res.json(studentList);
}));

// 6. Get Performance (Only Active Users)
app.get('/api/performance', asyncHandler(async (req, res, next) => {
    const users = await User.find({}).sort({ matricNumber: 1 });

    // Filter to only users who have taken at least one quiz
    const activeUsers = users.filter(user => user.history.length > 0);

    // Transform into performance report
    const report = activeUsers.map(user => {
        // Group by subject
        const subjectMap = {};

        user.history.forEach(attempt => {
            if (!subjectMap[attempt.subject]) {
                subjectMap[attempt.subject] = [];
            }
            subjectMap[attempt.subject].push(attempt.score);
        });

        const performance = [];
        for (const [subject, scores] of Object.entries(subjectMap)) {
            const sum = scores.reduce((a, b) => a + b, 0);
            const avg = sum / scores.length;
            performance.push({
                subject,
                attempts: scores, // Array of scores [CA1, CA2...]
                average: parseFloat(avg.toFixed(2))
            });
        }

        return {
            matricNumber: user.matricNumber,
            name: user.name || user.matricNumber,
            department: user.department,
            performance // Array of { subject, attempts, average }
        };
    });

    res.json(report);
}));

// Seed Initial Data
app.post('/api/seed', asyncHandler(async (req, res, next) => {
    await Quiz.deleteMany({});
    await Quiz.insertMany(seedData);
    res.json({ message: "Seeded successfully with Engineering Subjects" });
}));

// Serve Frontend for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Global Error Handler (MUST be last)
app.use(errorHandler);

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
