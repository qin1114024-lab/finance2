
import React, { useState } from 'react';
import { Plus, Trash2, ShieldCheck, X } from 'lucide-react';
import { Budget, Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface BudgetsProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
}

const Budgets: React.FC<BudgetsProps> = ({ budgets, setBudgets, transactions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ category: CATEGORIES[0].name, limit: '' });
  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgets.find(b => b.category === formData.category)) {
      alert('該分類已設定預算');
      return;
    }
    const newBudget: Budget = {
      id: Math.random().toString(36).substr(2, 9),
      category: formData.category,
      limit: parseFloat(formData.limit),
      period: currentMonth
    };
    setBudgets(prev => [...prev, newBudget]);
    setIsModalOpen(false);
  };

  const deleteBudget = (id: string) => {
    if (confirm('確定刪除此預算？')) {
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">預算規劃</h2>
          <p className="text-slate-500">控制支出，讓錢花在刀口上</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={18} /> 設定預算
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(b => {
          const spent = transactions
            .filter(t => t.category === b.category && t.date.startsWith(currentMonth))
            .reduce((sum, t) => sum + t.amount, 0);
          const percent = (spent / b.limit) * 100;

          return (
            <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><ShieldCheck size={20} /></div>
                    <span className="font-bold text-slate-900">{b.category}</span>
                  </div>
                  <button onClick={() => deleteBudget(b.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">已花費 ${spent.toLocaleString()}</span>
                    <span className={`font-bold ${percent > 100 ? 'text-rose-600' : 'text-slate-900'}`}>{percent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${percent > 100 ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${Math.min(percent, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                <span className="text-xs text-slate-400">本月額度 ${b.limit.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg">設定分類預算</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">選擇分類</label>
                <select 
                  className="w-full border rounded-lg p-2"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.filter(c => c.type === 'EXPENSE').map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">月預算金額</label>
                <input 
                  type="number" required
                  className="w-full border rounded-lg p-2"
                  value={formData.limit}
                  onChange={e => setFormData({ ...formData, limit: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">儲存設定</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
