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
        tr: txnId,
        mode: '00'
      });

      const upiURL = `upi://pay?${upiParams.toString()}`;

      // Store pending transaction in localStorage
      localStorage.setItem('pendingUpiPayment', JSON.stringify({
        txnId,
        amount: formData.amount,
        timestamp: Date.now()
      }));

      // Check device type
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (isIOS || isAndroid) {
        const paymentApps = [
          { 
            name: 'Google Pay',
            url: `gpay://upi/pay?${upiParams.toString()}`,
            universalLink: `https://pay.google.com/pay?${upiParams.toString()}`,
            androidPackage: 'com.google.android.apps.nbu.paisa.user',
            icon: '💳'
          },
          { 
            name: 'PhonePe',
            url: `phonepe://pay?${upiParams.toString()}`,
            universalLink: `https://phon.pe/ru_${btoa(upiURL)}`,
            androidPackage: 'com.phonepe.app',
            icon: '📱'
          },
          { 
            name: 'Paytm',
            url: `paytmmp://pay?${upiParams.toString()}`,
            universalLink: `https://paytm.com/upi?${upiParams.toString()}`,
            androidPackage: 'net.one97.paytm',
            icon: '💰'
          },
          { 
            name: 'Other UPI Apps',
            url: upiURL,
            universalLink: upiURL,
            androidPackage: '',
            icon: '🔄'
          }
        ];

        const handleAppClick = (app: typeof paymentApps[0]) => {
          const now = Date.now();
          
          if (isAndroid) {
            // For Android, try intent URL first
            
            if(app.androidPackage != ''){
              const intentUrl = `intent://${app.url.replace('://', '/')}#Intent;scheme=${app.url.split('://')[0]};package=${app.androidPackage};end`;
              window.location.href = intentUrl;
            }
            
            // Fallback to direct URL after a short delay
            setTimeout(() => {
              if (Date.now() - now < 1500) {
                window.location.href = app.url;
              }
            }, 1000);
          } else {
            // iOS handling remains the same
            window.location.href = app.url;
            
            setTimeout(() => {
              if (Date.now() - now < 1500) {
                window.location.href = app.universalLink;
              }
            }, 1000);
          }
        };

        const modal = document.createElement('div');
        modal.innerHTML = `
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-6 w-[90%] max-w-sm">
              <h3 class="text-lg font-semibold text-center mb-4">Choose Payment App</h3>
              <div class="space-y-3">
                ${paymentApps.map(app => `
                  <button 
                    class="w-full flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50 active:bg-gray-100 transition-all"
                    data-app='${JSON.stringify(app)}'
                  >
                    <span class="text-2xl">${app.icon}</span>
                    <span class="font-medium">${app.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        // Add click handlers
        modal.querySelectorAll('button').forEach(button => {
          button.addEventListener('click', () => {
            const app = JSON.parse(button.dataset.app || '{}');
            handleAppClick(app);
          });
        });

        // Clean up modal when user returns
        window.addEventListener('focus', () => {
          modal.remove();
          setShowConfirmation(true);
        }, { once: true });

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