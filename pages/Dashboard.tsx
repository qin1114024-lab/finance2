
import React from 'react';
// Added Plus to lucide-react imports
import { TrendingUp, TrendingDown, CreditCard, Target, AlertTriangle, ChevronRight, Plus } from 'lucide-react';
import { BankAccount, Transaction, Budget, FinancialGoal } from '../types';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  setCurrentPage: (page: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, budgets, goals, setCurrentPage }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const monthlyIncome = monthTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  const budgetWarnings = budgets.map(b => {
    const spent = monthTransactions.filter(t => t.category === b.category).reduce((sum, t) => sum + t.amount, 0);
    const percent = (spent / b.limit) * 100;
    return { ...b, spent, percent };
  }).filter(b => b.percent > 80);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">歡迎回來！</h2>
          <p className="text-slate-500">今天也是理財的一大步</p>
        </div>
        <button onClick={() => setCurrentPage('transactions')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-100 flex items-center gap-2">
          <Plus size={18} /> 快速記帳
        </button>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">總資產</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform"><CreditCard size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">${totalBalance.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">本月收入</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-emerald-600">+${monthlyIncome.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">本月支出</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:scale-110 transition-transform"><TrendingDown size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-rose-600">-${monthlyExpense.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Alerts & Goals */}
        <div className="lg:col-span-1 space-y-6">
          {/* Budget Alerts */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" /> 預算警示
            </h3>
            {budgetWarnings.length > 0 ? (
              <div className="space-y-4">
                {budgetWarnings.map(b => (
                  <div key={b.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{b.category}</span>
                      <span className={b.percent >= 100 ? 'text-rose-600 font-bold' : 'text-amber-600'}>
                        {b.percent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${b.percent >= 100 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                        style={{ width: `${Math.min(b.percent, 100)}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-2">目前沒有預算超支警示。</p>
            )}
          </section>

          {/* Savings Goals Summary */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Target size={18} className="text-indigo-600" /> 理財目標
              </h3>
              <button onClick={() => setCurrentPage('goals')} className="text-xs text-blue-600">管理</button>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map(g => {
                  const percent = (g.currentAmount / g.targetAmount) * 100;
                  return (
                    <div key={g.id} className="p-3 bg-slate-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">{g.name}</span>
                        <span className="text-xs text-slate-500">{percent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-2">尚未設定理財目標。</p>
            )}
          </section>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-2">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900">最近紀錄</h3>
              <button onClick={() => setCurrentPage('transactions')} className="text-sm text-blue-600 flex items-center gap-1">
                查看全部 <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {[...transactions].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 7).map(t => (
                <div key={t.id} className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.category[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.category}</p>
                      <p className="text-xs text-slate-400">{t.date} · {t.note || '無備註'}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && <div className="text-center py-20 text-slate-400">尚無交易紀錄</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;