export function isHttpUrl(value: string | null | undefined) {
  if (!value?.trim()) return false;
  return /^https?:\/\//i.test(value.trim());
}
