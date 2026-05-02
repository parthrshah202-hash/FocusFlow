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
        <div className="min-h-screen">
            {currentView === 'input' && <TaskInput />}
            {currentView === 'checkin' && <EnergyCheckIn />}
            {currentView === 'timer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TaskQueue />
                    <Timer />
                </div>
            )}
            {currentView === 'summary' && <SessionSummary />}
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