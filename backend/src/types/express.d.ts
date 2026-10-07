import { ClientUser } from '@interfaces/users.interface';

declare global {
  namespace Express {
    interface User extends ClientUser {
      givenName?: string;
      surname?: string;
      groups?: string[];
    }
  }
}

export {};
