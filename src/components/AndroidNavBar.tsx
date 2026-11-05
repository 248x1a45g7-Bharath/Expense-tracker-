import React from 'react';
import { ChevronLeft, Circle, Square } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

export const AndroidNavBar: React.FC = () => {
  const { activeScreen, setActiveScreen } = useExpenses();

  const handleBack = () => {
    if (activeScreen === 'detail' || activeScreen === 'add' || activeScreen === 'edit') {
      setActiveScreen('dashboard');
    } else if (activeScreen !== 'dashboard') {
      setActiveScreen('dashboard');
    }
  };

  const handleHome = () => {
    setActiveScreen('dashboard');
  };

  return (
    <div className="w-full h-11 bg-slate-950 flex items-center justify-around px-8 select-none text-slate-400">
      {/* Back Triangle / Chevron */}
      <button
        onClick={handleBack}
        title="Android Back"
        className="p-2 hover:text-white transition-colors active:scale-90"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {/* Home Circle */}
      <button
        onClick={handleHome}
        title="Android Home"
        className="p-2 hover:text-white transition-colors active:scale-90"
      >
        <Circle size={15} strokeWidth={3} />
      </button>

      {/* Recents Square */}
      <button
        onClick={() => setActiveScreen('list')}
        title="Android App Switcher / Expenses"
        className="p-2 hover:text-white transition-colors active:scale-90"
      >
        <Square size={14} strokeWidth={2.8} />
      </button>
    </div>
  );
};
