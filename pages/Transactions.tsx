
import React, { useState } from 'react';
import { Plus, Filter, Trash2, X, ArrowUpRight, ArrowDownLeft, Search, Download } from 'lucide-react';
import { Transaction, BankAccount, TransactionType } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, accounts, setAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || '',
    amount: '',
    type: 'EXPENSE' as TransactionType,
    category: CATEGORIES[0].name,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const exportToCSV = () => {
    const headers = ['日期', '分類', '類型', '帳戶', '備註', '金額'];
    const rows = transactions.map(t => [
      t.date,
      t.category,
      t.type === 'INCOME' ? '收入' : '支出',
      accounts.find(a => a.id === t.accountId)?.name || '未知',
      t.note,
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `財務紀錄_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const handleDelete = (id: string) => {
    const t = transactions.find(item => item.id === id);
    if (!t) return;
    if (confirm('確定刪除？此操作將會回滾帳戶餘額。')) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === t.accountId) {
          return { ...acc, balance: acc.balance + (t.type === 'INCOME' ? -t.amount : t.amount) };
        }
        return acc;
      }));
      setTransactions(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      accountId: formData.accountId,
      amount,
      type: formData.type,
      category: formData.category,
      date: formData.date,
      note: formData.note
    };
    setAccounts(prev => prev.map(acc => {
      if (acc.id === formData.accountId) {
        return { ...acc, balance: acc.balance + (formData.type === 'INCOME' ? amount : -amount) };
      }
      return acc;
    }));
    setTransactions(prev => [newTransaction, ...prev]);
    setIsModalOpen(false);
  };

  const filteredTransactions = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t => t.category.includes(searchTerm) || t.note.includes(searchTerm));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">財務紀錄</h2>
          <p className="text-slate-500">每一分錢都有它的故事</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToCSV} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
            <Download size={18} /> 匯出 CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={18} /> 新增紀錄
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋分類或備註..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 w-full md:w-auto overflow-x-auto">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                filterType === type ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type === 'ALL' ? '全部' : type === 'INCOME' ? '收入' : '支出'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-center">日期</th>
                <th className="px-6 py-4">分類</th>
                <th className="px-6 py-4">帳戶</th>
                <th className="px-6 py-4">備註</th>
                <th className="px-6 py-4 text-right">金額</th>
                <th className="px-6 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-500 text-center">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{accounts.find(a => a.id === t.accountId)?.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 italic truncate max-w-[200px]">{t.note}</td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDelete(t.id)} className="p-1 text-slate-300 hover:text-rose-600"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400">找不到相關紀錄</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg">新增收支</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button type="button" onClick={() => setFormData({...formData, type: 'EXPENSE'})} className={`flex-1 py-2 rounded-md text-sm font-bold ${formData.type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>支出</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'INCOME'})} className={`flex-1 py-2 rounded-md text-sm font-bold ${formData.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>收入</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-500">日期</label><input type="date" required className="w-full border p-2 rounded-lg text-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}/></div>
                <div><label className="text-xs font-bold text-slate-500">金額</label><input type="number" required className="w-full border p-2 rounded-lg text-sm" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}/></div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">分類</label>
                <select className="w-full border p-2 rounded-lg text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.filter(c => c.type === formData.type).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">帳戶</label>
                <select className="w-full border p-2 rounded-lg text-sm" value={formData.accountId} onChange={e => setFormData({...formData, accountId: e.target.value})}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div><label className="text-xs font-bold text-slate-500">備註</label><input type="text" className="w-full border p-2 rounded-lg text-sm" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}/></div>
              <button type="submit" className={`w-full py-3 rounded-xl text-white font-bold transition-all ${formData.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'}`}>儲存紀錄</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
