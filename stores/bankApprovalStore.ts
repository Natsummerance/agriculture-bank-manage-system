import { create } from 'zustand';

export type BankApprovalStatus = 'pending' | 'approved' | 'rejected' | 'returned';

export interface BankApproval {
  id: string;
  farmerName: string;
  amount: number;
  term: string;
  purpose: string;
  createdAt: string;
  status: BankApprovalStatus;
}

interface BankApprovalState {
  approvals: BankApproval[];
  selectedId: string | null;
  setApprovals: (data: BankApproval[]) => void;
  select: (id: string | null) => void;
  updateStatus: (id: string, status: BankApprovalStatus) => void;
}

export const useBankApprovalStore = create<BankApprovalState>((set) => ({
  approvals: [],
  selectedId: null,
  setApprovals: (data) => set({ approvals: data }),
  select: (id) => set({ selectedId: id }),
  updateStatus: (id, status) =>
    set((state) => ({
      approvals: state.approvals.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
}));


