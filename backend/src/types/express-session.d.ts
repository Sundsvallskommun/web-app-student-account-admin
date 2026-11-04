import { ClientUser } from '@/interfaces/users.interface';

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
    passport?: { user?: ClientUser };
    representingChoices?: Engagement[];
    messages: string[];
  }
}
