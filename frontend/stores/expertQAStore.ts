import { create } from 'zustand';

export type ExpertQuestionStatus = 'pending' | 'answered' | 'accepted';

export interface ExpertQuestion {
  id: string;
  title: string;
  content: string;
  farmerName: string;
  reward: number;
  createdAt: string;
  status: ExpertQuestionStatus;
  answer?: string;
}

interface ExpertQAState {
  questions: ExpertQuestion[];
  setQuestions: (data: ExpertQuestion[]) => void;
  answerQuestion: (id: string, answer: string) => void;
  acceptAnswer: (id: string) => void;
}

export const useExpertQAStore = create<ExpertQAState>((set) => ({
  questions: [],
  setQuestions: (data) => set({ questions: data }),
  answerQuestion: (id, answer) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, answer, status: 'answered' } : q
      ),
    })),
  acceptAnswer: (id) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, status: 'accepted' } : q
      ),
    })),
}));


