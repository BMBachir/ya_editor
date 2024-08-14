// data/simpleFields.ts

export const simpleFields: { [key: string]: string[] } = {
  Pod: [
    "metadata.name",
    "metadata.namespace",
    "metadata.labels", // Adding labels
    "spec.containers.name",
    "spec.containers.image",
  ],
  Service: [
    "metadata.name",
    "metadata.namespace",
    "spec.ports.port",
    "spec.selector",
  ],
  Deployment: [
    "metadata.name",
    "metadata.namespace",
    "metadata.labels", // Adding labels
    "spec.template.metadata.labels", // Template metadata labels
    "spec.template.spec.containers.name",
    "spec.template.spec.containers.image",
  ],
  ConfigMap: [
    "metadata.name",
    "metadata.namespace",
    "metadata.labels", // Adding labels
    "data", // Key-value pairs in ConfigMap
  ],
  Ingress: [
    "metadata.name",
    "metadata.namespace",
    "metadata.labels", // Adding labels
    "spec.rules.host",
    "spec.rules.http.paths.path",
    "spec.tls.hosts",
  ],
  // Add other kinds as needed...
};
