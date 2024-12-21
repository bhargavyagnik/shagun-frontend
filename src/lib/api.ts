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

// Add at the top of the file
const API_TIMEOUT = 15000; // 15 seconds

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
  }> = [];
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      // Add request retry logic
      retry: 3,
      retryDelay: (retryCount) => {
        return retryCount * 1000; // time interval between retries
      }
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
      
      // Skip auth check for public routes
      if (this.isPublicRoute(config.url || '')) {
        return config;
      }

      // Original auth logic
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

  private isPublicRoute(url: string): boolean {
    // Add any public routes that don't need authentication
    const publicRoutes = ['/contributions/add', '/events/public'];
    return publicRoutes.some(route => url.includes(route));
  }

  // Add error handling wrapper
  private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle network errors
        if (!error.response) {
          throw new Error('Network error occurred. Please check your connection.');
        }
        
        // Handle specific HTTP errors
        switch (error.response.status) {
          case 400:
            throw new Error('Invalid request. Please check your input.');
          case 401:
            throw new Error('Authentication required. Please log in.');
          case 403:
            throw new Error('Access denied. You do not have permission.');
          case 404:
            throw new Error('Resource not found.');
          case 429:
            throw new Error('Too many requests. Please try again later.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error('An unexpected error occurred.');
        }
      }
      throw error;
    }
  }

  // Update HTTP methods to use error handling wrapper
  async get<T>(endpoint: string): Promise<T> {
    return this.handleRequest(this.client.get(endpoint));
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(this.client.post(endpoint, data));
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.handleRequest(this.client.put(endpoint, data));
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.handleRequest(this.client.delete(endpoint));
  }
}

export const api = new ApiClient();