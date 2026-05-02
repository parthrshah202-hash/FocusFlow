import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TaskInput from './components/TaskInput';
import MoodCheckIn from './components/MoodCheckIn';
import EnergyCheckIn from './components/EnergyCheckIn';
import Timer from './components/Timer';
import TaskQueue from './components/TaskQueue';
import SessionSummary from './components/SessionSummary';
import Dashboard from './components/Dashboard';
import CoachChat from './components/CoachChat';
import DistractionLog from './components/DistractionLog';
import FocusScore from './components/FocusScore';

const MainContent = () => {
  const { currentView } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'input':
        return <TaskInput />;
      case 'checkin':
        return (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto py-12">
            <MoodCheckIn />
            <EnergyCheckIn />
          </div>
        );
      case 'timer':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-7 flex flex-col gap-8">
              <Timer />
              <FocusScore />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-8">
              <TaskQueue />
              <DistractionLog />
            </div>
          </div>
        );
      case 'summary':
        return <SessionSummary />;
      case 'coach':
        return <CoachChat />;
      default:
        return <TaskInput />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto">
        {renderView()}
      </div>
    </main>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="flex h-screen bg-[#0A0A0F] text-[#F0F0FF] overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
}

export default App;
