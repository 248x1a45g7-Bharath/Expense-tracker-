import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  BarChart2,
  TrendingDown,
  Sparkles,
  Award,
  Wallet,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryIcon } from '../CategoryIcon';
import { CATEGORIES, CATEGORY_LIST } from '../../constants/categories';
import { ExpenseCategory } from '../../types/expense';

export const AnalyticsScreen: React.FC = () => {
  const {
    expenses,
    totalSpending,
    currentMonthSpending,
    monthlyBudget,
    categorySummaries,
    currency,
  } = useExpenses();

  const [activeCategory, setActiveCategory] = useState<ExpenseCategory | null>(null);

  // Active categories with spending > 0
  const nonZeroCategories = categorySummaries.filter(c => c.total > 0);

  // Sorted by highest spending
  const sortedCategories = [...nonZeroCategories].sort((a, b) => b.total - a.total);
  const highestCategory = sortedCategories[0];

  // Calculate SVG Pie/Donut Chart Coordinates
  const chartSize = 220;
  const strokeWidth = 36;
  const radius = (chartSize - strokeWidth) / 2;
  const center = chartSize / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  // Monthly breakdown for the past 4 months
  const monthlyData = React.useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const monthName = d.toLocaleString('default', { month: 'short' });

      const sum = expenses
        .filter(e => {
          const expDate = new Date(e.date);
          return expDate.getFullYear() === year && expDate.getMonth() === month;
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

      months.push({ label: monthName, year, total: sum });
    }
    return months;
  }, [expenses]);

  const maxMonthTotal = Math.max(...monthlyData.map(m => m.total), 1);

  if (expenses.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-slate-50">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
          <PieIcon size={32} />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Analytics Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Start recording expenses to view interactive spending breakdown, monthly bar charts, and category insights.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 bg-slate-50/70">
      {/* Overview Metric Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet size={14} />
            Total Expenditure
          </span>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currency}
            {totalSpending.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-100 mt-0.5">Across {expenses.length} tracked transactions</p>
        </div>

        <div className="text-right bg-white/10 px-3.5 py-2.5 rounded-2xl backdrop-blur-xs border border-white/15">
          <span className="text-[10px] text-emerald-200 uppercase font-bold block">Top Category</span>
          <span className="text-sm font-extrabold text-white">
            {highestCategory ? highestCategory.category : 'N/A'}
          </span>
          <span className="text-[10px] text-emerald-300 block font-bold">
            {highestCategory ? `${highestCategory.percentage.toFixed(0)}% of total` : ''}
          </span>
        </div>
      </div>

      {/* Interactive Pie / Donut Chart */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Spending Distribution</h3>
            <p className="text-xs text-slate-400">Tap a category to inspect share</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {nonZeroCategories.length} active categories
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
          {/* SVG Donut Chart */}
          <div className="relative flex items-center justify-center">
            <svg width={chartSize} height={chartSize} className="rotate-[-90deg] drop-shadow-xs">
              {/* Background ring */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />

              {/* Data segments */}
              {nonZeroCategories.map(item => {
                const catInfo = CATEGORIES[item.category];
                const percent = item.percentage / 100;
                const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
                const strokeDashoffset = -circumference * accumulatedPercent;
                accumulatedPercent += percent;

                const isSelected = activeCategory === item.category;

                return (
                  <circle
                    key={item.category}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={catInfo.color}
                    strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-300 hover:opacity-85"
                    onClick={() =>
                      setActiveCategory(prev => (prev === item.category ? null : item.category))
                    }
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              {activeCategory ? (
                <>
                  <span className="text-xs font-bold text-slate-500">{activeCategory}</span>
                  <span className="text-lg font-black text-slate-900">
                    {categorySummaries.find(c => c.category === activeCategory)?.percentage.toFixed(0)}%
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">
                    {currency}
                    {categorySummaries.find(c => c.category === activeCategory)?.total.toFixed(0)}
                  </span>
                </>
              ) : (
                <>
                  <PieIcon size={20} className="text-emerald-600 mb-0.5" />
                  <span className="text-sm font-extrabold text-slate-900">
                    {currency}
                    {totalSpending.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Total</span>
                </>
              )}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="w-full sm:w-48 space-y-2">
            {nonZeroCategories.map(item => {
              const cat = CATEGORIES[item.category];
              const isSelected = activeCategory === item.category;
              return (
                <button
                  key={item.category}
                  onClick={() =>
                    setActiveCategory(prev => (prev === item.category ? null : item.category))
                  }
                  className={`w-full flex items-center justify-between text-xs p-1.5 rounded-xl transition-all ${
                    isSelected ? 'bg-emerald-50 font-bold border border-emerald-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-700 font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 mr-1.5">
                      {item.percentage.toFixed(0)}%
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      ({currency}
                      {item.total.toFixed(0)})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Expense Comparison Bar Chart */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BarChart2 size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Monthly Spending Trends</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Last 4 Months</span>
        </div>

        <div className="pt-4 flex items-end justify-between gap-3 h-36 px-2">
          {monthlyData.map(m => {
            const barHeightPercent = (m.total / maxMonthTotal) * 100;
            return (
              <div key={m.label} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-700 mb-1 opacity-80 group-hover:opacity-100">
                  {currency}
                  {m.total.toFixed(0)}
                </span>
                <div className="w-full bg-slate-100 rounded-t-xl h-24 flex items-end p-0.5">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-700 to-teal-500 rounded-t-lg transition-all duration-500 group-hover:from-emerald-600 group-hover:to-teal-400 shadow-xs"
                    style={{ height: `${Math.max(barHeightPercent, 6)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 mt-2">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category-Wise Progress Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Category-Wise Summary</h3>

        <div className="space-y-3 pt-1">
          {categorySummaries.map(item => {
            const cat = CATEGORIES[item.category];
            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={item.category} size={14} />
                    <span className="font-bold text-slate-800">{item.category}</span>
                    <span className="text-slate-400 text-[10px]">({item.count} items)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {currency}
                      {item.total.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      {item.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
