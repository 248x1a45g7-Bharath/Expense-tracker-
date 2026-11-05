import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Folder,
  FileText,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  FLUTTER_PROJECT_FILES,
  FlutterFile,
  generateFlutterProjectZip,
  downloadFlutterZip,
} from '../../data/flutterSourceFiles';

export const FlutterCodeScreen: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('lib/main.dart');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'files' | 'viva'>('files');
  const [openVivaId, setOpenVivaId] = useState<number | null>(0);

  const currentFile =
    FLUTTER_PROJECT_FILES.find(f => f.path === selectedFilePath) || FLUTTER_PROJECT_FILES[1];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateFlutterProjectZip();
      downloadFlutterZip(blob);
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const vivaQuestions = [
    {
      q: 'Why did you choose Provider with ChangeNotifier for this project?',
      a: 'Provider is the officially recommended state management library by the Flutter core team. It follows the Observer Pattern and decouples business logic from UI widgets. When data mutations occur (such as adding, editing, or deleting an expense), `notifyListeners()` triggers granular widget rebuilds via `Consumer` or `context.watch()`, avoiding costly full-tree refreshes.',
    },
    {
      q: 'How is offline persistence implemented without internet?',
      a: 'We implemented `StorageService` using `shared_preferences`. Each `Expense` model contains `toJson()` and `fromJson()` serialization methods. Expenses are stored as a JSON-encoded string under a persistent key. When the app boots, `WidgetsFlutterBinding.ensureInitialized()` runs and the provider loads stored records before rendering.',
    },
    {
      q: 'Explain the folder structure of this Flutter project.',
      a: 'The project strictly adheres to clean separation of concerns:\n• `models/`: Plain Dart data definitions & serialization.\n• `services/`: Low-level I/O & SharedPreferences storage.\n• `providers/`: App business state & calculations.\n• `screens/`: Scaffold view pages (Dashboard, List, Add/Edit, Detail, Analytics).\n• `widgets/`: Reusable UI components (ExpenseCard, CategoryIcon).',
    },
    {
      q: 'How are form validation and errors handled?',
      a: 'In `AddEditExpenseScreen`, we use Flutter\'s `GlobalKey<FormState>()`. The amount field validates that the text is non-empty, strictly numeric, and greater than zero. The category selection is verified, and date picker restricts future dates where necessary. Visual feedback is provided via floating `SnackBar` notifications.',
    },
    {
      q: 'How does the theme fulfill the green and white requirement?',
      a: 'In `main.dart`, `ThemeData` is configured with `colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF059669))` with Emerald green primary accents, light mint container badges, and crisp white surfaces with Material 3 rounded card shapes (`borderRadius: 16`).',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-slate-100">
      {/* Top Banner & Mode Tabs */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Flutter & Dart Source Repository
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            100% production-ready code matching college group project specifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="bg-slate-900 p-0.5 rounded-xl border border-slate-800 flex text-xs">
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'files'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Files ({FLUTTER_PROJECT_FILES.length})
            </button>
            <button
              onClick={() => setActiveTab('viva')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                activeTab === 'viva'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle size={13} />
              <span>Viva Q&A</span>
            </button>
          </div>

          {/* 1-Click Download Zip Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            title="Download full Flutter project ready to open in Android Studio"
          >
            <Download size={14} />
            <span>{isDownloading ? 'Generating...' : 'Download .ZIP'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'files' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto shrink-0 max-h-48 md:max-h-full">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FolderTree size={12} className="text-emerald-400" />
              <span>Project Files</span>
            </div>

            <div className="space-y-1">
              {FLUTTER_PROJECT_FILES.map(file => {
                const isSelected = file.path === selectedFilePath;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 truncate ${
                      isSelected
                        ? 'bg-emerald-950/90 text-emerald-300 font-bold border border-emerald-700/60'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    {file.name.endsWith('.dart') ? (
                      <FileCode size={14} className="text-teal-400 shrink-0" />
                    ) : file.name.endsWith('.yaml') ? (
                      <FileText size={14} className="text-amber-400 shrink-0" />
                    ) : (
                      <BookOpen size={14} className="text-blue-400 shrink-0" />
                    )}
                    <span className="truncate">{file.path}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
            {/* File info bar */}
            <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-emerald-400">{currentFile.path}</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  — {currentFile.description}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200 select-text">
              <pre className="overflow-x-auto whitespace-pre">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* College Project Viva / Presentation Q&A Tab */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 max-w-3xl mx-auto w-full">
          <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-2xl p-4 mb-4 text-emerald-200 text-xs flex items-start gap-3">
            <Sparkles size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block text-sm">
                College Project Defense & Viva Cheat Sheet
              </span>
              Use these explanations when demonstrating your project to professors, external examiners, or group teammates.
            </div>
          </div>

          {vivaQuestions.map((item, idx) => {
            const isOpen = openVivaId === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenVivaId(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 text-slate-100 font-bold text-xs sm:text-sm hover:text-emerald-300"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronDown size={18} className="text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight size={18} className="text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-slate-300 text-xs leading-relaxed border-t border-slate-900 bg-slate-900/60 whitespace-pre-line">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
