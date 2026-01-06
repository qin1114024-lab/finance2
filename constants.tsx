
import React from 'react';
import { 
  Utensils, Car, ShoppingBag, Coffee, Home, 
  HeartPulse, GraduationCap, Zap, DollarSign, 
  Briefcase, TrendingUp, HelpCircle 
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'food', name: '飲食', type: 'EXPENSE', icon: <Utensils className="w-4 h-4" /> },
  { id: 'transport', name: '交通', type: 'EXPENSE', icon: <Car className="w-4 h-4" /> },
  { id: 'shopping', name: '購物', type: 'EXPENSE', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'entertainment', name: '娛樂', type: 'EXPENSE', icon: <Coffee className="w-4 h-4" /> },
  { id: 'housing', name: '居住', type: 'EXPENSE', icon: <Home className="w-4 h-4" /> },
  { id: 'medical', name: '醫療', type: 'EXPENSE', icon: <HeartPulse className="w-4 h-4" /> },
  { id: 'education', name: '教育', type: 'EXPENSE', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'utilities', name: '雜支', type: 'EXPENSE', icon: <Zap className="w-4 h-4" /> },
  { id: 'salary', name: '薪資', type: 'INCOME', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'bonus', name: '獎金', type: 'INCOME', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'investment', name: '投資回報', type: 'INCOME', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'other', name: '其他', type: 'INCOME', icon: <HelpCircle className="w-4 h-4" /> },
];

export const ACCOUNT_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 
  'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'
];
