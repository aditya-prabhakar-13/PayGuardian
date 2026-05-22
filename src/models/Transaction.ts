import mongoose, { Schema, type InferSchemaType } from "mongoose";

const transactionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    txn_ref: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export type ITransaction = InferSchemaType<typeof transactionSchema>;

const Transaction =
  mongoose.models.Transaction ??
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
