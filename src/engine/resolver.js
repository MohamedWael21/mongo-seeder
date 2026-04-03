function extractDependencies(schema) {
  const deps = new Set();

  function walk(obj) {
    for (const key in obj) {
      const val = obj[key];

      if (typeof val === "object" && val !== null) {
        if (val.ref) {
          deps.add(val.ref);
        } else {
          walk(val);
        }
      }
    }
  }

  walk(schema);
  return [...deps];
}

export function buildGraph(collections) {
  const graph = {};

  for (const name in collections) {
    graph[name] = extractDependencies(collections[name].schema);
  }

  return graph;
}

export function topoSort(graph) {
  const visited = new Set();
  const visiting = new Set();
  const result = [];

  function dfs(node) {
    if (visiting.has(node)) {
      throw new Error(`Circular dependency detected at ${node}`);
    }

    if (!visited.has(node)) {
      visiting.add(node);

      (graph[node] || []).forEach(dfs);

      visiting.delete(node);
      visited.add(node);
      result.push(node);
    }
  }

  Object.keys(graph).forEach(dfs);

  return result;
}
