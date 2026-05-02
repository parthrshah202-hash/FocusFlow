import { useState, useEffect, useRef, useCallback } from 'react';

const playBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    console.error('Audio beep failed:', e);
  }
};

export const useTimer = (timerMode) => {
  const getDurations = (mode) => {
    switch (mode) {
      case "50/10": return { focus: 50 * 60, break: 10 * 60 };
      case "90/15": return { focus: 90 * 60, break: 15 * 60 };
      default: return { focus: 25 * 60, break: 5 * 60 };
    }
  };

  const durations = getDurations(timerMode);
  const [secondsLeft, setSecondsLeft] = useState(durations.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const timerRef = useRef(null);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(mode === 'focus' ? durations.focus : durations.break);
  }, [mode, durations.focus, durations.break]);

  const skip = () => {
    setSecondsLeft(0);
  };

  useEffect(() => {
    setSecondsLeft(mode === 'focus' ? durations.focus : durations.break);
  }, [timerMode]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      playBeep();
      if (mode === 'focus') {
        setPomodoroCount((prev) => prev + 1);
        setMode('break');
        setSecondsLeft(durations.break);
      } else {
        setMode('focus');
        setSecondsLeft(durations.focus);
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, secondsLeft, mode, durations.focus, durations.break]);

  return {
    secondsLeft,
    isRunning,
    mode,
    pomodoroCount,
    start,
    pause,
    reset,
    skip,
  };
};
