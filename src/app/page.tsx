"use client";

import Link from "next/link";
import { localDb } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";
import { HemiDonut } from "@/components/HemiDonut";
import { useState, useEffect } from "react";

import { useCloudSync } from "@/hooks/useCloudSync";

export default function Home() {
  // Fetch categories to calculate dynamic budget
  const categories = useLiveQuery(() => localDb.categories.toArray()) || [];
  const dynamicBudget = categories.reduce((sum, cat) => sum + (cat.limit || 0), 0);
  const budget = dynamicBudget > 0 ? dynamicBudget : 50000; // Fallback to 50000 if no limits set
  
  // Fetch transactions using dexie-react-hooks
  const transactions = useLiveQuery(
    () => localDb.transactions.orderBy('created_at').reverse().toArray()
  ) || [];

  // Calculate spent this month
  const spent = transactions.reduce((sum, txn) => {
    // Only count success/pending for spent limit
    if (txn.status !== 'failed') {
      return sum + txn.amount;
    }
    return sum;
  }, 0);

  // Sync state placeholder (will be replaced in Wave 2)
  const { isOnline, isSyncing, queueSize } = useCloudSync();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-24 relative">
      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400">Welcome back</p>
        </div>
        <div className="flex items-center space-x-2">
          {queueSize > 0 && (
            <span className="text-xs text-gray-400 font-medium mr-2">
              {queueSize} {queueSize === 1 ? 'item' : 'items'} pending
            </span>
          )}
          {isSyncing ? (
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" title="Syncing..." />
          ) : (
            <span className={`w-3 h-3 rounded-full ${isOnline ? (queueSize > 0 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-red-500'}`} title={isOnline ? (queueSize > 0 ? 'Pending Sync' : 'Online & Synced') : 'Offline'} />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 space-y-8 mt-2">
        
        {/* Visualizer Card */}
        <section className="bg-gray-900/50 rounded-3xl p-6 shadow-2xl border border-gray-800/50 backdrop-blur-md">
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-400 text-sm font-medium">Budget Limit</span>
            <span className="text-gray-200 text-sm font-bold">₹{budget.toLocaleString('en-IN')}</span>
          </div>
          
          <div className="w-full max-w-sm mx-auto">
            <HemiDonut spent={spent} budget={budget} />
          </div>
        </section>

        {/* Recent Transactions List */}
        <section className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Recent</h2>
            <Link href="/history" className="text-blue-400 text-sm font-medium hover:underline">
              See All
            </Link>
          </div>

          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No transactions yet. Scan a QR code to begin.
              </div>
            ) : (
              transactions.slice(0, 5).map((txn) => (
                <TransactionRow key={txn.id} txn={txn} />
              ))
            )}
          </div>
        </section>

      </main>

      {/* Floating Action Button for Scanning */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <Link 
          href="/scan"
          className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-transform active:scale-95"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// Helper component to render a row with vendor resolution
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
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-2xl border border-gray-800">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-300">
          {(vendor?.name || "V").charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-100">{vendor?.name || 'Unknown Vendor'}</span>
          <span className="text-xs text-gray-500">
            {new Date(txn.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
