import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    google_id: { type: String, required: true, unique: true },
    last_login_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export type IUser = InferSchemaType<typeof userSchema>;

const User = mongoose.models.User ?? mongoose.model("User", userSchema);

export default User;
