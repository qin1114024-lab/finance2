
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { BankAccount, Transaction } from '../types';
import { ACCOUNT_COLORS } from '../constants';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  transactions: Transaction[];
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts, transactions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({ name: '', balance: '', bankName: '', color: ACCOUNT_COLORS[0] });

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormData({ name: '', balance: '', bankName: '', color: ACCOUNT_COLORS[0] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({ 
      name: account.name, 
      balance: account.balance.toString(), 
      bankName: account.bankName, 
      color: account.color 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？這將不會刪除相關交易紀錄，但可能導致顯示錯誤。')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: BankAccount = {
      id: editingAccount ? editingAccount.id : Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      name: formData.name,
      balance: parseFloat(formData.balance),
      bankName: formData.bankName,
      color: formData.color,
    };

    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? newAccount : a));
    } else {
      setAccounts(prev => [...prev, newAccount]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">銀行帳戶</h2>
          <p className="text-slate-500">管理您的資產來源</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          新增帳戶
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className={`h-2 ${account.color}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{account.name}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{account.bankName}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(account)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(account.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xs text-slate-400 mb-1">目前餘額</p>
                <p className="text-2xl font-bold text-slate-900">${account.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingAccount ? '編輯帳戶' : '新增帳戶'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例如：薪資轉帳"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">銀行名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例如：中國信託"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.balance}
                  onChange={e => setFormData({ ...formData, balance: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">代表顏色</label>
                <div className="flex gap-2">
                  {ACCOUNT_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? 'ring-2 ring-offset-2 ring-slate-900' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 mt-4"
              >
                儲存帳戶
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
