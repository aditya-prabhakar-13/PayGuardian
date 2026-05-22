import { NextResponse } from "next/server";
import { verifyApiRequest } from "@/lib/verify-jwt";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import Vendor from "@/models/Vendor";

export async function POST(request: Request) {
  try {
    const authResult = await verifyApiRequest(request);
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    // The user_id tied to this offline device
    const userId = authResult.userId;

    const payload = await request.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json({ error: "Payload must be an array" }, { status: 400 });
    }

    let processed = 0;

    for (const item of payload) {
      const { action, entity, payload: data } = item;

      if (action === "CREATE") {
        if (entity === "vendor") {
          await Vendor.updateOne(
            { user_id: userId, _id: data.id },
            {
              $setOnInsert: {
                _id: data.id,
                user_id: userId,
                name: data.name,
                upi_id: data.upi_id,
                default_category_id: data.default_category_id
              }
            },
            { upsert: true }
          );
          processed++;
        } else if (entity === "transaction") {
          await Transaction.updateOne(
            { user_id: userId, _id: data.id },
            {
              $setOnInsert: {
                _id: data.id,
                user_id: userId,
                amount: data.amount,
                vendor_id: data.vendor_id,
                category_id: data.category_id,
                status: data.status,
                txn_ref: data.txn_ref,
                notes: data.notes,
                date: new Date(data.created_at)
              }
            },
            { upsert: true }
          );
          processed++;
        }
      }
    }

    return NextResponse.json({ success: true, processed });

  } catch (error: any) {
    console.error("Sync Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
