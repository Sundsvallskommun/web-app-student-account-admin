import { ClientUser } from '@/interfaces/users.interface';
import { Session } from 'express-session';

interface Engagement {
  organizationName: string;
  organizationNumber: string;
  organizationId: string;
}

declare module 'express-session' {
  interface Session {
    returnTo?: string;
    user?: ClientUser;
    representing?: Engagement;
    passport?: any;
    representingChoices?: Engagement[];
  }
}
