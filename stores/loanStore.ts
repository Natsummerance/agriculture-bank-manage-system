import { create } from 'zustand';

interface Farmer {
  id: string;
  name: string;
  avatar: string;
  creditScore: number;
  similarity: number;
  location: string;
}

interface LoanApplication {
  id: string;
  amount: number;
  purpose: string;
  duration: number;
  documents: File[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface LoanStore {
  quota: number;
  duration: number;
  purpose: string;
  documents: File[];
  unitedEnabled: boolean;
  unitedList: Farmer[];
  matchPool: Farmer[];
  currentApplication: LoanApplication | null;
  
  setQuota: (quota: number) => void;
  setDuration: (duration: number) => void;
  setPurpose: (purpose: string) => void;
  addDocument: (doc: File) => void;
  removeDocument: (index: number) => void;
  toggleUnited: () => void;
  inviteFarmer: (farmer: Farmer) => void;
  removeFarmer: (id: string) => void;
  loadMatchPool: () => void;
  submitApplication: () => Promise<void>;
  aiPrefill: () => void;
  saveDraft: () => void;
}

export const useLoanStore = create<LoanStore>((set, get) => ({
  quota: 50000,
  duration: 12,
  purpose: '',
  documents: [],
  unitedEnabled: false,
  unitedList: [],
  matchPool: [],
  currentApplication: null,

  setQuota: (quota) => {
    set({ quota });
    get().saveDraft();
  },

  setDuration: (duration) => {
    set({ duration });
    get().saveDraft();
  },

  setPurpose: (purpose) => {
    set({ purpose });
    get().saveDraft();
  },

  addDocument: (doc) => {
    set((state) => ({ documents: [...state.documents, doc] }));
    get().saveDraft();
  },

  removeDocument: (index) => {
    set((state) => ({ documents: state.documents.filter((_, i) => i !== index) }));
    get().saveDraft();
  },

  toggleUnited: () => {
    set((state) => ({ unitedEnabled: !state.unitedEnabled }));
    if (get().unitedEnabled) {
      get().loadMatchPool();
    }
  },

  inviteFarmer: (farmer) => {
    set((state) => ({ unitedList: [...state.unitedList, farmer] }));
  },

  removeFarmer: (id) => {
    set((state) => ({ unitedList: state.unitedList.filter((f) => f.id !== id) }));
  },

  loadMatchPool: () => {
    // Mock data
    const mockPool: Farmer[] = [
      {
        id: '1',
        name: '张三农场',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer1',
        creditScore: 850,
        similarity: 92,
        location: '四川成都',
      },
      {
        id: '2',
        name: '李四种植园',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer2',
        creditScore: 820,
        similarity: 87,
        location: '山东济南',
      },
      {
        id: '3',
        name: '王五果园',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer3',
        creditScore: 880,
        similarity: 95,
        location: '陕西西安',
      },
    ];
    set({ matchPool: mockPool });
  },

  submitApplication: async () => {
    const { quota, duration, purpose, documents, unitedList } = get();
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const application: LoanApplication = {
      id: `LOAN-${Date.now()}`,
      amount: quota,
      purpose,
      duration,
      documents,
      status: 'submitted',
    };
    
    set({ currentApplication: application });
    localStorage.removeItem('loan-draft');
  },

  aiPrefill: () => {
    // Mock AI prefill with historical data
    set({
      quota: 80000,
      duration: 24,
      purpose: '购买有机肥料和种子，扩大种植面积',
    });
  },

  saveDraft: () => {
    const { quota, duration, purpose } = get();
    localStorage.setItem('loan-draft', JSON.stringify({ quota, duration, purpose }));
  },
}));
