import { k8sDefinitions } from "../data/definitions";

const numberKeys = [
  "spec.replicas",
  "spec.ports.port",
  "spec.ports.targetPort",
  "spec.ports.nodePort",
  "spec.template.spec.containers.0.ports.0.containerPort",
  "spec.template.spec.containers.0.resources.limits.cpu",
  "spec.template.spec.containers.0.resources.limits.memory",
  "spec.template.spec.containers.0.resources.requests.cpu",
  "spec.template.spec.containers.0.resources.requests.memory",
];

// Check if a given path is in the list of number keys
export const isNumberKey = (path: string): boolean => {
  const normalizedPath = path.replace(/\[(\d+)\]/g, ".$1");
  return numberKeys.includes(normalizedPath);
};

// Update nested objects based on a given path and new value
export const updateNestedObject = (
  obj: any,
  path: string,
  newValue: any
): any => {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = newValue;
  return obj;
};

// Get the last word from a dot-separated string
export const getLastWord = (str: string): string => {
  const parts = str.split(".");
  return parts[parts.length - 1];
};

// Resolve $ref recursively to get nested properties
export const resolveRef = (
  refValue: string,
  visited = new Set<string>()
): any => {
  if (visited.has(refValue)) {
    console.warn(`Circular reference detected: ${refValue}`);
    return {};
  }

  visited.add(refValue);

  if (!(refValue in k8sDefinitions)) {
    console.error(`$ref value not found in k8sDefinitions: ${refValue}`);
    return {};
  }

  const nestedResource =
    k8sDefinitions[refValue as keyof typeof k8sDefinitions];
  if (typeof nestedResource !== "object" || !("properties" in nestedResource)) {
    console.error(`No properties found for $ref value: ${refValue}`);
    return {};
  }

  const nestedProperties = nestedResource.properties as {
    [key: string]: { type?: string; items?: any; $ref?: string };
  };

  return Object.keys(nestedProperties).reduce((acc, nestedKey) => {
    const nestedProperty = nestedProperties[nestedKey];
    if (nestedProperty.items && nestedProperty.items.$ref) {
      const nestedRefValue = nestedProperty.items.$ref.replace(
        "#/definitions/",
        ""
      );
      acc[nestedKey] = resolveRef(nestedRefValue, visited);
    } else if (nestedProperty.$ref) {
      const nestedRefValue = nestedProperty.$ref.replace("#/definitions/", "");
      acc[nestedKey] = resolveRef(nestedRefValue, visited);
    } else {
      const nestedPropertyType = nestedProperty.type;
      acc[nestedKey] = getDefaultForType(nestedPropertyType || "");
    }

    return acc;
  }, {} as { [key: string]: any });
};

// Function to get default values based on property type
export const getDefaultForType = (type: string): any => {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return null;
  }
};
