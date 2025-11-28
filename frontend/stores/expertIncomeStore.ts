import { create } from 'zustand';

interface ExpertIncomeState {
  qaEarnings: number;
  appointmentEarnings: number;
  withdrawTotal: number;
  addQaEarning: (amount: number) => void;
  addAppointmentEarning: (amount: number) => void;
  withdraw: (amount: number) => void;
}

export const useExpertIncomeStore = create<ExpertIncomeState>((set, get) => ({
  qaEarnings: 0,
  appointmentEarnings: 0,
  withdrawTotal: 0,
  addQaEarning: (amount) =>
    set((state) => ({ qaEarnings: state.qaEarnings + amount })),
  addAppointmentEarning: (amount) =>
    set((state) => ({ appointmentEarnings: state.appointmentEarnings + amount })),
  withdraw: (amount) => {
    const total = get().qaEarnings + get().appointmentEarnings - get().withdrawTotal;
    if (amount > total) {
      return;
    }
    set((state) => ({ withdrawTotal: state.withdrawTotal + amount }));
  },
}));


