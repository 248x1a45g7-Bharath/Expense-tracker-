import React from 'react';
import {
  TrendingUp,
  Calendar,
  CreditCard,
  Plus,
  ArrowRight,
  AlertTriangle,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryIcon } from '../CategoryIcon';
import { CATEGORIES } from '../../constants/categories';

export const DashboardScreen: React.FC = () => {
  const {
    expenses,
    currency,
    totalSpending,
    todaySpending,
    currentMonthSpending,
    monthlyBudget,
    recentExpenses,
    categorySummaries,
    setActiveScreen,
  } = useExpenses();

  const budgetUsagePercent = monthlyBudget > 0 ? (currentMonthSpending / monthlyBudget) * 100 : 0;
  const isBudgetWarning = budgetUsagePercent >= 85;
  const isBudgetExceeded = budgetUsagePercent > 100;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
      {/* Total Balance / Spending Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white p-5 shadow-xl shadow-emerald-900/15 border border-emerald-600/30">
        {/* Glow ambient background decoration */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-300" />
              Total Spending
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] tracking-normal font-bold">
              {expenses.length} records
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold opacity-80">{currency}</span>
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {totalSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Monthly Budget Bar */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-emerald-100 font-medium flex items-center gap-1">
                Monthly Target ({currency}
                {monthlyBudget.toLocaleString()})
              </span>
              <span
                className={`font-bold ${
                  isBudgetExceeded ? 'text-amber-300' : 'text-white'
                }`}
              >
                {budgetUsagePercent.toFixed(0)}% used
              </span>
            </div>

            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBudgetExceeded
                    ? 'bg-amber-400'
                    : isBudgetWarning
                    ? 'bg-amber-300'
                    : 'bg-emerald-300'
                }`}
                style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
              />
            </div>

            {isBudgetWarning && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-200 bg-amber-500/20 px-2.5 py-1 rounded-lg">
                <AlertTriangle size={13} className="shrink-0" />
                <span>
                  {isBudgetExceeded
                    ? 'Warning: You have exceeded your monthly budget target!'
                    : 'Caution: Approaching your monthly budget limit!'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Today & Monthly Spending Twin Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Spend */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar size={15} strokeWidth={2.4} />
            </div>
            <span className="text-xs font-semibold text-slate-600">Today</span>
          </div>
          <div className="text-lg font-bold text-slate-900 tracking-tight">
            {currency}
            {todaySpending.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Daily expenditure</p>
        </div>

        {/* Monthly Spend */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp size={15} strokeWidth={2.4} />
            </div>
            <span className="text-xs font-semibold text-slate-600">This Month</span>
          </div>
          <div className="text-lg font-bold text-slate-900 tracking-tight">
            {currency}
            {currentMonthSpending.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Current cycle</p>
        </div>
      </div>

      {/* Category-Wise Expense Summary (Horizontal Scroll) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">Category Breakdown</h2>
          <button
            onClick={() => setActiveScreen('analytics')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>See Charts</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {categorySummaries.map(item => {
            const cat = CATEGORIES[item.category];
            return (
              <button
                key={item.category}
                onClick={() => {
                  setActiveScreen('list');
                }}
                className="shrink-0 w-28 p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 shadow-xs text-left transition-all hover:scale-102"
              >
                <CategoryIcon category={item.category} size={15} />
                <div className="mt-2 font-bold text-xs text-slate-800 truncate">{item.category}</div>
                <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                  {currency}
                  {item.total.toFixed(0)}
                </div>
                <div className="text-[10px] text-slate-400">{item.count} items</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">Recent Transactions</h2>
            <span className="text-[11px] text-slate-400">({recentExpenses.length})</span>
          </div>
          {expenses.length > 0 && (
            <button
              onClick={() => setActiveScreen('list')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {recentExpenses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
              <Receipt size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">No expenses recorded yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tap the green &ldquo;+&rdquo; button below to track your first expense.
            </p>
            <button
              onClick={() => setActiveScreen('add')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={15} />
              <span>Add Expense</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map(expense => (
              <div
                key={expense.id}
                onClick={() => setActiveScreen('detail', expense.id)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer hover:shadow-xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon category={expense.category} size={18} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-800">{expense.category}</span>
                      <span className="text-[11px] text-slate-400 font-medium">• {expense.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[190px]">
                      {expense.note || 'No notes added'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    -{currency}
                    {expense.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
