export const getTasks = () => {
    const data = localStorage.getItem("ff_tasks");
    return data ? JSON.parse(data) : [];
};

export const setTasks = (tasks) => {
    localStorage.setItem("ff_tasks", JSON.stringify(tasks));
};

export const getPlan = () => {
    const data = localStorage.getItem("ff_plan");
    return data ? JSON.parse(data) : null;
};

export const setPlan = (plan) => {
    localStorage.setItem("ff_plan", JSON.stringify(plan));
};

export const getActiveTaskId = () => {
    const data = localStorage.getItem("ff_active_task_id");
    return data ? JSON.parse(data) : null;
};

export const setActiveTaskId = (taskId) => {
    if (taskId === null) {
        localStorage.removeItem("ff_active_task_id");
    } else {
        localStorage.setItem("ff_active_task_id", JSON.stringify(taskId));
    }
};

export const getSessionLog = () => {
    const data = localStorage.getItem("ff_session_log");
    return data ? JSON.parse(data) : [];
};

export const setSessionLog = (log) => {
    localStorage.setItem("ff_session_log", JSON.stringify(log));
};

export const getEnergy = () => {
    const data = localStorage.getItem("ff_energy");
    return data ? JSON.parse(data) : "";
};

export const setEnergy = (energy) => {
    localStorage.setItem("ff_energy", JSON.stringify(energy));
};

export const clearAll = () => {
    localStorage.removeItem('ff_tasks');
    localStorage.removeItem('ff_plan');
    localStorage.removeItem('ff_active_task_id');
    localStorage.removeItem('ff_session_log');
    localStorage.removeItem('ff_energy');
};
