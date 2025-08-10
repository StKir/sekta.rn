import { MediaItem } from '@/shared/ui/MediaPicker/MediaPicker';

export interface UserAvatar {
  id?: number;
  name: string;
  uri?: string;
}

export interface UserGender {
  id?: number;
  name: string;
}

export interface UserData {
  // Основная информация
  name?: string;
  birthDate?: string;
  gender?: UserGender | string;

  // Медиа
  profile_photo?: MediaItem[];
  avatar?: UserAvatar;

  // Даты
  registrationDate?: string;

  // Дополнительная информация из регистрации
  feeling?: string;
  stress_level?: string;
  bad_habits?: string;
  tracking_goals?: string[];
  app_experience?: string;
  communication_style?: string;
  notification?: {
    active: boolean;
    time: string | null;
  };

  // Для совместимости с FormAnswers
  [key: string]: any;
}

export interface UseUserReturn {
  // Основные данные
  userData: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Методы
  setUser: (userData: UserData) => void;
  updateUser: (userData: Partial<UserData>) => void;
  loadUser: () => void;
  removeUser: () => void;

  // Вычисляемые свойства
  isLoggedIn: boolean;
  userName: string;
  userBirthDate: string | null;
  userAge: number | null;
  userGender: UserGender | string | null;
  registrationDate: string | null;
  profilePhoto: MediaItem[] | null;
  avatar: UserAvatar | null;
  notification: {
    active: boolean;
    time: string | null;
  };
  theme: 'light' | 'dark';
}
