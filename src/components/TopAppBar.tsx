import React from 'react';
import { ChevronLeft, Settings, Wallet, Smartphone, Monitor } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

interface TopAppBarProps {
  onOpenSettings: () => void;
  isPhoneView: boolean;
  onTogglePhoneView: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenSettings,
  isPhoneView,
  onTogglePhoneView,
}) => {
  const { activeScreen, setActiveScreen, currency } = useExpenses();

  const getTitle = () => {
    switch (activeScreen) {
      case 'dashboard':
        return 'SmartSpend';
      case 'list':
        return 'All Expenses';
      case 'add':
        return 'Add Expense';
      case 'edit':
        return 'Edit Expense';
      case 'detail':
        return 'Expense Details';
      case 'analytics':
        return 'Analytics & Summary';
      case 'code':
        return 'Flutter Project Code';
      default:
        return 'SmartSpend';
    }
  };

  const showBackButton = activeScreen === 'add' || activeScreen === 'edit' || activeScreen === 'detail';

  return (
    <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white px-4 py-3 shadow-md flex items-center justify-between z-20">
      <div className="flex items-center space-x-2">
        {showBackButton ? (
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="p-1 -ml-1 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
            title="Go Back"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
            <Wallet size={18} strokeWidth={2.4} />
          </div>
        )}

        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight flex items-center gap-1.5">
            {getTitle()}
            {activeScreen === 'dashboard' && (
              <span className="text-[10px] font-semibold bg-emerald-400/25 text-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-400/30">
                Flutter M3
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        {/* Currency Quick Indicator */}
        <button
          onClick={onOpenSettings}
          title="Change Currency"
          className="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-all flex items-center space-x-0.5"
        >
          <span>{currency}</span>
        </button>

        {/* View Switcher: Phone Mockup Frame vs Full Web View */}
        <button
          onClick={onTogglePhoneView}
          className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all"
          title={isPhoneView ? 'Switch to Full Screen View' : 'Switch to Android Phone Emulator'}
        >
          {isPhoneView ? <Monitor size={17} /> : <Smartphone size={17} />}
        </button>

        {/* Settings modal */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all active:rotate-45"
          title="App Settings & Data"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
};
