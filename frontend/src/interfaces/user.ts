export interface User {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'admin' | 'developer' | 'user';
  permissions: Permissions;
}

export interface Permissions {
  canEditAdmin: boolean;
  canViewAdmin: boolean;
}