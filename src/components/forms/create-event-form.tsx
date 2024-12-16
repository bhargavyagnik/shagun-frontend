
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Gift, User2, Wallet } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export function CreateEventForm() {
  const [formData, setFormData] = useState({
    occasionType: "wedding",
    brideName: "",
    groomName: "",
    eventDate: "",
    upiId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // Generate unique link and QR code
    // Save to database
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Create Your <GradientText>Digital Shagun</GradientText> Page
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate your personalized collection page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User2 className="h-4 w-4" />
              Bride's Name
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.brideName}
              onChange={(e) =>
                setFormData({ ...formData, brideName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User2 className="h-4 w-4" />
              Groom's Name
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={formData.groomName}
              onChange={(e) =>
                setFormData({ ...formData, groomName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Wedding Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            UPI ID
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="username@upi"
            value={formData.upiId}
            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
        >
          <Gift className="mr-2 h-4 w-4" />
          Create Collection Page
        </Button>
      </form>
    </motion.div>
  );
}