"use client";

import { useState } from "react";
import { localDb } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";

export default function VendorsPage() {
  const vendors = useLiveQuery(() => localDb.vendors.toArray()) || [];
  const categories = useLiveQuery(() => localDb.categories.toArray()) || [];
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const startEdit = (vendor: any) => {
    setEditingId(vendor.id);
    setEditName(vendor.name);
    setEditCategory(vendor.default_category_id || "");
  };

  const handleSave = async (vendor: any) => {
    if (!editName.trim()) return;

    const updated = {
      ...vendor,
      name: editName.trim(),
      default_category_id: editCategory || undefined,
      synced: false
    };

    await localDb.vendors.put(updated);
    
    // Push update to sync queue
    await localDb.sync_queue.add({
      entity: "vendor",
      action: "UPDATE",
      payload: updated
    });

    setEditingId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6">
      <header className="flex items-center space-x-4 mb-8">
        <Link href="/settings" className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Vendors</h1>
      </header>

      <div className="space-y-3">
        {vendors.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
            No vendors found. Scan a QR to add one!
          </div>
        ) : (
          vendors.map(vendor => (
            <div key={vendor.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              {editingId === vendor.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Default Category</label>
                    <select
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- No Default --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSave(vendor)}
                      disabled={!editName.trim()}
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium disabled:opacity-50 transition hover:bg-blue-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between" onClick={() => startEdit(vendor)}>
                  <div>
                    <h3 className="font-bold text-gray-100">{vendor.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">UPI: {vendor.upi_id || 'N/A'}</p>
                    {vendor.default_category_id && (
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-1 bg-gray-800 text-gray-300 rounded">
                        {categories.find(c => c.id === vendor.default_category_id)?.name || 'Unknown Category'}
                      </span>
                    )}
                  </div>
                  <button className="text-gray-500 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
