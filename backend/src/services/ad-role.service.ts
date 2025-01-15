import { InternalRole } from '@/interfaces/users.interface';

export type RoleADMapping = {
  [key: string]: InternalRole;
};

const mapping: RoleADMapping = {};

mapping[process.env.ADMIN_GROUP.toLocaleLowerCase()] = 'admin';

export const roleADMapping: RoleADMapping = mapping;
