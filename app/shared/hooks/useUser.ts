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
    updateUser,
    loadUser,
    removeUser,
    // Дополнительные вычисляемые свойства
    isLoggedIn: isAuthenticated && !!userData,
    userName: userData?.name || 'Пользователь',
    userAge: userData?.age
      ? typeof userData.age === 'string'
        ? parseInt(userData.age, 10)
        : userData.age
      : null,
    userGender: userData?.gender || null,
    registrationDate: userData?.registrationDate || null,
    profilePhoto: userData?.profile_photo || null,
    avatar: userData?.avatar || null,
  };
};
