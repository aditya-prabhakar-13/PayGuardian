"use client";

import { useState } from "react";
import { localDb } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
// Using a simple crypto.randomUUID fallback for ObjectId generation on client
const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '').substring(0, 24)
    : Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14);
};

export default function CategoriesPage() {
  const categories = useLiveQuery(() => localDb.categories.toArray()) || [];
  
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [limit, setLimit] = useState("");

  const handleSave = async () => {
    if (!name.trim()) return;

    const newCategory = {
      id: generateId(),
      name: name.trim(),
      color,
      limit: Number(limit) || 0,
      synced: false
    };

    // Save to local categories
    await localDb.categories.add(newCategory);

    // Queue for sync
    await localDb.sync_queue.add({
      entity: "category",
      action: "CREATE",
      payload: newCategory
    });

    setIsAdding(false);
    setName("");
    setColor("#3b82f6");
    setLimit("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/settings" className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-blue-400 font-medium hover:text-blue-300 transition"
        >
          Add New
        </button>
      </header>

      {isAdding && (
        <div className="bg-gray-900 rounded-2xl p-5 mb-6 border border-gray-800">
          <h2 className="text-lg font-bold mb-4">New Category</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Groceries"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Monthly Limit (₹)</label>
                <input 
                  type="number" 
                  value={limit} 
                  onChange={e => setLimit(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Color</label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={e => setColor(e.target.value)}
                  className="w-full h-12 bg-black border border-gray-800 rounded-lg p-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!name.trim()}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium disabled:opacity-50 transition hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.length === 0 && !isAdding ? (
          <div className="text-center text-gray-500 py-10 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
            No categories defined yet.
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-inner border border-gray-700" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span className="font-medium text-gray-100">{cat.name}</span>
              </div>
              <div className="text-sm font-bold text-gray-300">
                {cat.limit && cat.limit > 0 ? `₹${cat.limit.toLocaleString('en-IN')}` : 'No limit'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
