import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, User, Heart } from 'lucide-react';

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: BarChart2, label: 'Leaderboard', path: '/leaderboard' },
        { icon: Heart, label: 'Saved', path: '/saved' }, // Placeholder
        { icon: User, label: 'Profile', path: '/profile' }, // Placeholder
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[400px] h-16 bg-app-dark rounded-full shadow-2xl flex items-center justify-around px-2 z-50">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`p-3 rounded-full transition-all flex items-center justify-center ${isActive ? 'bg-white text-app-dark' : 'text-white/50 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className={isActive ? "mr-2" : ""} />
                        {isActive && <span className="text-xs font-bold">{item.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}
