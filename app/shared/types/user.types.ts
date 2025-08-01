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
  age?: number | string;
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
  userAge: number | null;
  userGender: UserGender | string | null;
  registrationDate: string | null;
  profilePhoto: MediaItem[] | null;
  avatar: UserAvatar | null;
}
