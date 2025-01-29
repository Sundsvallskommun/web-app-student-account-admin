import { User, Permissions } from '@interfaces/user';
import { ApiResponse } from '@services/api-service';

export const defaultPermissions: Permissions = {
  canEditAdmin: false,
  canViewAdmin: false,
};

export const emptyUser: User = {
  firstName: '',
  lastName: '',
  name: '',
  username: '',
  role: 'user',
  permissions: defaultPermissions,
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
