"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User2, IndianRupee, Share2, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { mockContributions, mockEvents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ContributionsTable } from "./contributions-table";

export function EventDetails({ eventId }: { eventId: string }) {
  const event = mockEvents.find(e => e.id === eventId);
  const contributions = mockContributions[eventId as keyof typeof mockContributions] || [];
  
  const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
  const bridesSideAmount = contributions
    .filter(c => c.relation === "bride")
    .reduce((sum, c) => sum + c.amount, 0);
  const groomsSideAmount = contributions
    .filter(c => c.relation === "groom")
    .reduce((sum, c) => sum + c.amount, 0);

  if (!event) return null;

  return (
    <div className="space-y-8">
      {/* Event Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {event.brideName} & {event.groomName}
        </h1>
        <div className="flex gap-4 text-muted-foreground">
          <span>Event Date: {formatDate(event.eventDate)}</span>
          <span>•</span>
          <span>{contributions.length} Contributions</span>
          <span>•</span>
          <span>₹{totalAmount.toLocaleString()} Collected</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Collection"
          value={`₹${totalAmount.toLocaleString()}`}
          icon={<IndianRupee className="h-5 w-5" />}
          className="bg-gradient-to-br from-pink-500/10 to-rose-500/10"
        />
        <SummaryCard
          label="Bride's Side"
          value={`₹${bridesSideAmount.toLocaleString()}`}
          icon={<User2 className="h-5 w-5" />}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
        />
        <SummaryCard
          label="Groom's Side"
          value={`₹${groomsSideAmount.toLocaleString()}`}
          icon={<User2 className="h-5 w-5" />}
          className="bg-gradient-to-br from-violet-500/10 to-purple-500/10"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Collection Page
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Contributions Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Contributions</h2>
        <ContributionsTable contributions={contributions} />
      </div>
    </div>
  );
}

function SummaryCard({ 
  label, 
  value, 
  icon, 
  className = "" 
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-6 rounded-xl border ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}