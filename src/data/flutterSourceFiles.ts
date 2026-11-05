import JSZip from 'jszip';

export interface FlutterFile {
  path: string;
  name: string;
  folder: string;
  language: 'dart' | 'yaml' | 'markdown';
  content: string;
  description: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    folder: 'root',
    language: 'yaml',
    description: 'Flutter project dependencies (Provider, SharedPreferences, Intl, FL Chart)',
    content: `name: smartspend
description: SmartSpend – Expense Tracker Android Application for College Project.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State Management as required by project specification
  provider: ^6.1.2
  # Local Storage for offline persistence
  shared_preferences: ^2.2.2
  # Date formatting & internationalization
  intl: ^0.19.0
  # Beautiful Charts for Analytics Screen
  fl_chart: ^0.66.2
  # Material Icons
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    folder: 'lib',
    language: 'dart',
    description: 'Application entry point, MultiProvider configuration, and Green & White theme',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/expense_provider.dart';
import 'screens/dashboard_screen.dart';
import 'screens/expense_list_screen.dart';
import 'screens/analytics_screen.dart';
import 'screens/add_edit_expense_screen.dart';

void main() async {
  // Ensure Flutter engine bindings are initialized before accessing local storage
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartSpendApp());
}

class SmartSpendApp extends StatelessWidget {
  const SmartSpendApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => ExpenseProvider()..loadExpenses(),
        ),
      ],
      child: MaterialApp(
        title: 'SmartSpend',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF059669), // Emerald Green
            primary: const Color(0xFF059669),
            onPrimary: Colors.white,
            primaryContainer: const Color(0xFFD1FAE5),
            onPrimaryContainer: const Color(0xFF064E3B),
            secondary: const Color(0xFF0D9488),
            surface: Colors.white,
            onSurface: const Color(0xFF0F172A),
            background: const Color(0xFFF8FAFC),
          ),
          scaffoldBackgroundColor: const Color(0xFFF8FAFC),
          appBarTheme: const AppBarTheme(
            elevation: 0,
            centerTitle: true,
            backgroundColor: Color(0xFF059669),
            foregroundColor: Colors.white,
            titleTextStyle: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.2,
            ),
          ),
          cardTheme: CardTheme(
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.grey.shade200),
            ),
            color: Colors.white,
          ),
          floatingActionButtonTheme: const FloatingActionButtonThemeData(
            backgroundColor: Color(0xFF059669),
            foregroundColor: Colors.white,
            elevation: 4,
          ),
          fontFamily: 'Roboto',
        ),
        home: const MainNavigationScreen(),
      ),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DashboardScreen(),
    ExpenseListScreen(),
    AnalyticsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFD1FAE5),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: Color(0xFF059669)),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long, color: Color(0xFF059669)),
            label: 'Expenses',
          ),
          NavigationDestination(
            icon: Icon(Icons.pie_chart_outline),
            selectedIcon: Icon(Icons.pie_chart, color: Color(0xFF059669)),
            label: 'Analytics',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        tooltip: 'Add Expense',
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AddEditExpenseScreen(),
            ),
          );
        },
        child: const Icon(Icons.add, size: 28),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/expense_model.dart',
    name: 'expense_model.dart',
    folder: 'lib/models',
    language: 'dart',
    description: 'Expense data model with JSON serialization and Category enumeration',
    content: `import 'package:flutter/material.dart';

enum ExpenseCategory {
  food,
  travel,
  shopping,
  education,
  bills,
  entertainment,
  others,
}

extension ExpenseCategoryExtension on ExpenseCategory {
  String get name {
    switch (this) {
      case ExpenseCategory.food:
        return 'Food';
      case ExpenseCategory.travel:
        return 'Travel';
      case ExpenseCategory.shopping:
        return 'Shopping';
      case ExpenseCategory.education:
        return 'Education';
      case ExpenseCategory.bills:
        return 'Bills';
      case ExpenseCategory.entertainment:
        return 'Entertainment';
      case ExpenseCategory.others:
        return 'Others';
    }
  }

  IconData get icon {
    switch (this) {
      case ExpenseCategory.food:
        return Icons.restaurant;
      case ExpenseCategory.travel:
        return Icons.directions_bus;
      case ExpenseCategory.shopping:
        return Icons.shopping_bag;
      case ExpenseCategory.education:
        return Icons.school;
      case ExpenseCategory.bills:
        return Icons.receipt_long;
      case ExpenseCategory.entertainment:
        return Icons.movie;
      case ExpenseCategory.others:
        return Icons.category;
    }
  }

