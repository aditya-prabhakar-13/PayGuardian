"use client";

import Link from "next/link";
import { localDb } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";

export default function HistoryPage() {
  const transactions = useLiveQuery(
    () => localDb.transactions.orderBy('created_at').reverse().toArray()
  ) || [];

  // Group transactions by date
  const grouped = transactions.reduce((acc: any, txn) => {
    const dateStr = new Date(txn.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(txn);
    return acc;
  }, {});

  const dates = Object.keys(grouped);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-24">
      <header className="flex items-center space-x-4 mb-8">
        <Link href="/" className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">History</h1>
      </header>

      <main className="space-y-6">
        {dates.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
            No transactions found.
          </div>
        ) : (
          dates.map(date => (
            <section key={date} className="space-y-3">
              <h2 className="text-sm font-bold text-gray-400 sticky top-0 bg-black/90 py-2 backdrop-blur-sm z-10">
                {date}
              </h2>
              <div className="space-y-3">
                {grouped[date].map((txn: any) => (
                  <TransactionRow key={txn.id} txn={txn} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

// Helper component identical to the one in Dashboard, but scoped for the History page
function TransactionRow({ txn }: { txn: any }) {
  const vendor = useLiveQuery(() => localDb.vendors.get(txn.vendor_id), [txn.vendor_id]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-300">
          {(vendor?.name || "V").charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-100">{vendor?.name || 'Unknown Vendor'}</span>
          <span className="text-xs text-gray-500">
            {new Date(txn.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-bold text-lg text-white">
          ₹{txn.amount.toLocaleString('en-IN')}
        </span>
        <span className={`text-xs font-medium uppercase ${getStatusColor(txn.status)}`}>
          {txn.status}
        </span>
      </div>
    </div>
  );
}
