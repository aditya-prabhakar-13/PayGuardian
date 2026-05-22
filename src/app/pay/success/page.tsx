"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { localDb } from "@/lib/local-db";

function SuccessScreen() {
  const searchParams = useSearchParams();
  const rawResponse = searchParams.get("rawResponse") || "";
  const pa = searchParams.get("pa");
  const pn = searchParams.get("pn");
  const amountStr = searchParams.get("amount");
  const categoryId = searchParams.get("categoryId");
  const notes = searchParams.get("notes");

  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");
  const [txnRef, setTxnRef] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (isLogged) return;
    if (!pa || !amountStr) return;

    // 1. Parse Response
    // Responses from UPI apps vary, usually query-string like:
    // txnId=...&responseCode=...&Status=SUCCESS&txnRef=...
    let parsedStatus: "pending" | "success" | "failed" = "pending";
    let parsedTxnRef = "";

    try {
      // It might be URL encoded, replace & with & to safely parse
      const params = new URLSearchParams(rawResponse.replace(/\?/g, "&"));
      const rawStatus = (params.get("Status") || params.get("status"))?.toUpperCase();
      
      if (rawStatus === "SUCCESS" || rawStatus === "SUCCESSFUL") {
        parsedStatus = "success";
      } else if (rawStatus === "FAILED" || rawStatus === "FAILURE") {
        parsedStatus = "failed";
      }

      parsedTxnRef = params.get("txnRef") || params.get("txnId") || "";
    } catch (e) {
      console.warn("Failed to parse raw UPI response", e);
    }

    setStatus(parsedStatus);
    setTxnRef(parsedTxnRef);

    // 2. Log to Local Database
    const logTransaction = async () => {
      try {
        let vendorId = "";
        
        // Auto-create vendor if not exists
        let existingVendor = await localDb.vendors.where("upi_id").equals(pa).first();
        if (existingVendor) {
          vendorId = existingVendor.id;
        } else {
          vendorId = crypto.randomUUID();
          const newVendor = {
            id: vendorId,
            name: pn || pa,
            upi_id: pa,
            default_category_id: categoryId || undefined,
            synced: false
          };
          await localDb.vendors.add(newVendor);
          await localDb.sync_queue.add({
            action: "CREATE",
            entity: "vendor",
            payload: newVendor
          });
        }

        // Create transaction
        const txnId = crypto.randomUUID();
        const newTxn = {
          id: txnId,
          amount: Number(amountStr),
          vendor_id: vendorId,
          category_id: categoryId || undefined,
          status: parsedStatus,
          txn_ref: parsedTxnRef,
          notes: notes || undefined,
          created_at: Date.now(),
          synced: false
        };

        await localDb.transactions.add(newTxn);
        await localDb.sync_queue.add({
          action: "CREATE",
          entity: "transaction",
          payload: newTxn
        });

      } catch (err) {
        console.error("Failed to log transaction locally:", err);
      } finally {
        setIsLogged(true);
      }
    };

    logTransaction();
  }, [rawResponse, pa, pn, amountStr, categoryId, notes, isLogged]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      {status === "success" && (
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      {status === "failed" && (
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      {status === "pending" && (
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {status === "success" ? "Payment Successful" : status === "failed" ? "Payment Failed" : "Payment Pending"}
        </h2>
        <p className="text-gray-400 text-lg">₹{amountStr} to {pn || pa}</p>
        {txnRef && <p className="text-gray-600 mt-2 text-sm font-mono">Ref: {txnRef}</p>}
      </div>

      <Link
        href="/"
        className="mt-8 bg-white text-black font-bold text-lg py-4 px-12 rounded-full shadow-lg transition-transform active:scale-[0.98]"
      >
        Done
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Suspense fallback={<div className="p-8 text-center text-gray-400">Processing...</div>}>
        <SuccessScreen />
      </Suspense>
    </div>
  );
}
