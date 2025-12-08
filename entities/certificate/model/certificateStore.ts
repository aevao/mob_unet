import { create } from 'zustand';
import { fetchCertificates } from '../api/certificateApi';
import type { Certificate } from './types';

interface CertificateState {
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  fetchCertificates: () => Promise<void>;
}

export const useCertificateStore = create<CertificateState>((set) => ({
  certificates: [],
  isLoading: false,
  error: null,

  fetchCertificates: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchCertificates();
      set({ certificates: data, isLoading: false, error: null });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось загрузить справки';
      set({ error: message, isLoading: false, certificates: [] });
    }
  },
}));

