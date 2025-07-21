import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { StorageService } from '@/shared/utils/storage';

export type RecordType = 'emotions' | 'activities' | 'mood';

export interface Record {
  id: string;
  text: string;
  timestamp: number;
  type: RecordType;
}

interface RecordsState {
  records: Record[];
}

interface RecordsActions {
  addRecord: (type: RecordType, text: string) => void;
  removeRecord: (id: string) => void;
  getRecordsByType: (type: RecordType) => Record[];
  clearRecords: () => void;
}

type RecordsStore = RecordsState & RecordsActions;

export const useRecordsStore = create<RecordsStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (type: RecordType, text: string) => {
        const newRecord: Record = {
          id: Date.now().toString(),
          text: text.trim(),
          timestamp: Date.now(),
          type,
        };

        set((state) => ({
          records: [...state.records, newRecord],
        }));
      },

      removeRecord: (id: string) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },

      getRecordsByType: (type: RecordType) => {
        return get().records.filter((record) => record.type === type);
      },

      clearRecords: () => {
        set({ records: [] });
      },
    }),
    {
      name: 'records-storage',
      storage: createJSONStorage(() => StorageService),
    }
  )
);
