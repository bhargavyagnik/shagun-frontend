"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GradientText } from "@/components/ui/gradient-text";
import { EventCard } from "@/components/dashboard/event-card";
import { mockEvents } from "@/lib/mock-data";
import { apiClient } from "@/lib/api";
import { Plus, Calendar, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

interface GetAllResponse {
  success: boolean;
  events: Event[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await apiClient<GetAllResponse>("/events/getall/", {
          method: "GET",
          credentials: "include",
        });
        if (response.data) {
          setAllEvents(response.data.events);
        } else {
          console.error("Failed to fetch events:", response.data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);


  const filteredEvents = allEvents
    .filter(event => 
      event.brideName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.groomName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      }
      return 10000;
      // return b.totalAmount - a.totalAmount;
    });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Your <GradientText>Events</GradientText>
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your shagun collections and view contributions
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg hover:shadow-pink-500/20">
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" /> Create New Event
            </Link>
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background/50 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border bg-background/50 backdrop-blur-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventCard
                event={event}
                onClick={() => router.push(`/dashboard/events/${event.id}`)}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or create a new event
            </p>
          </div>
        )}
      </div>
    </main>
  );
}