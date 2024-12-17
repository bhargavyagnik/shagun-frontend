interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
  }
  
  export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };
  
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
      });
  
      const data = await response.json();
  
      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: 'Network error occurred',
        status: 500,
      };
    }
  }