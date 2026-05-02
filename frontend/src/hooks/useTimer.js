// Member B — useTimer hook stub
// Replace this with the real implementation from Member B

const useTimer = (durationMinutes = 25) => {
  return {
    secondsLeft: durationMinutes * 60,
    isRunning: false,
    mode: 'focus',
    pomodoroCount: 0,
    start: () => {},
    pause: () => {},
    reset: () => {},
    skip: () => {},
  };
};

export default useTimer;
