"use client";

import { motion } from "framer-motion";
import { GradientText } from "@/components/ui/gradient-text";
import { EventCard } from "@/components/dashboard/event-card";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";


export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const {
    events,
    isLoading: eventsLoading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useEvents();
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

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
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
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
        {events.length === 0 && (
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