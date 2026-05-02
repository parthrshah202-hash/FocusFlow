/**
 * Calculate a focus score (0–100) from session data.
 * Formula:
 * base = (actualPomodoros / estimatedPomodoros) * 60
 * distraction_penalty = min(40, totalDistractions * 4)
 * mood_bonus = (averageMood / 5) * 20
 * score = clamp(base - distraction_penalty + mood_bonus, 0, 100)
 */
export const calculateFocusScore = (sessionLog, totalDistractions) => {
  if (sessionLog.length === 0) return 0;

  let totalActual = 0;
  let totalEstimated = 0;
  let totalMood = 0;

  sessionLog.forEach((session) => {
    totalActual += session.actualPomodoros;
    totalEstimated += session.estimatedPomodoros;
    totalMood += session.moodAfter;
  });

  const base = totalEstimated > 0 ? (totalActual / totalEstimated) * 60 : 0;
  const distractionPenalty = Math.min(40, totalDistractions * 4);
  const averageMood = totalMood / sessionLog.length;
  const moodBonus = (averageMood / 5) * 20;

  const score = base - distractionPenalty + moodBonus;
  return Math.min(100, Math.max(0, Math.round(score)));
};
