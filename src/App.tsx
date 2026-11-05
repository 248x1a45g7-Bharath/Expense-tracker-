import React, { useState } from 'react';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { PhoneFrame } from './components/PhoneFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ExpenseListScreen } from './components/screens/ExpenseListScreen';
import { AddEditExpenseScreen } from './components/screens/AddEditExpenseScreen';
import { ExpenseDetailScreen } from './components/screens/ExpenseDetailScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { FlutterCodeScreen } from './components/screens/FlutterCodeScreen';
import { SettingsModal } from './components/SettingsModal';
import { Download, Smartphone, Monitor, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateFlutterProjectZip, downloadFlutterZip } from './data/flutterSourceFiles';

const AppContent: React.FC = () => {
  const { activeScreen, setActiveScreen } = useExpenses();
  const [isPhoneView, setIsPhoneView] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateFlutterProjectZip();
      downloadFlutterZip(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'list':
        return <ExpenseListScreen />;
      case 'add':
      case 'edit':
        return <AddEditExpenseScreen />;
      case 'detail':
        return <ExpenseDetailScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'code':
        return <FlutterCodeScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const showBottomNav = activeScreen !== 'add' && activeScreen !== 'edit';

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 text-slate-800 overflow-hidden font-sans">
      {/* Top Banner for College Evaluators / Desktop Users */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-extrabold text-white tracking-tight">SmartSpend</span>
          <span className="text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            College Flutter Group Project (Provider + SharedPreferences + Material 3)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick toggle view button */}
          <button
            onClick={() => setIsPhoneView(prev => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isPhoneView ? (
              <>
                <Monitor size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">Fullscreen Mode</span>
              </>
            ) : (
              <>
                <Smartphone size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">Android Frame Mode</span>
              </>
            )}
          </button>

          {/* Quick Code Button */}
          <button
            onClick={() => setActiveScreen('code')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Code2 size={14} className="text-teal-400" />
            <span className="hidden sm:inline">Flutter Code</span>
          </button>

          {/* Download Zip */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Download size={13} />
            <span>{isDownloading ? 'Packaging...' : 'Download Project .ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div className="flex-1 flex overflow-hidden">
        <PhoneFrame
          isPhoneView={isPhoneView}
          onToggleView={() => setIsPhoneView(prev => !prev)}
        >
          {/* Top Green App Bar */}
          <TopAppBar
            onOpenSettings={() => setIsSettingsOpen(true)}
            isPhoneView={isPhoneView}
            onTogglePhoneView={() => setIsPhoneView(prev => !prev)}
          />

          {/* Active Screen View */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {renderScreen()}
          </main>

          {/* Bottom Navigation Bar */}
          {showBottomNav && <BottomNav />}
        </PhoneFrame>
      </div>

      {/* Global Settings & Data Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
