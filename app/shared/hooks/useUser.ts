import { useEffect, useState } from 'react';

import { StorageService } from '../utils/storage';
import { FormAnswers } from '../types/form.types';

export const useUser = () => {
  const [user, setUser] = useState<FormAnswers | null>(null);

  useEffect(() => {
    const userData = StorageService.getUser();
    setUser(userData);
  }, []);

  return { user };
};
