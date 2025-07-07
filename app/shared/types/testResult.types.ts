export interface TestResultQuestion {
  type: string;
  id?: number | string;
  name: string;
  question: string;
  answer: any;
}

export interface TestResult {
  test: string;
  id: string | number;
  date: string;
  data: TestResultQuestion[];
}

export interface TestResultsStore {
  results: TestResult[];
  addResult: (result: TestResult) => void;
  getResultsByTestId: (testId: number) => TestResult[];
  clearResults: () => void;
  logResults: () => void;
}
