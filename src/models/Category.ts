import mongoose, { Schema, type InferSchemaType } from "mongoose";

const categorySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    color: { type: String, trim: true },
    limit: { type: Number, min: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export type ICategory = InferSchemaType<typeof categorySchema>;

const Category =
  mongoose.models.Category ?? mongoose.model("Category", categorySchema);

export default Category;
