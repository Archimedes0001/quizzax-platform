const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    image: { type: String }, // Optional image URL for diagrams
    options: [{ type: String, required: true }], // Array of 4 options
    correctOption: { type: Number, required: true }, // Index 0-3
    explanation: { type: String }
});

const quizSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        unique: true
    },
    icon: { type: String, default: 'BookOpen' }, // Lucide icon name
    description: String,
    color: String, // For UI theme
    questions: [questionSchema]
});

module.exports = mongoose.model('Quiz', quizSchema);
