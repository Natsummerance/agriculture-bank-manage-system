import { create } from 'zustand';

export type FinancingStatus =
  | 'applied'
  | 'reviewing'
  | 'approved'
  | 'rejected'
  | 'signed'
  | 'disbursed'
  | 'repaying'
  | 'settled';

export interface FinancingTimelineItem {
  at: string;
  actor: 'farmer' | 'bank' | 'admin';
  action: string;
  note?: string;
}

export interface RepaymentInstallment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Financing {
  id: string;
  farmerId: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: FinancingStatus;
  createdAt: string;
  timeline: FinancingTimelineItem[];
  repaymentSchedule: RepaymentInstallment[];
}

interface FinancingState {
  list: Financing[];
  createFromFarmer: (payload: { farmerId: string; amount: number; termMonths: number; purpose: string }) => Financing;
  updateStatus: (id: string, status: FinancingStatus) => void;
  appendTimeline: (id: string, item: FinancingTimelineItem) => void;
  setRepaymentSchedule: (id: string, schedule: RepaymentInstallment[]) => void;
  markInstallmentPaid: (financingId: string, instId: string) => void;
}

export const useFinancingStore = create<FinancingState>((set, get) => ({
  list: [],

  createFromFarmer: ({ farmerId, amount, termMonths, purpose }) => {
    const now = new Date().toISOString();
    const financing: Financing = {
      id: `fin_${Date.now()}`,
      farmerId,
      amount,
      termMonths,
      purpose,
      status: 'applied',
      createdAt: now,
      timeline: [
        {
          at: now,
          actor: 'farmer',
          action: '提交融资申请',
          note: purpose,
        },
      ],
      repaymentSchedule: [],
    };
    set((state) => ({ list: [financing, ...state.list] }));
    return financing;
  },

  updateStatus: (id, status) => {
    set((state) => ({
      list: state.list.map((f) => (f.id === id ? { ...f, status } : f)),
    }));
  },

  appendTimeline: (id, item) => {
    set((state) => ({
      list: state.list.map((f) =>
        f.id === id ? { ...f, timeline: [...f.timeline, item] } : f,
      ),
    }));
  },

  setRepaymentSchedule: (id, schedule) => {
    set((state) => ({
      list: state.list.map((f) =>
        f.id === id ? { ...f, repaymentSchedule: schedule } : f,
      ),
    }));
  },

  markInstallmentPaid: (financingId, instId) => {
    set((state) => ({
      list: state.list.map((f) =>
        f.id === financingId
          ? {
              ...f,
              repaymentSchedule: f.repaymentSchedule.map((i) =>
                i.id === instId ? { ...i, status: 'paid' } : i,
              ),
            }
          : f,
      ),
    }));
  },
}));


