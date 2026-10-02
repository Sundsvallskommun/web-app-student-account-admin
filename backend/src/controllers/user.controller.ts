import { Controller, Req, Get, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import authMiddleware from '@middlewares/auth.middleware';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/HttpException';
import { ClientUser } from '@/interfaces/users.interface';

@Controller()
export class UserController {
  @Get('/me')
  @OpenAPI({ summary: 'Return current user' })
  @UseBefore(authMiddleware)
  async getUser(@Req() req: RequestWithUser): Promise<{ data: ClientUser; message: string }> {
    const { name, firstName, lastName, username, permissions, role } = req.user;

    if (!name) {
      throw new HttpException(400, 'Bad Request');
    }

    const userData: ClientUser = {
      name,
      firstName,
      lastName,
      username,
      permissions,
      role,
    };

    return { data: userData, message: 'success' };
  }
}
