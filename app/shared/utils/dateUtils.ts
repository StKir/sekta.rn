export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const formatBirthDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRegistrationDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isValidDate = (dateValue: Date | string | undefined): boolean => {
  if (!dateValue) {
    return false;
  }

  const date = new Date(dateValue);
  return !isNaN(date.getTime());
};

export const getDateWithOffset = (dayOffset: number, h: number, m: number) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(h, m, 0, 0);
  return date;
};

export const isDatePassed = (date: Date) => {
  const now = new Date();
  return date.getTime() < now.getTime();
};
