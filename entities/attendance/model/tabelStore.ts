import { create } from 'zustand';

interface TabelStore {
  lastUpdateTimestamp: number;
  refreshTabel: () => void;
}

export const useTabelStore = create<TabelStore>((set) => ({
  lastUpdateTimestamp: Date.now(),
  refreshTabel: () => {
    set({ lastUpdateTimestamp: Date.now() });
  },
}));

