//this data/schemas.ts

export const simpleSchemas: { [key: string]: { [key: string]: any } } = {
  Deployment: {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: "Bachir",
      namespace: "default",
      labels: "",
    },
    spec: {
      replicas: 1,
      template: {
        spec: {
          containers: {
            name: "",
            image: "",
            ports: [
              {
                containerPort: 80,
              },
            ],
            securityContext: {
              privileged: false,
            },
            resources: {
              requests: {
                cpu: "",
                memory: "",
              },
            },
            command: "",
            args: "",
            env: "",
          },

          imagePullSecrets: "",
        },
      },
    },
  },
  Service: {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: "",
    },
    spec: {
      selector: {
        app: "",
      },
      ports: {
        protocol: "TCP",
        port: 80,
        targetPort: 80,
      },
    },
  },
  ConfigMap: {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: "",
    },
    data: {
      "example.property": "value",
    },
  },
  Pod: {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: "",
      labels: {
        app: "",
      },
    },
    spec: {
      containers: [
        {
          name: "",
          image: "",
          ports: [
            {
              containerPort: 80,
            },
          ],
        },
      ],
    },
  },
  Ingress: {
    apiVersion: "networking.k8s.io/v1",
    kind: "Ingress",
    metadata: {
      name: "",
    },
    spec: {
      rules: [
        {
          host: "",
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: "",
                    port: {
                      number: 80,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  PersistentVolumeClaim: {
    apiVersion: "v1",
    kind: "PersistentVolumeClaim",
    metadata: {
      name: "",
    },
    spec: {
      accessModes: ["ReadWriteOnce"],
      resources: {
        requests: {
          storage: "1Gi",
        },
      },
    },
  },
  Namespace: {
    apiVersion: "v1",
    kind: "Namespace",
    metadata: {
      name: "",
    },
  },
  Role: {
    apiVersion: "rbac.authorization.k8s.io/v1",
    kind: "Role",
    metadata: {
      namespace: "",
      name: "",
    },
    rules: [
      {
        apiGroups: "",
        resources: "",
        verbs: "",
      },
    ],
  },
  RoleBinding: {
    apiVersion: "rbac.authorization.k8s.io/v1",
    kind: "RoleBinding",
    metadata: {
      name: "",
      namespace: "",
    },
    subjects: [
      {
        kind: "User",
        name: "",
        apiGroup: "rbac.authorization.k8s.io",
      },
    ],
    roleRef: {
      kind: "Role",
      name: "",
      apiGroup: "rbac.authorization.k8s.io",
    },
  },
  Secret: {
    apiVersion: "v1",
    kind: "Secret",
    metadata: {
      name: "",
    },
    type: "Opaque",
    data: {
      username: "",
      password: "",
    },
  },
};
