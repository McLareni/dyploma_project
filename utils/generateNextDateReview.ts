export const generateTime = (stage: number) => {
  const intervalsOfDays = [0, 1, 3, 7, 14];

  const result = new Date();
  const day = result.getDate() + (intervalsOfDays[stage] ?? 30);
  result.setDate(day);

  return result;
};
