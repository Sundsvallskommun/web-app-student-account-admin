import { HttpException } from '@/exceptions/HttpException';
import { Class, Pupil, School } from '@/interfaces/school';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Body, Controller, Get, Param, Patch, Req, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

interface ResponseData<T> {
  data: T;
  message: string;
  status: number;
}

@Controller()
export class SchoolController {
  private apiService = new ApiService();

  @Get('/schools')
  @OpenAPI({ summary: 'Get all schools that user has access too by login name' })
  @UseBefore(authMiddleware)
  async getSchools(@Req() req: any): Promise<ResponseData<School[]>> {
    const { username } = req.user;

    try {
      const url = `/education/1.0/schools?loginName=${username}`;

      const res = await this.apiService.get<any>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/school/:schoolId/classes')
  @OpenAPI({ summary: 'Get list of classes for a given school' })
  @UseBefore(authMiddleware)
  async getClasses(@Param('schoolId') schoolId: string, @Req() req: any): Promise<ResponseData<Class[]>> {
    const { username } = req.user;

    try {
      const url = `/education/1.0/school/${schoolId}/classes?loginName=${username}`;
      const res = await this.apiService.get<any>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/schoolclass/:schoolClassId/pupils')
  @OpenAPI({ summary: 'Get list of pupils in a specific class' })
  @UseBefore(authMiddleware)
  async getPupils(@Param('schoolClassId') schoolClassId: string, @Req() req: any): Promise<ResponseData<Pupil[]>> {
    const { username } = req.user;

    try {
      const url = `/education/1.0/schoolclass/${schoolClassId}/pupils?loginName=${username}`;
      const res = await this.apiService.get<any>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/pupil/search')
  @OpenAPI({ summary: 'Search for pupils based on criteria' })
  @UseBefore(authMiddleware)
  async searchPupils(@Req() req: any): Promise<ResponseData<Pupil[]>> {
    const { username } = req.user;

    try {
      const searchParams = req.query;

      const res = await this.apiService.get<any>({
        url: `/education/1.0/pupil/search?loginName=${username}`,
        params: searchParams,
      });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/:pupil/password')
  @OpenAPI({ summary: 'Generate a new password for a pupil' })
  @UseBefore(authMiddleware)
  async generatePupilPassword(@Req() req: any): Promise<ResponseData<any>> {
    const { username } = req.user;

    try {
      if (!username) {
        throw new HttpException(400, 'Pupil login name is required');
      }
      const url = `/education/1.0/pupil/password?loginName=${username}`;
      const res = await this.apiService.get<any>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  // @Patch('/pupil/:pupilLoginName')
  // @OpenAPI({ summary: 'Update a pupil' })
  // @UseBefore(authMiddleware)
  // async updatePupilPassword(@Req() req: any) : (@Body() body: { loginName: any }): Promise<ResponseData<any>> {
  //   try {
  //     const { loginName } = body;
  //     const { username } = req.user;

  //     const url = `/education/1.0/pupil/${loginName}/password?loginName?${username}`;

  //     const res = await this.apiService.patch<any>({ url });
  //     return { data: res.data, message: 'success', status: 200 };
  //   } catch (error) {
  //     throw new HttpException(500, error.message);
  //   }
  // }
  @Patch('/pupil/:pupilLoginName')
  @OpenAPI({ summary: 'Update a pupil' })
  @UseBefore(authMiddleware)
  async updatePupilPassword(@Body() body: { pupilLoginName: string; newPassword: string }, @Req() req: any): Promise<ResponseData<any>> {
    try {
      const { pupilLoginName, newPassword } = body;
      const { username } = req.user;

      const url = `/education/1.0/pupil/${pupilLoginName}/password?loginName=${username}`;
      const updateData = {
        ...body,
        // Other data you might need to send
      };

      const res = await this.apiService.patch<Pupil>({ url, data: updateData });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }
}
