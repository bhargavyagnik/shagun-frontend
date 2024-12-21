"use client";

import { GiftContributionForm } from "@/components/forms/gift-contribution-form";
import { eventApi } from "@/lib/endpoints";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await eventApi.getPublic(eventId);
        setEventDetails(response.data);
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!eventDetails) {
    return <div className="text-center py-20">Event not found</div>;
  }

  return (
    <main className="py-20">
      <GiftContributionForm eventDetails={eventDetails} eventId={eventId} />
    </main>
  );
}