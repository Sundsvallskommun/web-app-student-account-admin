import { HttpException } from '@/exceptions/HttpException';
import { apiURL } from '@/utils/util';
import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import ApiTokenService from './api-token.service';
import { logger } from '@/utils/logger';

class ApiResponse<T> {
  data: T;
  message: string;
}

class ApiService {
  private apiTokenService = new ApiTokenService();
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const token = await this.apiTokenService.getToken();

    const defaultHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const defaultParams = {};

    const preparedConfig: AxiosRequestConfig = {
      ...config,
      headers: { ...defaultHeaders, ...config.headers },
      params: { ...defaultParams, ...config.params },
      url: apiURL(config.url),
    };

    try {
      const res = await axios(preparedConfig);
      return { data: res.data, message: 'success' };
    } catch (error: unknown | AxiosError) {
      if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 404) {
        logger.error(`Error details: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(404, 'Not found');
      } else if (axios.isAxiosError(error) && (error as AxiosError).response?.data) {
        logger.error(`ERROR: API request failed with status: ${error.response?.status}`);
        logger.error(`Error details: ${JSON.stringify(error.response.data)}`);
        logger.error(`Error url: ${error.response.config.url}`);
        logger.error(`Error data: ${error.response.config.data?.slice(0, 1500)}`);
        logger.error(`Error method: ${error.response.config.method}`);
        logger.error(`Error headers: ${error.response.config.headers}`);
      } else {
        logger.error(`Unknown error: ${error}`);
      }
      throw new HttpException(500, 'Internal server error');
    }
  }

  public async get<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  public async post<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  public async patch<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }

  public async delete<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }
}

export default ApiService;
