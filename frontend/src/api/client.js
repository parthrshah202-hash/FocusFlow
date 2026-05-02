import axios from 'axios';

const BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generatePlan = async (tasks, energyLevel, availableMinutes, moodScore, preferredMode) => {
  try {
    const response = await api.post('/api/plan', {
      tasks,
      energyLevel,
      availableMinutes,
      moodScore,
      preferredMode,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new Error(error.response?.data?.detail || 'Failed to generate plan');
  }
};

export const generateSummary = async (completedSessions, totalDistractions, averageMood, focusScore) => {
  try {
    const response = await api.post('/api/summary', {
      completedSessions,
      totalDistractions,
      averageMood,
      focusScore,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(error.response?.data?.detail || 'Failed to generate summary');
  }
};

export const sendCoachMessage = async (message, context) => {
  try {
    const response = await api.post('/api/coach', {
      message,
      context,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to coach:', error);
    throw new Error(error.response?.data?.detail || 'Failed to communicate with coach');
  }
};
