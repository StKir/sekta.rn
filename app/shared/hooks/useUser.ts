import { calculateAge } from '@/shared/utils/dateUtils';
import { UseUserReturn } from '@/shared/types/user.types';
import { useUserStore } from '@/entities/user';

export const useUser = (): UseUserReturn => {
  const { userData, isLoading, isAuthenticated, setUser, updateUser, loadUser, removeUser } =
    useUserStore();

  return {
    userData,
    isLoading,
    isAuthenticated,
    setUser,
    theme: userData?.theme || 'light',
    updateUser,
    loadUser,
    removeUser,
    // Дополнительные вычисляемые свойства
    isLoggedIn: isAuthenticated && !!userData,
    userName: userData?.name || 'Пользователь',
    userBirthDate: userData?.birthDate || null,
    notification: userData?.notification || { active: false, time: null },
    userAge: userData?.birthDate ? calculateAge(userData.birthDate) : null,
    userGender: userData?.gender || null,
    registrationDate: userData?.registrationDate || null,
    profilePhoto: userData?.profile_photo || null,
    avatar: userData?.avatar || null,
  };
};
