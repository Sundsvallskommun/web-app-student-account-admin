export function getInitials(name?: string | null): string {
  const initials = (name ?? '').match(/\b\w/g) || [];
  return (initials.shift() ?? '') + (initials.pop() ?? '');
}
