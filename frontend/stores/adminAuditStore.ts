import { create } from 'zustand';

export interface AdminProductAuditItem {
  id: string;
  name: string;
  farmerName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminContentAuditItem {
  id: string;
  title: string;
  author: string;
  type: 'article' | 'video' | 'qa';
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminAuditState {
  productAudits: AdminProductAuditItem[];
  contentAudits: AdminContentAuditItem[];
  setProductAudits: (list: AdminProductAuditItem[]) => void;
  setContentAudits: (list: AdminContentAuditItem[]) => void;
  updateProductStatus: (id: string, status: AdminProductAuditItem['status']) => void;
  updateContentStatus: (id: string, status: AdminContentAuditItem['status']) => void;
}

export const useAdminAuditStore = create<AdminAuditState>((set) => ({
  productAudits: [],
  contentAudits: [],
  setProductAudits: (list) => set({ productAudits: list }),
  setContentAudits: (list) => set({ contentAudits: list }),
  updateProductStatus: (id, status) =>
    set((state) => ({
      productAudits: state.productAudits.map((p) =>
        p.id === id ? { ...p, status } : p,
      ),
    })),
  updateContentStatus: (id, status) =>
    set((state) => ({
      contentAudits: state.contentAudits.map((c) =>
        c.id === id ? { ...c, status } : c,
      ),
    })),
}));


