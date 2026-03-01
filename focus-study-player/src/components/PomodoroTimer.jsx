import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export default function PomodoroTimer() {
    const [mode, setMode] = useState('focus25'); // focus25, focus50, break
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
    const nodeRef = useRef(null);

    // Set initial time depending on mode
    useEffect(() => {
        if (!isActive) {
            if (mode === 'focus25') setTimeLeft(25 * 60);
            else if (mode === 'focus50') setTimeLeft(50 * 60);
            else if (mode === 'break') setTimeLeft(5 * 60);
        }
    }, [mode, isActive]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
                if (mode.startsWith('focus')) {
                    setTotalFocusSeconds((prev) => prev + 1);
                }
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Auto switch logic
            setIsActive(false);
            if (mode.startsWith('focus')) {
                setMode('break');
            } else {
                setMode('focus25');
            }
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus25') setTimeLeft(25 * 60);
        else if (mode === 'focus50') setTimeLeft(50 * 60);
        else if (mode === 'break') setTimeLeft(5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Draggable nodeRef={nodeRef} bounds="parent">
            <div
                ref={nodeRef}
                className="absolute top-8 right-8 cursor-move z-50 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 p-4 rounded-2xl shadow-2xl w-64 select-none hover:bg-gray-900/80 transition-colors"
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1">
                        <button
                            onClick={() => { setMode('focus25'); setIsActive(false); }}
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${mode === 'focus25' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            25m
                        </button>
                        <button
                            onClick={() => { setMode('focus50'); setIsActive(false); }}
                            className={`text-xs px-2 py-1 rounded-md transition-colors ${mode === 'focus50' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            50m
                        </button>
                        <button
                            onClick={() => { setMode('break'); setIsActive(false); }}
                            className={`text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${mode === 'break' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            <Coffee className="w-3 h-3" /> 5m
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                    <div className="text-4xl font-mono font-bold tracking-tight text-white mb-1">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 uppercase tracking-wider font-semibold">
                        {mode.startsWith('focus') ? <><Brain className="w-3 h-3" /> Focus Session</> : <><Coffee className="w-3 h-3" /> Break Time</>}
                    </div>
                    {totalFocusSeconds > 0 && (
                        <div className="text-xs text-purple-400 mt-3 font-medium bg-purple-900/40 px-3 py-1.5 rounded-lg border border-purple-800/50 flex flex-col items-center">
                            <span className="text-[10px] uppercase text-purple-500/80 mb-0.5 tracking-wider">Total in Focus</span>
                            <span>
                                {Math.floor(totalFocusSeconds / 3600) > 0 ? `${Math.floor(totalFocusSeconds / 3600)}h ` : ''}
                                {Math.floor((totalFocusSeconds % 3600) / 60)}m {totalFocusSeconds % 60}s
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={toggleTimer}
                        className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-amber-600/80 hover:bg-amber-500/80' : 'bg-purple-600/80 hover:bg-purple-500/80'}`}
                    >
                        {isActive ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-1" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <RotateCcw className="w-5 h-5 text-gray-300" />
                    </button>
                </div>
            </div>
        </Draggable>
    );
}
