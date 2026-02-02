export function waitUntil(hour, minute) {
  const now = new Date();
  const target = new Date();

  target.setHours(hour, minute, 0, 0);
  if (target < now) target.setDate(target.getDate() + 1);

  return target.getTime() - now.getTime();
}