  Color get color {
    switch (this) {
      case ExpenseCategory.food:
        return const Color(0xFF059669); // Emerald
      case ExpenseCategory.travel:
        return const Color(0xFF0D9488); // Teal
      case ExpenseCategory.shopping:
        return const Color(0xFF10B981); // Emerald light
      case ExpenseCategory.education:
        return const Color(0xFF15803D); // Green 700
      case ExpenseCategory.bills:
        return const Color(0xFF047857); // Green 800
      case ExpenseCategory.entertainment:
        return const Color(0xFF16A34A); // Green 600
      case ExpenseCategory.others:
        return const Color(0xFF64748B); // Slate
    }
  }

  Color get lightColor {
    return color.withOpacity(0.12);
  }

  static ExpenseCategory fromString(String categoryName) {
    return ExpenseCategory.values.firstWhere(
      (e) => e.name.toLowerCase() == categoryName.toLowerCase(),
      orElse: () => ExpenseCategory.others,
    );
  }
}

class Expense {
  final String id;
  final double amount;
  final ExpenseCategory category;
  final DateTime date;
  final String note;
  final DateTime createdAt;

  Expense({
    required this.id,
    required this.amount,
    required this.category,
    required this.date,
    this.note = '',
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  // Convert an Expense object to a JSON Map for local storage
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'category': category.name,
      'date': date.toIso8601String(),
      'note': note,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  // Create an Expense object from a JSON Map
  factory Expense.fromJson(Map<String, dynamic> map) {
    return Expense(
      id: map['id'] as String,
      amount: (map['amount'] as num).toDouble(),
      category: ExpenseCategoryExtension.fromString(map['category'] as String),
      date: DateTime.parse(map['date'] as String),
      note: (map['note'] ?? '') as String,
      createdAt: map['createdAt'] != null
          ? DateTime.parse(map['createdAt'] as String)
          : DateTime.now(),
    );
  }

  // Copy with method for editing
  Expense copyWith({
    String? id,
    double? amount,
    ExpenseCategory? category,
    DateTime? date,
    String? note,
  }) {
    return Expense(
      id: id ?? this.id,
      amount: amount ?? this.amount,
      category: category ?? this.category,
      date: date ?? this.date,
      note: note ?? this.note,
      createdAt: createdAt,
    );
  }
}
`,
  },
  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    folder: 'lib/services',
    language: 'dart',
    description: 'Local persistence service using SharedPreferences (Offline-first)',
    content: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/expense_model.dart';

class StorageService {
  static const String _keyExpenses = 'smartspend_saved_expenses';
  static const String _keyBudget = 'smartspend_user_budget';

  // Save list of expenses into SharedPreferences as JSON string
  Future<bool> saveExpenses(List<Expense> expenses) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<Map<String, dynamic>> jsonList =
          expenses.map((e) => e.toJson()).toList();
      final String encoded = jsonEncode(jsonList);
      return await prefs.setString(_keyExpenses, encoded);
    } catch (e) {
      debugPrint('Error saving expenses to local storage: \$e');
      return false;
    }
  }

  // Read list of expenses from SharedPreferences
  Future<List<Expense>> loadExpenses() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? encoded = prefs.getString(_keyExpenses);
      if (encoded == null || encoded.isEmpty) {
        return [];
      }
      final List<dynamic> decoded = jsonDecode(encoded);
      return decoded.map((item) => Expense.fromJson(item as Map<String, dynamic>)).toList();
    } catch (e) {
      debugPrint('Error loading expenses from local storage: \$e');
      return [];
    }
  }

  // Save monthly budget target
  Future<bool> saveMonthlyBudget(double budget) async {
    final prefs = await SharedPreferences.getInstance();
    return await prefs.setDouble(_keyBudget, budget);
  }

  // Get saved monthly budget target
  Future<double> getMonthlyBudget() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(_keyBudget) ?? 500.0;
  }
}
`,
  },
  {
    path: 'lib/providers/expense_provider.dart',
    name: 'expense_provider.dart',
    folder: 'lib/providers',
    language: 'dart',
    description: 'ChangeNotifier state manager with loading, error, and CRUD operations',
    content: `import 'package:flutter/material.dart';
import '../models/expense_model.dart';
import '../services/storage_service.dart';

enum ViewFilter { all, today, thisWeek, thisMonth }

class ExpenseProvider extends ChangeNotifier {
  final StorageService _storageService = StorageService();

  List<Expense> _expenses = [];
  bool _isLoading = false;
  String? _errorMessage;
  double _monthlyBudget = 500.0;

  // Filters
  ExpenseCategory? _selectedCategory;
  ViewFilter _dateFilter = ViewFilter.all;
  String _searchQuery = '';

  // Getters
  List<Expense> get expenses => _expenses;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  double get monthlyBudget => _monthlyBudget;
  ExpenseCategory? get selectedCategory => _selectedCategory;
  ViewFilter get dateFilter => _dateFilter;
  String get searchQuery => _searchQuery;

  // Filtered expenses based on category, date, and search
  List<Expense> get filteredExpenses {
    final now = DateTime.now();

    return _expenses.where((expense) {
      // 1. Category Filter
      if (_selectedCategory != null && expense.category != _selectedCategory) {
        return false;
      }

      // 2. Date Filter
      switch (_dateFilter) {
        case ViewFilter.today:
          if (expense.date.year != now.year ||
              expense.date.month != now.month ||
              expense.date.day != now.day) {
            return false;
          }
          break;
        case ViewFilter.thisWeek:
          final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
          final startOfMonday = DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day);
          if (expense.date.isBefore(startOfMonday)) {
            return false;
          }
          break;
        case ViewFilter.thisMonth:
          if (expense.date.year != now.year || expense.date.month != now.month) {
            return false;
          }
          break;
        case ViewFilter.all:
          break;
      }

      // 3. Search Query
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final noteMatch = expense.note.toLowerCase().contains(query);
        final catMatch = expense.category.name.toLowerCase().contains(query);
        if (!noteMatch && !catMatch) {
          return false;
        }
      }

      return true;
    }).toList()
      ..sort((a, b) => b.date.compareTo(a.date)); // Newest first
  }

  // Analytics & Summary Getters
  double get totalSpending => _expenses.fold(0.0, (sum, e) => sum + e.amount);

  double get todaySpending {
    final now = DateTime.now();
    return _expenses
        .where((e) =>
            e.date.year == now.year &&
            e.date.month == now.month &&
            e.date.day == now.day)
        .fold(0.0, (sum, e) => sum + e.amount);
  }

  double get monthlySpending {
    final now = DateTime.now();
    return _expenses
        .where((e) => e.date.year == now.year && e.date.month == now.month)
        .fold(0.0, (sum, e) => sum + e.amount);
  }

  Map<ExpenseCategory, double> get categoryTotals {
    final Map<ExpenseCategory, double> map = {};
    for (var cat in ExpenseCategory.values) {
      map[cat] = 0.0;
    }
    for (var expense in _expenses) {
      map[expense.category] = (map[expense.category] ?? 0.0) + expense.amount;
    }
    return map;
  }

  // Load from Local Storage
  Future<void> loadExpenses() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _expenses = await _storageService.loadExpenses();
      _monthlyBudget = await _storageService.getMonthlyBudget();
    } catch (e) {
      _errorMessage = 'Failed to load local expenses: \$e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add Expense
  Future<bool> addExpense(Expense expense) async {
    try {
      _expenses.add(expense);
      await _storageService.saveExpenses(_expenses);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Error saving expense: \$e';
      notifyListeners();
      return false;
    }
  }

  // Edit Expense
  Future<bool> updateExpense(Expense updated) async {
    final index = _expenses.indexWhere((e) => e.id == updated.id);
    if (index != -1) {
      _expenses[index] = updated;
      await _storageService.saveExpenses(_expenses);
      notifyListeners();
      return true;
    }
    return false;
  }

  // Delete Expense
  Future<bool> deleteExpense(String id) async {
    final initialCount = _expenses.length;
    _expenses.removeWhere((e) => e.id == id);
    if (_expenses.length < initialCount) {
      await _storageService.saveExpenses(_expenses);
      notifyListeners();
      return true;
    }
    return false;
  }

  // Set Filters
  void setCategoryFilter(ExpenseCategory? category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setDateFilter(ViewFilter filter) {
    _dateFilter = filter;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setMonthlyBudget(double budget) {
    _monthlyBudget = budget;
    _storageService.saveMonthlyBudget(budget);
    notifyListeners();
  }
}
`,
  },
  {
    path: 'lib/screens/dashboard_screen.dart',
    name: 'dashboard_screen.dart',
    folder: 'lib/screens',
    language: 'dart',
    description: 'Home / Dashboard Screen with Total, Today, Monthly spending, and Recent list',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/expense_provider.dart';
import '../models/expense_model.dart';
import '../widgets/expense_card.dart';
import 'expense_detail_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final currency = NumberFormat.simpleCurrency(decimalDigits: 2);

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.account_balance_wallet, size: 24),
            SizedBox(width: 8),
            Text('SmartSpend'),
          ],
        ),
      ),
      body: Consumer<ExpenseProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF059669)));
          }

          if (provider.errorMessage != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.red),
                  const SizedBox(height: 12),
                  Text(provider.errorMessage!),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () => provider.loadExpenses(),
                    child: const Text('Retry'),
                  )
                ],
              ),
            );
          }

          final recentExpenses = provider.expenses.toList()
            ..sort((a, b) => b.date.compareTo(a.date));
          final displayedRecent = recentExpenses.take(5).toList();

          final budgetPercent = provider.monthlyBudget > 0
              ? (provider.monthlySpending / provider.monthlyBudget).clamp(0.0, 1.0)
              : 0.0;

          return RefreshIndicator(
            onRefresh: () => provider.loadExpenses(),
            color: const Color(0xFF059669),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Gradient Emerald Total Expenses Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(22.0),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF047857), Color(0xFF10B981)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF059669).withOpacity(0.3),
                          blurRadius: 15,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Total Expenses',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Icon(Icons.trending_up, color: Colors.white70, size: 20),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          currency.format(provider.totalSpending),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Monthly Budget Progress Bar
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Monthly Budget: \${currency.format(provider.monthlyBudget)}',
                              style: const TextStyle(color: Colors.white, fontSize: 12),
                            ),
                            Text(
                              '\${(budgetPercent * 100).toStringAsFixed(0)}%',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: budgetPercent,
                            minHeight: 8,
                            backgroundColor: Colors.white24,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              budgetPercent > 0.9 ? Colors.amberAccent : Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Today & Monthly Spending Row
                  Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          title: "Today's Spend",
                          amount: currency.format(provider.todaySpending),
                          icon: Icons.calendar_today,
                          accentColor: const Color(0xFF0D9488),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _StatCard(
                          title: "This Month",
                          amount: currency.format(provider.monthlySpending),
                          icon: Icons.date_range,
                          accentColor: const Color(0xFF059669),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Category Breakdown Summary
                  const Text(
                    'Category Breakdown',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 94,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: ExpenseCategory.values.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        final cat = ExpenseCategory.values[index];
                        final catTotal = provider.categoryTotals[cat] ?? 0.0;
                        return Container(
                          width: 110,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.parseBorder(BorderSide(color: Colors.grey.shade200)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircleAvatar(
                                radius: 14,
                                backgroundColor: cat.lightColor,
                                child: Icon(cat.icon, size: 14, color: cat.color),
                              ),
                              const Spacer(),
                              Text(
                                cat.name,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              Text(
                                currency.format(catTotal),
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Recent Transactions Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Recent Transactions',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                      Text(
                        '\${provider.expenses.length} total',
                        style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  if (displayedRecent.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(28),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.receipt_long_outlined, size: 48, color: Colors.grey.shade400),
                          const SizedBox(height: 8),
                          const Text(
                            'No expenses recorded yet',
                            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Tap the green "+" button below to add your first expense.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                          ),
                        ],
                      ),
                    )
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: displayedRecent.length,
                      itemBuilder: (context, index) {
                        final expense = displayedRecent[index];
                        return ExpenseCard(
                          expense: expense,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ExpenseDetailScreen(expenseId: expense.id),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  const SizedBox(height: 80), // spacing for FAB
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String amount;
  final IconData icon;
  final Color accentColor;

  const _StatCard({
    required this.title,
    required this.amount,
    required this.icon,
    required this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 14,
                backgroundColor: accentColor.withOpacity(0.12),
                child: Icon(icon, size: 14, color: accentColor),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontWeight: FontWeight.w500),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            amount,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A),
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/expense_list_screen.dart',
    name: 'expense_list_screen.dart',
    folder: 'lib/screens',
    language: 'dart',
    description: 'Expense List Screen with Category filter chips, Date filters, and Search',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/expense_provider.dart';
import '../models/expense_model.dart';
import '../widgets/expense_card.dart';
import 'expense_detail_screen.dart';

class ExpenseListScreen extends StatefulWidget {
  const ExpenseListScreen({super.key});

  @override
  State<ExpenseListScreen> createState() => _ExpenseListScreenState();
}

class _ExpenseListScreenState extends State<ExpenseListScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ExpenseProvider>();
    final expenses = provider.filteredExpenses;

    return Scaffold(
      appBar: AppBar(
        title: const Text('All Expenses'),
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Column(
              children: [
                // Search Input
                TextField(
                  controller: _searchController,
                  onChanged: (val) => provider.setSearchQuery(val),
                  decoration: InputDecoration(
                    hintText: 'Search note or category...',
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF059669)),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              provider.setSearchQuery('');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFF059669), width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Date Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterDateChip(
                        label: 'All Time',
                        isSelected: provider.dateFilter == ViewFilter.all,
                        onTap: () => provider.setDateFilter(ViewFilter.all),
                      ),
                      const SizedBox(width: 8),
                      _FilterDateChip(
                        label: 'Today',
                        isSelected: provider.dateFilter == ViewFilter.today,
                        onTap: () => provider.setDateFilter(ViewFilter.today),
                      ),
                      const SizedBox(width: 8),
                      _FilterDateChip(
                        label: 'This Week',
                        isSelected: provider.dateFilter == ViewFilter.thisWeek,
                        onTap: () => provider.setDateFilter(ViewFilter.thisWeek),
                      ),
                      const SizedBox(width: 8),
                      _FilterDateChip(
                        label: 'This Month',
                        isSelected: provider.dateFilter == ViewFilter.thisMonth,
                        onTap: () => provider.setDateFilter(ViewFilter.thisMonth),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Category Chips Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.only(bottom: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  ChoiceChip(
                    label: const Text('All Categories'),
                    selected: provider.selectedCategory == null,
                    onSelected: (_) => provider.setCategoryFilter(null),
                    selectedColor: const Color(0xFF059669),
                    labelStyle: TextStyle(
                      color: provider.selectedCategory == null ? Colors.white : Colors.black87,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(width: 6),
                  ...ExpenseCategory.values.map((cat) {
                    final isSel = provider.selectedCategory == cat;
                    return Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        avatar: Icon(cat.icon, size: 14, color: isSel ? Colors.white : cat.color),
                        label: Text(cat.name),
                        selected: isSel,
                        onSelected: (_) => provider.setCategoryFilter(cat),
                        selectedColor: const Color(0xFF059669),
                        labelStyle: TextStyle(
                          color: isSel ? Colors.white : Colors.black87,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),

          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // Expense List Content
          Expanded(
            child: expenses.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.filter_list_off, size: 54, color: Colors.grey.shade400),
                          const SizedBox(height: 12),
                          const Text(
                            'No matching expenses found',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Try clearing your search query or choosing another filter.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: expenses.length,
                    itemBuilder: (context, index) {
                      final item = expenses[index];
                      return ExpenseCard(
                        expense: item,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ExpenseDetailScreen(expenseId: item.id),
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _FilterDateChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterDateChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFD1FAE5) : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF059669) : Colors.transparent,
            width: 1.2,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFF065F46) : const Color(0xFF475569),
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/add_edit_expense_screen.dart',
    name: 'add_edit_expense_screen.dart',
    folder: 'lib/screens',
    language: 'dart',
    description: 'Add and Edit Expense Screen with full form validation and category selector',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/expense_model.dart';
import '../providers/expense_provider.dart';

class AddEditExpenseScreen extends StatefulWidget {
  final Expense? expenseToEdit;

  const AddEditExpenseScreen({super.key, this.expenseToEdit});

  @override
  State<AddEditExpenseScreen> createState() => _AddEditExpenseScreenState();
}

class _AddEditExpenseScreenState extends State<AddEditExpenseScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();

  late ExpenseCategory _selectedCategory;
  late DateTime _selectedDate;
  bool _isSaving = false;

  bool get _isEditing => widget.expenseToEdit != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      final exp = widget.expenseToEdit!;
      _amountController.text = exp.amount.toStringAsFixed(2);
      _noteController.text = exp.note;
      _selectedCategory = exp.category;
      _selectedDate = exp.date;
    } else {
      _selectedCategory = ExpenseCategory.food;
      _selectedDate = DateTime.now();
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF059669),
              onPrimary: Colors.white,
              onSurface: Color(0xFF0F172A),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    final double amount = double.parse(_amountController.text.trim());

    setState(() {
      _isSaving = true;
    });

    final provider = context.read<ExpenseProvider>();

    if (_isEditing) {
      final updated = widget.expenseToEdit!.copyWith(
        amount: amount,
        category: _selectedCategory,
        date: _selectedDate,
        note: _noteController.text.trim(),
      );
      await provider.updateExpense(updated);
    } else {
      final newExpense = Expense(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        amount: amount,
        category: _selectedCategory,
        date: _selectedDate,
        note: _noteController.text.trim(),
      );
      await provider.addExpense(newExpense);
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing ? 'Expense updated successfully!' : 'Expense added successfully!'),
          backgroundColor: const Color(0xFF059669),
          behavior: SnackBarBehavior.floating,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Expense' : 'Add New Expense'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Amount Input Field
              const Text(
                'Expense Amount *',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF334155)),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                autofocus: !_isEditing,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.attach_money, color: Color(0xFF059669)),
                  hintText: '0.00',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFF059669), width: 2),
                  ),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter an expense amount';
                  }
                  final parsed = double.tryParse(val.trim());
                  if (parsed == null || parsed <= 0) {
                    return 'Please enter a valid amount greater than 0';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 24),

              // Category Selector Grid
              const Text(
                'Select Category *',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF334155)),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: ExpenseCategory.values.map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return InkWell(
                    onTap: () {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF059669) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? const Color(0xFF059669) : Colors.grey.shade300,
                          width: isSelected ? 1.5 : 1.0,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            cat.icon,
                            size: 16,
                            color: isSelected ? Colors.white : cat.color,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            cat.name,
                            style: TextStyle(
                              color: isSelected ? Colors.white : const Color(0xFF1E293B),
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 24),

              // Date Picker Field
              const Text(
                'Expense Date *',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF334155)),
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_month, color: Color(0xFF059669)),
                      const SizedBox(width: 12),
                      Text(
                        DateFormat('EEEE, MMM d, yyyy').format(_selectedDate),
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                      ),
                      const Spacer(),
                      const Icon(Icons.arrow_drop_down, color: Colors.grey),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Optional Note Field
              const Text(
                'Note / Description (Optional)',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF334155)),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _noteController,
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'e.g., Grocery shopping at Walmart with friends',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFF059669), width: 2),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Save Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _submitForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 2,
                  ),
                  child: _isSaving
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          _isEditing ? 'Update Expense' : 'Save Expense',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/expense_detail_screen.dart',
    name: 'expense_detail_screen.dart',
    folder: 'lib/screens',
    language: 'dart',
    description: 'Expense Details Screen with Edit and Delete options',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/expense_model.dart';
import '../providers/expense_provider.dart';
import 'add_edit_expense_screen.dart';

class ExpenseDetailScreen extends StatelessWidget {
  final String expenseId;

  const ExpenseDetailScreen({super.key, required this.expenseId});

  void _confirmDelete(BuildContext context, ExpenseProvider provider, Expense expense) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Expense?'),
        content: Text('Are you sure you want to delete this expense of \$\${expense.amount.toStringAsFixed(2)}? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            onPressed: () async {
              Navigator.pop(ctx);
              await provider.deleteExpense(expenseId);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Expense deleted successfully'),
                    backgroundColor: Colors.redAccent,
                  ),
                );
                Navigator.pop(context);
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ExpenseProvider>();
    final expense = provider.expenses.cast<Expense?>().firstWhere(
          (e) => e?.id == expenseId,
          orElse: () => null,
        );

    if (expense == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Expense Details')),
        body: const Center(child: Text('Expense not found.')),
      );
    }

    final currency = NumberFormat.simpleCurrency(decimalDigits: 2);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Expense Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Edit Expense',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => AddEditExpenseScreen(expenseToEdit: expense),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            tooltip: 'Delete Expense',
            onPressed: () => _confirmDelete(context, provider, expense),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Hero Receipt Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: expense.category.lightColor,
                    child: Icon(expense.category.icon, size: 36, color: expense.category.color),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    expense.category.name,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    currency.format(expense.amount),
                    style: const TextStyle(
                      fontSize: 38,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 16),

                  _DetailRow(
                    icon: Icons.calendar_today,
                    label: 'Date',
                    value: DateFormat('EEEE, MMMM d, yyyy').format(expense.date),
                  ),
                  const SizedBox(height: 16),

                  _DetailRow(
                    icon: Icons.notes,
                    label: 'Note',
                    value: expense.note.isNotEmpty ? expense.note : 'No note provided',
                  ),
                  const SizedBox(height: 16),

                  _DetailRow(
                    icon: Icons.access_time,
                    label: 'Recorded On',
                    value: DateFormat('MMM d, yyyy – hh:mm a').format(expense.createdAt),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Quick Actions
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: Color(0xFF059669)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.edit, color: Color(0xFF059669)),
                    label: const Text('Edit', style: TextStyle(color: Color(0xFF059669), fontWeight: FontWeight.bold)),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AddEditExpenseScreen(expenseToEdit: expense),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade600,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.delete),
                    label: const Text('Delete', style: TextStyle(fontWeight: FontWeight.bold)),
                    onPressed: () => _confirmDelete(context, provider, expense),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: const Color(0xFF059669)),
        const SizedBox(width: 12),
        SizedBox(
          width: 80,
          child: Text(
            label,
            style: TextStyle(color: Colors.grey.shade600, fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF0F172A)),
          ),
        ),
      ],
    );
  }
}
`,
  },
  {
    path: 'lib/screens/analytics_screen.dart',
    name: 'analytics_screen.dart',
    folder: 'lib/screens',
    language: 'dart',
    description: 'Summary / Analytics Screen with Pie chart, category breakdown, and spending stats',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../providers/expense_provider.dart';
import '../models/expense_model.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  int _touchedIndex = -1;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ExpenseProvider>();
    final currency = NumberFormat.simpleCurrency(decimalDigits: 2);
    final categoryTotals = provider.categoryTotals;
    final total = provider.totalSpending;

    // Filter categories that have spending > 0
    final activeCategories = ExpenseCategory.values
        .where((cat) => (categoryTotals[cat] ?? 0.0) > 0)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics & Summary'),
      ),
      body: provider.expenses.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.pie_chart_outline, size: 64, color: Colors.grey.shade400),
                  const SizedBox(height: 16),
                  const Text(
                    'No spending analytics available',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Add expenses to see category breakdown and charts.',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Total Overview Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Total Spending',
                              style: TextStyle(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w500),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              currency.format(total),
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF059669),
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD1FAE5),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.analytics, color: Color(0xFF059669), size: 28),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Pie Chart Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Category Distribution',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          height: 200,
                          child: PieChart(
                            PieChartData(
                              pieTouchData: PieTouchData(
                                touchCallback: (FlTouchEvent event, pieTouchResponse) {
                                  setState(() {
                                    if (!event.isInterestedForInteractions ||
                                        pieTouchResponse == null ||
                                        pieTouchResponse.touchedSection == null) {
                                      _touchedIndex = -1;
                                      return;
                                    }
                                    _touchedIndex = pieTouchResponse
                                        .touchedSection!.touchedSectionIndex;
                                  });
                                },
                              ),
                              borderData: FlBorderData(show: false),
                              sectionsSpace: 3,
                              centerSpaceRadius: 40,
                              sections: activeCategories.asMap().entries.map((entry) {
                                final idx = entry.key;
                                final cat = entry.value;
                                final catAmount = categoryTotals[cat] ?? 0.0;
                                final isTouched = idx == _touchedIndex;
                                final radius = isTouched ? 60.0 : 50.0;
                                final percent = (catAmount / total * 100);

                                return PieChartSectionData(
                                  color: cat.color,
                                  value: catAmount,
                                  title: '\${percent.toStringAsFixed(0)}%',
                                  radius: radius,
                                  titleStyle: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Category-wise Breakdown List
                  const Text(
                    'Category-Wise Spending',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: ExpenseCategory.values.length,
                    itemBuilder: (context, index) {
                      final cat = ExpenseCategory.values[index];
                      final catAmount = categoryTotals[cat] ?? 0.0;
                      final percent = total > 0 ? (catAmount / total) : 0.0;

                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 16,
                                  backgroundColor: cat.lightColor,
                                  child: Icon(cat.icon, size: 16, color: cat.color),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    cat.name,
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                  ),
                                ),
                                Text(
                                  currency.format(catAmount),
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: LinearProgressIndicator(
                                value: percent,
                                minHeight: 6,
                                backgroundColor: const Color(0xFFF1F5F9),
                                valueColor: AlwaysStoppedAnimation<Color>(cat.color),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/expense_card.dart',
    name: 'expense_card.dart',
    folder: 'lib/widgets',
    language: 'dart',
    description: 'Reusable Expense Card widget showing amount, category, date, and note',
    content: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/expense_model.dart';

class ExpenseCard extends StatelessWidget {
  final Expense expense;
  final VoidCallback onTap;

  const ExpenseCard({
    super.key,
    required this.expense,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final currency = NumberFormat.simpleCurrency(decimalDigits: 2);
    final dateStr = DateFormat('MMM d, yyyy').format(expense.date);

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: CircleAvatar(
          radius: 22,
          backgroundColor: expense.category.lightColor,
          child: Icon(expense.category.icon, color: expense.category.color, size: 22),
        ),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              expense.category.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            Text(
              currency.format(expense.amount),
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  expense.note.isNotEmpty ? expense.note : 'No note',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                dateStr,
                style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
              ),
            ],
          ),
        ),
        trailing: const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
      ),
    );
  }
}
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    folder: 'root',
    language: 'markdown',
    description: 'College Project Report, Setup Guide, Architecture, and Viva Questions',
    content: `# SmartSpend – Expense Tracker Android Application
