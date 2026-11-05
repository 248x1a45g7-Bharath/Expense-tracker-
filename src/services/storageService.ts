import { Expense } from '../types/expense';

const EXPENSES_STORAGE_KEY = 'smartspend_flutter_expenses_v1';
const BUDGET_STORAGE_KEY = 'smartspend_flutter_budget_v1';
const CURRENCY_STORAGE_KEY = 'smartspend_flutter_currency_v1';

export const getInitialSampleExpenses = (): Expense[] => {
  const today = new Date();
  const formatDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(today.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'exp-1',
      title: 'College Cafeteria Lunch',
      amount: 14.5,
      category: 'Food',
      date: formatDate(0), // Today
      note: 'Sandwich, iced tea, and apple with friends',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'exp-2',
      title: 'Metro Transit Card Recharge',
      amount: 25.0,
      category: 'Travel',
      date: formatDate(0), // Today
      note: 'Monthly commute fare pass',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'exp-3',
      title: 'Data Structures Textbook',
      amount: 45.0,
      category: 'Education',
      date: formatDate(2),
      note: 'Required textbook for semester 5 exam preparation',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'exp-4',
      title: 'Campus High-Speed Internet',
      amount: 32.0,
      category: 'Bills',
      date: formatDate(4),
      note: 'Dorm Wi-Fi split with roommates',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'exp-5',
      title: 'Cinema Weekend Movie Ticket',
      amount: 18.0,
      category: 'Entertainment',
      date: formatDate(6),
      note: 'IMAX weekend show ticket with popcorn',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: 'exp-6',
      title: 'New Running Shoes',
      amount: 68.0,
      category: 'Shopping',
      date: formatDate(10),
      note: 'Sport store discount sale',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      id: 'exp-7',
      title: 'Pharmacy Vitamins & Bandages',
      amount: 12.5,
      category: 'Others',
      date: formatDate(12),
      note: 'First-aid kit and vitamin C supplements',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
  ];
};

export const storageService = {
  getExpenses: (): Expense[] => {
    try {
      const data = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // If first run, provide initial realistic college demo expenses so the screen is not empty
      const initial = getInitialSampleExpenses();
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    } catch (e) {
      console.error('Error reading expenses from storage:', e);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Error saving expenses to storage:', e);
    }
  },

  getBudget: (): number => {
    try {
      const b = localStorage.getItem(BUDGET_STORAGE_KEY);
      return b ? parseFloat(b) : 500;
    } catch {
      return 500;
    }
  },

  saveBudget: (budget: number): void => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, budget.toString());
    } catch (e) {
      console.error('Error saving budget:', e);
    }
  },

  getCurrency: (): string => {
    try {
      return localStorage.getItem(CURRENCY_STORAGE_KEY) || '$';
    } catch {
      return '$';
    }
  },

  saveCurrency: (symbol: string): void => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, symbol);
    } catch (e) {
      console.error('Error saving currency:', e);
    }
  },

  exportToCSV: (expenses: Expense[], currency: string): void => {
    const headers = ['ID', 'Category', 'Amount', 'Currency', 'Date', 'Note', 'Created At'];
    const rows = expenses.map(e => [
      e.id,
      e.category,
      e.amount.toFixed(2),
      currency,
      e.date,
      `"${(e.note || '').replace(/"/g, '""')}"`,
      e.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartSpend_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToJSON: (expenses: Expense[]): void => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SmartSpend_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },
};
