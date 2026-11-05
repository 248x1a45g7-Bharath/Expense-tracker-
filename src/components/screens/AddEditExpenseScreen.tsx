import React, { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  FileText,
  Check,
  X,
  AlertCircle,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { ExpenseCategory } from '../../types/expense';
import { CATEGORY_LIST, CATEGORIES } from '../../constants/categories';
import { CategoryIcon } from '../CategoryIcon';

export const AddEditExpenseScreen: React.FC = () => {
  const {
    activeScreen,
    selectedExpenseId,
    getExpenseById,
    addExpense,
    updateExpense,
    setActiveScreen,
    currency,
  } = useExpenses();

  const isEditing = activeScreen === 'edit' && !!selectedExpenseId;
  const existingExpense = isEditing ? getExpenseById(selectedExpenseId!) : undefined;

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<{ amount?: string; date?: string }>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing && existingExpense) {
      setAmount(existingExpense.amount.toString());
      setCategory(existingExpense.category);
      setDate(existingExpense.date);
      setNote(existingExpense.note || '');
    } else {
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
    setErrors({});
  }, [isEditing, existingExpense]);

  const validate = () => {
    const errs: { amount?: string; date?: string } = {};

    if (!amount.trim()) {
      errs.amount = 'Expense amount is required';
    } else {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        errs.amount = 'Please enter a valid amount greater than 0';
      } else if (num > 1000000) {
        errs.amount = 'Amount exceeds maximum allowable threshold';
      }
    }

    if (!date) {
      errs.date = 'Expense date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const parsedAmount = parseFloat(amount);

    if (isEditing && existingExpense) {
      updateExpense({
        ...existingExpense,
        amount: parsedAmount,
        category,
        date,
        note: note.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setActiveScreen('detail', existingExpense.id);
      }, 500);
    } else {
      addExpense({
        amount: parsedAmount,
        category,
        date,
        note: note.trim(),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setActiveScreen('dashboard');
      }, 500);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 bg-slate-50/70">
      {/* Top Banner card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveScreen(isEditing ? 'detail' : 'dashboard', selectedExpenseId)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isEditing ? 'Edit Expense Record' : 'Record New Expense'}
            </h2>
            <p className="text-xs text-slate-400">
              {isEditing ? 'Modify amount, category, or note' : 'Fill details below to log transaction'}
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
          {currency}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
            <span>Expense Amount *</span>
            <span className="text-[11px] font-semibold text-emerald-600 lowercase">required</span>
          </label>

          <div className="relative">
            <span className="absolute left-4 top-3 text-2xl font-black text-emerald-700 select-none">
              {currency}
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => {
                setAmount(e.target.value);
                if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
              }}
              className={`w-full pl-12 pr-4 py-3 text-2xl font-black rounded-xl border transition-all placeholder:text-slate-300 text-slate-900 focus:outline-none ${
                errors.amount
                  ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
          </div>

          {errors.amount && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle size={13} />
              <span>{errors.amount}</span>
            </p>
          )}

          {/* Quick preset amount chips */}
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Quick:</span>
            {[5, 10, 20, 50, 100].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val.toString())}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-bold transition-all border border-slate-200"
              >
                +{currency}
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector Grid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Select Category *
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORY_LIST.map(cat => {
              const isSelected = category === cat;
              const catData = CATEGORIES[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs scale-102 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <CategoryIcon category={cat} size={15} />
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-bold truncate ${
                        isSelected ? 'text-emerald-900' : 'text-slate-800'
                      }`}
                    >
                      {cat}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Expense Date *
          </label>

          <div className="relative">
            <input
              type="date"
              value={date}
              max={new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]}
              onChange={e => {
                setDate(e.target.value);
                if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
              }}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
            />
          </div>

          {errors.date && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle size={13} />
              <span>{errors.date}</span>
            </p>
          )}
        </div>

        {/* Optional Note Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Note / Description
            </label>
            <span className="text-[11px] text-slate-400">Optional</span>
          </div>

          <textarea
            rows={3}
            placeholder="e.g. Lunch with group project teammates at campus cafeteria"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            {isSuccess ? (
              <>
                <Check size={18} />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Confirm & Add Expense'}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen(isEditing ? 'detail' : 'dashboard', selectedExpenseId)}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-2xl border border-slate-200 transition-colors text-xs"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
