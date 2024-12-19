"use client";

import { useEffect, useState } from "react";
import { EventDetails } from "@/components/dashboard/event-details";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useParams } from "next/navigation"; 
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  occasionType: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  upiId: string;
  userId: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface EventResponse {
  success: boolean;
  event: Event;
}

export default function EventViewPage() {
  const router = useRouter();
  const { eventId } = useParams(); // Dynamically get eventId
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setIsLoading(true);
        const response = await apiClient<EventResponse>(`/events/event/${eventId}`, {
          method: "GET",
          credentials: "include",
        });
        if ((response.status==200 || response.status==201) && response.data) {
          setEvent(response.data.event);
        } else if(response.status==401){
            router.push('/login');
        }

        else {
          setError("Failed to fetch event details");
        }
      } catch (err) {
        setError("Error fetching event details");
        console.error("Error fetching event:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (eventId) {
      fetchEvent();
    }
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {error || "Event not found"}
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        <EventDetails eventId={event.id} event={event} />
      </div>
    </main>
  );
}