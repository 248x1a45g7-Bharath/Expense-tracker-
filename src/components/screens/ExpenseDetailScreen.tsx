import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  Receipt,
  Share2,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { CategoryIcon } from '../CategoryIcon';
import { CATEGORIES } from '../../constants/categories';

export const ExpenseDetailScreen: React.FC = () => {
  const {
    selectedExpenseId,
    getExpenseById,
    deleteExpense,
    setActiveScreen,
    currency,
  } = useExpenses();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const expense = selectedExpenseId ? getExpenseById(selectedExpenseId) : undefined;

  if (!expense) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-slate-50">
        <Receipt size={48} className="text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Expense Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This expense record may have been deleted or moved.
        </p>
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const cat = CATEGORIES[expense.category] || CATEGORIES.Others;

  const handleDelete = () => {
    deleteExpense(expense.id);
    setShowDeleteModal(false);
    setActiveScreen('list');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 bg-slate-50/70">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('list')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft size={16} />
          <span>All Expenses</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('edit', expense.id)}
            className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
            title="Edit Expense"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
            title="Delete Expense"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Receipt Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Top Decorative Category Watermark */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-dashed border-slate-200">
          <CategoryIcon category={expense.category} size={28} className="mb-3 scale-110" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {expense.category}
          </span>
          <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-baseline justify-center gap-1">
            <span className="text-emerald-700 font-extrabold">{currency}</span>
            <span>{expense.amount.toFixed(2)}</span>
          </div>
          <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
            Logged Expense
          </span>
        </div>

        {/* Details Grid */}
        <div className="py-5 space-y-4 text-xs">
          <div className="flex items-start justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Calendar size={14} className="text-emerald-600" />
              Expense Date
            </span>
            <span className="font-bold text-slate-800 text-right">{expense.date}</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Receipt size={14} className="text-emerald-600" />
              Category
            </span>
            <span className="font-bold text-slate-800 text-right">{cat.name} ({cat.description})</span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-600" />
              Created At
            </span>
            <span className="font-medium text-slate-600 text-right">
              {new Date(expense.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          {/* Note section */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1.5">
              <FileText size={14} className="text-emerald-600" />
              Note / Description
            </span>
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-700 font-medium text-xs border border-slate-100 italic">
              {expense.note ? `"${expense.note}"` : 'No description provided for this transaction.'}
            </div>
          </div>
        </div>

        {/* Bottom Jagged Receipt Line */}
        <div className="pt-2 flex justify-between gap-1 text-slate-200 select-none">
          {Array.from({ length: 18 }).map((_, idx) => (
            <span key={idx} className="w-2 h-1 bg-slate-200 rounded-full" />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => setActiveScreen('edit', expense.id)}
          className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Edit3 size={15} />
          <span>Edit Details</span>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="py-3 px-4 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Trash2 size={15} />
          <span>Delete Expense</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-red-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-800">Delete this expense?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete the expense of {currency}
                {expense.amount.toFixed(2)} ({expense.category})? This action cannot be reversed.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
