import { create } from 'zustand';
import {
  fetchInboxDocuments,
  fetchOutboxDocuments,
  fetchHistoryDocuments,
} from '../api/documentApi';
import type { Document, DocumentType } from './types';

interface DocumentState {
  inboxDocuments: Document[];
  outboxDocuments: Document[];
  historyDocuments: Document[];
  isLoading: {
    inbox: boolean;
    outbox: boolean;
    history: boolean;
  };
  error: {
    inbox: string | null;
    outbox: string | null;
    history: string | null;
  };
  fetchDocuments: (type: DocumentType) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  inboxDocuments: [],
  outboxDocuments: [],
  historyDocuments: [],
  isLoading: {
    inbox: false,
    outbox: false,
    history: false,
  },
  error: {
    inbox: null,
    outbox: null,
    history: null,
  },

  fetchDocuments: async (type: DocumentType) => {
    const loadingKey = type as keyof DocumentState['isLoading'];
    const errorKey = type as keyof DocumentState['error'];

    set((state) => ({
      isLoading: { ...state.isLoading, [loadingKey]: true },
      error: { ...state.error, [errorKey]: null },
    }));

    try {
      let data;
      switch (type) {
        case 'inbox':
          data = await fetchInboxDocuments();
          set({ inboxDocuments: data });
          break;
        case 'outbox':
          data = await fetchOutboxDocuments();
          set({ outboxDocuments: data });
          break;
        case 'history':
          data = await fetchHistoryDocuments();
          set({ historyDocuments: data });
          break;
      }
      set((state) => ({
        isLoading: { ...state.isLoading, [loadingKey]: false },
        error: { ...state.error, [errorKey]: null },
      }));
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Не удалось загрузить документы';
      set((state) => ({
        isLoading: { ...state.isLoading, [loadingKey]: false },
        error: { ...state.error, [errorKey]: message },
      }));
    }
  },
}));

