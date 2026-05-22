import mongoose, { Schema, type InferSchemaType } from "mongoose";

const vendorSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    upi_id: { type: String, trim: true },
    default_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export type IVendor = InferSchemaType<typeof vendorSchema>;

const Vendor = mongoose.models.Vendor ?? mongoose.model("Vendor", vendorSchema);

export default Vendor;
