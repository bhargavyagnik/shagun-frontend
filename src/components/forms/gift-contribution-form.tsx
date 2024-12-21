declare global {
  interface Window {
    webUPI?: {
      enable: () => Promise<void>;
      sendPayment: (upiURI: string) => Promise<void>;
    }
  }
}

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, User2, Wallet, Share } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import { contributionApi } from "@/lib/endpoints";
import { toast } from "sonner";
import Link from "next/link";

export function GiftContributionForm({ eventDetails, eventId }: { eventDetails: any, eventId: string }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    relation: "bride", // or "groom"
    message: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const txnId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(txnId);

      const upiParams = new URLSearchParams({
        pa: eventDetails.upiId,
        pn: eventDetails.brideName,
        am: formData.amount,
        cu: 'INR',
        tn: `Shagun for ${eventDetails.brideName}'s wedding`,
        tr: txnId
      });

      const upiURL = `upi://pay?${upiParams.toString()}`;

      // Store pending transaction in localStorage
      localStorage.setItem('pendingUpiPayment', JSON.stringify({
        txnId,
        amount: formData.amount,
        timestamp: Date.now()
      }));

      // Check if device is iOS
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      // Check if device is Android
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isIOS || isAndroid) {
        if (isIOS) {
          // For iOS, we need to handle both newer and older devices
          const gpayURL = `gpay://upi/pay?${upiParams.toString()}`;
          const phonepeURL = `phonepe://pay?${upiParams.toString()}`;
          const paytmURL = `paytmmp://pay?${upiParams.toString()}`;

          // Create fallback links for different UPI apps
          const fallbackDiv = document.createElement('div');
          fallbackDiv.innerHTML = `
            <p style="margin-bottom: 20px;">Choose your UPI app:</p>
            <a href="${gpayURL}" style="display: block; margin: 10px 0;">Open in Google Pay</a>
            <a href="${phonepeURL}" style="display: block; margin: 10px 0;">Open in PhonePe</a>
            <a href="${paytmURL}" style="display: block; margin: 10px 0;">Open in Paytm</a>
            <a href="${upiURL}" style="display: block; margin: 10px 0;">Open in Other UPI Apps</a>
          `;

          // Show a modal with UPI app options
          const modal = document.createElement('div');
          modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
          `;
          modal.appendChild(fallbackDiv);

          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 999;
          `;

          document.body.appendChild(overlay);
          document.body.appendChild(modal);

          // Clean up modal when user returns
          window.addEventListener('focus', () => {
            modal.remove();
            overlay.remove();
            setShowConfirmation(true);
          }, { once: true });
        } else {
          // Android handling
          if (window.webUPI) {
            try {
              await window.webUPI.enable();
              await window.webUPI.sendPayment(upiURL);
              setShowConfirmation(true);
              return;
            } catch (webUPIError) {
              console.log('WebUPI failed, falling back to URL scheme', webUPIError);
            }
          }

          // Fallback to URL scheme for Android
          const link = document.createElement('a');
          link.href = upiURL;
          link.click();
          
          window.addEventListener('focus', () => {
            setShowConfirmation(true);
          }, { once: true });
        }
      } else {
        toast.error('Please use a mobile device for UPI payments');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  const confirmPayment = async (success: boolean) => {
    try {
      if (success) {
        const response = await contributionApi.create({
          eventId: eventId,
          name: formData.name,
          amount: Number(formData.amount),
          relation: formData.relation as 'bride' | 'groom',
          message: formData.message
        });
        
        if (response.success) {
          setShowThankYou(true);
        }
      }
    } catch (error) {
      toast.error('Failed to record contribution');
    } finally {
      setShowConfirmation(false);
      setIsProcessing(false);
      localStorage.removeItem('pendingUpiPayment');
    }
  };

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-xl mx-auto">
          {/* Logo */}
          {/* <div className="mb-8">
            <Link href="/" className="text-2xl font-bold text-pink-500">
              Shagun
            </Link>
          </div> */}

          {/* Main Content */}
          <motion.div 
            className="space-y-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="space-y-4">
              {/* <h2 className="text-xl text-muted-foreground">
                शुभ आशीर्वाद 🙏
              </h2> */}
              <h1 className="text-4xl font-bold text-pink-500">
                <GradientText>Thank You for Your Blessings</GradientText>
              </h1>
            </div>

            {/* Couple Names */}
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Your blessings for
              </p>
              <p className="text-xl font-medium">
                {eventDetails.brideName} & {eventDetails.groomName}
              </p>
            </div>

            {/* Amount Card */}
            <div className="bg-pink-50 rounded-lg p-6 max-w-sm mx-auto">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Shagun Amount
              </p>
              <p className="text-4xl font-bold text-pink-500">
                ₹{Number(formData.amount).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Message */}
            {formData.message && (
              <div className="max-w-md mx-auto space-y-4">
                <p className="italic text-lg text-muted-foreground">
                  "{formData.message}"
                </p>
                <div>
                  <p className="text-sm text-muted-foreground">
                    With heartfelt blessings from,
                  </p>
                  <p className="font-medium mt-1">
                    {formData.name}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 max-w-sm mx-auto pt-4">
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
              >
                Return to Event
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Wedding Shagun',
                      text: `I just sent my blessings to ${eventDetails.brideName} & ${eventDetails.groomName}'s wedding!`
                    }).catch(() => {
                      toast.error("Couldn't share. Please try again.");
                    });
                  } else {
                    toast.error("Sharing is not supported on this device");
                  }
                }}
                className="flex-1"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Payment Confirmation</h3>
            <p className="mb-6">Did you complete the payment successfully?</p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => confirmPayment(false)}
              >
                No, Failed
              </Button>
              <Button 
                onClick={() => confirmPayment(true)}
              >
                Yes, Completed
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}