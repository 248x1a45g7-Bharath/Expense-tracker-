import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart, Code2, Plus } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { ActiveScreen } from '../types/expense';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, expenses } = useExpenses();

  const navItems: { screen: ActiveScreen; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { screen: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { screen: 'list', label: 'Expenses', icon: ReceiptText },
    { screen: 'analytics', label: 'Analytics', icon: PieChart },
    { screen: 'code', label: 'Flutter Code', icon: Code2 },
  ];

  return (
    <div className="relative border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-2 shadow-lg z-20">
      {/* Floating Action Button (FAB) positioned above or in middle */}
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {navItems.slice(0, 2).map(item => {
          const isActive = activeScreen === item.screen;
          const Icon = item.icon;
          return (
            <button
              key={item.screen}
              onClick={() => setActiveScreen(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all rounded-xl relative ${
                isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {item.screen === 'list' && expenses.length > 0 && (
                <span className="absolute top-1 right-3 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-[9px] font-bold text-white flex items-center justify-center">
                  {expenses.length > 99 ? '99+' : expenses.length}
                </span>
              )}
            </button>
          );
        })}

        {/* Center Raised Add Button */}
        <div className="px-2 -mt-7">
          <button
            onClick={() => setActiveScreen('add')}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-200 border-3 border-white"
            title="Add New Expense"
          >
            <Plus size={26} strokeWidth={2.8} />
          </button>
        </div>

        {navItems.slice(2).map(item => {
          const isActive = activeScreen === item.screen;
          const Icon = item.icon;
          return (
            <button
              key={item.screen}
              onClick={() => setActiveScreen(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all rounded-xl relative ${
                isActive ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
