import { create } from 'zustand';

interface TimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'available' | 'booked' | 'draft';
  service?: string;
}

type ViewMode = 'month' | 'week' | 'day';

interface CalendarStore {
  viewMode: ViewMode;
  currentDate: Date;
  timeBlocks: TimeBlock[];
  selectedBlock: TimeBlock | null;
  isDragging: boolean;
  dragStart: { date: string; time: string } | null;
  
  setViewMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Date) => void;
  createTimeBlock: (block: Omit<TimeBlock, 'id' | 'status'>) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  selectBlock: (block: TimeBlock | null) => void;
  startDrag: (date: string, time: string) => void;
  endDrag: (date: string, time: string) => void;
  batchCopyToNextWeek: () => void;
  saveCalendar: () => Promise<void>;
  loadCalendar: () => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  viewMode: 'week',
  currentDate: new Date(),
  timeBlocks: [],
  selectedBlock: null,
  isDragging: false,
  dragStart: null,

  setViewMode: (mode) => set({ viewMode: mode }),

  setCurrentDate: (date) => set({ currentDate: date }),

  createTimeBlock: (block) => {
    const newBlock: TimeBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      status: 'draft',
    };
    set((state) => ({ timeBlocks: [...state.timeBlocks, newBlock] }));
  },

  updateTimeBlock: (id, updates) => {
    set((state) => ({
      timeBlocks: state.timeBlocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      ),
    }));
  },

  deleteTimeBlock: (id) => {
    set((state) => ({
      timeBlocks: state.timeBlocks.filter((block) => block.id !== id),
    }));
  },

  selectBlock: (block) => set({ selectedBlock: block }),

  startDrag: (date, time) => {
    set({ isDragging: true, dragStart: { date, time } });
  },

  endDrag: (date, time) => {
    const { dragStart } = get();
    if (!dragStart) return;

    const startHour = parseInt(dragStart.time.split(':')[0]);
    const endHour = parseInt(time.split(':')[0]);
    
    get().createTimeBlock({
      date: dragStart.date,
      startTime: dragStart.time,
      endTime: time,
      price: Math.abs(endHour - startHour) * 200,
    });

    set({ isDragging: false, dragStart: null });
  },

  batchCopyToNextWeek: () => {
    const { timeBlocks } = get();
    const newBlocks = timeBlocks
      .filter((block) => block.status === 'available')
      .map((block) => {
        const date = new Date(block.date);
        date.setDate(date.getDate() + 7);
        return {
          ...block,
          id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          date: date.toISOString().split('T')[0],
          status: 'draft' as const,
        };
      });
    
    set((state) => ({ timeBlocks: [...state.timeBlocks, ...newBlocks] }));
  },

  saveCalendar: async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    set((state) => ({
      timeBlocks: state.timeBlocks.map((block) =>
        block.status === 'draft' ? { ...block, status: 'available' } : block
      ),
    }));
  },

  loadCalendar: () => {
    // Mock data
    const mockBlocks: TimeBlock[] = [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        price: 200,
        status: 'available',
        service: '农业技术咨询',
      },
      {
        id: '2',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '16:00',
        price: 400,
        status: 'booked',
        service: '土壤检测指导',
      },
    ];
    set({ timeBlocks: mockBlocks });
  },
}));
