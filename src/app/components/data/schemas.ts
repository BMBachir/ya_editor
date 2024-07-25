export const defaultSchema = {
  name: "string",
  namespace: "string",
};

export const specificSchemas: { [key: string]: { [key: string]: any } } = {
  Deployment: {
    ...defaultSchema,
    replicas: "number",
    template: "object",
    metadata: {
      propriety: {
        creationTimestamp: "string",
        labels: "object",
        annotations: "object",
      },
    },
  },
  Service: {
    ...defaultSchema,
    selector: "object",
    ports: "object",
    spec: {
      propriety: {
        replicas: "number",
        selector: "object",
        template: "object",
        imzge: "object",
      },
    },
  },
};
