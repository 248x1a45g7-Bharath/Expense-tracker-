import React from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  Calendar,
  Layers,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryIcon } from '../CategoryIcon';
import { CATEGORY_LIST } from '../../constants/categories';
import { DateFilterType, ExpenseCategory, SortOption } from '../../types/expense';

export const ExpenseListScreen: React.FC = () => {
  const {
    filteredExpenses,
    currency,
    filter,
    setFilter,
    resetFilter,
    setActiveScreen,
    expenses,
  } = useExpenses();

  const dateFilterOptions: { type: DateFilterType; label: string }[] = [
    { type: 'all', label: 'All Time' },
    { type: 'today', label: 'Today' },
    { type: 'week', label: 'This Week' },
    { type: 'month', label: 'This Month' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount-high', label: 'Highest Amount' },
    { value: 'amount-low', label: 'Lowest Amount' },
  ];

  const isFiltered = filter.category !== 'All' || filter.dateFilter !== 'all' || filter.searchQuery.trim() !== '';

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/60">
      {/* Sticky Top Filter Panel */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 space-y-2.5 shrink-0 shadow-xs">
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes or category..."
            value={filter.searchQuery}
            onChange={e => setFilter({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-9 py-2 text-xs font-medium rounded-xl bg-slate-100/90 border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter({ searchQuery: '' })}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Date Filter & Sort Controls */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Date Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {dateFilterOptions.map(opt => {
              const isSelected = filter.dateFilter === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => setFilter({ dateFilter: opt.type })}
                  className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-all text-[11px] ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filter.sortBy}
              onChange={e => setFilter({ sortBy: e.target.value as SortOption })}
              className="appearance-none bg-slate-100 text-slate-700 font-semibold text-[11px] py-1 pl-6 pr-6 rounded-full border-none focus:outline-none cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={12} className="absolute left-2 top-2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <button
            onClick={() => setFilter({ category: 'All' })}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter.category === 'All'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {CATEGORY_LIST.map(cat => {
            const isSelected = filter.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter({ category: cat })}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Summary & Count Header */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 bg-slate-100/50">
        <span className="font-semibold">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </span>
        {isFiltered && (
          <button
            onClick={resetFilter}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <X size={12} />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Expenses List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 pb-24">
        {filteredExpenses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 my-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <FolderOpen size={28} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">No matching expenses found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try adjusting your category filter, clearing your search keywords, or selecting another date range.
            </p>
            {isFiltered && (
              <button
                onClick={resetFilter}
                className="mt-3 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl hover:bg-emerald-200 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredExpenses.map(expense => (
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
                  <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[200px]">
                    {expense.note ? expense.note : 'No note provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    -{currency}
                    {expense.amount.toFixed(2)}
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
