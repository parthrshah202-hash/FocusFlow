import { useState, useCallback } from 'react';
import { calculateFocusScore } from '../utils/scoring';
import { storage } from '../utils/storage';

export const useFocusScore = () => {
  const [focusScore, setFocusScore] = useState(storage.getFocusScore());

  const updateScore = useCallback((sessionLog, distractions) => {
    const totalDistractions = distractions.length;
    const newScore = calculateFocusScore(sessionLog, totalDistractions);
    setFocusScore(newScore);
    storage.setFocusScore(newScore);
  }, []);

  return { focusScore, updateScore };
};
