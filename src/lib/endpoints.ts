import { api } from './api';
import { ApiResponse, Event, Contribution, ContributionData } from './types';

export const eventApi = {
  getAll: () => {
    return api.get<ApiResponse<Event[]>>('/events/getall');
  },
  
  getOne: (id: string) => {
    return api.get<ApiResponse<Event>>(`/events/event/${id}`);
  },

  getPublic: (id: string) => {
    return api.get<ApiResponse<any>>(`/events/public/${id}`);
  },
    
  
  create: (data: Partial<Event>) => {
    return api.post<ApiResponse<any>>('/events/addevent', data);
  },
  
  update: (id: string, data: Partial<Event>) => 
    api.put<ApiResponse<void>>(`/events/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/events/${id}`)
};

export const contributionApi = {
  getAll: (eventId: string) => {
    return api.get<Contribution[]>(`/contributions/get/${eventId}`);
  },
    
  
  create: ( data: Partial<ContributionData>) => {
    return api.post<ApiResponse<void>>(`/contributions/add`, data);
  }
};