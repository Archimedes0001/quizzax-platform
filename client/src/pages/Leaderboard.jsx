import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2 } from 'lucide-react';

export default function Leaderboard({ user }) {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    }, []);

    // Top 3 for podium
    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    // Podium Order: 2nd, 1st, 3rd (Left, Center, Right)
    const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

    return (
        <div className="min-h-screen bg-[#efffdb] pb-24">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <button onClick={() => navigate('/home')} className="p-2 hover:bg-black/5 rounded-full">
                    <ChevronLeft />
                </button>
                <h1 className="text-xl font-bold">Leaderboard</h1>
                <button className="p-2 hover:bg-black/5 rounded-full">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-6 mb-8">
                <div className="bg-app-dark/5 p-1 rounded-full flex">
                    <button className="flex-1 py-2 text-sm font-semibold bg-app-dark text-white rounded-full shadow-md">Weekly</button>
                    <button className="flex-1 py-2 text-sm font-semibold opacity-50">All Time</button>
                </div>
            </div>

            {/* Podium */}
            <div className="flex justify-center items-end gap-2 mb-8 px-6 h-48">
                {podium.map((u, i) => {
                    const isFirst = u === top3[0];
                    const isSecond = u === top3[1];
                    const height = isFirst ? 'h-40' : (isSecond ? 'h-32' : 'h-24');
                    const color = isFirst ? 'bg-app-dark text-white' : 'bg-white text-app-dark';
                    // 2nd (i=0 in podium arr), 1st (i=1), 3rd (i=2)
                    const rank = isFirst ? 1 : (isSecond ? 2 : 3);

                    return (
                        <div key={i} className="flex flex-col items-center">
                            <div className="mb-2 relative">
                                <img src={u?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u?.matricNumber}`} alt="avatar" className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                                {u?.matricNumber === user?.matricNumber && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-app-dark text-white text-[10px] px-2 py-0.5 rounded-full">You</div>
                                )}
                            </div>
                            {/* Podium Step */}
                            <div className={`${height} w-24 ${color} rounded-t-2xl shadow-xl flex flex-col items-center justify-start pt-4 relative clip-podium`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${isFirst ? 'bg-[#FFD700] text-black' : (isSecond ? 'bg-[#C0C0C0]' : 'bg-[#CD7F32]')}`}>
                                    {rank}
                                </div>
                                <span className="text-xs font-bold truncate max-w-[80%]">{u?.name === 'Student' ? u.matricNumber.split('/')[0] : u?.name}</span>
                                <span className="text-[10px] opacity-70">{u?.score}pts</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* List */}
            <div className="px-4 space-y-3">
                {rest.map((u, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl flex items-center shadow-sm">
                        <span className="text-sm font-bold w-6 opacity-50">{i + 4}</span>
                        <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-100 mr-4" />
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{u.matricNumber}</h4>
                            <p className="text-xs opacity-50">{u.department}</p>
                        </div>
                        <div className="font-bold text-app-dark">{u.score} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
