import { MongoClient } from "mongodb";

export async function connectDB(uri) {
  const client = new MongoClient(uri);
  await client.connect();

  const dbName = uri.split("/").pop();
  const db = client.db(dbName);

  console.log("Connected to MongoDB");

  return { db, client };
}
