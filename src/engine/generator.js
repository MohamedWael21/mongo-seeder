import fakerMap from "../utils/fakerMap.js";

function resolveField(field, context) {
  if (typeof field === "string") {
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
