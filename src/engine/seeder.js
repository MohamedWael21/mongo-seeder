import { generateCollection } from "./generator.js";
import { buildGraph, topoSort } from "./resolver.js";

export async function seedAll(db, config, mode = "reset") {
  const context = {};

  const graph = buildGraph(config.collections);
  const order = topoSort(graph);

  console.log("Seeding order:", order);
  console.log(`Mode: ${mode}`);

  for (const collectionName of order) {
    const collectionConfig = config.collections[collectionName];

    const collection = db.collection(collectionName);

    // RESET MODE
    if (mode === "reset") {
      await collection.deleteMany({});
      console.log(`Cleared ${collectionName}`);
    }

    // APPEND MODE (load existing data for refs)
    if (mode === "append") {
      const existingDocs = await collection.find().toArray();
      context[collectionName] = existingDocs;
    }

    const docs = generateCollection(collectionConfig, context);

    const result = await collection.insertMany(docs);

    const insertedDocs = docs.map((doc, i) => ({
      ...doc,
      _id: result.insertedIds[i],
    }));

    // merge with existing (important for append mode)
    context[collectionName] = [
      ...(context[collectionName] || []),
      ...insertedDocs,
    ];

    console.log(`Seeded ${collectionName}: ${docs.length}`);
  }

  return context;
}
