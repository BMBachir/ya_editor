// Data/commonFields.tsx

export const commonFields: { [key: string]: string[] } = {
  Pod: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "spec.containers.name",
    "spec.containers.image",
    "spec.containers.ports",
    "spec.containers.env",
    "spec.volumes",
    "spec.restartPolicy",
  ],
  Service: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "spec.type",
    "spec.selector",
    "spec.ports.port",
    "spec.ports.targetPort",
  ],
  Deployment: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "spec.replicas",
    "spec.selector.matchLabels",
    "spec.template.metadata.labels",
    "spec.template.spec.containers.name",
    "spec.template.spec.containers.image",
    "spec.template.spec.containers.ports",
    "spec.template.spec.containers.env",
    "spec.template.spec.volumes",
    "spec.strategy.type",
    "spec.strategy.rollingUpdate.maxSurge",
    "spec.strategy.rollingUpdate.maxUnavailable",
  ],
  StatefulSet: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "spec.serviceName",
    "spec.replicas",
    "spec.selector.matchLabels",
    "spec.template.metadata.labels",
    "spec.template.spec.containers.name",
    "spec.template.spec.containers.image",
    "spec.template.spec.containers.ports",
    "spec.template.spec.containers.env",
    "spec.template.spec.volumes",
    "spec.updateStrategy.type",
    "spec.updateStrategy.rollingUpdate.partition",
    "spec.volumeClaimTemplates",
  ],
  ConfigMap: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "data",
  ],
  Secret: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "data",
    "stringData",
  ],
  Namespace: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.labels",
    "metadata.annotations",
  ],
  Ingress: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "spec.rules.host",
    "spec.rules.http.paths.path",
    "spec.tls.hosts",
  ],
  PersistentVolume: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.labels",
    "metadata.annotations",
    "spec.capacity.storage",
    "spec.accessModes",
    "spec.storageClassName",
    "spec.hostPath.path",
    "spec.nfs.path",
    "spec.nfs.server",
    "spec.gcePersistentDisk.pdName",
    "spec.awsElasticBlockStore.volumeID",
  ],
  PersistentVolumeClaim: [
    "apiVersion",
    "kind",
    "metadata.name",
    "metadata.namespace",
    "metadata.labels",
    "metadata.annotations",
    "spec.accessModes",
    "spec.resources.requests.storage",
    "spec.storageClassName",
  ],
};
