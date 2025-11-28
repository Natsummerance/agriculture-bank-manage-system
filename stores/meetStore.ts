import { create } from 'zustand';

interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  equipment: string[];
  thumbnail: string;
  available: boolean;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'farmer' | 'expert' | 'bank' | 'buyer' | 'admin';
}

interface Booking {
  id: string;
  roomId: string;
  date: string;
  timeSlot: TimeSlot;
  members: Member[];
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  blockchainHash?: string;
}

interface MeetStore {
  step: number;
  selectedDate: Date | null;
  selectedTime: TimeSlot | null;
  selectedRoom: Room | null;
  invitedMembers: Member[];
  purpose: string;
  roomList: Room[];
  timeSlots: TimeSlot[];
  
  setStep: (step: number) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: TimeSlot | null) => void;
  setSelectedRoom: (room: Room | null) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  setPurpose: (purpose: string) => void;
  loadRooms: () => void;
  loadTimeSlots: (date: Date) => void;
  bookRoom: () => Promise<Booking>;
  reset: () => void;
}

export const useMeetStore = create<MeetStore>((set, get) => ({
  step: 0,
  selectedDate: null,
  selectedTime: null,
  selectedRoom: null,
  invitedMembers: [],
  purpose: '',
  roomList: [],
  timeSlots: [],

  setStep: (step) => set({ step }),

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    if (date) {
      get().loadTimeSlots(date);
    }
  },

  setSelectedTime: (time) => set({ selectedTime: time }),

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  addMember: (member) => {
    set((state) => ({ invitedMembers: [...state.invitedMembers, member] }));
  },

  removeMember: (id) => {
    set((state) => ({ invitedMembers: state.invitedMembers.filter((m) => m.id !== id) }));
  },

  setPurpose: (purpose) => set({ purpose }),

  loadRooms: () => {
    const mockRooms: Room[] = [
      {
        id: 'room-1',
        name: '星云会议室 A',
        capacity: 8,
        floor: '3F',
        equipment: ['投影仪', '白板', '视频会议'],
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
        available: true,
      },
      {
        id: 'room-2',
        name: '量子会议室 B',
        capacity: 12,
        floor: '5F',
        equipment: ['4K屏幕', '全景摄像头', '同声传译'],
        thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
        available: true,
      },
      {
        id: 'room-3',
        name: '星际会议室 C',
        capacity: 6,
        floor: '2F',
        equipment: ['触控屏', '白板', '音响系统'],
        thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400',
        available: false,
      },
    ];
    set({ roomList: mockRooms });
  },

  loadTimeSlots: (date) => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const start = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const endHour = min === 30 ? hour + 1 : hour;
        const endMin = min === 30 ? 0 : 30;
        const end = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
        
        slots.push({
          start,
          end,
          available: Math.random() > 0.3,
        });
      }
    }
    set({ timeSlots: slots });
  },

  bookRoom: async () => {
    const { selectedDate, selectedTime, selectedRoom, invitedMembers, purpose } = get();
    
    if (!selectedDate || !selectedTime || !selectedRoom) {
      throw new Error('请完成所有必填项');
    }

    // Simulate blockchain hash generation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const blockchainHash = `0x${Math.random().toString(16).slice(2, 34)}`;

    const booking: Booking = {
      id: `MEET-${Date.now()}`,
      roomId: selectedRoom.id,
      date: selectedDate.toISOString(),
      timeSlot: selectedTime,
      members: invitedMembers,
      purpose,
      status: 'confirmed',
      blockchainHash,
    };

    return booking;
  },

  reset: () => {
    set({
      step: 0,
      selectedDate: null,
      selectedTime: null,
      selectedRoom: null,
      invitedMembers: [],
      purpose: '',
    });
  },
}));
