import { create } from 'zustand';

interface Verification {
  id: string;
  certificate_type: string;
  institution_name: string;
  status: string;
  trust_score: number;
  created_at: string;
}

interface JobState {
  activeJob: any | null;
  bulkProgress: {
    total: number;
    processed: number;
    verified: number;
    suspicious: number;
    fake: number;
    failed: number;
    percent: number;
  } | null;
  recentVerifications: Verification[];
  setActiveJob: (job: any) => void;
  updateBulkProgress: (progress: any) => void;
  setRecentVerifications: (verifications: Verification[]) => void;
}

export const useJobStore = create<JobState>((set) => ({
  activeJob: null,
  bulkProgress: null,
  recentVerifications: [],
  setActiveJob: (activeJob) => set({ activeJob }),
  updateBulkProgress: (bulkProgress) => set({ bulkProgress }),
  setRecentVerifications: (recentVerifications) => set({ recentVerifications }),
}));
