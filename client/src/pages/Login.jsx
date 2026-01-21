import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login({ setUser }) {
    const [matricNumber, setMatricNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowWakeUpMessage(false);

        const timer = setTimeout(() => {
            setShowWakeUpMessage(true);
        }, 3000);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricNumber, department })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                navigate('/home');
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert('Login failed');
        } finally {
            clearTimeout(timer);
            setLoading(false);
            setShowWakeUpMessage(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-screen w-full relative">
            {/* Abstract Shapes */}
            <div className="absolute top-20 right-[-50px] w-64 h-64 border-[40px] border-app-dark/5 rounded-full" />
            <div className="absolute bottom-20 left-[-50px] w-48 h-48 border-[30px] border-app-accent/30 rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full z-10"
            >
                <h1 className="text-4xl font-bold mb-2 text-app-dark">Hello,</h1>
                <p className="text-xl mb-12 opacity-70">Enter your details to start.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 ml-1">Matric Number</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. 19/SCI01/001"
                            value={matricNumber}
                            onChange={e => setMatricNumber(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 ml-1">Department</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Computer Science"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary mt-8 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : "Start Learning"}
                    </button>

                    <AnimatePresence>
                        {showWakeUpMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 p-4 bg-app-accent/10 rounded-xl border border-app-accent/20 text-center"
                            >
                                <p className="text-xs text-app-dark/60 leading-relaxed font-medium">
                                    Server is waking up from sleep mode... <br />
                                    This may take 30-50 seconds on the first try.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
}
