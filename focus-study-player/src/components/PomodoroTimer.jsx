import { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import { Play, Pause, RotateCcw, Coffee, Brain, Maximize2, Minimize2 } from 'lucide-react';

const DURATIONS = {
    focus25: 25 * 60,
    focus50: 50 * 60,
    break: 5 * 60,
};

export default function PomodoroTimer() {
    const [mode, setMode] = useState('focus25');
    const [timeLeft, setTimeLeft] = useState(DURATIONS.focus25);
    const [isActive, setIsActive] = useState(false);
    const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
    const [size, setSize] = useState('normal'); // 'compact', 'normal', 'large'
    const nodeRef = useRef(null);

    // Handle mode change — only reset time when mode actually changes
    const handleModeChange = useCallback((newMode) => {
        if (newMode === mode) return;
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(DURATIONS[newMode]);
    }, [mode]);

    // Countdown timer
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
            // Auto switch when timer ends
            setIsActive(false);
            const nextMode = mode.startsWith('focus') ? 'break' : 'focus25';
            setMode(nextMode);
            setTimeLeft(DURATIONS[nextMode]);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(DURATIONS[mode]);
    };

    const cycleSize = () => {
        const sizes = ['compact', 'normal', 'large'];
        const currentIndex = sizes.indexOf(size);
        setSize(sizes[(currentIndex + 1) % sizes.length]);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Size-based styles
    const sizeStyles = {
        compact: {
            container: 'p-2.5 rounded-xl w-48',
            timer: 'text-2xl',
            label: 'text-[10px]',
            buttons: 'mt-2 gap-2',
            modeBtn: 'text-[10px] px-1.5 py-0.5',
            actionBtn: 'py-1.5 rounded-lg',
            resetBtn: 'p-1.5 rounded-lg',
            icon: 'w-4 h-4',
            smallIcon: 'w-2.5 h-2.5',
            focusStats: 'mt-2 px-2 py-1 text-[10px]',
            focusStatsLabel: 'text-[8px]',
        },
        normal: {
            container: 'p-4 rounded-2xl w-64',
            timer: 'text-4xl',
            label: 'text-xs',
            buttons: 'mt-4 gap-3',
            modeBtn: 'text-xs px-2 py-1',
            actionBtn: 'py-2 rounded-xl',
            resetBtn: 'p-2 rounded-xl',
            icon: 'w-5 h-5',
            smallIcon: 'w-3 h-3',
            focusStats: 'mt-3 px-3 py-1.5 text-xs',
            focusStatsLabel: 'text-[10px]',
        },
        large: {
            container: 'p-6 rounded-3xl w-80',
            timer: 'text-5xl',
            label: 'text-sm',
            buttons: 'mt-5 gap-4',
            modeBtn: 'text-sm px-3 py-1.5',
            actionBtn: 'py-3 rounded-xl',
            resetBtn: 'p-3 rounded-xl',
            icon: 'w-6 h-6',
            smallIcon: 'w-4 h-4',
            focusStats: 'mt-4 px-4 py-2 text-sm',
            focusStatsLabel: 'text-xs',
        },
    };

    const s = sizeStyles[size];

    return (
        <Draggable nodeRef={nodeRef} bounds="parent">
            <div
                ref={nodeRef}
                className={`absolute top-8 right-8 cursor-move z-50 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 shadow-2xl select-none hover:bg-gray-900/80 transition-all duration-200 ${s.container}`}
            >
                <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleModeChange('focus25')}
                            className={`${s.modeBtn} rounded-md transition-colors ${mode === 'focus25' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            25m
                        </button>
                        <button
                            onClick={() => handleModeChange('focus50')}
                            className={`${s.modeBtn} rounded-md transition-colors ${mode === 'focus50' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            50m
                        </button>
                        <button
                            onClick={() => handleModeChange('break')}
                            className={`${s.modeBtn} rounded-md transition-colors flex items-center gap-1 ${mode === 'break' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            <Coffee className={s.smallIcon} /> 5m
                        </button>
                    </div>
                    <button
                        onClick={cycleSize}
                        className="p-1 rounded-md bg-gray-800/60 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        title={`Size: ${size}`}
                    >
                        {size === 'large' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                    <div className={`${s.timer} font-mono font-bold tracking-tight text-white mb-1`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className={`${s.label} text-gray-400 flex items-center gap-1 uppercase tracking-wider font-semibold`}>
                        {mode.startsWith('focus') ? <><Brain className={s.smallIcon} /> Focus Session</> : <><Coffee className={s.smallIcon} /> Break Time</>}
                    </div>
                    {totalFocusSeconds > 0 && (
                        <div className={`${s.focusStats} text-purple-400 font-medium bg-purple-900/40 rounded-lg border border-purple-800/50 flex flex-col items-center`}>
                            <span className={`${s.focusStatsLabel} uppercase text-purple-500/80 mb-0.5 tracking-wider`}>Total in Focus</span>
                            <span>
                                {Math.floor(totalFocusSeconds / 3600) > 0 ? `${Math.floor(totalFocusSeconds / 3600)}h ` : ''}
                                {Math.floor((totalFocusSeconds % 3600) / 60)}m {totalFocusSeconds % 60}s
                            </span>
                        </div>
                    )}
                </div>

                <div className={`flex justify-center ${s.buttons}`}>
                    <button
                        onClick={toggleTimer}
                        className={`flex-1 ${s.actionBtn} flex items-center justify-center transition-colors ${isActive ? 'bg-amber-600/80 hover:bg-amber-500/80' : 'bg-purple-600/80 hover:bg-purple-500/80'}`}
                    >
                        {isActive ? <Pause className={`${s.icon} text-white`} /> : <Play className={`${s.icon} text-white ml-1`} />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className={`${s.resetBtn} bg-gray-800 hover:bg-gray-700 transition-colors`}
                    >
                        <RotateCcw className={`${s.icon} text-gray-300`} />
                    </button>
                </div>
            </div>
        </Draggable>
    );
}
