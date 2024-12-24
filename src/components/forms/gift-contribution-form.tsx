import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, User2, Wallet, Share } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import { contributionApi } from "@/lib/endpoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";


export function GiftContributionForm({ eventDetails, eventId }: { eventDetails: any, eventId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    relation: "bride", // or "groom"
    message: "",
    paymentMethod: "cash",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try {
      const txnId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(txnId);
      setIsLoading(true);

      if (formData.paymentMethod === "upi") {
        // Generate UPI payment link
        const upiParams = new URLSearchParams({
          pa: eventDetails.upiId,
          pn: eventDetails.brideName,
          tr: txnId,
          tn: `Shagun for ${eventDetails.brideName}'s wedding`,
          am: formData.amount,
          cu: "INR",
        });
        const upiURL = `upi://pay?${upiParams.toString()}`;
        setIsLoading(false);
        setQrValue(upiURL);
        setShowQR(true);
      }
      else {
        await contributionApi.create({
          eventId,
          name: formData.name,
          amount: Number(formData.amount),
          relation: formData.relation as "bride" | "groom",
          message: formData.message
        });
        setIsLoading(false);

        setShowConfirmation(true);
      }

      
    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate payment');
      setIsLoading(false);
    }
  };
  const QRModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-[90%] max-w-sm"
      >
        <h3 className="text-lg font-semibold text-center mb-4">Scan QR Code to Pay</h3>
        <div className="flex justify-center mb-4">
          <QRCodeCanvas 
            id="qr-code"
            value={qrValue}
            size={200}
            level="Q"
            includeMargin
            />
        </div>
        <p className="text-sm text-center mb-4 text-gray-600">
          Scan this QR code with any UPI app to send shagun
        </p>
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline" 
            onClick={() => setShowQR(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={async () => {
              await contributionApi.create({
                eventId,
                name: formData.name,
                amount: Number(formData.amount),
                relation: formData.relation as "bride" | "groom",
                message: formData.message
              });
              toast.success("UPI contribution recorded successfully!");
              setShowQR(false);
              setFormData({
                name: "",
                amount: "",
                relation: "bride",
                message: "",
                paymentMethod: "upi"
              });
              router.refresh();
            }}
          >
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );

  const confirmPayment = async (success: boolean) => {
    try {
      if (success) {
        setFormData({
          name: "",
          amount: "",
          relation: "bride",
          message: "",
          paymentMethod: "cash"
        });
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to record contribution');
    } finally {
      setShowConfirmation(false);
      setIsLoading(false);
      
    }
  };

  // if (showThankYou) {
  //   return (
  //     <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
  //       <div className="w-full max-w-xl mx-auto">
  //         {/* Logo */}
  //         {/* <div className="mb-8">
  //           <Link href="/" className="text-2xl font-bold text-pink-500">
  //             Shagun
  //           </Link>
  //         </div> */}

  //         {/* Main Content */}
  //         <motion.div 
  //           className="space-y-8 text-center"
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //         >
  //           {/* Header */}
  //           <div className="space-y-4">
  //             {/* <h2 className="text-xl text-muted-foreground">
  //               शुभ आशीर्वाद 🙏
  //             </h2> */}
  //             <h1 className="text-4xl font-bold text-pink-500">
  //               <GradientText>Thank You for Your Blessings</GradientText>
  //             </h1>
  //           </div>

  //           {/* Couple Names */}
  //           <div className="space-y-1">
  //             <p className="text-muted-foreground">
  //               Your blessings for
  //             </p>
  //             <p className="text-xl font-medium">
  //               {eventDetails.brideName} & {eventDetails.groomName}
  //             </p>
  //           </div>

  //           {/* Amount Card */}
  //           <div className="bg-pink-50 rounded-lg p-6 max-w-sm mx-auto">
  //             <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
  //               Shagun Amount
  //             </p>
  //             <p className="text-4xl font-bold text-pink-500">
  //               ₹{Number(formData.amount).toLocaleString('en-IN')}
  //             </p>
  //           </div>

  //           {/* Message */}
  //           {formData.message && (
  //             <div className="max-w-md mx-auto space-y-4">
  //               <p className="italic text-lg text-muted-foreground">
  //                 "{formData.message}"
  //               </p>
  //               <div>
  //                 <p className="text-sm text-muted-foreground">
  //                   With heartfelt blessings from,
  //                 </p>
  //                 <p className="font-medium mt-1">
  //                   {formData.name}
  //                 </p>
  //               </div>
  //             </div>
  //           )}

  //           {/* Action Buttons */}
  //           <div className="flex gap-4 max-w-sm mx-auto pt-4">
  //             <Button 
  //               onClick={() => window.location.reload()}
  //               className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
  //             >
  //               Return to Event
  //             </Button>
  //             <Button 
  //               variant="outline"
  //               onClick={() => {
  //                 if (navigator.share) {
  //                   navigator.share({
  //                     title: 'Wedding Shagun',
  //                     text: `I just sent my blessings to ${eventDetails.brideName} & ${eventDetails.groomName}'s wedding!`
  //                   }).catch(() => {
  //                     toast.error("Couldn't share. Please try again.");
  //                   });
  //                 } else {
  //                   toast.error("Sharing is not supported on this device");
  //                 }
  //               }}
  //               className="flex-1"
  //             >
  //               <Share className="w-4 h-4 mr-2" />
  //               Share
  //             </Button>
  //           </div>
  //         </motion.div>
  //       </div>
  //     </div>
  //   );
  // }

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
          <label className="text-sm font-medium">Payment Method</label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={formData.paymentMethod === "upi" ? "primary" : "outline"}
              onClick={() => setFormData({ ...formData, paymentMethod: "upi" })}
              className="flex-1"
            >
              <Wallet className="mr-2 h-4 w-4" />
              UPI
            </Button>
            <Button
              type="button"
              variant={formData.paymentMethod === "cash" ? "primary" : "outline"}
              onClick={() => setFormData({ ...formData, paymentMethod: "cash" })}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              Cash
            </Button>
          </div>
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

      {showQR && <QRModal />}
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Shagun Added Successfully!!</h3>
            
            <div className="flex gap-4">
             
            
              <Button 
                onClick={() => confirmPayment(true)}
              >
                Okay
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Processing your shagun...</p>
              </div>
            </div>
      )}
    </motion.div>
  );
}