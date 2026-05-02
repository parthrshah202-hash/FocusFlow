import { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import TaskInput from './components/TaskInput';
import EnergyCheckIn from './components/EnergyCheckIn';
import Timer from './components/Timer';
import TaskQueue from './components/TaskQueue';
import SessionSummary from './components/SessionSummary';

const AppInner = () => {
  const { currentView } = useContext(AppContext);

  return (
    <>
      {currentView === 'input' && <TaskInput />}
      {currentView === 'checkin' && <EnergyCheckIn />}
      {currentView === 'timer' && (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12122a] to-[#0a0a1a] p-6 flex gap-6 items-start justify-center">
          <div className="flex-1 max-w-md">
            <Timer />
          </div>
          <div className="flex-1 max-w-md">
            <TaskQueue />
          </div>
        </div>
      )}
      {currentView === 'summary' && <SessionSummary />}
    </>
  );
};

const App = () => (
  <AppProvider>
    <AppInner />
  </AppProvider>
);

export default App;
