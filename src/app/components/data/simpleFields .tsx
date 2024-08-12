// data/simpleFields.ts

export const simpleFields: { [key: string]: string[] } = {
  Pod: [
    "metadata.name",
    "metadata.namespace",
    "spec.containers.name",
    "spec.containers.image",
  ],
  Service: [
    "metadata.name",
    "metadata.namespace",
    "spec.selector",
    "spec.ports.port",
  ],
  Deployment: ["metadata.name", "metadata.namespace", "spec.replicas"],
  // Add other kinds as needed...
};
