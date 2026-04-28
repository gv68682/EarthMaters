// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Missing MONGODB_URI in environment variables');
// }

// /**
//  * Type for cached mongoose connection
//  */
// type MongooseCache = {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// };

// /**
//  * Extend global type safely (TypeScript fix)
//  */
// declare global {
//   // eslint-disable-next-line no-var
//   var mongooseCache: MongooseCache | undefined;
// }

// // Initialize cached object once globally
// const cached: MongooseCache = global.mongooseCache ?? {
//   conn: null,
//   promise: null,
// };

// global.mongooseCache = cached;

// async function dbConnect(): Promise<typeof mongoose> {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;




import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}