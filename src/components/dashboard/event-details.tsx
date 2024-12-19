"use client";

import { useEffect, useState } from "react";
import { User2, IndianRupee, Share2, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ContributionsTable } from "./contributions-table";
import { apiClient } from "@/lib/api";

interface Contribution {
  id: string;
  name:string;
  amount: number;
  relation: "bride" | "groom";
  message?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface ContributionsResponse {
  contributions: Contribution[];
}

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

export function EventDetails({ 
  eventId,
  event 
}: { 
  eventId: string;
  event: Event;
}) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        setIsLoading(true);
        console.log(eventId);
        const response = await apiClient<ContributionsResponse>(`/contributions/get/${eventId}`, {
          method: "GET",
          credentials: "include"
        });
        console.log(response);
        if (response.data) {
          setContributions(response.data.contributions);
        } else {
          setError("Failed to fetch contributions");
        }
      } catch (error) {
        setError("Error fetching contributions");
        console.error("Error fetching contributions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, []);
  const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
  const bridesSideAmount = contributions
    .filter(c => c.relation === "bride")
    .reduce((sum, c) => sum + c.amount, 0);
  const groomsSideAmount = contributions
   .filter(c => c.relation === "groom")
    .reduce((sum, c) => sum + c.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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