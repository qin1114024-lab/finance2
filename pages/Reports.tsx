
import React, { useState, useMemo } from 'react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
// Added PieChart to lucide-react imports to fix icon reference error
import { Sparkles, Loader2, RefreshCw, Trophy, Target, PieChart } from 'lucide-react';
import { Transaction, BankAccount, Budget, FinancialGoal } from '../types';
import { getFinancialAdvice } from '../geminiService';

interface ReportsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  budgets: Budget[];
  goals: FinancialGoal[];
}

const COLORS = ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6'];

const Reports: React.FC<ReportsProps> = ({ transactions, accounts, budgets, goals }) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE');
    const grouped = expenseTransactions.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const fetchAiAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions, accounts, budgets, goals);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">智慧分析報表</h2>
        <p className="text-slate-500">透過 AI 與數據視覺化，優化您的財務健康</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18}/> 支出結構分析</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <ReTooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Trophy size={18} className="text-amber-500"/> 目標達成概況</h3>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {goals.length > 0 ? goals.map(g => {
              const percent = (g.currentAmount / g.targetAmount) * 100;
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>{g.name}</span>
                    <span className="text-blue-600">{percent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${Math.min(percent, 100)}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-slate-400 py-10">目前沒有設定目標</div>
            )}
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-2xl">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-[22px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner"><Sparkles size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Gemini AI 理財顧問</h3>
                <p className="text-slate-500 text-sm">結合預算、目標與收支的深度診斷</p>
              </div>
            </div>
            <button 
              onClick={fetchAiAdvice} 
              disabled={isAiLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
              立即獲取 AI 建議
            </button>
          </div>

          <div className="min-h-[200px] bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
            {isAiLoading ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                </div>
                <p className="font-medium">AI 正在審閱您的財務健康狀況...</p>
              </div>
            ) : aiAdvice ? (
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-line leading-relaxed text-lg">
                {aiAdvice}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
                <Target size={48} className="mb-4 opacity-10" />
                <p>點擊按鈕，由 AI 提供專業的理財規劃與改善建議</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;