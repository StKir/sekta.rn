import { useEffect, useState } from 'react';

import { RegisterFormData } from '@/pages/RegisterPage';

import { StorageService } from '../utils/storage';

export const useUser = () => {
  const [user, setUser] = useState<RegisterFormData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await StorageService.getUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  return { user };
};
