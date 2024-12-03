export function getInitials(name: string): string {
  const initials = name.match(/\b\w/g) || [];
  return (initials.shift() ?? '') + (initials.pop() ?? '');
}
