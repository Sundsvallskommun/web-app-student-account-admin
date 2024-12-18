import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Header, Param, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class EmployeeController {
  private apiService = new ApiService();

  // Images

  @Get('/image/:personId')
  @OpenAPI({ summary: 'Return pupil image' })
  @UseBefore(authMiddleware)
  @Header('Content-Type', 'image/jpeg')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getEmployeeImage(@Param('personId') personId: string, @QueryParam('width') width = 120): Promise<any> {
    const url = `employee/1.0/${personId}/personimage`;
    const res = await this.apiService.get<any>({
      url,
      responseType: 'arraybuffer',
      params: {
        width: width,
      },
    });
    return res.data;
  }
}
