import { create } from 'zustand';

export interface AdminUser {
  id: string;
  name: string;
  role: 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';
  status: 'active' | 'disabled';
}

interface AdminUserState {
  users: AdminUser[];
  setUsers: (users: AdminUser[]) => void;
  toggleStatus: (id: string) => void;
}

export const useAdminUserStore = create<AdminUserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  toggleStatus: (id) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u,
      ),
    })),
}));


