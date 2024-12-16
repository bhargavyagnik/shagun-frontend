import { motion } from "framer-motion";
import { Calendar, Gift, IndianRupee, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    brideName: string;
    groomName: string;
    eventDate: string;
    totalAmount: number;
    contributionsCount: number;
  };
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-pink-500/10 hover:border-pink-500/50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <h3 className="font-semibold text-lg mb-4 group-hover:text-primary transition-colors">
          {event.brideName} & {event.groomName}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(event.eventDate)}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <IndianRupee className="h-4 w-4" />
            <span className="font-medium text-foreground">
              ₹{event.totalAmount.toLocaleString()}
            </span>
            collected
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gift className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {event.contributionsCount}
            </span>
            contributions
          </div>
        </div>

        <div className="absolute right-6 bottom-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}