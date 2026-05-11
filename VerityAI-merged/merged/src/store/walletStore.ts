import { create } from 'zustand';

export interface WalletTransaction {
  id: number;
  type: 'topup' | 'deduction' | 'refund';
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string;
  status: string;
  createdAt: string;
}

interface WalletState {
  balance: number; // in naira (not kobo)
  transactions: WalletTransaction[];
  setBalance: (balance: number) => void;
  setTransactions: (transactions: WalletTransaction[]) => void;
  deductBalance: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],
  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ transactions }),
  deductBalance: (amount) => set((state) => ({ balance: state.balance - amount })),
}));
