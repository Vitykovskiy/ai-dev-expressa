export function minutesBetween(start: string, end: string): number {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  return endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
}
