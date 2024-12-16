import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, User2, Wallet } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export function GiftContributionForm({ eventDetails }: { eventDetails: any }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    relation: "bride", // or "groom"
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle UPI payment
    // Save contribution details
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Send Your <GradientText>Shagun</GradientText>
        </h1>
        <p className="text-muted-foreground">
          Celebrate {eventDetails.brideName} & {eventDetails.groomName}'s wedding
          with your blessings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User2 className="h-4 w-4" />
            Your Name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Amount (₹)
          </label>
          <input
            type="number"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Relation With</label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="relation"
                value="bride"
                checked={formData.relation === "bride"}
                onChange={(e) =>
                  setFormData({ ...formData, relation: e.target.value })
                }
              />
              <span>Bride's Side</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="relation"
                value="groom"
                checked={formData.relation === "groom"}
                onChange={(e) =>
                  setFormData({ ...formData, relation: e.target.value })
                }
              />
              <span>Groom's Side</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Your Message
          </label>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
        >
          <Send className="mr-2 h-4 w-4" />
          Send Shagun
        </Button>
      </form>
    </motion.div>
  );
}