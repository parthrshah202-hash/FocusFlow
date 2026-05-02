import { useState, useEffect, useCallback, useRef } from "react";

const useTimer = (durationMinutes = 25) => {
  const [mode, setMode] = useState("focus"); // "focus" | "break"
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [config, setConfig] = useState({ focus: 25, break: 5 });

  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  const playBeep = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio beep failed", e);
    }
  }, []);

  const switchMode = useCallback(() => {
    const nextMode = mode === "focus" ? "break" : "focus";
    setMode(nextMode);
    setSecondsLeft(config[nextMode] * 60);
    if (mode === "focus") {
      setPomodoroCount((prev) => prev + 1);
    }
    playBeep();
  }, [mode, config, playBeep]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            switchMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, switchMode]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(config[mode] * 60);
  };

  const skip = () => {
    setIsRunning(false);
    switchMode();
  };

  const updateConfig = (focusMinutes, breakMinutes) => {
    setConfig({ focus: focusMinutes, break: breakMinutes });
    if (!isRunning) {
      setSecondsLeft(mode === "focus" ? focusMinutes * 60 : breakMinutes * 60);
    }
  };

  const resetPomodoroCount = () => setPomodoroCount(0);

  return {
    secondsLeft,
    isRunning,
    mode,
    pomodoroCount,
    start,
    pause,
    reset,
    skip,
    updateConfig,
    config,
    resetPomodoroCount
  };
};

export default useTimer;
