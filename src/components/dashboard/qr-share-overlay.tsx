import React, { useState, useRef, useEffect } from 'react';
import { Share2, Download, Copy, QrCode, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QRShareDialog = ({ eventId }: { eventId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const shareUrl = `https://shagun.app/event/${eventId}`;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector("#qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "shagun-qr.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <QrCode className="h-4 w-4 mr-2" />
        Show QR Code
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Share Event</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center space-y-6 p-4">
              <svg
                id="qr-code"
                className="w-64 h-64"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 20h20v20h-20z M60 20h20v20h-20z M20 60h20v20h-20z" fill="currentColor" />
                <path d="M30 30h20v20h-20z M50 50h20v20h-20z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              
              <div className="flex w-full items-center space-x-2">
                <input
                  className="flex-1 px-3 py-2 text-sm border rounded-md"
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
              
              <Button className="w-full" onClick={handleDownloadQR}>
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRShareDialog;