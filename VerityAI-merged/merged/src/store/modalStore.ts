import { create } from 'zustand';

type ModalType = 'login' | 'getStarted' | 'createAccount' | null;

interface ModalState {
  activeModal: ModalType;
  prefillData: {
    fullName: string;
    email: string;
  };
  openLogin: () => void;
  openGetStarted: () => void;
  openCreateAccount: (prefill?: { fullName: string; email: string }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  prefillData: { fullName: '', email: '' },
  openLogin: () => set({ activeModal: 'login' }),
  openGetStarted: () => set({ activeModal: 'getStarted' }),
  openCreateAccount: (prefill) => set({ 
    activeModal: 'createAccount', 
    prefillData: prefill || { fullName: '', email: '' } 
  }),
  closeModal: () => set({ activeModal: null, prefillData: { fullName: '', email: '' } }),
}));
