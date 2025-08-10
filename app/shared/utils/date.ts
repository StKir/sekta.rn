export const formatDateRange = (endDateISO: string): string => {
  const endDate = new Date(endDateISO);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 7);

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };

  const startFormatted = startDate.toLocaleDateString('ru-RU', formatOptions);
  const endFormatted = endDate.toLocaleDateString('ru-RU', formatOptions);

  return `от ${startFormatted} до ${endFormatted}`;
};
