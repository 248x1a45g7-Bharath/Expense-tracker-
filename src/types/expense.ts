export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Education'
  | 'Bills'
  | 'Entertainment'
  | 'Others';

export interface Expense {
  id: string;
  title?: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO format 'YYYY-MM-DD'
  note?: string;
  createdAt: string;
}

export interface CategoryInfo {
  name: ExpenseCategory;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom';
export type SortOption = 'newest' | 'oldest' | 'amount-high' | 'amount-low';

export interface FilterState {
  category: ExpenseCategory | 'All';
  dateFilter: DateFilterType;
  customStartDate?: string;
  customEndDate?: string;
  searchQuery: string;
  sortBy: SortOption;
}

export type ActiveScreen = 'dashboard' | 'list' | 'add' | 'edit' | 'detail' | 'analytics' | 'code';

export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
}
