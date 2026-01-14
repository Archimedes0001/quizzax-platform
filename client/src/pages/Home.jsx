import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Atom, FlaskConical, Calculator, Search, User as UserIcon } from 'lucide-react';

const icons = {
    Box, Atom, FlaskConical, Calculator
};

export default function Home({ user }) {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/quizzes')
            .then(res => res.json())
            .then(data => setQuizzes(data))
            .catch(err => console.error(err));
    }, []);

    if (!user) return null;

    return (
        <div className="p-6 pt-12">
            <header className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-sm opacity-60 mb-1">Hello,</p>
                    <h1 className="text-2xl font-bold">{user.matricNumber}</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-app-dark/10 flex items-center justify-center">
                    <UserIcon size={20} />
                </div>
            </header>

            <div className="mb-8">
                <h2 className="text-3xl font-bold leading-tight mb-6 text-app-dark">
                    What Subject do<br />you want to improve<br />today?
                </h2>

                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-app-dark/40" size={20} />
                    <input
                        type="text"
                        placeholder="Search here"
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white/70 border-none focus:ring-2 focus:ring-app-dark/10 transition-all placeholder-app-dark/40"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {quizzes.map((quiz, i) => {
                    const Icon = icons[quiz.icon] || Box;
                    // Apply different simple styles for variety or use the color from DB if valid class
                    // For now, consistent clean look
                    return (
                        <motion.div
                            key={quiz._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/quiz/${quiz.subject}`)}
                            className={`p-6 rounded-3xl cursor-pointer flex flex-col items-center justify-center aspect-square shadow-sm ${i % 2 === 0 ? 'bg-app-dark text-white' : 'bg-white text-app-dark'
                                }`}
                        >
                            <Icon size={40} strokeWidth={1.5} className="mb-4" />
                            <h3 className="font-semibold text-lg">{quiz.subject}</h3>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
