import { useState, useEffect, useRef, useCallback } from 'react';

const playBeep = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.error("AudioContext not supported or blocked", e);
    }
};

export const useTimer = (focusMinutes = 25, breakMinutes = 5) => {
    const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState("focus"); // "focus" | "break"
    const [pomodoroCount, setPomodoroCount] = useState(0);

    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isRunning && mode === "focus") {
            setSecondsLeft(focusMinutes * 60);
        }
    }, [focusMinutes, mode, isRunning]);

    const tick = useCallback(() => {
        setSecondsLeft(prev => {
            if (prev <= 1) {
                playBeep();
                if (mode === "focus") {
                    setPomodoroCount(c => c + 1);
                    setMode("break");
                    return breakMinutes * 60;
                } else {
                    setMode("focus");
                    return focusMinutes * 60;
                }
            }
            return prev - 1;
        });
    }, [mode, focusMinutes, breakMinutes]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(tick, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, tick]);

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    
    const reset = () => {
        setIsRunning(false);
        setMode("focus");
        setSecondsLeft(focusMinutes * 60);
    };

    const skip = () => {
        playBeep();
        if (mode === "focus") {
            setMode("break");
            setSecondsLeft(breakMinutes * 60);
        } else {
            setMode("focus");
            setSecondsLeft(focusMinutes * 60);
        }
    };

    return {
        secondsLeft,
        isRunning,
        mode,
        pomodoroCount,
        start,
        pause,
        reset,
        skip,
        setPomodoroCount
    };
};
