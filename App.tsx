import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  PieChart, 
  Target,
  ShieldCheck,
  LogOut, 
  Menu, 
  X,
  Plus,
  User
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProfile, BankAccount, Transaction, Budget, FinancialGoal } from './types';
import { auth, db } from './firebase'; // 引入 Firebase 實例

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'accounts' | 'transactions' | 'reports' | 'budgets' | 'goals'>('dashboard');
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 核心資料狀態
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);

  // Firebase 認證監聽
  useEffect(() => {
    // 如果 auth 沒定義 (開發用 Mock)
    if (!auth) {
      const savedUser = localStorage.getItem('ww_mock_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '使用者'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 資料持久化與加載 (這部分在真實專案中會改為從 Firestore 讀取)
  useEffect(() => {
    if (user) {
      const savedAcc = localStorage.getItem(`ww_accounts_${user.uid}`);
      const savedTx = localStorage.getItem(`ww_transactions_${user.uid}`);
      const savedBud = localStorage.getItem(`ww_budgets_${user.uid}`);
      const savedGoal = localStorage.getItem(`ww_goals_${user.uid}`);
      
      if (savedAcc) setAccounts(JSON.parse(savedAcc));
      if (savedTx) setTransactions(JSON.parse(savedTx));
      if (savedBud) setBudgets(JSON.parse(savedBud));
      if (savedGoal) setGoals(JSON.parse(savedGoal));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`ww_accounts_${user.uid}`, JSON.stringify(accounts));
      localStorage.setItem(`ww_transactions_${user.uid}`, JSON.stringify(transactions));
      localStorage.setItem(`ww_budgets_${user.uid}`, JSON.stringify(budgets));
      localStorage.setItem(`ww_goals_${user.uid}`, JSON.stringify(goals));
    }
  }, [accounts, transactions, budgets, goals, user]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    } else {
      localStorage.removeItem('ww_mock_user');
    }
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">WealthWisdom 載入中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return isAuthMode === 'login' 
      ? <Login onLogin={setUser} onSwitch={() => setIsAuthMode('register')} />
      : <Register onRegister={setUser} onSwitch={() => setIsAuthMode('login')} />;
  }

  const navItems = [
    { id: 'dashboard', label: '總覽儀表板', icon: <LayoutDashboard size={20} /> },
    { id: 'accounts', label: '資產帳戶', icon: <Wallet size={20} /> },
    { id: 'transactions', label: '日常記帳', icon: <History size={20} /> },
    { id: 'budgets', label: '預算控管', icon: <ShieldCheck size={20} /> },
    { id: 'goals', label: '理財目標', icon: <Target size={20} /> },
    { id: 'reports', label: 'AI 智慧分析', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm fixed inset-y-0">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">WealthWisdom</h1>
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI Financial Butler</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                currentPage === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={currentPage === item.id ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg shadow-inner">
              {user.displayName[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate uppercase">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            安全登出
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 h-20 z-50">
          <h1 className="text-xl font-black text-indigo-600 tracking-tight">WealthWisdom</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-50 rounded-xl text-slate-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-0 right-0 bottom-0 w-80 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-black text-xl">功能選單</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-lg"><X size={20}/></button>
              </div>
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentPage(item.id as any); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      currentPage === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
                <div className="pt-6 border-t mt-6">
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 bg-rose-50 rounded-2xl font-bold">
                    <LogOut size={20} />
                    登出系統
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto md:p-10 p-6">
          {currentPage === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} budgets={budgets} goals={goals} setCurrentPage={setCurrentPage} />}
          {currentPage === 'accounts' && <Accounts accounts={accounts} setAccounts={setAccounts} transactions={transactions} />}
          {currentPage === 'transactions' && <Transactions transactions={transactions} setTransactions={setTransactions} accounts={accounts} setAccounts={setAccounts} />}
          {currentPage === 'budgets' && <Budgets budgets={budgets} setBudgets={setBudgets} transactions={transactions} />}
          {currentPage === 'goals' && <Goals goals={goals} setGoals={setGoals} accounts={accounts} />}
          {currentPage === 'reports' && <Reports transactions={transactions} accounts={accounts} budgets={budgets} goals={goals} />}
        </div>
      </main>
    </div>
  );
};

export default App;