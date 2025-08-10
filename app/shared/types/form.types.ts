export type FormQuestionType =
  | 'text'
  | 'quote'
  | 'media'
  | 'select'
  | 'tags'
  | 'color'
  | 'gender'
  | 'welcome'
  | 'avatar'
  | 'multi_select'
  | 'title'
  | 'area'
  | 'range'
  | 'date'
  | 'time'
  | 'notification'
  | 'theme';

export interface FormOption {
  id: number;
  name: string;
}

export interface FormColor extends FormOption {
  color: string;
}

export interface FormQuestion {
  id?: number | string;
  name: string;
  color?: string;
  type: FormQuestionType;
  question: string;
  title?: string;
  description?: string;
  step?: boolean;
  options?: FormOption[];
  tags?: FormOption[];
  colors?: FormColor[];
  answer?: any;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface FormStep {
  questions: FormQuestion[];
}

export interface FormTest {
  id: number;
  name: string;
  data: FormStep[];
}

export interface FormAnswers {
  [questionName: string]: any;
}
