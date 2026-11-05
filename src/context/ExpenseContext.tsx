import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Expense,
  ExpenseCategory,
  FilterState,
  ActiveScreen,
  CategorySummary,
} from '../types/expense';
import { CATEGORY_LIST } from '../constants/categories';
import { storageService, getInitialSampleExpenses } from '../services/storageService';

interface ExpenseContextType {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  currency: string;
  monthlyBudget: number;
  filter: FilterState;
  activeScreen: ActiveScreen;
  selectedExpenseId: string | null;

  // Actions
  addExpense: (data: { amount: number; category: ExpenseCategory; date: string; note?: string }) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setMonthlyBudget: (amount: number) => void;
  setCurrency: (symbol: string) => void;
  setFilter: (update: Partial<FilterState>) => void;
  resetFilter: () => void;
  setActiveScreen: (screen: ActiveScreen, expenseId?: string | null) => void;
  resetToInitialDemo: () => void;
  clearAllExpenses: () => void;

  // Computed data
  totalSpending: number;
  todaySpending: number;
  currentMonthSpending: number;
  filteredExpenses: Expense[];
  categorySummaries: CategorySummary[];
  recentExpenses: Expense[];
  getExpenseById: (id: string) => Expense | undefined;
}

const defaultFilter: FilterState = {
  category: 'All',
  dateFilter: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrencyState] = useState<string>('$');
  const [monthlyBudget, setMonthlyBudgetState] = useState<number>(500);
  const [filter, setFilterState] = useState<FilterState>(defaultFilter);
  const [activeScreen, setActiveScreenState] = useState<ActiveScreen>('dashboard');
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Initialize from storage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      const loaded = storageService.getExpenses();
      setExpenses(loaded);
      setCurrencyState(storageService.getCurrency());
      setMonthlyBudgetState(storageService.getBudget());
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load local data');
      setIsLoading(false);
    }
  }, []);

  // Save whenever expenses change
  const persistExpenses = (updated: Expense[]) => {
    setExpenses(updated);
    storageService.saveExpenses(updated);
  };

  const addExpense = (data: { amount: number; category: ExpenseCategory; date: string; note?: string }) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: data.amount,
      category: data.category,
      date: data.date,
      note: data.note || '',
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    persistExpenses(updated);
  };

  const updateExpense = (updated: Expense) => {
    const next = expenses.map(e => (e.id === updated.id ? updated : e));
    persistExpenses(next);
  };

  const deleteExpense = (id: string) => {
    const next = expenses.filter(e => e.id !== id);
    persistExpenses(next);
    if (selectedExpenseId === id) {
      setSelectedExpenseId(null);
    }
  };

  const setMonthlyBudget = (amount: number) => {
    setMonthlyBudgetState(amount);
    storageService.saveBudget(amount);
  };

  const setCurrency = (symbol: string) => {
    setCurrencyState(symbol);
    storageService.saveCurrency(symbol);
  };

  const setFilter = (update: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...update }));
  };

  const resetFilter = () => {
    setFilterState(defaultFilter);
  };

  const setActiveScreen = (screen: ActiveScreen, expenseId?: string | null) => {
    setActiveScreenState(screen);
    if (expenseId !== undefined) {
      setSelectedExpenseId(expenseId);
    }
  };

  const resetToInitialDemo = () => {
    const initial = getInitialSampleExpenses();
    persistExpenses(initial);
  };

  const clearAllExpenses = () => {
    persistExpenses([]);
  };

  // Helper getters
  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const todaySpending = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return expenses
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const currentMonthSpending = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Compute week start
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
    startOfWeek.setHours(0, 0, 0, 0);

    return expenses
      .filter(expense => {
        // Category filter
        if (filter.category !== 'All' && expense.category !== filter.category) {
          return false;
        }

        // Date filter
        if (filter.dateFilter === 'today') {
          if (expense.date !== todayStr) return false;
        } else if (filter.dateFilter === 'week') {
          const expDate = new Date(expense.date);
          if (expDate < startOfWeek) return false;
        } else if (filter.dateFilter === 'month') {
          const expDate = new Date(expense.date);
          if (
            expDate.getFullYear() !== now.getFullYear() ||
            expDate.getMonth() !== now.getMonth()
          ) {
            return false;
          }
        } else if (filter.dateFilter === 'custom') {
          if (filter.customStartDate && expense.date < filter.customStartDate) return false;
          if (filter.customEndDate && expense.date > filter.customEndDate) return false;
        }

        // Search query filter
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase();
          const matchCategory = expense.category.toLowerCase().includes(q);
          const matchNote = (expense.note || '').toLowerCase().includes(q);
          if (!matchCategory && !matchNote) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filter.sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filter.sortBy === 'amount-high') {
          return b.amount - a.amount;
        }
        if (filter.sortBy === 'amount-low') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [expenses, filter]);

  const categorySummaries = useMemo<CategorySummary[]>(() => {
    const total = totalSpending;
    return CATEGORY_LIST.map(category => {
      const catExpenses = expenses.filter(e => e.category === category);
      const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      const count = catExpenses.length;
      const percentage = total > 0 ? (catTotal / total) * 100 : 0;
      return {
        category,
        total: catTotal,
        count,
        percentage,
      };
    });
  }, [expenses, totalSpending]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const getExpenseById = (id: string) => {
    return expenses.find(e => e.id === id);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        error,
        currency,
        monthlyBudget,
        filter,
        activeScreen,
        selectedExpenseId,
        addExpense,
        updateExpense,
        deleteExpense,
        setMonthlyBudget,
        setCurrency,
        setFilter,
        resetFilter,
        setActiveScreen,
        resetToInitialDemo,
        clearAllExpenses,
        totalSpending,
        todaySpending,
        currentMonthSpending,
        filteredExpenses,
        categorySummaries,
        recentExpenses,
        getExpenseById,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
