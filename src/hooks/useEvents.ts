import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '@/lib/endpoints';
import { Event } from '@/lib/types'
import { useMemo, useState } from 'react';

interface UseEventsOptions {
    initialSortBy?: 'date' | 'amount';
    initialSearchQuery?: string;
}

export function useEvents(options: UseEventsOptions = {}) {

  console.log("useEvents");
  const [searchQuery, setSearchQuery] = useState(options.initialSearchQuery || '');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>(options.initialSortBy || 'date');
  const queryClient = useQueryClient();

  const {data, isLoading, error} = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.getAll()
  });

  const filteredEvents = useMemo(() => {
    const events = data?.data || [];
    return events
      .filter((event: Event) => 
        event.brideName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.groomName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: Event, b: Event) => {
        if (sortBy === 'date') {
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        }
        // Add other sorting options here
        return 0;
      });
  }, [data, searchQuery, sortBy]);


  const createEvent = useMutation({
    mutationFn: (data: Partial<Event>) => eventApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  return {
    events: filteredEvents,
    isLoading,
    error,
    createEvent,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  };
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getOne(id),
    enabled: !!id
  });
}