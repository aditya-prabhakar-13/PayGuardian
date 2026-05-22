"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ScanPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: any) => {
    try {
      if (!result || !result.length) return;
      
      const rawUrl = result[0].rawValue;
      if (!rawUrl.startsWith("upi://pay")) {
        setError("Invalid QR Code. Please scan a standard UPI QR.");
        return;
      }

      // upi://pay?pa=address@upi&pn=Payee%20Name
      const url = new URL(rawUrl);
      const pa = url.searchParams.get("pa");
      const pn = url.searchParams.get("pn");

      if (!pa) {
        setError("Invalid UPI QR. Missing payee address.");
        return;
      }

      const queryParams = new URLSearchParams();
      queryParams.set("pa", pa);
      if (pn) queryParams.set("pn", pn);

      // Extract amount if present in QR code
      const am = url.searchParams.get("am");
      if (am) queryParams.set("am", am);

      router.push(`/pay?${queryParams.toString()}`);
    } catch (e: any) {
      console.error("Scan error", e);
      setError("Failed to parse QR code.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="p-4 flex items-center justify-between z-10 bg-black/50 absolute top-0 w-full">
        <Link href="/" className="text-white hover:text-gray-300 font-medium">
          ← Back
        </Link>
        <h1 className="text-lg font-bold">Scan & Pay</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {/* React QR Scanner renders a video element taking full width */}
        <Scanner
          onScan={handleScan}
          onError={(err) => setError(err?.message || "Camera access failed")}
          components={{
            onOff: true, // Show torch toggle
          }}
          styles={{
            container: { width: "100%", height: "100%" },
          }}
        />

        {/* Scan Overlay Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center border-[40px] border-black/60">
          <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
          </div>
          <p className="mt-8 font-medium text-white/80">Scan any UPI QR Code</p>
        </div>
      </div>

        {error && (
          <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Camera Access Denied</h2>
            <p className="text-gray-400 mb-8 max-w-sm">
              We need camera access to scan UPI QR codes. Please open your Android App Settings, locate PayGuardian, and enable Camera permissions.
            </p>
            <Link 
              href="/"
              className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition w-full max-w-xs"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
    </div>
  );
}
