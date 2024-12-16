"use client";

import { GiftContributionForm } from "@/components/forms/gift-contribution-form";

export default function EventPage({ params }: { params: { id: string } }) {
  // Fetch event details using params.id
  const eventDetails = {
    brideName: "Sarah",
    groomName: "John",
    // ... other details
  };

  return (
    <main className="py-20">
      <GiftContributionForm eventDetails={eventDetails} />
    </main>
  );
}