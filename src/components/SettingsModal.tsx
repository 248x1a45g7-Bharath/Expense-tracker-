import React, { useState } from 'react';
import { X, DollarSign, Target, Download, Upload, RotateCcw, Trash2, Check } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { CURRENCY_SYMBOLS } from '../constants/categories';
import { storageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    currency,
    setCurrency,
    monthlyBudget,
    setMonthlyBudget,
    expenses,
    resetToInitialDemo,
    clearAllExpenses,
  } = useExpenses();

  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 2000);
    }
  };

  const handleExportCSV = () => {
    storageService.exportToCSV(expenses, currency);
  };

  const handleExportJSON = () => {
    storageService.exportToJSON(expenses);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ⚙️
            </div>
            <h3 className="text-lg font-bold text-slate-800">SmartSpend Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          {/* Currency Preference */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Currency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CURRENCY_SYMBOLS).map(([code, info]) => {
                const isSelected = currency === info.symbol;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(info.symbol)}
                    className={`py-2 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-base font-bold">{info.symbol}</span>
                    <span>{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly Budget Goal */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Monthly Budget Target
            </label>
            <form onSubmit={handleSaveBudget} className="flex space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">{currency}</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1"
              >
                {showSavedMsg ? <Check size={16} /> : <span>Update</span>}
              </button>
            </form>
            {showSavedMsg && (
              <p className="text-xs text-emerald-600 font-medium mt-1">Budget updated successfully!</p>
            )}
          </div>

          {/* Data Export / Backup */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Data Backup & Export
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportCSV}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download size={15} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download size={15} />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Reset / Clear Section */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Demo & Storage Management
            </label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  resetToInitialDemo();
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <RotateCcw size={15} />
                <span>Restore College Demo Dataset</span>
              </button>

              {confirmClear ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <p className="text-xs text-red-700 font-semibold">
                    Are you sure? All {expenses.length} expenses will be deleted permanently.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        clearAllExpenses();
                        setConfirmClear(false);
                        onClose();
                      }}
                      className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full py-2 px-3 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Clear All Expenses (Start Clean)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
