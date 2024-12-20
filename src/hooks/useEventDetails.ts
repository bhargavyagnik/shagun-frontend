import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Event, Contribution } from '@/lib/types';
import { contributionApi, eventApi } from '@/lib/endpoints';

export function useEventDetails(eventId: string) {
  // Fetch event details
  const eventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventApi.getOne(eventId),
    enabled: !!eventId,
  });

  // Fetch contributions
  const contributionsQuery = useQuery({
    queryKey: ['contributions', eventId],
    queryFn: () => contributionApi.getAll(eventId),
    enabled: !!eventId,
  });

  return {
    event: eventQuery.data?.event,
    contributions: contributionsQuery.data?.contributions || [],
    isLoading: eventQuery.isLoading || contributionsQuery.isLoading,
    error: eventQuery.error || contributionsQuery.error,
  };
}