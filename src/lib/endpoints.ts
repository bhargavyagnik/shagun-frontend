import { api } from './api';
import { ApiResponse, Event, Contribution } from './types';

export const eventApi = {
  getAll: () => {
    return api.get<ApiResponse<Event[]>>('/events/getall');
  },
  
  getOne: (id: string) => {
    return api.get<ApiResponse<Event>>(`/events/event/${id}`);
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
    return api.get<ApiResponse<Contribution[]>>(`/contributions/get/${eventId}`);
  },
    
  
  create: (eventId: string, data: Partial<Contribution>) => {
    return api.post<ApiResponse<void>>(`/contributions/${eventId}`, data);
  }
};