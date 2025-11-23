import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

export interface DemandDraft {
  productName?: string;
  category?: string[];
  quantity?: number;
  unit?: string;
  priceExpectation?: number;
  deliveryDate?: Date;
  deliveryLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
  images?: string[];
  description?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  isPublic?: boolean;
  allowBidding?: boolean;
  autoExpireDays?: number;
}

interface DemandStore {
  draft: DemandDraft;
  uploadImgs: string[];
  currentStep: number;
  lastSaved: number | null;
  
  setField: <K extends keyof DemandDraft>(key: K, value: DemandDraft[K]) => void;
  setMultipleFields: (fields: Partial<DemandDraft>) => void;
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  setStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  publish: () => Promise<void>;
  reset: () => void;
}

export const useDemandStore = create<DemandStore>()(
  persist(
    (set, get) => ({
      draft: {
        unit: 'kg',
        priceExpectation: 0,
        isPublic: true,
        allowBidding: true,
        autoExpireDays: 30,
        images: [],
        attachments: [],
      },
      uploadImgs: [],
      currentStep: 0,
      lastSaved: null,

      setField: (key, value) =>
        set(
          produce((state: DemandStore) => {
            state.draft[key] = value as any;
          })
        ),

      setMultipleFields: (fields) =>
        set(
          produce((state: DemandStore) => {
            Object.assign(state.draft, fields);
          })
        ),

      addImage: (url) =>
        set(
          produce((state: DemandStore) => {
            if (!state.draft.images) state.draft.images = [];
            if (state.draft.images.length < 3) {
              state.draft.images.push(url);
            }
          })
        ),

      removeImage: (index) =>
        set(
          produce((state: DemandStore) => {
            if (state.draft.images) {
              state.draft.images.splice(index, 1);
            }
          })
        ),

      setStep: (step) => set({ currentStep: step }),

      saveDraft: async () => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ lastSaved: Date.now() });
        console.log('Draft saved:', get().draft);
      },

      publish: async () => {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Published:', get().draft);
      },

      reset: () =>
        set({
          draft: {
            unit: 'kg',
            priceExpectation: 0,
            isPublic: true,
            allowBidding: true,
            autoExpireDays: 30,
            images: [],
            attachments: [],
          },
          uploadImgs: [],
          currentStep: 0,
          lastSaved: null,
        }),
    }),
    {
      name: 'demand-draft',
      partialize: (state) => ({ draft: state.draft, lastSaved: state.lastSaved }),
    }
  )
);
