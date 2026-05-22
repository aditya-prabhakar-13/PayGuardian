import Dexie, { type EntityTable } from "dexie";

export interface LocalCategory {
  id: string; // Maps to MongoDB _id
  name: string;
  color?: string;
  limit?: number;
  synced: boolean;
}

export interface LocalVendor {
  id: string; // Maps to MongoDB _id
  name: string;
  upi_id?: string;
  default_category_id?: string;
  synced: boolean;
}

export interface LocalTransaction {
  id: string; // Local UUID generated before sync, maps to MongoDB _id after sync
  amount: number;
  vendor_id?: string;
  category_id?: string;
  status: "pending" | "success" | "failed";
  txn_ref?: string;
  notes?: string;
  created_at: number; // Stored as Unix timestamp for easier sorting locally
  synced: boolean;
}

export interface SyncQueueItem {
  id?: number; // Auto-incremented local queue ID
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "category" | "vendor" | "transaction";
  payload: any;
}

class PayGuardianDB extends Dexie {
  categories!: EntityTable<LocalCategory, "id">;
  vendors!: EntityTable<LocalVendor, "id">;
  transactions!: EntityTable<LocalTransaction, "id">;
  sync_queue!: EntityTable<SyncQueueItem, "id">;

  constructor() {
    super("PayGuardianDB");

    this.version(1).stores({
      categories: "id, synced",
      vendors: "id, synced",
      transactions: "id, vendor_id, category_id, synced, created_at",
      sync_queue: "++id, entity, action",
    });
  }
}

export const localDb = new PayGuardianDB();
