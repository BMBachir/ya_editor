// schemas.ts
// Default schema
export const defaultSchema = {
  name: "string",
  namespace: "string",
};

// Common schemas
export const commonSchemas = {
  metadata: {
    creationTimestamp: "string",
    labels: "object",
    annotations: "object",
  },
  spec: {
    replicas: "number",
    selector: "object",
    template: "object",
  },
};

// Specific schemas for common kinds
export const specificSchemas: { [key: string]: { [key: string]: any } } = {
  Deployment: {
    ...defaultSchema,
    replicas: "number",
    template: "object",
  },
  Service: {
    ...defaultSchema,
    selector: "object",
    ports: "object",
  },
  // Add other kinds as needed
};
