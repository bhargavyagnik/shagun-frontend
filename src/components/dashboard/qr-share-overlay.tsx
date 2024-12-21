import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Share2, Download, Copy, QrCode, Check, X, Image, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Event } from "@/lib/types";

const QRShareDialog = ({ event }: { event: Event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const modalRef = useRef(null);
  const shareUrl = `https://shagun.app/event/${event.id}`;
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const generatePreview = (format: string) => {
    const canvas = document.createElement("canvas");
    const qrCanvas = document.getElementById(`qr-code-${activeTab}`) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!ctx || !qrCanvas) return;

    const width = activeTab === "basic" ? 512 : 512;
    const height = activeTab === "basic" ? 512 : 640;
    canvas.width = width;
    canvas.height = height;

    // Create gradient for border
    const borderGradient = ctx.createLinearGradient(0, 0, width, 0);
    borderGradient.addColorStop(0, "#f43f5e"); // rose-500
    borderGradient.addColorStop(1, "#ec4899"); // pink-500

    // Draw white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw gradient border (10px thickness)
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 20;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    if (activeTab === "basic") {
        ctx.drawImage(qrCanvas, 128, 128, 256, 256);
    } else {
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(20, height - 200, width-40, 4);
        ctx.drawImage(qrCanvas, (width - 300) / 2, 100, 300, 300);
        ctx.font = "bold 32px system-ui";
        ctx.fillStyle = "#1e293b";
        ctx.textAlign = "center";
        ctx.fillText(`${event.brideName} & ${event.groomName}`, width / 2, height - 140);
        ctx.font = "24px system-ui";
        ctx.fillStyle = "#475569";
        ctx.fillText(`${event.eventDate}`, width / 2, height - 90);
    }
    ctx.textAlign = "center";
    ctx.font = "16px system-ui";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("shagun.app", width / 2, height - 40);

    setPreviewImage(canvas.toDataURL(`image/${format}`));
  };

  useEffect(() => {
    if (isOpen) generatePreview("png");
  }, [activeTab, isOpen]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = (format: string) => {
    const link = document.createElement("a");
    link.download = `shagun-event-${activeTab}.${format}`;
    link.href = previewImage || "";
    link.click();
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <QrCode className="h-4 w-4 mr-2" />
        Show QR Code
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-xl" ref={modalRef}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Share Event</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardDescription className="px-6">
              Share your event details with guests
            </CardDescription>

            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="basic">Basic QR</TabsTrigger>
                  <TabsTrigger value="styled">Styled QR</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm hidden">
                      <QRCodeCanvas
                        id={`qr-code-${activeTab}`}
                        value={shareUrl}
                        size={256}
                        level="Q"
                        includeMargin
                      />
                    </div>
                    <div className="rounded-lg shadow-sm max-h-96 overflow-y-auto">
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="QR Code Preview"
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      className="flex-1 px-3 py-2 text-sm border rounded-md bg-slate-50"
                      value={shareUrl}
                      readOnly
                    />
                    <Button size="sm" onClick={handleCopyLink}>
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleDownloadQR("png")}
                    >
                      <FileImage className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default QRShareDialog;
