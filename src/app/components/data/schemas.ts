//this data/schemas.ts
export const defaultSchema = {
  metadata: {
    name: "string",
    namespace: "string",
  },
};

export const specificSchemas: { [key: string]: { [key: string]: any } } = {
  Deployment: {
    metadata: {
      name: "string",
      namespace: "string",
      labels: "object",
    },
    spec: {
      replicas: "number",
      selector: "object",
      template: {
        spec: {
          containers: [
            {
              name: "string",
              image: "string",
              ports: [
                {
                  containerPort: "number",
                },
              ],
              securityContext: {
                privileged: "boolean",
              },
              resources: {
                requests: {
                  cpu: "string",
                  memory: "string",
                },
              },
              command: ["string"],
              args: ["string"],
              env: [
                {
                  name: "string",
                  value: "string",
                },
              ],
            },
          ],
          imagePullSecrets: [
            {
              name: "string",
            },
          ],
        },
      },
    },
  },
  // Other schemas...

  Service: {
    metadata: {
      name: "string",
      namespace: "string",
    },
    spec: {
      selector: "object",
      type: "string",
      externalName: "string",
      externalIPs: ["string"],
      ports: [
        {
          port: "number",
          targetPort: "number",
          protocol: "string",
          name: "string",
        },
      ],
    },
  },
  //and more..
};
