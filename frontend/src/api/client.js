import axios from 'axios';

const BASE_URL = "http://localhost:8000";

export const generatePlan = async (tasks, energyLevel, availableMinutes) => {
    const response = await axios.post(`${BASE_URL}/api/plan`, {
        tasks,
        energyLevel,
        availableMinutes
    });
    return response.data;
};

export const generateSummary = async (completedSessions) => {
    const response = await axios.post(`${BASE_URL}/api/summary`, {
        completedSessions
    });
    return response.data;
};
