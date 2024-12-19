import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Class, Pupil, Resource, School } from '@/interfaces/school';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, QueryParam, Req, UseBefore } from 'routing-controllers';
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
  async getSchools(@Req() req: RequestWithUser): Promise<ResponseData<School[]>> {
    const { username } = req.user;

    try {
      const url = `/education/1.0/schools?loginName=${username}`;

      const res = await this.apiService.get<School[]>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/school/:schoolId/classes')
  @OpenAPI({ summary: 'Get list of classes for a given school' })
  @UseBefore(authMiddleware)
  async getClasses(@Param('schoolId') schoolId: string, @Req() req: RequestWithUser): Promise<ResponseData<Class[]>> {
    const { username } = req.user;

    try {
      const url = `/education/1.0/school/${schoolId}/classes?loginName=${username}`;
      const res = await this.apiService.get<Class[]>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/schoolclass/:schoolClassId/pupils')
  @OpenAPI({ summary: 'Get list of pupils in a specific class' })
  @UseBefore(authMiddleware)
  async getPupils(@Param('schoolClassId') schoolClassId: string, @Req() req: RequestWithUser): Promise<ResponseData<Pupil[]>> {
    const { username } = req.user;

    try {
      const url = `/education/1.0/schoolclass/${schoolClassId}/pupils?loginName=${username}`;
      const res = await this.apiService.get<Pupil[]>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/pupil/search')
  @OpenAPI({ summary: 'Search for pupils based on criteria' })
  @UseBefore(authMiddleware)
  async searchPupils(@Req() req: RequestWithUser): Promise<ResponseData<Pupil[]>> {
    const { username } = req.user;

    try {
      const searchParams = req.query;

      const res = await this.apiService.get<Pupil[]>({
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
  async generatePupilPassword(@Req() req: RequestWithUser): Promise<ResponseData<{ newPassword: string }>> {
    const { username } = req.user;

    try {
      if (!username) {
        throw new HttpException(400, 'Pupil login name is required');
      }
      const url = `/education/1.0/pupil/password?loginName=${username}`;
      const res = await this.apiService.get<{ newPassword: string }>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Patch('/pupil/:pupilLoginName')
  @OpenAPI({ summary: 'Update a pupil' })
  @UseBefore(authMiddleware)
  async updatePupil(
    @Param('pupilLoginName') pupilLoginName: string,
    @Body() body: { isEnabled: boolean; displayname: string; password: string },

    @Req() req: RequestWithUser,
  ): Promise<ResponseData<{ updatedPupil: any }>> {
    try {
      const { isEnabled, displayname, password } = body;
      const { username } = req.user;

      const url = `/education/1.0/pupil/${pupilLoginName}?loginName=${username}`;
      const updateData = {
        isEnabled,
        displayname,
        password,
      };
      const res = await this.apiService.patch<any>({ url, data: updateData });

      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  // Resources

  @Get('/resources/:unitId')
  @OpenAPI({ summary: 'Get all resources from a school' })
  @UseBefore(authMiddleware)
  async getResources(@Param('unitId') unitId: string, @Req() req: RequestWithUser): Promise<ResponseData<Resource[]>> {
    const { username } = req.user;
    try {
      const url = `/education/1.0/resources/${unitId}?loginName=${username}`;

      const res = await this.apiService.get<Resource[]>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Post('/resource')
  @OpenAPI({ summary: 'Add a resource to a school' })
  @UseBefore(authMiddleware)
  async addResourceToSchool(
    @Body() body: { resourceLoginName: string; unitId: string },
    @Req() req: RequestWithUser,
  ): Promise<ResponseData<Resource[]>> {
    try {
      const { resourceLoginName, unitId } = body;
      const { username } = req.user;

      const url = `/education/1.0/resource?resourceLoginName=${resourceLoginName}&unitId=${unitId}&creatorLoginName=${username}`;

      const res = await this.apiService.post<Resource[]>({ url });
      return { data: res.data, message: 'Resource added successfully', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Delete('/resource')
  @OpenAPI({ summary: 'Delete a resource to a school' })
  @UseBefore(authMiddleware)
  async deleteResourceFromSchool(
    @QueryParam('resourceLoginName') resourceLoginName: string,
    @QueryParam('unitId') unitId: string,
    @Req() req: RequestWithUser,
  ): Promise<ResponseData<{ message: string }>> {
    try {
      const { username } = req.user;

      const url = `/education/1.0/resource?resourceLoginName=${resourceLoginName}&unitId=${unitId}&creatorLoginName=${username}`;

      const res = await this.apiService.delete<{ message: string }>({ url });
      return { data: res.data, message: 'Resource added successfully', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  @Get('/resources/search/:searchTerm')
  @OpenAPI({ summary: 'Search for resources' })
  @UseBefore(authMiddleware)
  async searchResources(@Param('searchTerm') searchTerm: string, @Req() req: RequestWithUser): Promise<ResponseData<Resource>> {
    const { username } = req.user;

    try {
      if (!searchTerm) {
        throw new HttpException(400, 'Search term is required');
      }
      const url = `/education/1.0/resources/search/${searchTerm}?loginName=${username}`;
      const res = await this.apiService.get<Resource>({ url });
      return { data: res.data, message: 'success', status: 200 };
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }
}
