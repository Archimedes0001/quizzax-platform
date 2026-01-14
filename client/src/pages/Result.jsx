import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home } from 'lucide-react';

export default function Result({ user }) {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) return <div>No result data.</div>;

    const { score, total, subject } = state;
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="p-8 h-screen flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600"
            >
                <CheckCircle2 size={64} />
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-lg opacity-60 mb-8">{subject}</p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-sm opacity-60">Score</p>
                    <p className="text-3xl font-bold text-app-dark">{score}/{total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <p className="text-sm opacity-60">Accuracy</p>
                    <p className="text-3xl font-bold text-app-dark">{percentage}%</p>
                </div>
            </div>

            <div className="bg-app-dark/5 p-6 rounded-2xl w-full mb-8 text-left">
                <h3 className="font-bold mb-2">History (CA1 + CA2)</h3>
                <p className="text-sm opacity-70 mb-4">Your attempts are recorded.</p>
                <div className="space-y-2">
                    {/* Mocking recent history visual here, real app would pluck from user context if updated */}
                    <div className="flex justify-between text-sm">
                        <span>Current Attempt</span>
                        <span className="font-bold">{score} pts</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/home')}
                className="w-full btn-primary flex items-center justify-center gap-2"
            >
                <Home size={20} /> Back Home
            </button>
        </div>
    );
}
