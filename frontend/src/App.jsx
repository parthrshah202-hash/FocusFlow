import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import TaskInput from './components/TaskInput';
import EnergyCheckIn from './components/EnergyCheckIn';
import TaskQueue from './components/TaskQueue';
import Timer from './components/Timer';
import SessionSummary from './components/SessionSummary';

const MainContent = () => {
    const { currentView } = useContext(AppContext);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl p-8">
                <header className="mb-8 text-center border-b pb-4">
                    <h1 className="text-4xl font-extrabold text-blue-600 mb-2">FocusFlow</h1>
                    <p className="text-gray-500 text-lg">AI-Powered Pomodoro Planner</p>
                </header>
                
                <main>
                    {currentView === 'input' && <TaskInput />}
                    {currentView === 'checkin' && <EnergyCheckIn />}
                    {currentView === 'timer' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TaskQueue />
                            <Timer />
                        </div>
                    )}
                    {currentView === 'summary' && <SessionSummary />}
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <AppProvider>
            <MainContent />
        </AppProvider>
    );
}

export default App;
