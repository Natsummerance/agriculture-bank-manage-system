import { create } from 'zustand';

export interface ExpertSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeRange: string; // e.g. 14:00-15:00
  isBooked: boolean;
}

export const useExpertCalendarStore = create<{
  slots: ExpertSlot[];
  addSlot: (date: string, timeRange: string) => void;
}>((set) => ({
  slots: [],
  addSlot: (date, timeRange) =>
    set((state) => ({
      slots: [
        ...state.slots,
        {
          id: `slot_${Date.now()}`,
          date,
          timeRange,
          isBooked: false,
        },
      ],
    })),
}));


