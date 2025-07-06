import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENDPOINTS } from './endpoints';

export enum APIMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

interface APIResponse<T = any> {
  data?: T;
  status: number;
}

interface APIError {
  response?: {
    status: number;
    data?: any;
  };
}

export const apiCaller = async <T>(
  method: APIMethod,
  endPoint: string,
  body?: object,
  params?: object,
  customHeaders?: Record<string, string>,
): Promise<APIResponse<T> | undefined> => {
  const fullUrl = `${ENDPOINTS.BASE_URL}${endPoint}`;
  console.log('🌐 NewsAPI Call:', method.toUpperCase(), fullUrl);
  console.log('📋 API Params:', params);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'NewsApp/1.0',
    ...customHeaders,
  };

  console.log('📋 API Headers:', headers);

  const config: AxiosRequestConfig = {
    headers,
    timeout: 15000,
    params,
  };

  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case APIMethod.GET:
        response = await axios.get<T>(fullUrl, config);
        break;
      case APIMethod.POST:
        response = await axios.post<T>(fullUrl, body, config);
        break;
      case APIMethod.PUT:
        response = await axios.put<T>(fullUrl, body, config);
        break;
      case APIMethod.PATCH:
        response = await axios.patch<T>(fullUrl, body, config);
        break;
      case APIMethod.DELETE:
        response = await axios.delete<T>(fullUrl, { ...config, data: body });
        break;
      default:
        throw new Error('Unknown API Method');
    }

    console.log('✅ NewsAPI Success:', response.status);
    console.log('📊 Response Data received:', !!response.data);

    return { data: response.data, status: response.status };
  } catch (error: any) {
    console.error('💥 NewsAPI Error Details:', error.message);
    console.error('💥 NewsAPI Error Response:', error.response?.data);
    console.error('💥 NewsAPI Error Status:', error.response?.status);

    const apiError = error as APIError;
    return apiError.response;
  }
};
