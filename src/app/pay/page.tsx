"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { UpiIntent } from "capacitor-upi-intent";
import { localDb, LocalCategory } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";

function PayForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pa = searchParams.get("pa");
  const pn = searchParams.get("pn");
  const am = searchParams.get("am") || "";

  const [amount, setAmount] = useState(am);
  const [notes, setNotes] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch categories for the dropdown
  const categories = useLiveQuery(() => localDb.categories.toArray()) || [];

  // Try to pre-select category based on vendor history
  useEffect(() => {
    if (pa) {
      localDb.vendors
        .where("upi_id")
        .equals(pa)
        .first()
        .then((vendor) => {
          if (vendor?.default_category_id) {
            setCategoryId(vendor.default_category_id);
          } else if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id);
          }
        });
    } else if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [pa, categories, categoryId]);

  const handlePayment = async () => {
    if (!pa) {
      alert("Missing Payee Address (UPI ID)");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setIsProcessing(true);

    try {
      // Build a clean minimal UPI URL with only the essential parameters.
      // GPay rejects external intents that include merchant-specific params
      // like mc, mode, purpose that are only meant for internal QR processing.
      // CRITICAL: We must URL-encode `pn` and `tn` because raw spaces break Android's
      // Uri.parse(). However, we must NOT encode `pa` because GPay rejects `%40` instead of `@`.
      const parts: string[] = [];
      parts.push(`pa=${pa.trim()}`);
      if (pn) parts.push(`pn=${encodeURIComponent(pn.trim())}`);
      parts.push(`am=${amount}`);
      parts.push(`cu=INR`);
      if (notes) parts.push(`tn=${encodeURIComponent(notes.trim())}`);

      const upiUrl = `upi://pay?${parts.join("&")}`;

      // DEBUG: Show the exact URL being sent so we can diagnose issues
      // Remove this alert once payments work correctly
      alert("DEBUG UPI URL:\n\n" + upiUrl);

      // Call the Capacitor Plugin
      console.log("Initiating payment to:", upiUrl);
      const result = await UpiIntent.initiatePayment({ url: upiUrl });
      
      console.log("Payment Result:", result);

      // In Plan 4.3, we will handle parsing the result, saving to db, and routing to success.
      // For now, pass raw result via URL state to the success page to parse it there, or parse here.
      // We'll just pass the raw response string to a parsing function in the next task.
      
      // Let's pass the data to /pay/success
      const successParams = new URLSearchParams();
      successParams.set("rawResponse", result.response);
      successParams.set("pa", pa);
      if (pn) successParams.set("pn", pn);
      successParams.set("amount", amount);
      if (categoryId) successParams.set("categoryId", categoryId);
      if (notes) successParams.set("notes", notes);

      router.push(`/pay/success?${successParams.toString()}`);

    } catch (error: any) {
      console.error("Payment failed:", error);
      alert("Payment failed: " + error?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!pa) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-400 font-medium">Invalid Payment Link.</p>
        <Link href="/scan" className="mt-4 text-blue-400 underline">
          Scan Again
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {(pn || pa).charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-white">{pn || pa}</h2>
        <p className="text-gray-400">{pa}</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 shadow-inner space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black text-white text-4xl font-bold p-4 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center"
            placeholder="0.00"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-400">
              Category
            </label>
            <button
              type="button"
              onClick={async () => {
                const newCat = prompt("Enter new category name:");
                if (newCat && newCat.trim()) {
                  const id = crypto.randomUUID();
                  const payload = { id, name: newCat.trim(), limit: 0, synced: false };
                  await localDb.categories.add(payload);
                  await localDb.sync_queue.add({
                    action: "CREATE",
                    entity: "category",
                    payload
                  });
                  setCategoryId(id);
                }
              }}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add New
            </button>
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-black text-white p-4 rounded-xl border border-gray-800 focus:border-blue-500 outline-none"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((c: LocalCategory) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-black text-white p-4 rounded-xl border border-gray-800 focus:border-blue-500 outline-none"
            placeholder="What is this for?"
            maxLength={50}
          />
        </div>
      </div>

      <div className="flex-1"></div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold text-lg p-5 rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
      >
        {isProcessing ? "Processing..." : "Pay with UPI"}
      </button>
    </div>
  );
}

export default function PayPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link href="/" className="text-white hover:text-gray-300 font-medium">
          ← Cancel
        </Link>
        <h1 className="text-lg font-bold">Payment</h1>
        <div className="w-16"></div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading payment details...</div>}>
        <PayForm />
      </Suspense>
    </div>
  );
}
