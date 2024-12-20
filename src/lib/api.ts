import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import { auth } from './firebase';

// Add logger utility
const logger = {
  info: (message: string, meta?: object) => {
     console.info(`[API] ${message}`, meta || '');
  },
  error: (message: string, error?: any, meta?: object) => {
     console.log(`[API] ${message}`, error, meta || '');
  },
  warn: (message: string, meta?: object) => {
     console.warn(`[API] ${message}`, meta || '');
  }
};

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add logging to response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`Response received for ${response.config.url}`, {
          status: response.status,
          method: response.config.method
        });
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          logger.warn('Token expired, attempting refresh', {
            url: originalRequest.url
          });

          if (this.isRefreshing) {
            logger.info('Refresh already in progress, queueing request');
            try {
              const token = await new Promise<string>((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
              });
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return this.client(originalRequest);
            } catch (err) {
              logger.error('Failed to process queued request', err);
              return Promise.reject(err);
            }
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const token = await this.refreshToken();
            if (token) {
              logger.info('Token refresh successful');
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              // Process failed queue
              this.processQueue(null, token);
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            logger.error('Token refresh failed', refreshError);
            this.processQueue(refreshError, null);
            window.location.href = '/';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }
        
        logger.error('Request failed', error, {
          url: originalRequest?.url,
          status: error.response?.status
        });
        return Promise.reject(error);
      }
    );

    // Add logging to request interceptor
    this.client.interceptors.request.use(async (config) => {
      logger.info(`Request started: ${config.method?.toUpperCase()} ${config.url}`);
      
      if (!auth.currentUser) {
        logger.error('Request attempted without authentication');
        throw new Error('User not authenticated');
      }

      try {
        const token = await this.getValidToken();
        if (token) {
          logger.info('Token added to request');
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        logger.error('Failed to get valid token', error);
        window.location.href = '/';
        return Promise.reject(error);
      }
      return config;
    });
  }

  private async getValidToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      logger.warn('No current user found');
      return null;
     }
    
    try {
      const token = await user.getIdToken(false);
      logger.info('Retrieved valid token');
      return token;
    } catch (error) {
      logger.error('Error getting token', error);
      return null;
    }
  }

  private async refreshToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      logger.warn('No current user found during token refresh');
      return null;
    }
    
    try {
      const token = await user.getIdToken(true);
      logger.info('Token refreshed successfully');
      return token;
    } catch (error) {
      logger.error('Error refreshing token', error);
      return null;
    }
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token!);
      }
    });
    this.failedQueue = [];
  }

  // Add logging to HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    logger.info(`GET request to ${endpoint}`);
    const response: AxiosResponse<T> = await this.client.get(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    logger.info(`POST request to ${endpoint}`, { dataSize: data ? Object.keys(data).length : 0 });
    const response: AxiosResponse<T> = await this.client.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    logger.info(`PUT request to ${endpoint}`, { dataSize: data ? Object.keys(data).length : 0 });
    const response: AxiosResponse<T> = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    logger.info(`DELETE request to ${endpoint}`);
    const response: AxiosResponse<T> = await this.client.delete(endpoint);
    return response.data;
  }
}

export const api = new ApiClient();