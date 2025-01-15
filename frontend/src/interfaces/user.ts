export interface User {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  role: 'admin' | 'developer' | 'user';
  permissions: Permissions;
}