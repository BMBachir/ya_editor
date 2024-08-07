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
export const updateNestedObject = (obj: any, path: string, newValue: any) => {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]] = current[keys[i]] || {};
  }

  // If the target is an object, merge the newValue with existing properties
  if (
    typeof current[keys[keys.length - 1]] === "object" &&
    current[keys[keys.length - 1]] !== null
  ) {
    current[keys[keys.length - 1]] = {
      ...current[keys[keys.length - 1]],
      ...newValue,
    };
  } else {
    current[keys[keys.length - 1]] = newValue;
  }
};

// Get the last word from a dot-separated string

export function getLastWord(str: string | undefined): string {
  if (typeof str !== "string") {
    return "";
  }
  return str.split(".").pop() || "";
}

// Resolve $ref recursively to get nested properties
// Example improved circular reference handling
export const resolveRef = (
  refValue: string,
  visited = new Set<string>()
): any => {
  if (visited.has(refValue)) {
    console.warn(`Circular reference detected: ${refValue}`);
    return {}; // Or handle according to your needs
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
