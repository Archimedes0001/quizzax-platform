import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, CheckCircle2, XCircle } from 'lucide-react';

export default function Quiz({ user }) {
    const { subject } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]); // Track for history

    useEffect(() => {
        fetch(`/api/quizzes/${subject}`)
            .then(res => res.json())
            .then(data => setQuizData(data))
            .catch(err => {
                console.error(err);
                alert("Failed to load quiz");
                navigate('/home');
            });
    }, [subject, navigate]);

    const handleOptionSelect = (index) => {
        if (showExplanation) return; // Prevent changing after submission
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (showExplanation) {
            // Move to next question
            if (currentQuestionIndex < quizData.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setShowExplanation(false);
            } else {
                submitQuiz();
            }
        } else {
            // Check answer
            if (selectedOption === null) return; // Must select something to save & next

            const currentQuestion = quizData.questions[currentQuestionIndex];
            const isCorrect = selectedOption === currentQuestion.correctOption;

            if (isCorrect) setScore(prev => prev + 1);

            // Update answers log
            setAnswers([...answers, {
                question: currentQuestion.questionText,
                selected: selectedOption,
                correct: currentQuestion.correctOption,
                isCorrect
            }]);

            setShowExplanation(true);
        }
    };

    const handleSkip = () => {
        // Treat as incorrect/unanswered
        const currentQuestion = quizData.questions[currentQuestionIndex];
        setAnswers([...answers, {
            question: currentQuestion.questionText,
            selected: null,
            correct: currentQuestion.correctOption,
            isCorrect: false
        }]);

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        // Send to backend
        // Note: score passed here might need to be final calculation if async state update is slow, 
        // but in this flow we increment score *before* calling submit so it should be fine mostly.
        // Better to recalculate from answers array to be safe.
        const finalScore = answers.filter(a => a.isCorrect).length + (selectedOption === quizData.questions[currentQuestionIndex].correctOption ? 1 : 0);
        // Actually the logic above for finalQuestion submission is tricky with state updates.
        // Lets rely on the 'score' state but be careful.
        // Wait, handleNext logic for last question calls submitQuiz.
        // If we are in 'showExplanation' mode (step 2 of answering), 'score' is already updated.

        try {
            await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matricNumber: user.matricNumber,
                    subject,
                    score: finalScore, // Use calculated to avoid race conditions
                    totalQuestions: quizData.questions.length
                })
            });
            navigate('/result', { state: { score: finalScore, total: quizData.questions.length, subject } });
        } catch (err) {
            console.error(err);
        }
    };

    if (!quizData) return <div className="p-8 text-center">Loading...</div>;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

    return (
        <div className="p-6 h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate('/home')} className="p-2 bg-white rounded-full shadow-sm">
                    <ChevronLeft />
                </button>
                <div className="w-16 h-16 rounded-full border-4 border-app-accent flex items-center justify-center text-xs font-bold bg-white">
                    {currentQuestionIndex + 1} / {quizData.questions.length}
                </div>
                <button className="p-2 bg-white rounded-full shadow-sm opacity-0 cursor-default">
                    <Info />
                </button>
            </div>

            {/* Question Card */}
            <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
                <div className="mb-2">
                    <h2 className="text-sm uppercase tracking-wider opacity-60 font-semibold">{subject}</h2>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold leading-tight text-app-dark">
                        {currentQuestion.questionText}
                    </h1>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((opt, idx) => {
                        let statusClass = "bg-white text-app-dark border-transparent"; // Default

                        if (showExplanation) {
                            if (idx === currentQuestion.correctOption) {
                                statusClass = "bg-green-100 border-green-500 text-green-900";
                            } else if (idx === selectedOption) {
                                statusClass = "bg-red-100 border-red-500 text-red-900";
                            } else {
                                statusClass = "opacity-50";
                            }
                        } else if (selectedOption === idx) {
                            statusClass = "bg-app-accent text-app-dark border-app-dark";
                        }

                        return (
                            <motion.button
                                key={idx}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleOptionSelect(idx)}
                                className={`w-full p-4 rounded-xl text-left font-medium border-2 transition-all ${statusClass} shadow-sm`}
                            >
                                {opt}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Explanation Area */}
                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-24"
                        >
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                {selectedOption === currentQuestion.correctOption ? (
                                    <span className="text-green-600 flex items-center gap-2"><CheckCircle2 size={18} /> Correct!</span>
                                ) : (
                                    <span className="text-red-500 flex items-center gap-2"><XCircle size={18} /> Incorrect</span>
                                )}
                            </h3>
                            <div className="bg-white/50 p-4 rounded-lg text-sm leading-relaxed">
                                <p className="font-semibold mb-1">Explanation:</p>
                                {currentQuestion.explanation || "No explanation provided."}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-app-bg via-app-bg to-transparent">
                <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                    <button
                        onClick={handleSkip}
                        disabled={showExplanation} // Can't skip if already answered
                        className="py-4 rounded-full border border-app-dark text-app-dark font-semibold bg-transparent"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className="py-4 rounded-full bg-app-dark text-white font-semibold shadow-lg"
                    >
                        {showExplanation ? (currentQuestionIndex === quizData.questions.length - 1 ? "Finish" : "Next Question") : "Check Answer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
