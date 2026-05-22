import mongoose from "mongoose";

/**
 * Global cache for the Mongoose connection.
 *
 * In serverless environments (Vercel), each invocation may spin up a new
 * module scope. Caching the connection on `globalThis` prevents opening
 * multiple connections to MongoDB Atlas per cold-start.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
  var __mongoose: MongooseCache | undefined;
}
/* eslint-enable no-var */

const cached: MongooseCache = globalThis.__mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalThis.__mongoose) {
  globalThis.__mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => {
        console.log("✅ MongoDB connected");
        return m;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
