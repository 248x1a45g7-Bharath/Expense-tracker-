import { CategoryInfo, ExpenseCategory } from '../types/expense';

export const CATEGORIES: Record<ExpenseCategory, CategoryInfo> = {
  Food: {
    name: 'Food',
    iconName: 'Utensils',
    color: '#059669', // Emerald 600
    bgColor: '#ECFDF5', // Emerald 50
    borderColor: '#A7F3D0',
    description: 'Groceries, dining, snacks & beverages',
  },
  Travel: {
    name: 'Travel',
    iconName: 'Plane',
    color: '#0D9488', // Teal 600
    bgColor: '#F0FDFA', // Teal 50
    borderColor: '#99F6E4',
    description: 'Fuel, public transit, flights & cabs',
  },
  Shopping: {
    name: 'Shopping',
    iconName: 'ShoppingBag',
    color: '#10B981', // Emerald 500
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    description: 'Clothing, gadgets, accessories & goods',
  },
  Education: {
    name: 'Education',
    iconName: 'GraduationCap',
    color: '#15803D', // Green 700
    bgColor: '#F0FDF4',
    borderColor: '#86EFAC',
    description: 'Books, college courses, fees & stationery',
  },
  Bills: {
    name: 'Bills',
    iconName: 'Receipt',
    color: '#047857', // Emerald 700
    bgColor: '#ECFDF5',
    borderColor: '#6EE7B7',
    description: 'Electricity, water, rent, mobile & wifi',
  },
  Entertainment: {
    name: 'Entertainment',
    iconName: 'Film',
    color: '#16A34A', // Green 600
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
    description: 'Movies, streaming, games & events',
  },
  Others: {
    name: 'Others',
    iconName: 'MoreHorizontal',
    color: '#475569', // Slate 600
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    description: 'Miscellaneous and unexpected spending',
  },
};

export const CATEGORY_LIST: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Shopping',
  'Education',
  'Bills',
  'Entertainment',
  'Others',
];

export const CURRENCY_SYMBOLS: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar ($)' },
  INR: { symbol: '₹', name: 'Indian Rupee (₹)' },
  EUR: { symbol: '€', name: 'Euro (€)' },
  GBP: { symbol: '£', name: 'British Pound (£)' },
  JPY: { symbol: '¥', name: 'Japanese Yen (¥)' },
};