**College Flutter Group Project Submission**

## 1. Project Overview
SmartSpend is a complete, modern, and professional Expense Tracker mobile application developed with **Flutter & Dart**. It allows users to track their day-to-day spending, organize expenses by categories, review historical transactions with flexible filters, and visualize spending habits through interactive charts.

---

## 2. Technical Stack & Architecture
- **Framework:** Flutter (Material 3)
- **Language:** Dart 3.0+
- **State Management:** \`Provider\` with \`ChangeNotifier\`
- **Local Persistence:** \`shared_preferences\` (JSON serialized offline storage)
- **Visualization:** \`fl_chart\`
- **Date & Currency Formatting:** \`intl\`

### Directory Structure:
\`\`\`
lib/
├── main.dart                      # Entry point, MultiProvider setup, Green/White Theme
├── models/
│   └── expense_model.dart         # Expense class, Category enum, JSON serialization
├── providers/
│   └── expense_provider.dart      # ChangeNotifier handling CRUD, state, filters & totals
├── services/
│   └── storage_service.dart       # SharedPreferences persistence layer
├── screens/
│   ├── dashboard_screen.dart      # Home: Total spend, Today/Month stats, recent list
│   ├── expense_list_screen.dart   # All expenses, Category chips, Date filters, Search
│   ├── add_edit_expense_screen.dart# Form with full input validation & category grid
│   ├── expense_detail_screen.dart # Receipt view, Edit, Delete with confirm dialog
│   └── analytics_screen.dart      # Pie chart, percentage distribution, category totals
└── widgets/
    └── expense_card.dart          # Reusable transaction list tile
\`\`\`

---

## 3. How to Run the App
1. Install Flutter SDK (\`>=3.0.0\`).
2. Open terminal in the project directory:
   \`\`\`bash
   flutter pub get
   flutter run
   \`\`\`
3. Select an Android emulator or connected Android smartphone.

---

## 4. Viva / Evaluation Key Points
- **Why Provider?** It is lightweight, officially recommended by Flutter team, decoupled from UI, and implements the Observer pattern seamlessly.
- **Offline First:** No network calls are made. Expenses persist in local storage via JSON string encoding in \`SharedPreferences\`.
- **Validation:** Amount field enforces positive numbers (>0), category is mandatory, date defaults to today or picked date.
`,
  },
];

export async function generateFlutterProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root folder
  const root = zip.folder('smartspend_flutter_project')!;

  for (const file of FLUTTER_PROJECT_FILES) {
    root.file(file.path, file.content);
  }

  // Generate binary zip
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

export function downloadFlutterZip(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'SmartSpend_Flutter_College_Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
