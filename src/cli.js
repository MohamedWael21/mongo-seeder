#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import { connectDB } from "./db.js";
import { seedAll } from "./engine/seeder.js";

const program = new Command();

program
  .name("mongo-seeder")
  .description(
    "Advanced MongoDB Seeder CLI with schema + relationships support",
  )
  .version("1.0.0");

program
  .command("seed")
  .description("Seed MongoDB database using a config file")
  .requiredOption("-c, --config <path>", "Path to config JSON file")
  .requiredOption("-u, --uri <uri>", "MongoDB connection URI")
  .option(
    "-m, --mode <mode>",
    "Seeding mode: reset | append (default: reset)",
    "reset",
  )
  .addHelpText(
    "after",
    `
 Example:
  mongo-seeder seed -c ./config.json -u mongodb://localhost:27017/testdb

Config Structure:
{
  "collections": {
    "users": {
      "count": 10,
      "schema": {
        "name": "name",
        "email": "email"
      }
    }
  }
}
`,
  )
  .action(async (options) => {
    try {
      const config = JSON.parse(fs.readFileSync(options.config, "utf-8"));

      const { db, client } = await connectDB(options.uri);

      await seedAll(db, config, options.mode);

      await client.close();

      console.log("Done seeding");
    } catch (err) {
      console.error("Error:", err.message);
    }
  });

program.parse();
