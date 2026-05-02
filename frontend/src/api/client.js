import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const generatePlan = async (tasks, energyLevel, availableMinutes) => {
  const response = await client.post('/api/plan', {
    tasks,
    energyLevel,
    availableMinutes,
  });
  return response.data;
};

export const generateSummary = async (completedSessions) => {
  const response = await client.post('/api/summary', {
    completedSessions,
  });
  return response.data;
};

export default client;
