import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';
import BottomNav from './components/BottomNav';

function App() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    // Load user from local storage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const isAuthPage = location.pathname === '/';

    return (
        <div className="min-h-screen pb-24 md:pb-0 font-sans text-app-dark bg-app-bg selection:bg-app-accent">
            <div className="max-w-md mx-auto min-h-screen bg-app-bg relative shadow-2xl overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                <Routes>
                    <Route path="/" element={<Login setUser={setUser} />} />
                    <Route path="/home" element={<Home user={user} />} />
                    <Route path="/quiz/:subject" element={<Quiz user={user} />} />
                    <Route path="/result" element={<Result user={user} />} />
                    <Route path="/leaderboard" element={<Leaderboard user={user} />} />
                </Routes>

                {!isAuthPage && user && <BottomNav />}
            </div>
        </div>
    );
}

export default App;
