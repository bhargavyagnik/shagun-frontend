"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EventDetails } from "@/components/dashboard/event-details";
import { mockEvents, mockContributions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";

export default function EventViewPage({ params }: { params: { eventId: string } }) {
  const event = mockEvents.find(e => e.id === params.eventId);
  const contributions = mockContributions[params.eventId as keyof typeof mockContributions] || [];

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <main className="py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Event Details Component */}
        <EventDetails eventId={params.eventId} />
      </div>
    </main>
  );
}