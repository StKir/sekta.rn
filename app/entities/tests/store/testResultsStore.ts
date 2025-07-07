import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

import { StorageService } from '@/shared/utils/storage';
import { TestResult, TestResultsStore } from '@/shared/types/testResult.types';

export const useTestResultsStore = create<TestResultsStore>()(
  persist(
    (set, get) => ({
      results: [],

      addResult: (result: TestResult) => {
        console.log(result, 'result');
        set((state) => ({
          results: [...state.results, result],
        }));
      },

      getResultsByTestId: (testId: number): TestResult[] => {
        return get().results.filter((result) => result.id === testId);
      },

      clearResults: () => {
        set({ results: [] });
      },

      logResults: () => {
        const results = StorageService.getItem('test-results');
        console.log(results);
      },
    }),
    {
      name: 'test-results-storage',
      storage: createJSONStorage(() => StorageService),
    }
  )
);
