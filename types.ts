
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface BankAccount {
  id: string;
  userId: string;
  name: string;
  balance: number;
  bankName: string;
  color: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: string; // e.g., '2024-05'
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
}
