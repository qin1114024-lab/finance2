
import React, { useState } from 'react';
import { Plus, Target, Trash2, X, CircleDollarSign } from 'lucide-react';
import { FinancialGoal, BankAccount } from '../types';

interface GoalsProps {
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
  accounts: BankAccount[];
}

const Goals: React.FC<GoalsProps> = ({ goals, setGoals, accounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', targetAmount: '', deadline: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: FinancialGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      color: 'bg-indigo-600'
    };
    setGoals(prev => [...prev, newGoal]);
    setIsModalOpen(false);
  };

  const deleteGoal = (id: string) => {
    if (confirm('確定刪除此目標？')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">理財目標</h2>
          <p className="text-slate-500">夢想很貴，但我們可以一起存到</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={18} /> 新增目標
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-blue-100 flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><CircleDollarSign size={24} /></div>
        <div>
          <p className="text-sm text-slate-500">可分配資產總計</p>
          <p className="text-xl font-bold text-slate-900">${totalBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(g => {
          // 在實際應用中，這裡會讓使用者手動分配帳戶資金到目標
          // 此範例簡化為顯示總資產對目標的進度 (或手動輸入)
          const percent = (g.currentAmount / g.targetAmount) * 100;
          return (
            <div key={g.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg">{g.name}</h3>
                  <p className="text-xs text-slate-400">到期日: {g.deadline}</p>
                </div>
                <button onClick={() => deleteGoal(g.id)} className="text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">已達成 ${g.currentAmount.toLocaleString()}</span>
                  <span className="font-bold text-blue-600">${g.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${Math.min(percent, 100)}%` }} />
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const amount = prompt('存入多少錢？');
                      if (amount) {
                        setGoals(prev => prev.map(item => 
                          item.id === g.id ? { ...item, currentAmount: item.currentAmount + parseFloat(amount) } : item
                        ));
                      }
                    }}
                    className="flex-1 bg-slate-900 text-white text-xs py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                  >
                    存入金額
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg">建立理財目標</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">目標名稱</label>
                <input type="text" required placeholder="例如：日本旅遊、買 MacBook Pro" className="w-full border rounded-lg p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">目標金額</label>
                <input type="number" required className="w-full border rounded-lg p-2" value={formData.targetAmount} onChange={e => setFormData({ ...formData, targetAmount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">目標期限</label>
                <input type="date" required className="w-full border rounded-lg p-2" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">開始存錢</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
