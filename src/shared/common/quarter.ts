export function getYearQuarterSprint(rawDate: Date): [number, number, number] {
  // Copy date so don't modify original
  const d = new Date(
    Date.UTC(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate())
  );
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  // quarter
  const q = Math.floor((d.getMonth() + 1) / 3);

  // Get first day of year
  const quarterStart = new Date(Date.UTC(d.getUTCFullYear(), (q - 1) * 3, 1));

  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    ((d.getTime() - quarterStart.getTime()) / 86400000 + 1) / 7
  );
  const sprintNo = Math.ceil(weekNo / 2);

  // Return array of year and week number
  return [d.getUTCFullYear(), q, sprintNo];
}

export function getSprintStr(d: Date): string {
  const [_, q, s] = getYearQuarterSprint(d);
  return `Q${q}S${s}`;
}
