"use client";

import { useEffect, useState } from "react";
import { localDb } from "@/lib/local-db";

export function useCloudSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [queueSize, setQueueSize] = useState(0);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Monitor queue size
  useEffect(() => {
    const checkQueue = async () => {
      const count = await localDb.sync_queue.count();
      setQueueSize(count);
    };

    // Initial check
    checkQueue();

    // Recheck every few seconds
    const interval = setInterval(checkQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  // Execute Sync
  useEffect(() => {
    if (!isOnline || queueSize === 0 || isSyncing) return;

    const processSync = async () => {
      setIsSyncing(true);
      try {
        const records = await localDb.sync_queue.toArray();
        if (records.length === 0) return;

        // Note: For now, we simulate pulling a token. NextAuth or Capacitor Storage usually holds this.
        // We'll proceed without Auth Header for the initial attempt, the API can enforce it.
        const token = localStorage.getItem("payguardian_token") || "";

        const response = await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(records),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Delete synced items
            const recordIds = records.map(r => r.id).filter((id): id is number => id !== undefined);
            await localDb.sync_queue.bulkDelete(recordIds);

            // Mark entities as synced
            for (const r of records) {
              if (r.entity === "transaction") {
                await localDb.transactions.update(r.payload.id, { synced: true });
              } else if (r.entity === "vendor") {
                await localDb.vendors.update(r.payload.id, { synced: true });
              }
            }
            
            setQueueSize(0);
            console.log(`Successfully synced ${recordIds.length} items to cloud.`);
          }
        } else {
          console.error("Cloud sync returned error status:", response.status);
        }
      } catch (error) {
        console.error("Cloud sync failed:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    processSync();
  }, [isOnline, queueSize, isSyncing]);

  return { isOnline, isSyncing, queueSize };
}
