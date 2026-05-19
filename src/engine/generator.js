import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import fakerMap from "../utils/fakerMap.js";

function resolveField(field, context) {
  if (typeof field === "string") {
    if (field === "password") {
      return bcrypt.hashSync("12345", 10);
    }
    return fakerMap[field]?.() || null;
  }

  if (field?.ref) {
    const refData = context[field.ref];

    if (!refData || refData.length === 0) {
      throw new Error(`Missing reference data: ${field.ref}`);
    }

    const random = refData[Math.floor(Math.random() * refData.length)];

    return random._id;
  }

  if (field?.type === "password") {
    const raw = field.value || "12345";
    return bcrypt.hashSync(raw, 10);
  }

  if (field?.type === "enum") {
    const values = field.values || [];
    return values[Math.floor(Math.random() * values.length)] || null;
  }

  if (field?.type === "number") {
    return faker.number.int({ min: field.min, max: field.max });
  }

  if (field?.type === "price") {
    return parseFloat(faker.commerce.price({ min: field.min, max: field.max }));
  }

  if (field?.type === "array") {
    const length = field.length || 3;

    return Array.from({ length }, () => resolveField(field.of, context));
  }

  if (typeof field === "object" && field !== null) {
    const obj = {};

    for (const key in field) {
      obj[key] = resolveField(field[key], context);
    }

    return obj;
  }

  return null;
}

function generateDocument(schema, context) {
  const doc = {};

  for (const key in schema) {
    doc[key] = resolveField(schema[key], context);
  }

  return doc;
}

export function generateCollection(config, context) {
  const { count, schema } = config;

  return Array.from({ length: count }, () => generateDocument(schema, context));
}
