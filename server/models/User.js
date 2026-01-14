const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  matricNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  name: { // Optional, can be derived or asked
    type: String,
    default: 'Student'
  },
  level: {
    type: String, // e.g., "100L"
    required: false
  },
  history: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    subject: String,
    score: Number,
    totalQuestions: Number,
    attemptDate: {
      type: Date,
      default: Date.now
    }
  }],
  activeSession: {
    subject: String,
    currentQuestionIndex: Number,
    score: Number,
    answers: Object,
    timer: Number,
    flaggedQuestions: [Number], // Store flagged indices
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
