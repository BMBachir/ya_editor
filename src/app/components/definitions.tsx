// download latest k8s api definitions from https://github.com/kubernetes/website/blob/main/api-ref-assets/api/swagger.json
// this is the latest version v1.29 of kubernetes api
export const k8sDefinitions = {
  "io.k8s.api.admissionregistration.v1.MatchCondition": {
    description:
      "MatchCondition represents a condition which must by fulfilled for a request to be sent to a webhook.",
    properties: {
      expression: {
        description:
          "Expression represents the expression which will be evaluated by CEL. Must evaluate to bool. CEL expressions have access to the contents of the AdmissionRequest and Authorizer, organized into CEL variables:\n\n'object' - The object from the incoming request. The value is null for DELETE requests. 'oldObject' - The existing object. The value is null for CREATE requests. 'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.\n  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz\n'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the\n  request resource.\nDocumentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/\n\nRequired.",
        type: "string",
      },
      name: {
        description:
          "Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')\n\nRequired.",
        type: "string",
      },
    },
    required: ["name", "expression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1.MutatingWebhook": {
    description:
      "MutatingWebhook describes an admission webhook and the resources and operations it applies to.",
    properties: {
      admissionReviewVersions: {
        description:
          "AdmissionReviewVersions is an ordered list of preferred `AdmissionReview` versions the Webhook expects. API server will try to use first version in the list which it supports. If none of the versions specified in this list supported by API server, validation will fail for this object. If a persisted webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail and be subject to the failure policy.",
        items: {
          type: "string",
        },
        type: "array",
      },
      clientConfig: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1.WebhookClientConfig",
        description:
          "ClientConfig defines how to communicate with the hook. Required",
      },
      failurePolicy: {
        description:
          "FailurePolicy defines how unrecognized errors from the admission endpoint are handled - allowed values are Ignore or Fail. Defaults to Fail.",
        type: "string",
      },
      matchConditions: {
        description:
          "MatchConditions is a list of conditions that must be met for a request to be sent to this webhook. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.\n\nThe exact matching logic is (in order):\n  1. If ANY matchCondition evaluates to FALSE, the webhook is skipped.\n  2. If ALL matchConditions evaluate to TRUE, the webhook is called.\n  3. If any matchCondition evaluates to an error (but none are FALSE):\n     - If failurePolicy=Fail, reject the request\n     - If failurePolicy=Ignore, the error is ignored and the webhook is skipped\n\nThis is a beta feature and managed by the AdmissionWebhookMatchConditions feature gate.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.MatchCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      matchPolicy: {
        description:
          'matchPolicy defines how the "rules" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".\n\n- Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the webhook.\n\n- Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the webhook.\n\nDefaults to "Equivalent"',
        type: "string",
      },
      name: {
        description:
          'The name of the admission webhook. Name should be fully qualified, e.g., imagepolicy.kubernetes.io, where "imagepolicy" is the name of the webhook, and kubernetes.io is the name of the organization. Required.',
        type: "string",
      },
      namespaceSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          'NamespaceSelector decides whether to run the webhook on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the webhook.\n\nFor example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "runlevel",\n      "operator": "NotIn",\n      "values": [\n        "0",\n        "1"\n      ]\n    }\n  ]\n}\n\nIf instead you want to only run the webhook on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "environment",\n      "operator": "In",\n      "values": [\n        "prod",\n        "staging"\n      ]\n    }\n  ]\n}\n\nSee https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.\n\nDefault to the empty LabelSelector, which matches everything.',
      },
      objectSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "ObjectSelector decides whether to run the webhook based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the webhook, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.",
      },
      reinvocationPolicy: {
        description:
          'reinvocationPolicy indicates whether this webhook should be called multiple times as part of a single admission evaluation. Allowed values are "Never" and "IfNeeded".\n\nNever: the webhook will not be called more than once in a single admission evaluation.\n\nIfNeeded: the webhook will be called at least one additional time as part of the admission evaluation if the object being admitted is modified by other admission plugins after the initial webhook call. Webhooks that specify this option *must* be idempotent, able to process objects they previously admitted. Note: * the number of additional invocations is not guaranteed to be exactly one. * if additional invocations result in further modifications to the object, webhooks are not guaranteed to be invoked again. * webhooks that use this option may be reordered to minimize the number of additional invocations. * to validate an object after all mutations are guaranteed complete, use a validating admission webhook instead.\n\nDefaults to "Never".',
        type: "string",
      },
      rules: {
        description:
          "Rules describes what operations on what resources/subresources the webhook cares about. The webhook cares about an operation if it matches _any_ Rule. However, in order to prevent ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks from putting the cluster in a state which cannot be recovered from without completely disabling the plugin, ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks are never called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.RuleWithOperations",
        },
        type: "array",
      },
      sideEffects: {
        description:
          "SideEffects states whether this webhook has side effects. Acceptable values are: None, NoneOnDryRun (webhooks created via v1beta1 may also specify Some or Unknown). Webhooks with side effects MUST implement a reconciliation system, since a request may be rejected by a future step in the admission chain and the side effects therefore need to be undone. Requests with the dryRun attribute will be auto-rejected if they match a webhook with sideEffects == Unknown or Some.",
        type: "string",
      },
      timeoutSeconds: {
        description:
          "TimeoutSeconds specifies the timeout for this webhook. After the timeout passes, the webhook call will be ignored or the API call will fail based on the failure policy. The timeout value must be between 1 and 30 seconds. Default to 10 seconds.",
        format: "int32",
        type: "integer",
      },
    },
    required: [
      "name",
      "clientConfig",
      "sideEffects",
      "admissionReviewVersions",
    ],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1.MutatingWebhookConfiguration": {
    description:
      "MutatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and may change the object.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
      },
      webhooks: {
        description:
          "Webhooks is a list of webhooks and the affected resources and operations.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.MutatingWebhook",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "MutatingWebhookConfiguration",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1.MutatingWebhookConfigurationList": {
    description:
      "MutatingWebhookConfigurationList is a list of MutatingWebhookConfiguration.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of MutatingWebhookConfiguration.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.MutatingWebhookConfiguration",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "MutatingWebhookConfigurationList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1.RuleWithOperations": {
    description:
      "RuleWithOperations is a tuple of Operations and Resources. It is recommended to make sure that all the tuple expansions are valid.",
    properties: {
      apiGroups: {
        description:
          "APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      apiVersions: {
        description:
          "APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      operations: {
        description:
          "Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resources: {
        description:
          "Resources is a list of resources this rule applies to.\n\nFor example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.\n\nIf wildcard is present, the validation rule will ensure resources do not overlap with each other.\n\nDepending on the enclosing object, subresources might not be allowed. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      scope: {
        description:
          'scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1.ServiceReference": {
    description: "ServiceReference holds a reference to Service.legacy.k8s.io",
    properties: {
      name: {
        description: "`name` is the name of the service. Required",
        type: "string",
      },
      namespace: {
        description: "`namespace` is the namespace of the service. Required",
        type: "string",
      },
      path: {
        description:
          "`path` is an optional URL path which will be sent in any request to this service.",
        type: "string",
      },
      port: {
        description:
          "If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive).",
        format: "int32",
        type: "integer",
      },
    },
    required: ["namespace", "name"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1.ValidatingWebhook": {
    description:
      "ValidatingWebhook describes an admission webhook and the resources and operations it applies to.",
    properties: {
      admissionReviewVersions: {
        description:
          "AdmissionReviewVersions is an ordered list of preferred `AdmissionReview` versions the Webhook expects. API server will try to use first version in the list which it supports. If none of the versions specified in this list supported by API server, validation will fail for this object. If a persisted webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail and be subject to the failure policy.",
        items: {
          type: "string",
        },
        type: "array",
      },
      clientConfig: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1.WebhookClientConfig",
        description:
          "ClientConfig defines how to communicate with the hook. Required",
      },
      failurePolicy: {
        description:
          "FailurePolicy defines how unrecognized errors from the admission endpoint are handled - allowed values are Ignore or Fail. Defaults to Fail.",
        type: "string",
      },
      matchConditions: {
        description:
          "MatchConditions is a list of conditions that must be met for a request to be sent to this webhook. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.\n\nThe exact matching logic is (in order):\n  1. If ANY matchCondition evaluates to FALSE, the webhook is skipped.\n  2. If ALL matchConditions evaluate to TRUE, the webhook is called.\n  3. If any matchCondition evaluates to an error (but none are FALSE):\n     - If failurePolicy=Fail, reject the request\n     - If failurePolicy=Ignore, the error is ignored and the webhook is skipped\n\nThis is a beta feature and managed by the AdmissionWebhookMatchConditions feature gate.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.MatchCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      matchPolicy: {
        description:
          'matchPolicy defines how the "rules" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".\n\n- Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the webhook.\n\n- Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the webhook.\n\nDefaults to "Equivalent"',
        type: "string",
      },
      name: {
        description:
          'The name of the admission webhook. Name should be fully qualified, e.g., imagepolicy.kubernetes.io, where "imagepolicy" is the name of the webhook, and kubernetes.io is the name of the organization. Required.',
        type: "string",
      },
      namespaceSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          'NamespaceSelector decides whether to run the webhook on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the webhook.\n\nFor example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "runlevel",\n      "operator": "NotIn",\n      "values": [\n        "0",\n        "1"\n      ]\n    }\n  ]\n}\n\nIf instead you want to only run the webhook on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "environment",\n      "operator": "In",\n      "values": [\n        "prod",\n        "staging"\n      ]\n    }\n  ]\n}\n\nSee https://kubernetes.io/docs/concepts/overview/working-with-objects/labels for more examples of label selectors.\n\nDefault to the empty LabelSelector, which matches everything.',
      },
      objectSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "ObjectSelector decides whether to run the webhook based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the webhook, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.",
      },
      rules: {
        description:
          "Rules describes what operations on what resources/subresources the webhook cares about. The webhook cares about an operation if it matches _any_ Rule. However, in order to prevent ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks from putting the cluster in a state which cannot be recovered from without completely disabling the plugin, ValidatingAdmissionWebhooks and MutatingAdmissionWebhooks are never called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.RuleWithOperations",
        },
        type: "array",
      },
      sideEffects: {
        description:
          "SideEffects states whether this webhook has side effects. Acceptable values are: None, NoneOnDryRun (webhooks created via v1beta1 may also specify Some or Unknown). Webhooks with side effects MUST implement a reconciliation system, since a request may be rejected by a future step in the admission chain and the side effects therefore need to be undone. Requests with the dryRun attribute will be auto-rejected if they match a webhook with sideEffects == Unknown or Some.",
        type: "string",
      },
      timeoutSeconds: {
        description:
          "TimeoutSeconds specifies the timeout for this webhook. After the timeout passes, the webhook call will be ignored or the API call will fail based on the failure policy. The timeout value must be between 1 and 30 seconds. Default to 10 seconds.",
        format: "int32",
        type: "integer",
      },
    },
    required: [
      "name",
      "clientConfig",
      "sideEffects",
      "admissionReviewVersions",
    ],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1.ValidatingWebhookConfiguration": {
    description:
      "ValidatingWebhookConfiguration describes the configuration of and admission webhook that accept or reject and object without changing it.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
      },
      webhooks: {
        description:
          "Webhooks is a list of webhooks and the affected resources and operations.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.ValidatingWebhook",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingWebhookConfiguration",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1.ValidatingWebhookConfigurationList": {
    description:
      "ValidatingWebhookConfigurationList is a list of ValidatingWebhookConfiguration.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of ValidatingWebhookConfiguration.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1.ValidatingWebhookConfiguration",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingWebhookConfigurationList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1.WebhookClientConfig": {
    description:
      "WebhookClientConfig contains the information to make a TLS connection with the webhook",
    properties: {
      caBundle: {
        description:
          "`caBundle` is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used.",
        format: "byte",
        type: "string",
      },
      service: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1.ServiceReference",
        description:
          "`service` is a reference to the service for this webhook. Either `service` or `url` must be specified.\n\nIf the webhook is running within the cluster, then you should use `service`.",
      },
      url: {
        description:
          '`url` gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.\n\nThe `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.\n\nPlease note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.\n\nThe scheme must be "https"; the URL must begin with "https://".\n\nA path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.\n\nAttempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.AuditAnnotation": {
    description:
      "AuditAnnotation describes how to produce an audit annotation for an API request.",
    properties: {
      key: {
        description:
          'key specifies the audit annotation key. The audit annotation keys of a ValidatingAdmissionPolicy must be unique. The key must be a qualified name ([A-Za-z0-9][-A-Za-z0-9_.]*) no more than 63 bytes in length.\n\nThe key is combined with the resource name of the ValidatingAdmissionPolicy to construct an audit annotation key: "{ValidatingAdmissionPolicy name}/{key}".\n\nIf an admission webhook uses the same resource name as this ValidatingAdmissionPolicy and the same audit annotation key, the annotation key will be identical. In this case, the first annotation written with the key will be included in the audit event and all subsequent annotations with the same key will be discarded.\n\nRequired.',
        type: "string",
      },
      valueExpression: {
        description:
          "valueExpression represents the expression which is evaluated by CEL to produce an audit annotation value. The expression must evaluate to either a string or null value. If the expression evaluates to a string, the audit annotation is included with the string value. If the expression evaluates to null or empty string the audit annotation will be omitted. The valueExpression may be no longer than 5kb in length. If the result of the valueExpression is more than 10kb in length, it will be truncated to 10kb.\n\nIf multiple ValidatingAdmissionPolicyBinding resources match an API request, then the valueExpression will be evaluated for each binding. All unique values produced by the valueExpressions will be joined together in a comma-separated list.\n\nRequired.",
        type: "string",
      },
    },
    required: ["key", "valueExpression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.ExpressionWarning": {
    description:
      "ExpressionWarning is a warning information that targets a specific expression.",
    properties: {
      fieldRef: {
        description:
          'The path to the field that refers the expression. For example, the reference to the expression of the first item of validations is "spec.validations[0].expression"',
        type: "string",
      },
      warning: {
        description:
          "The content of type checking information in a human-readable form. Each line of the warning contains the type that the expression is checked against, followed by the type check error from the compiler.",
        type: "string",
      },
    },
    required: ["fieldRef", "warning"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.MatchCondition": {
    properties: {
      expression: {
        description:
          "Expression represents the expression which will be evaluated by CEL. Must evaluate to bool. CEL expressions have access to the contents of the AdmissionRequest and Authorizer, organized into CEL variables:\n\n'object' - The object from the incoming request. The value is null for DELETE requests. 'oldObject' - The existing object. The value is null for CREATE requests. 'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.\n  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz\n'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the\n  request resource.\nDocumentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/\n\nRequired.",
        type: "string",
      },
      name: {
        description:
          "Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')\n\nRequired.",
        type: "string",
      },
    },
    required: ["name", "expression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.MatchResources": {
    description:
      "MatchResources decides whether to run the admission control policy on an object based on whether it meets the match criteria. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)",
    properties: {
      excludeResourceRules: {
        description:
          "ExcludeResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy should not care about. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.NamedRuleWithOperations",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      matchPolicy: {
        description:
          'matchPolicy defines how the "MatchResources" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".\n\n- Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the ValidatingAdmissionPolicy.\n\n- Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the ValidatingAdmissionPolicy.\n\nDefaults to "Equivalent"',
        type: "string",
      },
      namespaceSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          'NamespaceSelector decides whether to run the admission control policy on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the policy.\n\nFor example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "runlevel",\n      "operator": "NotIn",\n      "values": [\n        "0",\n        "1"\n      ]\n    }\n  ]\n}\n\nIf instead you want to only run the policy on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "environment",\n      "operator": "In",\n      "values": [\n        "prod",\n        "staging"\n      ]\n    }\n  ]\n}\n\nSee https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.\n\nDefault to the empty LabelSelector, which matches everything.',
      },
      objectSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "ObjectSelector decides whether to run the validation based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the cel validation, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.",
      },
      resourceRules: {
        description:
          "ResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy matches. The policy cares about an operation if it matches _any_ Rule.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.NamedRuleWithOperations",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1alpha1.NamedRuleWithOperations": {
    description:
      "NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.",
    properties: {
      apiGroups: {
        description:
          "APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      apiVersions: {
        description:
          "APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      operations: {
        description:
          "Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resourceNames: {
        description:
          "ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resources: {
        description:
          "Resources is a list of resources this rule applies to.\n\nFor example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.\n\nIf wildcard is present, the validation rule will ensure resources do not overlap with each other.\n\nDepending on the enclosing object, subresources might not be allowed. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      scope: {
        description:
          'scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".',
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1alpha1.ParamKind": {
    description: "ParamKind is a tuple of Group Kind and Version.",
    properties: {
      apiVersion: {
        description:
          'APIVersion is the API group version the resources belong to. In format of "group/version". Required.',
        type: "string",
      },
      kind: {
        description: "Kind is the API kind the resources belong to. Required.",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1alpha1.ParamRef": {
    description:
      "ParamRef describes how to locate the params to be used as input to expressions of rules applied by a policy binding.",
    properties: {
      name: {
        description:
          "`name` is the name of the resource being referenced.\n\n`name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.",
        type: "string",
      },
      namespace: {
        description:
          "namespace is the namespace of the referenced resource. Allows limiting the search for params to a specific namespace. Applies to both `name` and `selector` fields.\n\nA per-namespace parameter may be used by specifying a namespace-scoped `paramKind` in the policy and leaving this field empty.\n\n- If `paramKind` is cluster-scoped, this field MUST be unset. Setting this field results in a configuration error.\n\n- If `paramKind` is namespace-scoped, the namespace of the object being evaluated for admission will be used when this field is left unset. Take care that if this is left empty the binding must not match any cluster-scoped resources, which will result in an error.",
        type: "string",
      },
      parameterNotFoundAction: {
        description:
          "`parameterNotFoundAction` controls the behavior of the binding when the resource exists, and name or selector is valid, but there are no parameters matched by the binding. If the value is set to `Allow`, then no matched parameters will be treated as successful validation by the binding. If set to `Deny`, then no matched parameters will be subject to the `failurePolicy` of the policy.\n\nAllowed values are `Allow` or `Deny` Default to `Deny`",
        type: "string",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "selector can be used to match multiple param objects based on their labels. Supply selector: {} to match all resources of the ParamKind.\n\nIf multiple params are found, they are all evaluated with the policy expressions and the results are ANDed together.\n\nOne of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1alpha1.TypeChecking": {
    description:
      "TypeChecking contains results of type checking the expressions in the ValidatingAdmissionPolicy",
    properties: {
      expressionWarnings: {
        description: "The type checking warnings for each expression.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ExpressionWarning",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicy": {
    description:
      "ValidatingAdmissionPolicy describes the definition of an admission validation policy that accepts or rejects an object without changing it.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicySpec",
        description:
          "Specification of the desired behavior of the ValidatingAdmissionPolicy.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyStatus",
        description:
          "The status of the ValidatingAdmissionPolicy, including warnings that are useful to determine if the policy behaves in the expected way. Populated by the system. Read-only.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingAdmissionPolicy",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyBinding":
    {
      description:
        "ValidatingAdmissionPolicyBinding binds the ValidatingAdmissionPolicy with paramerized resources. ValidatingAdmissionPolicyBinding and parameter CRDs together define how cluster administrators configure policies for clusters.\n\nFor a given admission request, each binding will cause its policy to be evaluated N times, where N is 1 for policies/bindings that don't use params, otherwise N is the number of parameters selected by the binding.\n\nThe CEL expressions of a policy must have a computed CEL cost below the maximum CEL budget. Each evaluation of the policy is given an independent CEL cost budget. Adding/removing policies, bindings, or params can not affect whether a given (policy, binding, param) combination is within its own CEL budget.",
      properties: {
        apiVersion: {
          description:
            "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
          type: "string",
        },
        kind: {
          description:
            "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
          type: "string",
        },
        metadata: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
          description:
            "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
        },
        spec: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyBindingSpec",
          description:
            "Specification of the desired behavior of the ValidatingAdmissionPolicyBinding.",
        },
      },
      type: "object",
      "x-kubernetes-group-version-kind": [
        {
          group: "admissionregistration.k8s.io",
          kind: "ValidatingAdmissionPolicyBinding",
          version: "v1alpha1",
        },
      ],
    },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyBindingList":
    {
      description:
        "ValidatingAdmissionPolicyBindingList is a list of ValidatingAdmissionPolicyBinding.",
      properties: {
        apiVersion: {
          description:
            "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
          type: "string",
        },
        items: {
          description: "List of PolicyBinding.",
          items: {
            $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyBinding",
          },
          type: "array",
        },
        kind: {
          description:
            "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
          type: "string",
        },
        metadata: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
          description:
            "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        },
      },
      type: "object",
      "x-kubernetes-group-version-kind": [
        {
          group: "admissionregistration.k8s.io",
          kind: "ValidatingAdmissionPolicyBindingList",
          version: "v1alpha1",
        },
      ],
    },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyBindingSpec":
    {
      description:
        "ValidatingAdmissionPolicyBindingSpec is the specification of the ValidatingAdmissionPolicyBinding.",
      properties: {
        matchResources: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.MatchResources",
          description:
            "MatchResources declares what resources match this binding and will be validated by it. Note that this is intersected with the policy's matchConstraints, so only requests that are matched by the policy can be selected by this. If this is unset, all resources matched by the policy are validated by this binding When resourceRules is unset, it does not constrain resource matching. If a resource is matched by the other fields of this object, it will be validated. Note that this is differs from ValidatingAdmissionPolicy matchConstraints, where resourceRules are required.",
        },
        paramRef: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ParamRef",
          description:
            "paramRef specifies the parameter resource used to configure the admission control policy. It should point to a resource of the type specified in ParamKind of the bound ValidatingAdmissionPolicy. If the policy specifies a ParamKind and the resource referred to by ParamRef does not exist, this binding is considered mis-configured and the FailurePolicy of the ValidatingAdmissionPolicy applied. If the policy does not specify a ParamKind then this field is ignored, and the rules are evaluated without a param.",
        },
        policyName: {
          description:
            "PolicyName references a ValidatingAdmissionPolicy name which the ValidatingAdmissionPolicyBinding binds to. If the referenced resource does not exist, this binding is considered invalid and will be ignored Required.",
          type: "string",
        },
        validationActions: {
          description:
            'validationActions declares how Validations of the referenced ValidatingAdmissionPolicy are enforced. If a validation evaluates to false it is always enforced according to these actions.\n\nFailures defined by the ValidatingAdmissionPolicy\'s FailurePolicy are enforced according to these actions only if the FailurePolicy is set to Fail, otherwise the failures are ignored. This includes compilation errors, runtime errors and misconfigurations of the policy.\n\nvalidationActions is declared as a set of action values. Order does not matter. validationActions may not contain duplicates of the same action.\n\nThe supported actions values are:\n\n"Deny" specifies that a validation failure results in a denied request.\n\n"Warn" specifies that a validation failure is reported to the request client in HTTP Warning headers, with a warning code of 299. Warnings can be sent both for allowed or denied admission responses.\n\n"Audit" specifies that a validation failure is included in the published audit event for the request. The audit event will contain a `validation.policy.admission.k8s.io/validation_failure` audit annotation with a value containing the details of the validation failures, formatted as a JSON list of objects, each with the following fields: - message: The validation failure message string - policy: The resource name of the ValidatingAdmissionPolicy - binding: The resource name of the ValidatingAdmissionPolicyBinding - expressionIndex: The index of the failed validations in the ValidatingAdmissionPolicy - validationActions: The enforcement actions enacted for the validation failure Example audit annotation: `"validation.policy.admission.k8s.io/validation_failure": "[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]"`\n\nClients should expect to handle additional values by ignoring any values not recognized.\n\n"Deny" and "Warn" may not be used together since this combination needlessly duplicates the validation failure both in the API response body and the HTTP warning headers.\n\nRequired.',
          items: {
            type: "string",
          },
          type: "array",
          "x-kubernetes-list-type": "set",
        },
      },
      type: "object",
    },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyList": {
    description:
      "ValidatingAdmissionPolicyList is a list of ValidatingAdmissionPolicy.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of ValidatingAdmissionPolicy.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicy",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingAdmissionPolicyList",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicySpec": {
    description:
      "ValidatingAdmissionPolicySpec is the specification of the desired behavior of the AdmissionPolicy.",
    properties: {
      auditAnnotations: {
        description:
          "auditAnnotations contains CEL expressions which are used to produce audit annotations for the audit event of the API request. validations and auditAnnotations may not both be empty; a least one of validations or auditAnnotations is required.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.AuditAnnotation",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      failurePolicy: {
        description:
          "failurePolicy defines how to handle failures for the admission policy. Failures can occur from CEL expression parse errors, type check errors, runtime errors and invalid or mis-configured policy definitions or bindings.\n\nA policy is invalid if spec.paramKind refers to a non-existent Kind. A binding is invalid if spec.paramRef.name refers to a non-existent resource.\n\nfailurePolicy does not define how validations that evaluate to false are handled.\n\nWhen failurePolicy is set to Fail, ValidatingAdmissionPolicyBinding validationActions define how failures are enforced.\n\nAllowed values are Ignore or Fail. Defaults to Fail.",
        type: "string",
      },
      matchConditions: {
        description:
          "MatchConditions is a list of conditions that must be met for a request to be validated. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.\n\nIf a parameter object is provided, it can be accessed via the `params` handle in the same manner as validation expressions.\n\nThe exact matching logic is (in order):\n  1. If ANY matchCondition evaluates to FALSE, the policy is skipped.\n  2. If ALL matchConditions evaluate to TRUE, the policy is evaluated.\n  3. If any matchCondition evaluates to an error (but none are FALSE):\n     - If failurePolicy=Fail, reject the request\n     - If failurePolicy=Ignore, the policy is skipped",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.MatchCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      matchConstraints: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.MatchResources",
        description:
          "MatchConstraints specifies what resources this policy is designed to validate. The AdmissionPolicy cares about a request if it matches _all_ Constraints. However, in order to prevent clusters from being put into an unstable state that cannot be recovered from via the API ValidatingAdmissionPolicy cannot match ValidatingAdmissionPolicy and ValidatingAdmissionPolicyBinding. Required.",
      },
      paramKind: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.ParamKind",
        description:
          "ParamKind specifies the kind of resources used to parameterize this policy. If absent, there are no parameters for this policy and the param CEL variable will not be provided to validation expressions. If ParamKind refers to a non-existent kind, this policy definition is mis-configured and the FailurePolicy is applied. If paramKind is specified but paramRef is unset in ValidatingAdmissionPolicyBinding, the params variable will be null.",
      },
      validations: {
        description:
          "Validations contain CEL expressions which is used to apply the validation. Validations and AuditAnnotations may not both be empty; a minimum of one Validations or AuditAnnotations is required.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.Validation",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      variables: {
        description:
          "Variables contain definitions of variables that can be used in composition of other expressions. Each variable is defined as a named CEL expression. The variables defined here will be available under `variables` in other expressions of the policy except MatchConditions because MatchConditions are evaluated before the rest of the policy.\n\nThe expression of a variable can refer to other variables defined earlier in the list but not those after. Thus, Variables must be sorted by the order of first appearance and acyclic.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.Variable",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.ValidatingAdmissionPolicyStatus": {
    description:
      "ValidatingAdmissionPolicyStatus represents the status of a ValidatingAdmissionPolicy.",
    properties: {
      conditions: {
        description:
          "The conditions represent the latest available observations of a policy's current state.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Condition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
      },
      observedGeneration: {
        description: "The generation observed by the controller.",
        format: "int64",
        type: "integer",
      },
      typeChecking: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1alpha1.TypeChecking",
        description:
          "The results of type checking for each expression. Presence of this field indicates the completion of the type checking.",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.Validation": {
    description:
      "Validation specifies the CEL expression which is used to apply the validation.",
    properties: {
      expression: {
        description:
          'Expression represents the expression which will be evaluated by CEL. ref: https://github.com/google/cel-spec CEL expressions have access to the contents of the API request/response, organized into CEL variables as well as some other useful variables:\n\n- \'object\' - The object from the incoming request. The value is null for DELETE requests. - \'oldObject\' - The existing object. The value is null for CREATE requests. - \'request\' - Attributes of the API request([ref](/pkg/apis/admission/types.go#AdmissionRequest)). - \'params\' - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind. - \'namespaceObject\' - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources. - \'variables\' - Map of composited variables, from its name to its lazily evaluated value.\n  For example, a variable named \'foo\' can be accessed as \'variables.foo\'.\n- \'authorizer\' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.\n  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz\n- \'authorizer.requestResource\' - A CEL ResourceCheck constructed from the \'authorizer\' and configured with the\n  request resource.\n\nThe `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the object. No other metadata properties are accessible.\n\nOnly property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible. Accessible property names are escaped according to the following rules when accessed in the expression: - \'__\' escapes to \'__underscores__\' - \'.\' escapes to \'__dot__\' - \'-\' escapes to \'__dash__\' - \'/\' escapes to \'__slash__\' - Property names that exactly match a CEL RESERVED keyword escape to \'__{keyword}__\'. The keywords are:\n\t  "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if",\n\t  "import", "let", "loop", "package", "namespace", "return".\nExamples:\n  - Expression accessing a property named "namespace": {"Expression": "object.__namespace__ > 0"}\n  - Expression accessing a property named "x-prop": {"Expression": "object.x__dash__prop > 0"}\n  - Expression accessing a property named "redact__d": {"Expression": "object.redact__underscores__d > 0"}\n\nEquality on arrays with list type of \'set\' or \'map\' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:\n  - \'set\': `X + Y` performs a union where the array positions of all elements in `X` are preserved and\n    non-intersecting elements in `Y` are appended, retaining their partial order.\n  - \'map\': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values\n    are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with\n    non-intersecting keys are appended, retaining their partial order.\nRequired.',
        type: "string",
      },
      message: {
        description:
          'Message represents the message displayed when validation fails. The message is required if the Expression contains line breaks. The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host" If the Expression contains line breaks. Message is required. The message must not contain line breaks. If unset, the message is "failed Expression: {Expression}".',
        type: "string",
      },
      messageExpression: {
        description:
          "messageExpression declares a CEL expression that evaluates to the validation failure message that is returned when this rule fails. Since messageExpression is used as a failure message, it must evaluate to a string. If both message and messageExpression are present on a validation, then messageExpression will be used if validation fails. If messageExpression results in a runtime error, the runtime error is logged, and the validation failure message is produced as if the messageExpression field were unset. If messageExpression evaluates to an empty string, a string with only spaces, or a string that contains line breaks, then the validation failure message will also be produced as if the messageExpression field were unset, and the fact that messageExpression produced an empty string/string with only spaces/string with line breaks will be logged. messageExpression has access to all the same variables as the `expression` except for 'authorizer' and 'authorizer.requestResource'. Example: \"object.x must be less than max (\"+string(params.max)+\")\"",
        type: "string",
      },
      reason: {
        description:
          'Reason represents a machine-readable description of why this validation failed. If this is the first validation in the list to fail, this reason, as well as the corresponding HTTP response code, are used in the HTTP response to the client. The currently supported reasons are: "Unauthorized", "Forbidden", "Invalid", "RequestEntityTooLarge". If not set, StatusReasonInvalid is used in the response to the client.',
        type: "string",
      },
    },
    required: ["expression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1alpha1.Variable": {
    description:
      "Variable is the definition of a variable that is used for composition.",
    properties: {
      expression: {
        description:
          "Expression is the expression that will be evaluated as the value of the variable. The CEL expression has access to the same identifiers as the CEL expressions in Validation.",
        type: "string",
      },
      name: {
        description:
          'Name is the name of the variable. The name must be a valid CEL identifier and unique among all variables. The variable can be accessed in other expressions through `variables` For example, if name is "foo", the variable will be available as `variables.foo`',
        type: "string",
      },
    },
    required: ["name", "expression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.AuditAnnotation": {
    description:
      "AuditAnnotation describes how to produce an audit annotation for an API request.",
    properties: {
      key: {
        description:
          'key specifies the audit annotation key. The audit annotation keys of a ValidatingAdmissionPolicy must be unique. The key must be a qualified name ([A-Za-z0-9][-A-Za-z0-9_.]*) no more than 63 bytes in length.\n\nThe key is combined with the resource name of the ValidatingAdmissionPolicy to construct an audit annotation key: "{ValidatingAdmissionPolicy name}/{key}".\n\nIf an admission webhook uses the same resource name as this ValidatingAdmissionPolicy and the same audit annotation key, the annotation key will be identical. In this case, the first annotation written with the key will be included in the audit event and all subsequent annotations with the same key will be discarded.\n\nRequired.',
        type: "string",
      },
      valueExpression: {
        description:
          "valueExpression represents the expression which is evaluated by CEL to produce an audit annotation value. The expression must evaluate to either a string or null value. If the expression evaluates to a string, the audit annotation is included with the string value. If the expression evaluates to null or empty string the audit annotation will be omitted. The valueExpression may be no longer than 5kb in length. If the result of the valueExpression is more than 10kb in length, it will be truncated to 10kb.\n\nIf multiple ValidatingAdmissionPolicyBinding resources match an API request, then the valueExpression will be evaluated for each binding. All unique values produced by the valueExpressions will be joined together in a comma-separated list.\n\nRequired.",
        type: "string",
      },
    },
    required: ["key", "valueExpression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.ExpressionWarning": {
    description:
      "ExpressionWarning is a warning information that targets a specific expression.",
    properties: {
      fieldRef: {
        description:
          'The path to the field that refers the expression. For example, the reference to the expression of the first item of validations is "spec.validations[0].expression"',
        type: "string",
      },
      warning: {
        description:
          "The content of type checking information in a human-readable form. Each line of the warning contains the type that the expression is checked against, followed by the type check error from the compiler.",
        type: "string",
      },
    },
    required: ["fieldRef", "warning"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.MatchCondition": {
    description:
      "MatchCondition represents a condition which must be fulfilled for a request to be sent to a webhook.",
    properties: {
      expression: {
        description:
          "Expression represents the expression which will be evaluated by CEL. Must evaluate to bool. CEL expressions have access to the contents of the AdmissionRequest and Authorizer, organized into CEL variables:\n\n'object' - The object from the incoming request. The value is null for DELETE requests. 'oldObject' - The existing object. The value is null for CREATE requests. 'request' - Attributes of the admission request(/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.\n  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz\n'authorizer.requestResource' - A CEL ResourceCheck constructed from the 'authorizer' and configured with the\n  request resource.\nDocumentation on CEL: https://kubernetes.io/docs/reference/using-api/cel/\n\nRequired.",
        type: "string",
      },
      name: {
        description:
          "Name is an identifier for this match condition, used for strategic merging of MatchConditions, as well as providing an identifier for logging purposes. A good name should be descriptive of the associated expression. Name must be a qualified name consisting of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character (e.g. 'MyName',  or 'my.name',  or '123-abc', regex used for validation is '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') with an optional DNS subdomain prefix and '/' (e.g. 'example.com/MyName')\n\nRequired.",
        type: "string",
      },
    },
    required: ["name", "expression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.MatchResources": {
    description:
      "MatchResources decides whether to run the admission control policy on an object based on whether it meets the match criteria. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)",
    properties: {
      excludeResourceRules: {
        description:
          "ExcludeResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy should not care about. The exclude rules take precedence over include rules (if a resource matches both, it is excluded)",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.NamedRuleWithOperations",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      matchPolicy: {
        description:
          'matchPolicy defines how the "MatchResources" list is used to match incoming requests. Allowed values are "Exact" or "Equivalent".\n\n- Exact: match a request only if it exactly matches a specified rule. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, but "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would not be sent to the ValidatingAdmissionPolicy.\n\n- Equivalent: match a request if modifies a resource listed in rules, even via another API group or version. For example, if deployments can be modified via apps/v1, apps/v1beta1, and extensions/v1beta1, and "rules" only included `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, a request to apps/v1beta1 or extensions/v1beta1 would be converted to apps/v1 and sent to the ValidatingAdmissionPolicy.\n\nDefaults to "Equivalent"',
        type: "string",
      },
      namespaceSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          'NamespaceSelector decides whether to run the admission control policy on an object based on whether the namespace for that object matches the selector. If the object itself is a namespace, the matching is performed on object.metadata.labels. If the object is another cluster scoped resource, it never skips the policy.\n\nFor example, to run the webhook on any objects whose namespace is not associated with "runlevel" of "0" or "1";  you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "runlevel",\n      "operator": "NotIn",\n      "values": [\n        "0",\n        "1"\n      ]\n    }\n  ]\n}\n\nIf instead you want to only run the policy on any objects whose namespace is associated with the "environment" of "prod" or "staging"; you will set the selector as follows: "namespaceSelector": {\n  "matchExpressions": [\n    {\n      "key": "environment",\n      "operator": "In",\n      "values": [\n        "prod",\n        "staging"\n      ]\n    }\n  ]\n}\n\nSee https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/ for more examples of label selectors.\n\nDefault to the empty LabelSelector, which matches everything.',
      },
      objectSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "ObjectSelector decides whether to run the validation based on if the object has matching labels. objectSelector is evaluated against both the oldObject and newObject that would be sent to the cel validation, and is considered to match if either object matches the selector. A null object (oldObject in the case of create, or newObject in the case of delete) or an object that cannot have labels (like a DeploymentRollback or a PodProxyOptions object) is not considered to match. Use the object selector only if the webhook is opt-in, because end users may skip the admission webhook by setting the labels. Default to the empty LabelSelector, which matches everything.",
      },
      resourceRules: {
        description:
          "ResourceRules describes what operations on what resources/subresources the ValidatingAdmissionPolicy matches. The policy cares about an operation if it matches _any_ Rule.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.NamedRuleWithOperations",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1beta1.NamedRuleWithOperations": {
    description:
      "NamedRuleWithOperations is a tuple of Operations and Resources with ResourceNames.",
    properties: {
      apiGroups: {
        description:
          "APIGroups is the API groups the resources belong to. '*' is all groups. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      apiVersions: {
        description:
          "APIVersions is the API versions the resources belong to. '*' is all versions. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      operations: {
        description:
          "Operations is the operations the admission hook cares about - CREATE, UPDATE, DELETE, CONNECT or * for all of those operations and any future admission operations that are added. If '*' is present, the length of the slice must be one. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resourceNames: {
        description:
          "ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resources: {
        description:
          "Resources is a list of resources this rule applies to.\n\nFor example: 'pods' means pods. 'pods/log' means the log subresource of pods. '*' means all resources, but not subresources. 'pods/*' means all subresources of pods. '*/scale' means all scale subresources. '*/*' means all resources and their subresources.\n\nIf wildcard is present, the validation rule will ensure resources do not overlap with each other.\n\nDepending on the enclosing object, subresources might not be allowed. Required.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      scope: {
        description:
          'scope specifies the scope of this rule. Valid values are "Cluster", "Namespaced", and "*" "Cluster" means that only cluster-scoped resources will match this rule. Namespace API objects are cluster-scoped. "Namespaced" means that only namespaced resources will match this rule. "*" means that there are no scope restrictions. Subresources match the scope of their parent resource. Default is "*".',
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1beta1.ParamKind": {
    description: "ParamKind is a tuple of Group Kind and Version.",
    properties: {
      apiVersion: {
        description:
          'APIVersion is the API group version the resources belong to. In format of "group/version". Required.',
        type: "string",
      },
      kind: {
        description: "Kind is the API kind the resources belong to. Required.",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1beta1.ParamRef": {
    description:
      "ParamRef describes how to locate the params to be used as input to expressions of rules applied by a policy binding.",
    properties: {
      name: {
        description:
          "name is the name of the resource being referenced.\n\nOne of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.\n\nA single parameter used for all admission requests can be configured by setting the `name` field, leaving `selector` blank, and setting namespace if `paramKind` is namespace-scoped.",
        type: "string",
      },
      namespace: {
        description:
          "namespace is the namespace of the referenced resource. Allows limiting the search for params to a specific namespace. Applies to both `name` and `selector` fields.\n\nA per-namespace parameter may be used by specifying a namespace-scoped `paramKind` in the policy and leaving this field empty.\n\n- If `paramKind` is cluster-scoped, this field MUST be unset. Setting this field results in a configuration error.\n\n- If `paramKind` is namespace-scoped, the namespace of the object being evaluated for admission will be used when this field is left unset. Take care that if this is left empty the binding must not match any cluster-scoped resources, which will result in an error.",
        type: "string",
      },
      parameterNotFoundAction: {
        description:
          "`parameterNotFoundAction` controls the behavior of the binding when the resource exists, and name or selector is valid, but there are no parameters matched by the binding. If the value is set to `Allow`, then no matched parameters will be treated as successful validation by the binding. If set to `Deny`, then no matched parameters will be subject to the `failurePolicy` of the policy.\n\nAllowed values are `Allow` or `Deny`\n\nRequired",
        type: "string",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "selector can be used to match multiple param objects based on their labels. Supply selector: {} to match all resources of the ParamKind.\n\nIf multiple params are found, they are all evaluated with the policy expressions and the results are ANDed together.\n\nOne of `name` or `selector` must be set, but `name` and `selector` are mutually exclusive properties. If one is set, the other must be unset.",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.admissionregistration.v1beta1.TypeChecking": {
    description:
      "TypeChecking contains results of type checking the expressions in the ValidatingAdmissionPolicy",
    properties: {
      expressionWarnings: {
        description: "The type checking warnings for each expression.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ExpressionWarning",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicy": {
    description:
      "ValidatingAdmissionPolicy describes the definition of an admission validation policy that accepts or rejects an object without changing it.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicySpec",
        description:
          "Specification of the desired behavior of the ValidatingAdmissionPolicy.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyStatus",
        description:
          "The status of the ValidatingAdmissionPolicy, including warnings that are useful to determine if the policy behaves in the expected way. Populated by the system. Read-only.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingAdmissionPolicy",
        version: "v1beta1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyBinding": {
    description:
      "ValidatingAdmissionPolicyBinding binds the ValidatingAdmissionPolicy with paramerized resources. ValidatingAdmissionPolicyBinding and parameter CRDs together define how cluster administrators configure policies for clusters.\n\nFor a given admission request, each binding will cause its policy to be evaluated N times, where N is 1 for policies/bindings that don't use params, otherwise N is the number of parameters selected by the binding.\n\nThe CEL expressions of a policy must have a computed CEL cost below the maximum CEL budget. Each evaluation of the policy is given an independent CEL cost budget. Adding/removing policies, bindings, or params can not affect whether a given (policy, binding, param) combination is within its own CEL budget.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyBindingSpec",
        description:
          "Specification of the desired behavior of the ValidatingAdmissionPolicyBinding.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingAdmissionPolicyBinding",
        version: "v1beta1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyBindingList":
    {
      description:
        "ValidatingAdmissionPolicyBindingList is a list of ValidatingAdmissionPolicyBinding.",
      properties: {
        apiVersion: {
          description:
            "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
          type: "string",
        },
        items: {
          description: "List of PolicyBinding.",
          items: {
            $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyBinding",
          },
          type: "array",
        },
        kind: {
          description:
            "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
          type: "string",
        },
        metadata: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
          description:
            "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        },
      },
      type: "object",
      "x-kubernetes-group-version-kind": [
        {
          group: "admissionregistration.k8s.io",
          kind: "ValidatingAdmissionPolicyBindingList",
          version: "v1beta1",
        },
      ],
    },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyBindingSpec":
    {
      description:
        "ValidatingAdmissionPolicyBindingSpec is the specification of the ValidatingAdmissionPolicyBinding.",
      properties: {
        matchResources: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.MatchResources",
          description:
            "MatchResources declares what resources match this binding and will be validated by it. Note that this is intersected with the policy's matchConstraints, so only requests that are matched by the policy can be selected by this. If this is unset, all resources matched by the policy are validated by this binding When resourceRules is unset, it does not constrain resource matching. If a resource is matched by the other fields of this object, it will be validated. Note that this is differs from ValidatingAdmissionPolicy matchConstraints, where resourceRules are required.",
        },
        paramRef: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ParamRef",
          description:
            "paramRef specifies the parameter resource used to configure the admission control policy. It should point to a resource of the type specified in ParamKind of the bound ValidatingAdmissionPolicy. If the policy specifies a ParamKind and the resource referred to by ParamRef does not exist, this binding is considered mis-configured and the FailurePolicy of the ValidatingAdmissionPolicy applied. If the policy does not specify a ParamKind then this field is ignored, and the rules are evaluated without a param.",
        },
        policyName: {
          description:
            "PolicyName references a ValidatingAdmissionPolicy name which the ValidatingAdmissionPolicyBinding binds to. If the referenced resource does not exist, this binding is considered invalid and will be ignored Required.",
          type: "string",
        },
        validationActions: {
          description:
            'validationActions declares how Validations of the referenced ValidatingAdmissionPolicy are enforced. If a validation evaluates to false it is always enforced according to these actions.\n\nFailures defined by the ValidatingAdmissionPolicy\'s FailurePolicy are enforced according to these actions only if the FailurePolicy is set to Fail, otherwise the failures are ignored. This includes compilation errors, runtime errors and misconfigurations of the policy.\n\nvalidationActions is declared as a set of action values. Order does not matter. validationActions may not contain duplicates of the same action.\n\nThe supported actions values are:\n\n"Deny" specifies that a validation failure results in a denied request.\n\n"Warn" specifies that a validation failure is reported to the request client in HTTP Warning headers, with a warning code of 299. Warnings can be sent both for allowed or denied admission responses.\n\n"Audit" specifies that a validation failure is included in the published audit event for the request. The audit event will contain a `validation.policy.admission.k8s.io/validation_failure` audit annotation with a value containing the details of the validation failures, formatted as a JSON list of objects, each with the following fields: - message: The validation failure message string - policy: The resource name of the ValidatingAdmissionPolicy - binding: The resource name of the ValidatingAdmissionPolicyBinding - expressionIndex: The index of the failed validations in the ValidatingAdmissionPolicy - validationActions: The enforcement actions enacted for the validation failure Example audit annotation: `"validation.policy.admission.k8s.io/validation_failure": "[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]"`\n\nClients should expect to handle additional values by ignoring any values not recognized.\n\n"Deny" and "Warn" may not be used together since this combination needlessly duplicates the validation failure both in the API response body and the HTTP warning headers.\n\nRequired.',
          items: {
            type: "string",
          },
          type: "array",
          "x-kubernetes-list-type": "set",
        },
      },
      type: "object",
    },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyList": {
    description:
      "ValidatingAdmissionPolicyList is a list of ValidatingAdmissionPolicy.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of ValidatingAdmissionPolicy.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicy",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "admissionregistration.k8s.io",
        kind: "ValidatingAdmissionPolicyList",
        version: "v1beta1",
      },
    ],
  },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicySpec": {
    description:
      "ValidatingAdmissionPolicySpec is the specification of the desired behavior of the AdmissionPolicy.",
    properties: {
      auditAnnotations: {
        description:
          "auditAnnotations contains CEL expressions which are used to produce audit annotations for the audit event of the API request. validations and auditAnnotations may not both be empty; a least one of validations or auditAnnotations is required.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.AuditAnnotation",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      failurePolicy: {
        description:
          "failurePolicy defines how to handle failures for the admission policy. Failures can occur from CEL expression parse errors, type check errors, runtime errors and invalid or mis-configured policy definitions or bindings.\n\nA policy is invalid if spec.paramKind refers to a non-existent Kind. A binding is invalid if spec.paramRef.name refers to a non-existent resource.\n\nfailurePolicy does not define how validations that evaluate to false are handled.\n\nWhen failurePolicy is set to Fail, ValidatingAdmissionPolicyBinding validationActions define how failures are enforced.\n\nAllowed values are Ignore or Fail. Defaults to Fail.",
        type: "string",
      },
      matchConditions: {
        description:
          "MatchConditions is a list of conditions that must be met for a request to be validated. Match conditions filter requests that have already been matched by the rules, namespaceSelector, and objectSelector. An empty list of matchConditions matches all requests. There are a maximum of 64 match conditions allowed.\n\nIf a parameter object is provided, it can be accessed via the `params` handle in the same manner as validation expressions.\n\nThe exact matching logic is (in order):\n  1. If ANY matchCondition evaluates to FALSE, the policy is skipped.\n  2. If ALL matchConditions evaluate to TRUE, the policy is evaluated.\n  3. If any matchCondition evaluates to an error (but none are FALSE):\n     - If failurePolicy=Fail, reject the request\n     - If failurePolicy=Ignore, the policy is skipped",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.MatchCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      matchConstraints: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.MatchResources",
        description:
          "MatchConstraints specifies what resources this policy is designed to validate. The AdmissionPolicy cares about a request if it matches _all_ Constraints. However, in order to prevent clusters from being put into an unstable state that cannot be recovered from via the API ValidatingAdmissionPolicy cannot match ValidatingAdmissionPolicy and ValidatingAdmissionPolicyBinding. Required.",
      },
      paramKind: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.ParamKind",
        description:
          "ParamKind specifies the kind of resources used to parameterize this policy. If absent, there are no parameters for this policy and the param CEL variable will not be provided to validation expressions. If ParamKind refers to a non-existent kind, this policy definition is mis-configured and the FailurePolicy is applied. If paramKind is specified but paramRef is unset in ValidatingAdmissionPolicyBinding, the params variable will be null.",
      },
      validations: {
        description:
          "Validations contain CEL expressions which is used to apply the validation. Validations and AuditAnnotations may not both be empty; a minimum of one Validations or AuditAnnotations is required.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.Validation",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      variables: {
        description:
          "Variables contain definitions of variables that can be used in composition of other expressions. Each variable is defined as a named CEL expression. The variables defined here will be available under `variables` in other expressions of the policy except MatchConditions because MatchConditions are evaluated before the rest of the policy.\n\nThe expression of a variable can refer to other variables defined earlier in the list but not those after. Thus, Variables must be sorted by the order of first appearance and acyclic.",
        items: {
          $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.Variable",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.ValidatingAdmissionPolicyStatus": {
    description:
      "ValidatingAdmissionPolicyStatus represents the status of an admission validation policy.",
    properties: {
      conditions: {
        description:
          "The conditions represent the latest available observations of a policy's current state.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Condition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
      },
      observedGeneration: {
        description: "The generation observed by the controller.",
        format: "int64",
        type: "integer",
      },
      typeChecking: {
        $ref: "#/definitions/io.k8s.api.admissionregistration.v1beta1.TypeChecking",
        description:
          "The results of type checking for each expression. Presence of this field indicates the completion of the type checking.",
      },
    },
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.Validation": {
    description:
      "Validation specifies the CEL expression which is used to apply the validation.",
    properties: {
      expression: {
        description:
          'Expression represents the expression which will be evaluated by CEL. ref: https://github.com/google/cel-spec CEL expressions have access to the contents of the API request/response, organized into CEL variables as well as some other useful variables:\n\n- \'object\' - The object from the incoming request. The value is null for DELETE requests. - \'oldObject\' - The existing object. The value is null for CREATE requests. - \'request\' - Attributes of the API request([ref](/pkg/apis/admission/types.go#AdmissionRequest)). - \'params\' - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind. - \'namespaceObject\' - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources. - \'variables\' - Map of composited variables, from its name to its lazily evaluated value.\n  For example, a variable named \'foo\' can be accessed as \'variables.foo\'.\n- \'authorizer\' - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.\n  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz\n- \'authorizer.requestResource\' - A CEL ResourceCheck constructed from the \'authorizer\' and configured with the\n  request resource.\n\nThe `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the object. No other metadata properties are accessible.\n\nOnly property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible. Accessible property names are escaped according to the following rules when accessed in the expression: - \'__\' escapes to \'__underscores__\' - \'.\' escapes to \'__dot__\' - \'-\' escapes to \'__dash__\' - \'/\' escapes to \'__slash__\' - Property names that exactly match a CEL RESERVED keyword escape to \'__{keyword}__\'. The keywords are:\n\t  "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if",\n\t  "import", "let", "loop", "package", "namespace", "return".\nExamples:\n  - Expression accessing a property named "namespace": {"Expression": "object.__namespace__ > 0"}\n  - Expression accessing a property named "x-prop": {"Expression": "object.x__dash__prop > 0"}\n  - Expression accessing a property named "redact__d": {"Expression": "object.redact__underscores__d > 0"}\n\nEquality on arrays with list type of \'set\' or \'map\' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:\n  - \'set\': `X + Y` performs a union where the array positions of all elements in `X` are preserved and\n    non-intersecting elements in `Y` are appended, retaining their partial order.\n  - \'map\': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values\n    are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with\n    non-intersecting keys are appended, retaining their partial order.\nRequired.',
        type: "string",
      },
      message: {
        description:
          'Message represents the message displayed when validation fails. The message is required if the Expression contains line breaks. The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host" If the Expression contains line breaks. Message is required. The message must not contain line breaks. If unset, the message is "failed Expression: {Expression}".',
        type: "string",
      },
      messageExpression: {
        description:
          "messageExpression declares a CEL expression that evaluates to the validation failure message that is returned when this rule fails. Since messageExpression is used as a failure message, it must evaluate to a string. If both message and messageExpression are present on a validation, then messageExpression will be used if validation fails. If messageExpression results in a runtime error, the runtime error is logged, and the validation failure message is produced as if the messageExpression field were unset. If messageExpression evaluates to an empty string, a string with only spaces, or a string that contains line breaks, then the validation failure message will also be produced as if the messageExpression field were unset, and the fact that messageExpression produced an empty string/string with only spaces/string with line breaks will be logged. messageExpression has access to all the same variables as the `expression` except for 'authorizer' and 'authorizer.requestResource'. Example: \"object.x must be less than max (\"+string(params.max)+\")\"",
        type: "string",
      },
      reason: {
        description:
          'Reason represents a machine-readable description of why this validation failed. If this is the first validation in the list to fail, this reason, as well as the corresponding HTTP response code, are used in the HTTP response to the client. The currently supported reasons are: "Unauthorized", "Forbidden", "Invalid", "RequestEntityTooLarge". If not set, StatusReasonInvalid is used in the response to the client.',
        type: "string",
      },
    },
    required: ["expression"],
    type: "object",
  },
  "io.k8s.api.admissionregistration.v1beta1.Variable": {
    description:
      "Variable is the definition of a variable that is used for composition. A variable is defined as a named expression.",
    properties: {
      expression: {
        description:
          "Expression is the expression that will be evaluated as the value of the variable. The CEL expression has access to the same identifiers as the CEL expressions in Validation.",
        type: "string",
      },
      name: {
        description:
          'Name is the name of the variable. The name must be a valid CEL identifier and unique among all variables. The variable can be accessed in other expressions through `variables` For example, if name is "foo", the variable will be available as `variables.foo`',
        type: "string",
      },
    },
    required: ["name", "expression"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.apiserverinternal.v1alpha1.ServerStorageVersion": {
    description:
      "An API server instance reports the version it can decode and the version it encodes objects to when persisting objects in the backend.",
    properties: {
      apiServerID: {
        description: "The ID of the reporting API server.",
        type: "string",
      },
      decodableVersions: {
        description:
          "The API server can decode objects encoded in these versions. The encodingVersion must be included in the decodableVersions.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      encodingVersion: {
        description:
          "The API server encodes the object to this version when persisting it in the backend (e.g., etcd).",
        type: "string",
      },
      servedVersions: {
        description:
          "The API server can serve these versions. DecodableVersions must include all ServedVersions.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    type: "object",
  },
  "io.k8s.api.apiserverinternal.v1alpha1.StorageVersion": {
    description: "Storage version of a specific resource.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "The name is <group>.<resource>.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.apiserverinternal.v1alpha1.StorageVersionSpec",
        description:
          "Spec is an empty spec. It is here to comply with Kubernetes API style.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.apiserverinternal.v1alpha1.StorageVersionStatus",
        description:
          "API server instances report the version they can decode and the version they encode objects to when persisting objects in the backend.",
      },
    },
    required: ["spec", "status"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "internal.apiserver.k8s.io",
        kind: "StorageVersion",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.apiserverinternal.v1alpha1.StorageVersionCondition": {
    description:
      "Describes the state of the storageVersion at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "A human readable message indicating details about the transition.",
        type: "string",
      },
      observedGeneration: {
        description:
          "If set, this represents the .metadata.generation that the condition was set based upon.",
        format: "int64",
        type: "integer",
      },
      reason: {
        description: "The reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of the condition.",
        type: "string",
      },
    },
    required: ["type", "status", "reason"],
    type: "object",
  },
  "io.k8s.api.apiserverinternal.v1alpha1.StorageVersionList": {
    description: "A list of StorageVersions.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items holds a list of StorageVersion",
        items: {
          $ref: "#/definitions/io.k8s.api.apiserverinternal.v1alpha1.StorageVersion",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "internal.apiserver.k8s.io",
        kind: "StorageVersionList",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.apiserverinternal.v1alpha1.StorageVersionSpec": {
    description: "StorageVersionSpec is an empty spec.",
    type: "object",
  },
  "io.k8s.api.apiserverinternal.v1alpha1.StorageVersionStatus": {
    description:
      "API server instances report the versions they can decode and the version they encode objects to when persisting objects in the backend.",
    properties: {
      commonEncodingVersion: {
        description:
          "If all API server instances agree on the same encoding storage version, then this field is set to that version. Otherwise this field is left empty. API servers should finish updating its storageVersionStatus entry before serving write operations, so that this field will be in sync with the reality.",
        type: "string",
      },
      conditions: {
        description:
          "The latest available observations of the storageVersion's state.",
        items: {
          $ref: "#/definitions/io.k8s.api.apiserverinternal.v1alpha1.StorageVersionCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
      },
      storageVersions: {
        description: "The reported versions per API server instance.",
        items: {
          $ref: "#/definitions/io.k8s.api.apiserverinternal.v1alpha1.ServerStorageVersion",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["apiServerID"],
        "x-kubernetes-list-type": "map",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.ControllerRevision": {
    description:
      "ControllerRevision implements an immutable snapshot of state data. Clients are responsible for serializing and deserializing the objects that contain their internal state. Once a ControllerRevision has been successfully created, it can not be updated. The API Server will fail validation of all requests that attempt to mutate the Data field. ControllerRevisions may, however, be deleted. Note that, due to its use by both the DaemonSet and StatefulSet controllers for update and rollback, this object is beta. However, it may be subject to name and representation changes in future releases, and clients should not depend on its stability. It is primarily for internal use by controllers.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      data: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.runtime.RawExtension",
        description: "Data is the serialized representation of the state.",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      revision: {
        description:
          "Revision indicates the revision of the state represented by Data.",
        format: "int64",
        type: "integer",
      },
    },
    required: ["revision"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "ControllerRevision",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.ControllerRevisionList": {
    description:
      "ControllerRevisionList is a resource containing a list of ControllerRevision objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of ControllerRevisions",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.ControllerRevision",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "ControllerRevisionList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.DaemonSet": {
    description: "DaemonSet represents the configuration of a daemon set.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.apps.v1.DaemonSetSpec",
        description:
          "The desired behavior of this daemon set. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.apps.v1.DaemonSetStatus",
        description:
          "The current status of this daemon set. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "DaemonSet",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.DaemonSetCondition": {
    description:
      "DaemonSetCondition describes the state of a DaemonSet at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "A human readable message indicating details about the transition.",
        type: "string",
      },
      reason: {
        description: "The reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of DaemonSet condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.apps.v1.DaemonSetList": {
    description: "DaemonSetList is a collection of daemon sets.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "A list of daemon sets.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.DaemonSet",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "DaemonSetList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.DaemonSetSpec": {
    description: "DaemonSetSpec is the specification of a daemon set.",
    properties: {
      minReadySeconds: {
        description:
          "The minimum number of seconds for which a newly created DaemonSet pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready).",
        format: "int32",
        type: "integer",
      },
      revisionHistoryLimit: {
        description:
          "The number of old history to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10.",
        format: "int32",
        type: "integer",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "A label query over pods that are managed by the daemon set. Must match in order to be controlled. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          'An object that describes the pod that will be created. The DaemonSet will create exactly one copy of this pod on every node that matches the template\'s node selector (or on every node if no node selector is specified). The only allowed template.spec.restartPolicy value is "Always". More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template',
      },
      updateStrategy: {
        $ref: "#/definitions/io.k8s.api.apps.v1.DaemonSetUpdateStrategy",
        description:
          "An update strategy to replace existing DaemonSet pods with new pods.",
      },
    },
    required: ["selector", "template"],
    type: "object",
  },
  "io.k8s.api.apps.v1.DaemonSetStatus": {
    description:
      "DaemonSetStatus represents the current status of a daemon set.",
    properties: {
      collisionCount: {
        description:
          "Count of hash collisions for the DaemonSet. The DaemonSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision.",
        format: "int32",
        type: "integer",
      },
      conditions: {
        description:
          "Represents the latest available observations of a DaemonSet's current state.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.DaemonSetCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      currentNumberScheduled: {
        description:
          "The number of nodes that are running at least 1 daemon pod and are supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",
        format: "int32",
        type: "integer",
      },
      desiredNumberScheduled: {
        description:
          "The total number of nodes that should be running the daemon pod (including nodes correctly running the daemon pod). More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",
        format: "int32",
        type: "integer",
      },
      numberAvailable: {
        description:
          "The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and available (ready for at least spec.minReadySeconds)",
        format: "int32",
        type: "integer",
      },
      numberMisscheduled: {
        description:
          "The number of nodes that are running the daemon pod, but are not supposed to run the daemon pod. More info: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/",
        format: "int32",
        type: "integer",
      },
      numberReady: {
        description:
          "numberReady is the number of nodes that should be running the daemon pod and have one or more of the daemon pod running with a Ready Condition.",
        format: "int32",
        type: "integer",
      },
      numberUnavailable: {
        description:
          "The number of nodes that should be running the daemon pod and have none of the daemon pod running and available (ready for at least spec.minReadySeconds)",
        format: "int32",
        type: "integer",
      },
      observedGeneration: {
        description:
          "The most recent generation observed by the daemon set controller.",
        format: "int64",
        type: "integer",
      },
      updatedNumberScheduled: {
        description:
          "The total number of nodes that are running updated daemon pod",
        format: "int32",
        type: "integer",
      },
    },
    required: [
      "currentNumberScheduled",
      "numberMisscheduled",
      "desiredNumberScheduled",
      "numberReady",
    ],
    type: "object",
  },
  "io.k8s.api.apps.v1.DaemonSetUpdateStrategy": {
    description:
      "DaemonSetUpdateStrategy is a struct used to control the update strategy for a DaemonSet.",
    properties: {
      rollingUpdate: {
        $ref: "#/definitions/io.k8s.api.apps.v1.RollingUpdateDaemonSet",
        description:
          'Rolling update config params. Present only if type = "RollingUpdate".',
      },
      type: {
        description:
          'Type of daemon set update. Can be "RollingUpdate" or "OnDelete". Default is RollingUpdate.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.Deployment": {
    description:
      "Deployment enables declarative updates for Pods and ReplicaSets.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.apps.v1.DeploymentSpec",
        description: "Specification of the desired behavior of the Deployment.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.apps.v1.DeploymentStatus",
        description: "Most recently observed status of the Deployment.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "Deployment",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.DeploymentCondition": {
    description:
      "DeploymentCondition describes the state of a deployment at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transitioned from one status to another.",
      },
      lastUpdateTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "The last time this condition was updated.",
      },
      message: {
        description:
          "A human readable message indicating details about the transition.",
        type: "string",
      },
      reason: {
        description: "The reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of deployment condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.apps.v1.DeploymentList": {
    description: "DeploymentList is a list of Deployments.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of Deployments.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.Deployment",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "DeploymentList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.DeploymentSpec": {
    description:
      "DeploymentSpec is the specification of the desired behavior of the Deployment.",
    properties: {
      minReadySeconds: {
        description:
          "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)",
        format: "int32",
        type: "integer",
      },
      paused: {
        description: "Indicates that the deployment is paused.",
        type: "boolean",
      },
      progressDeadlineSeconds: {
        description:
          "The maximum time in seconds for a deployment to make progress before it is considered to be failed. The deployment controller will continue to process failed deployments and a condition with a ProgressDeadlineExceeded reason will be surfaced in the deployment status. Note that progress will not be estimated during the time a deployment is paused. Defaults to 600s.",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.",
        format: "int32",
        type: "integer",
      },
      revisionHistoryLimit: {
        description:
          "The number of old ReplicaSets to retain to allow rollback. This is a pointer to distinguish between explicit zero and not specified. Defaults to 10.",
        format: "int32",
        type: "integer",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "Label selector for pods. Existing ReplicaSets whose pods are selected by this will be the ones affected by this deployment. It must match the pod template's labels.",
      },
      strategy: {
        $ref: "#/definitions/io.k8s.api.apps.v1.DeploymentStrategy",
        description:
          "The deployment strategy to use to replace existing pods with new ones.",
        "x-kubernetes-patch-strategy": "retainKeys",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          'Template describes the pods that will be created. The only allowed template.spec.restartPolicy value is "Always".',
      },
    },
    required: ["selector", "template"],
    type: "object",
  },
  "io.k8s.api.apps.v1.DeploymentStatus": {
    description:
      "DeploymentStatus is the most recently observed status of the Deployment.",
    properties: {
      availableReplicas: {
        description:
          "Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.",
        format: "int32",
        type: "integer",
      },
      collisionCount: {
        description:
          "Count of hash collisions for the Deployment. The Deployment controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ReplicaSet.",
        format: "int32",
        type: "integer",
      },
      conditions: {
        description:
          "Represents the latest available observations of a deployment's current state.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.DeploymentCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      observedGeneration: {
        description: "The generation observed by the deployment controller.",
        format: "int64",
        type: "integer",
      },
      readyReplicas: {
        description:
          "readyReplicas is the number of pods targeted by this Deployment with a Ready Condition.",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "Total number of non-terminated pods targeted by this deployment (their labels match the selector).",
        format: "int32",
        type: "integer",
      },
      unavailableReplicas: {
        description:
          "Total number of unavailable pods targeted by this deployment. This is the total number of pods that are still required for the deployment to have 100% available capacity. They may either be pods that are running but not yet available or pods that still have not been created.",
        format: "int32",
        type: "integer",
      },
      updatedReplicas: {
        description:
          "Total number of non-terminated pods targeted by this deployment that have the desired template spec.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.DeploymentStrategy": {
    description:
      "DeploymentStrategy describes how to replace existing pods with new ones.",
    properties: {
      rollingUpdate: {
        $ref: "#/definitions/io.k8s.api.apps.v1.RollingUpdateDeployment",
        description:
          "Rolling update config params. Present only if DeploymentStrategyType = RollingUpdate.",
      },
      type: {
        description:
          'Type of deployment. Can be "Recreate" or "RollingUpdate". Default is RollingUpdate.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.ReplicaSet": {
    description:
      "ReplicaSet ensures that a specified number of pod replicas are running at any given time.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "If the Labels of a ReplicaSet are empty, they are defaulted to be the same as the Pod(s) that the ReplicaSet manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.apps.v1.ReplicaSetSpec",
        description:
          "Spec defines the specification of the desired behavior of the ReplicaSet. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.apps.v1.ReplicaSetStatus",
        description:
          "Status is the most recently observed status of the ReplicaSet. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "ReplicaSet",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.ReplicaSetCondition": {
    description:
      "ReplicaSetCondition describes the state of a replica set at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "The last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "A human readable message indicating details about the transition.",
        type: "string",
      },
      reason: {
        description: "The reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of replica set condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.apps.v1.ReplicaSetList": {
    description: "ReplicaSetList is a collection of ReplicaSets.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "List of ReplicaSets. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.ReplicaSet",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "ReplicaSetList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.ReplicaSetSpec": {
    description: "ReplicaSetSpec is the specification of a ReplicaSet.",
    properties: {
      minReadySeconds: {
        description:
          "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#what-is-a-replicationcontroller",
        format: "int32",
        type: "integer",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "Selector is a label query over pods that should match the replica count. Label keys and values that must match in order to be controlled by this replica set. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          "Template is the object that describes the pod that will be created if insufficient replicas are detected. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template",
      },
    },
    required: ["selector"],
    type: "object",
  },
  "io.k8s.api.apps.v1.ReplicaSetStatus": {
    description:
      "ReplicaSetStatus represents the current status of a ReplicaSet.",
    properties: {
      availableReplicas: {
        description:
          "The number of available replicas (ready for at least minReadySeconds) for this replica set.",
        format: "int32",
        type: "integer",
      },
      conditions: {
        description:
          "Represents the latest available observations of a replica set's current state.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.ReplicaSetCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      fullyLabeledReplicas: {
        description:
          "The number of pods that have labels matching the labels of the pod template of the replicaset.",
        format: "int32",
        type: "integer",
      },
      observedGeneration: {
        description:
          "ObservedGeneration reflects the generation of the most recently observed ReplicaSet.",
        format: "int64",
        type: "integer",
      },
      readyReplicas: {
        description:
          "readyReplicas is the number of pods targeted by this ReplicaSet with a Ready Condition.",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "Replicas is the most recently observed number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/#what-is-a-replicationcontroller",
        format: "int32",
        type: "integer",
      },
    },
    required: ["replicas"],
    type: "object",
  },
  "io.k8s.api.apps.v1.RollingUpdateDaemonSet": {
    description:
      "Spec to control the desired behavior of daemon set rolling update.",
    properties: {
      maxSurge: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "The maximum number of nodes with an existing available DaemonSet pod that can have an updated DaemonSet pod during during an update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up to a minimum of 1. Default value is 0. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their a new pod created before the old pod is marked as deleted. The update starts by launching new pods on 30% of nodes. Once an updated pod is available (Ready for at least minReadySeconds) the old DaemonSet pod on that node is marked deleted. If the old pod becomes unavailable for any reason (Ready transitions to false, is evicted, or is drained) an updated pod is immediatedly created on that node without considering surge limits. Allowing surge implies the possibility that the resources consumed by the daemonset on any given node can double if the readiness check fails, and so resource intensive daemonsets should take into account that they may cause evictions during disruption.",
      },
      maxUnavailable: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "The maximum number of DaemonSet pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of total number of DaemonSet pods at the start of the update (ex: 10%). Absolute number is calculated from percentage by rounding up. This cannot be 0 if MaxSurge is 0 Default value is 1. Example: when this is set to 30%, at most 30% of the total number of nodes that should be running the daemon pod (i.e. status.desiredNumberScheduled) can have their pods stopped for an update at any given time. The update starts by stopping at most 30% of those DaemonSet pods and then brings up new DaemonSet pods in their place. Once the new pods are available, it then proceeds onto other DaemonSet pods, thus ensuring that at least 70% of original number of DaemonSet pods are available at all times during the update.",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.RollingUpdateDeployment": {
    description: "Spec to control the desired behavior of rolling update.",
    properties: {
      maxSurge: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "The maximum number of pods that can be scheduled above the desired number of pods. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). This can not be 0 if MaxUnavailable is 0. Absolute number is calculated from percentage by rounding up. Defaults to 25%. Example: when this is set to 30%, the new ReplicaSet can be scaled up immediately when the rolling update starts, such that the total number of old and new pods do not exceed 130% of desired pods. Once old pods have been killed, new ReplicaSet can be scaled up further, ensuring that total number of pods running at any time during the update is at most 130% of desired pods.",
      },
      maxUnavailable: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding down. This can not be 0 if MaxSurge is 0. Defaults to 25%. Example: when this is set to 30%, the old ReplicaSet can be scaled down to 70% of desired pods immediately when the rolling update starts. Once new pods are ready, old ReplicaSet can be scaled down further, followed by scaling up the new ReplicaSet, ensuring that the total number of pods available at all times during the update is at least 70% of desired pods.",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.RollingUpdateStatefulSetStrategy": {
    description:
      "RollingUpdateStatefulSetStrategy is used to communicate parameter for RollingUpdateStatefulSetStrategyType.",
    properties: {
      maxUnavailable: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "The maximum number of pods that can be unavailable during the update. Value can be an absolute number (ex: 5) or a percentage of desired pods (ex: 10%). Absolute number is calculated from percentage by rounding up. This can not be 0. Defaults to 1. This field is alpha-level and is only honored by servers that enable the MaxUnavailableStatefulSet feature. The field applies to all pods in the range 0 to Replicas-1. That means if there is any unavailable pod in the range 0 to Replicas-1, it will be counted towards MaxUnavailable.",
      },
      partition: {
        description:
          "Partition indicates the ordinal at which the StatefulSet should be partitioned for updates. During a rolling update, all pods from ordinal Replicas-1 to Partition are updated. All pods from ordinal Partition-1 to 0 remain untouched. This is helpful in being able to do a canary based deployment. The default value is 0.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.StatefulSet": {
    description:
      "StatefulSet represents a set of pods with consistent identities. Identities are defined as:\n  - Network: A single stable DNS and hostname.\n  - Storage: As many VolumeClaims as requested.\n\nThe StatefulSet guarantees that a given network identity will always map to the same storage identity.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSetSpec",
        description: "Spec defines the desired identities of pods in this set.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSetStatus",
        description:
          "Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "StatefulSet",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.StatefulSetCondition": {
    description:
      "StatefulSetCondition describes the state of a statefulset at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "A human readable message indicating details about the transition.",
        type: "string",
      },
      reason: {
        description: "The reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of statefulset condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.apps.v1.StatefulSetList": {
    description: "StatefulSetList is a collection of StatefulSets.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of stateful sets.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSet",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apps",
        kind: "StatefulSetList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.apps.v1.StatefulSetOrdinals": {
    description:
      "StatefulSetOrdinals describes the policy used for replica ordinal assignment in this StatefulSet.",
    properties: {
      start: {
        description:
          "start is the number representing the first replica's index. It may be used to number replicas from an alternate index (eg: 1-indexed) over the default 0-indexed names, or to orchestrate progressive movement of replicas from one StatefulSet to another. If set, replica indices will be in the range:\n  [.spec.ordinals.start, .spec.ordinals.start + .spec.replicas).\nIf unset, defaults to 0. Replica indices will be in the range:\n  [0, .spec.replicas).",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.StatefulSetPersistentVolumeClaimRetentionPolicy": {
    description:
      "StatefulSetPersistentVolumeClaimRetentionPolicy describes the policy used for PVCs created from the StatefulSet VolumeClaimTemplates.",
    properties: {
      whenDeleted: {
        description:
          "WhenDeleted specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is deleted. The default policy of `Retain` causes PVCs to not be affected by StatefulSet deletion. The `Delete` policy causes those PVCs to be deleted.",
        type: "string",
      },
      whenScaled: {
        description:
          "WhenScaled specifies what happens to PVCs created from StatefulSet VolumeClaimTemplates when the StatefulSet is scaled down. The default policy of `Retain` causes PVCs to not be affected by a scaledown. The `Delete` policy causes the associated PVCs for any excess pods above the replica count to be deleted.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.apps.v1.StatefulSetSpec": {
    description: "A StatefulSetSpec is the specification of a StatefulSet.",
    properties: {
      minReadySeconds: {
        description:
          "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)",
        format: "int32",
        type: "integer",
      },
      ordinals: {
        $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSetOrdinals",
        description:
          'ordinals controls the numbering of replica indices in a StatefulSet. The default ordinals behavior assigns a "0" index to the first replica and increments the index by one for each additional replica requested. Using the ordinals field requires the StatefulSetStartOrdinal feature gate to be enabled, which is beta.',
      },
      persistentVolumeClaimRetentionPolicy: {
        $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSetPersistentVolumeClaimRetentionPolicy",
        description:
          "persistentVolumeClaimRetentionPolicy describes the lifecycle of persistent volume claims created from volumeClaimTemplates. By default, all persistent volume claims are created as needed and retained until manually deleted. This policy allows the lifecycle to be altered, for example by deleting persistent volume claims when their stateful set is deleted, or when their pod is scaled down. This requires the StatefulSetAutoDeletePVC feature gate to be enabled, which is alpha.  +optional",
      },
      podManagementPolicy: {
        description:
          "podManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down. The default policy is `OrderedReady`, where pods are created in increasing order (pod-0, then pod-1, etc) and the controller will wait until each pod is ready before continuing. When scaling down, the pods are removed in the opposite order. The alternative policy is `Parallel` which will create pods in parallel to match the desired scale without waiting, and on scale down will delete all pods at once.",
        type: "string",
      },
      replicas: {
        description:
          "replicas is the desired number of replicas of the given Template. These are replicas in the sense that they are instantiations of the same Template, but individual replicas also have a consistent identity. If unspecified, defaults to 1.",
        format: "int32",
        type: "integer",
      },
      revisionHistoryLimit: {
        description:
          "revisionHistoryLimit is the maximum number of revisions that will be maintained in the StatefulSet's revision history. The revision history consists of all revisions not represented by a currently applied StatefulSetSpec version. The default value is 10.",
        format: "int32",
        type: "integer",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "selector is a label query over pods that should match the replica count. It must match the pod template's labels. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors",
      },
      serviceName: {
        description:
          'serviceName is the name of the service that governs this StatefulSet. This service must exist before the StatefulSet, and is responsible for the network identity of the set. Pods get DNS/hostnames that follow the pattern: pod-specific-string.serviceName.default.svc.cluster.local where "pod-specific-string" is managed by the StatefulSet controller.',
        type: "string",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          'template is the object that describes the pod that will be created if insufficient replicas are detected. Each pod stamped out by the StatefulSet will fulfill this Template, but have a unique identity from the rest of the StatefulSet. Each pod will be named with the format <statefulsetname>-<podindex>. For example, a pod in a StatefulSet named "web" with index number "3" would be named "web-3". The only allowed template.spec.restartPolicy value is "Always".',
      },
      updateStrategy: {
        $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSetUpdateStrategy",
        description:
          "updateStrategy indicates the StatefulSetUpdateStrategy that will be employed to update Pods in the StatefulSet when a revision is made to Template.",
      },
      volumeClaimTemplates: {
        description:
          "volumeClaimTemplates is a list of claims that pods are allowed to reference. The StatefulSet controller is responsible for mapping network identities to claims in a way that maintains the identity of a pod. Every claim in this list must have at least one matching (by name) volumeMount in one container in the template. A claim in this list takes precedence over any volumes in the template, with the same name.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaim",
        },
        type: "array",
      },
    },
    required: ["selector", "template", "serviceName"],
    type: "object",
  },
  "io.k8s.api.apps.v1.StatefulSetStatus": {
    description:
      "StatefulSetStatus represents the current state of a StatefulSet.",
    properties: {
      availableReplicas: {
        description:
          "Total number of available pods (ready for at least minReadySeconds) targeted by this statefulset.",
        format: "int32",
        type: "integer",
      },
      collisionCount: {
        description:
          "collisionCount is the count of hash collisions for the StatefulSet. The StatefulSet controller uses this field as a collision avoidance mechanism when it needs to create the name for the newest ControllerRevision.",
        format: "int32",
        type: "integer",
      },
      conditions: {
        description:
          "Represents the latest available observations of a statefulset's current state.",
        items: {
          $ref: "#/definitions/io.k8s.api.apps.v1.StatefulSetCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      currentReplicas: {
        description:
          "currentReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by currentRevision.",
        format: "int32",
        type: "integer",
      },
      currentRevision: {
        description:
          "currentRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas).",
        type: "string",
      },
      observedGeneration: {
        description:
          "observedGeneration is the most recent generation observed for this StatefulSet. It corresponds to the StatefulSet's generation, which is updated on mutation by the API Server.",
        format: "int64",
        type: "integer",
      },
      readyReplicas: {
        description:
          "readyReplicas is the number of pods created for this StatefulSet with a Ready Condition.",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "replicas is the number of Pods created by the StatefulSet controller.",
        format: "int32",
        type: "integer",
      },
      updateRevision: {
        description:
          "updateRevision, if not empty, indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas)",
        type: "string",
      },
      updatedReplicas: {
        description:
          "updatedReplicas is the number of Pods created by the StatefulSet controller from the StatefulSet version indicated by updateRevision.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["replicas"],
    type: "object",
  },
  "io.k8s.api.apps.v1.StatefulSetUpdateStrategy": {
    description:
      "StatefulSetUpdateStrategy indicates the strategy that the StatefulSet controller will use to perform updates. It includes any additional parameters necessary to perform the update for the indicated strategy.",
    properties: {
      rollingUpdate: {
        $ref: "#/definitions/io.k8s.api.apps.v1.RollingUpdateStatefulSetStrategy",
        description:
          "RollingUpdate is used to communicate parameters when Type is RollingUpdateStatefulSetStrategyType.",
      },
      type: {
        description:
          "Type indicates the type of the StatefulSetUpdateStrategy. Default is RollingUpdate.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1.BoundObjectReference": {
    description:
      "BoundObjectReference is a reference to an object that a token is bound to.",
    properties: {
      apiVersion: {
        description: "API version of the referent.",
        type: "string",
      },
      kind: {
        description:
          "Kind of the referent. Valid kinds are 'Pod' and 'Secret'.",
        type: "string",
      },
      name: {
        description: "Name of the referent.",
        type: "string",
      },
      uid: {
        description: "UID of the referent.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1.SelfSubjectReview": {
    description:
      "SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.SelfSubjectReviewStatus",
        description:
          "Status is filled in by the server with the user attributes.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authentication.k8s.io",
        kind: "SelfSubjectReview",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authentication.v1.SelfSubjectReviewStatus": {
    description:
      "SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.",
    properties: {
      userInfo: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.UserInfo",
        description: "User attributes of the user making this request.",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1.TokenRequest": {
    description: "TokenRequest requests a token for a given service account.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.TokenRequestSpec",
        description: "Spec holds information about the request being evaluated",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.TokenRequestStatus",
        description:
          "Status is filled in by the server and indicates whether the token can be authenticated.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authentication.k8s.io",
        kind: "TokenRequest",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authentication.v1.TokenRequestSpec": {
    description:
      "TokenRequestSpec contains client provided parameters of a token request.",
    properties: {
      audiences: {
        description:
          "Audiences are the intendend audiences of the token. A recipient of a token must identify themself with an identifier in the list of audiences of the token, and otherwise should reject the token. A token issued for multiple audiences may be used to authenticate against any of the audiences listed but implies a high degree of trust between the target audiences.",
        items: {
          type: "string",
        },
        type: "array",
      },
      boundObjectRef: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.BoundObjectReference",
        description:
          "BoundObjectRef is a reference to an object that the token will be bound to. The token will only be valid for as long as the bound object exists. NOTE: The API server's TokenReview endpoint will validate the BoundObjectRef, but other audiences may not. Keep ExpirationSeconds small if you want prompt revocation.",
      },
      expirationSeconds: {
        description:
          "ExpirationSeconds is the requested duration of validity of the request. The token issuer may return a token with a different validity duration so a client needs to check the 'expiration' field in a response.",
        format: "int64",
        type: "integer",
      },
    },
    required: ["audiences"],
    type: "object",
  },
  "io.k8s.api.authentication.v1.TokenRequestStatus": {
    description: "TokenRequestStatus is the result of a token request.",
    properties: {
      expirationTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "ExpirationTimestamp is the time of expiration of the returned token.",
      },
      token: {
        description: "Token is the opaque bearer token.",
        type: "string",
      },
    },
    required: ["token", "expirationTimestamp"],
    type: "object",
  },
  "io.k8s.api.authentication.v1.TokenReview": {
    description:
      "TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.TokenReviewSpec",
        description: "Spec holds information about the request being evaluated",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.TokenReviewStatus",
        description:
          "Status is filled in by the server and indicates whether the request can be authenticated.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authentication.k8s.io",
        kind: "TokenReview",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authentication.v1.TokenReviewSpec": {
    description:
      "TokenReviewSpec is a description of the token authentication request.",
    properties: {
      audiences: {
        description:
          "Audiences is a list of the identifiers that the resource server presented with the token identifies as. Audience-aware token authenticators will verify that the token was intended for at least one of the audiences in this list. If no audiences are provided, the audience will default to the audience of the Kubernetes apiserver.",
        items: {
          type: "string",
        },
        type: "array",
      },
      token: {
        description: "Token is the opaque bearer token.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1.TokenReviewStatus": {
    description:
      "TokenReviewStatus is the result of the token authentication request.",
    properties: {
      audiences: {
        description:
          'Audiences are audience identifiers chosen by the authenticator that are compatible with both the TokenReview and token. An identifier is any identifier in the intersection of the TokenReviewSpec audiences and the token\'s audiences. A client of the TokenReview API that sets the spec.audiences field should validate that a compatible audience identifier is returned in the status.audiences field to ensure that the TokenReview server is audience aware. If a TokenReview returns an empty status.audience field where status.authenticated is "true", the token is valid against the audience of the Kubernetes API server.',
        items: {
          type: "string",
        },
        type: "array",
      },
      authenticated: {
        description:
          "Authenticated indicates that the token was associated with a known user.",
        type: "boolean",
      },
      error: {
        description: "Error indicates that the token couldn't be checked",
        type: "string",
      },
      user: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.UserInfo",
        description: "User is the UserInfo associated with the provided token.",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1.UserInfo": {
    description:
      "UserInfo holds the information about the user needed to implement the user.Info interface.",
    properties: {
      extra: {
        additionalProperties: {
          items: {
            type: "string",
          },
          type: "array",
        },
        description:
          "Any additional information provided by the authenticator.",
        type: "object",
      },
      groups: {
        description: "The names of groups this user is a part of.",
        items: {
          type: "string",
        },
        type: "array",
      },
      uid: {
        description:
          "A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.",
        type: "string",
      },
      username: {
        description:
          "The name that uniquely identifies this user among all active users.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1alpha1.SelfSubjectReview": {
    description:
      "SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authentication.v1alpha1.SelfSubjectReviewStatus",
        description:
          "Status is filled in by the server with the user attributes.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authentication.k8s.io",
        kind: "SelfSubjectReview",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.authentication.v1alpha1.SelfSubjectReviewStatus": {
    description:
      "SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.",
    properties: {
      userInfo: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.UserInfo",
        description: "User attributes of the user making this request.",
      },
    },
    type: "object",
  },
  "io.k8s.api.authentication.v1beta1.SelfSubjectReview": {
    description:
      "SelfSubjectReview contains the user information that the kube-apiserver has about the user making this request. When using impersonation, users will receive the user info of the user being impersonated.  If impersonation or request header authentication is used, any extra keys will have their case ignored and returned as lowercase.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authentication.v1beta1.SelfSubjectReviewStatus",
        description:
          "Status is filled in by the server with the user attributes.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authentication.k8s.io",
        kind: "SelfSubjectReview",
        version: "v1beta1",
      },
    ],
  },
  "io.k8s.api.authentication.v1beta1.SelfSubjectReviewStatus": {
    description:
      "SelfSubjectReviewStatus is filled by the kube-apiserver and sent back to a user.",
    properties: {
      userInfo: {
        $ref: "#/definitions/io.k8s.api.authentication.v1.UserInfo",
        description: "User attributes of the user making this request.",
      },
    },
    type: "object",
  },
  "io.k8s.api.authorization.v1.LocalSubjectAccessReview": {
    description:
      "LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace. Having a namespace scoped resource makes it much easier to grant namespace scoped policy that includes permissions checking.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SubjectAccessReviewSpec",
        description:
          "Spec holds information about the request being evaluated.  spec.namespace must be equal to the namespace you made the request against.  If empty, it is defaulted.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SubjectAccessReviewStatus",
        description:
          "Status is filled in by the server and indicates whether the request is allowed or not",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authorization.k8s.io",
        kind: "LocalSubjectAccessReview",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authorization.v1.NonResourceAttributes": {
    description:
      "NonResourceAttributes includes the authorization attributes available for non-resource requests to the Authorizer interface",
    properties: {
      path: {
        description: "Path is the URL path of the request",
        type: "string",
      },
      verb: {
        description: "Verb is the standard HTTP verb",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authorization.v1.NonResourceRule": {
    description:
      "NonResourceRule holds information that describes a rule for the non-resource",
    properties: {
      nonResourceURLs: {
        description:
          'NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path.  "*" means all.',
        items: {
          type: "string",
        },
        type: "array",
      },
      verbs: {
        description:
          'Verb is a list of kubernetes non-resource API verbs, like: get, post, put, delete, patch, head, options.  "*" means all.',
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["verbs"],
    type: "object",
  },
  "io.k8s.api.authorization.v1.ResourceAttributes": {
    description:
      "ResourceAttributes includes the authorization attributes available for resource requests to the Authorizer interface",
    properties: {
      group: {
        description: 'Group is the API Group of the Resource.  "*" means all.',
        type: "string",
      },
      name: {
        description:
          'Name is the name of the resource being requested for a "get" or deleted for a "delete". "" (empty) means all.',
        type: "string",
      },
      namespace: {
        description:
          'Namespace is the namespace of the action being requested.  Currently, there is no distinction between no namespace and all namespaces "" (empty) is defaulted for LocalSubjectAccessReviews "" (empty) is empty for cluster-scoped resources "" (empty) means "all" for namespace scoped resources from a SubjectAccessReview or SelfSubjectAccessReview',
        type: "string",
      },
      resource: {
        description:
          'Resource is one of the existing resource types.  "*" means all.',
        type: "string",
      },
      subresource: {
        description:
          'Subresource is one of the existing resource types.  "" means none.',
        type: "string",
      },
      verb: {
        description:
          'Verb is a kubernetes resource API verb, like: get, list, watch, create, update, delete, proxy.  "*" means all.',
        type: "string",
      },
      version: {
        description:
          'Version is the API Version of the Resource.  "*" means all.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authorization.v1.ResourceRule": {
    description:
      "ResourceRule is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.",
    properties: {
      apiGroups: {
        description:
          'APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed.  "*" means all.',
        items: {
          type: "string",
        },
        type: "array",
      },
      resourceNames: {
        description:
          'ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.  "*" means all.',
        items: {
          type: "string",
        },
        type: "array",
      },
      resources: {
        description:
          'Resources is a list of resources this rule applies to.  "*" means all in the specified apiGroups.\n "*/foo" represents the subresource \'foo\' for all resources in the specified apiGroups.',
        items: {
          type: "string",
        },
        type: "array",
      },
      verbs: {
        description:
          'Verb is a list of kubernetes resource API verbs, like: get, list, watch, create, update, delete, proxy.  "*" means all.',
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["verbs"],
    type: "object",
  },
  "io.k8s.api.authorization.v1.SelfSubjectAccessReview": {
    description:
      'SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SelfSubjectAccessReviewSpec",
        description:
          "Spec holds information about the request being evaluated.  user and groups must be empty",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SubjectAccessReviewStatus",
        description:
          "Status is filled in by the server and indicates whether the request is allowed or not",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authorization.k8s.io",
        kind: "SelfSubjectAccessReview",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authorization.v1.SelfSubjectAccessReviewSpec": {
    description:
      "SelfSubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set",
    properties: {
      nonResourceAttributes: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.NonResourceAttributes",
        description:
          "NonResourceAttributes describes information for a non-resource access request",
      },
      resourceAttributes: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.ResourceAttributes",
        description:
          "ResourceAuthorizationAttributes describes information for a resource access request",
      },
    },
    type: "object",
  },
  "io.k8s.api.authorization.v1.SelfSubjectRulesReview": {
    description:
      "SelfSubjectRulesReview enumerates the set of actions the current user can perform within a namespace. The returned list of actions may be incomplete depending on the server's authorization mode, and any errors experienced during the evaluation. SelfSubjectRulesReview should be used by UIs to show/hide actions, or to quickly let an end user reason about their permissions. It should NOT Be used by external systems to drive authorization decisions as this raises confused deputy, cache lifetime/revocation, and correctness concerns. SubjectAccessReview, and LocalAccessReview are the correct way to defer authorization decisions to the API server.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SelfSubjectRulesReviewSpec",
        description:
          "Spec holds information about the request being evaluated.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SubjectRulesReviewStatus",
        description:
          "Status is filled in by the server and indicates the set of actions a user can perform.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authorization.k8s.io",
        kind: "SelfSubjectRulesReview",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authorization.v1.SelfSubjectRulesReviewSpec": {
    description:
      "SelfSubjectRulesReviewSpec defines the specification for SelfSubjectRulesReview.",
    properties: {
      namespace: {
        description: "Namespace to evaluate rules for. Required.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authorization.v1.SubjectAccessReview": {
    description:
      "SubjectAccessReview checks whether or not a user or group can perform an action.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SubjectAccessReviewSpec",
        description: "Spec holds information about the request being evaluated",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.SubjectAccessReviewStatus",
        description:
          "Status is filled in by the server and indicates whether the request is allowed or not",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "authorization.k8s.io",
        kind: "SubjectAccessReview",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.authorization.v1.SubjectAccessReviewSpec": {
    description:
      "SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set",
    properties: {
      extra: {
        additionalProperties: {
          items: {
            type: "string",
          },
          type: "array",
        },
        description:
          "Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.",
        type: "object",
      },
      groups: {
        description: "Groups is the groups you're testing for.",
        items: {
          type: "string",
        },
        type: "array",
      },
      nonResourceAttributes: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.NonResourceAttributes",
        description:
          "NonResourceAttributes describes information for a non-resource access request",
      },
      resourceAttributes: {
        $ref: "#/definitions/io.k8s.api.authorization.v1.ResourceAttributes",
        description:
          "ResourceAuthorizationAttributes describes information for a resource access request",
      },
      uid: {
        description: "UID information about the requesting user.",
        type: "string",
      },
      user: {
        description:
          'User is the user you\'re testing for. If you specify "User" but not "Groups", then is it interpreted as "What if User were not a member of any groups',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.authorization.v1.SubjectAccessReviewStatus": {
    description: "SubjectAccessReviewStatus",
    properties: {
      allowed: {
        description:
          "Allowed is required. True if the action would be allowed, false otherwise.",
        type: "boolean",
      },
      denied: {
        description:
          "Denied is optional. True if the action would be denied, otherwise false. If both allowed is false and denied is false, then the authorizer has no opinion on whether to authorize the action. Denied may not be true if Allowed is true.",
        type: "boolean",
      },
      evaluationError: {
        description:
          "EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.",
        type: "string",
      },
      reason: {
        description:
          "Reason is optional.  It indicates why a request was allowed or denied.",
        type: "string",
      },
    },
    required: ["allowed"],
    type: "object",
  },
  "io.k8s.api.authorization.v1.SubjectRulesReviewStatus": {
    description:
      "SubjectRulesReviewStatus contains the result of a rules check. This check can be incomplete depending on the set of authorizers the server is configured with and any errors experienced during evaluation. Because authorization rules are additive, if a rule appears in a list it's safe to assume the subject has that permission, even if that list is incomplete.",
    properties: {
      evaluationError: {
        description:
          "EvaluationError can appear in combination with Rules. It indicates an error occurred during rule evaluation, such as an authorizer that doesn't support rule evaluation, and that ResourceRules and/or NonResourceRules may be incomplete.",
        type: "string",
      },
      incomplete: {
        description:
          "Incomplete is true when the rules returned by this call are incomplete. This is most commonly encountered when an authorizer, such as an external authorizer, doesn't support rules evaluation.",
        type: "boolean",
      },
      nonResourceRules: {
        description:
          "NonResourceRules is the list of actions the subject is allowed to perform on non-resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.",
        items: {
          $ref: "#/definitions/io.k8s.api.authorization.v1.NonResourceRule",
        },
        type: "array",
      },
      resourceRules: {
        description:
          "ResourceRules is the list of actions the subject is allowed to perform on resources. The list ordering isn't significant, may contain duplicates, and possibly be incomplete.",
        items: {
          $ref: "#/definitions/io.k8s.api.authorization.v1.ResourceRule",
        },
        type: "array",
      },
    },
    required: ["resourceRules", "nonResourceRules", "incomplete"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v1.CrossVersionObjectReference": {
    description:
      "CrossVersionObjectReference contains enough information to let you identify the referred resource.",
    properties: {
      apiVersion: {
        description: "apiVersion is the API version of the referent",
        type: "string",
      },
      kind: {
        description:
          "kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      name: {
        description:
          "name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.autoscaling.v1.HorizontalPodAutoscaler": {
    description: "configuration of a horizontal pod autoscaler.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerSpec",
        description:
          "spec defines the behaviour of autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerStatus",
        description: "status is the current information about the autoscaler.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "autoscaling",
        kind: "HorizontalPodAutoscaler",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerList": {
    description: "list of horizontal pod autoscaler objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of horizontal pod autoscaler objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.autoscaling.v1.HorizontalPodAutoscaler",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "autoscaling",
        kind: "HorizontalPodAutoscalerList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerSpec": {
    description: "specification of a horizontal pod autoscaler.",
    properties: {
      maxReplicas: {
        description:
          "maxReplicas is the upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.",
        format: "int32",
        type: "integer",
      },
      minReplicas: {
        description:
          "minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available.",
        format: "int32",
        type: "integer",
      },
      scaleTargetRef: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v1.CrossVersionObjectReference",
        description:
          "reference to scaled resource; horizontal pod autoscaler will learn the current resource consumption and will set the desired number of pods by using its Scale subresource.",
      },
      targetCPUUtilizationPercentage: {
        description:
          "targetCPUUtilizationPercentage is the target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the default autoscaling policy will be used.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["scaleTargetRef", "maxReplicas"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerStatus": {
    description: "current status of a horizontal pod autoscaler",
    properties: {
      currentCPUUtilizationPercentage: {
        description:
          "currentCPUUtilizationPercentage is the current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.",
        format: "int32",
        type: "integer",
      },
      currentReplicas: {
        description:
          "currentReplicas is the current number of replicas of pods managed by this autoscaler.",
        format: "int32",
        type: "integer",
      },
      desiredReplicas: {
        description:
          "desiredReplicas is the  desired number of replicas of pods managed by this autoscaler.",
        format: "int32",
        type: "integer",
      },
      lastScaleTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.",
      },
      observedGeneration: {
        description:
          "observedGeneration is the most recent generation observed by this autoscaler.",
        format: "int64",
        type: "integer",
      },
    },
    required: ["currentReplicas", "desiredReplicas"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v1.Scale": {
    description: "Scale represents a scaling request for a resource.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v1.ScaleSpec",
        description:
          "spec defines the behavior of the scale. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v1.ScaleStatus",
        description:
          "status is the current status of the scale. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status. Read-only.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "autoscaling",
        kind: "Scale",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.autoscaling.v1.ScaleSpec": {
    description: "ScaleSpec describes the attributes of a scale subresource.",
    properties: {
      replicas: {
        description:
          "replicas is the desired number of instances for the scaled object.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.autoscaling.v1.ScaleStatus": {
    description:
      "ScaleStatus represents the current status of a scale subresource.",
    properties: {
      replicas: {
        description:
          "replicas is the actual number of observed instances of the scaled object.",
        format: "int32",
        type: "integer",
      },
      selector: {
        description:
          "selector is the label query over pods that should match the replicas count. This is same as the label selector but in the string format to avoid introspection by clients. The string will be in the same format as the query-param syntax. More info about label selectors: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/",
        type: "string",
      },
    },
    required: ["replicas"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ContainerResourceMetricSource": {
    description:
      'ContainerResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set.',
    properties: {
      container: {
        description:
          "container is the name of the container in the pods of the scaling target",
        type: "string",
      },
      name: {
        description: "name is the name of the resource in question.",
        type: "string",
      },
      target: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricTarget",
        description: "target specifies the target value for the given metric",
      },
    },
    required: ["name", "target", "container"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ContainerResourceMetricStatus": {
    description:
      'ContainerResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing a single container in each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.',
    properties: {
      container: {
        description:
          "container is the name of the container in the pods of the scaling target",
        type: "string",
      },
      current: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricValueStatus",
        description: "current contains the current value for the given metric",
      },
      name: {
        description: "name is the name of the resource in question.",
        type: "string",
      },
    },
    required: ["name", "current", "container"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.CrossVersionObjectReference": {
    description:
      "CrossVersionObjectReference contains enough information to let you identify the referred resource.",
    properties: {
      apiVersion: {
        description: "apiVersion is the API version of the referent",
        type: "string",
      },
      kind: {
        description:
          "kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      name: {
        description:
          "name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ExternalMetricSource": {
    description:
      "ExternalMetricSource indicates how to scale on a metric not associated with any Kubernetes object (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).",
    properties: {
      metric: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricIdentifier",
        description: "metric identifies the target metric by name and selector",
      },
      target: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricTarget",
        description: "target specifies the target value for the given metric",
      },
    },
    required: ["metric", "target"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ExternalMetricStatus": {
    description:
      "ExternalMetricStatus indicates the current value of a global metric not associated with any Kubernetes object.",
    properties: {
      current: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricValueStatus",
        description: "current contains the current value for the given metric",
      },
      metric: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricIdentifier",
        description: "metric identifies the target metric by name and selector",
      },
    },
    required: ["metric", "current"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.HPAScalingPolicy": {
    description:
      "HPAScalingPolicy is a single policy which must hold true for a specified past interval.",
    properties: {
      periodSeconds: {
        description:
          "periodSeconds specifies the window of time for which the policy should hold true. PeriodSeconds must be greater than zero and less than or equal to 1800 (30 min).",
        format: "int32",
        type: "integer",
      },
      type: {
        description: "type is used to specify the scaling policy.",
        type: "string",
      },
      value: {
        description:
          "value contains the amount of change which is permitted by the policy. It must be greater than zero",
        format: "int32",
        type: "integer",
      },
    },
    required: ["type", "value", "periodSeconds"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.HPAScalingRules": {
    description:
      "HPAScalingRules configures the scaling behavior for one direction. These Rules are applied after calculating DesiredReplicas from metrics for the HPA. They can limit the scaling velocity by specifying scaling policies. They can prevent flapping by specifying the stabilization window, so that the number of replicas is not set instantly, instead, the safest value from the stabilization window is chosen.",
    properties: {
      policies: {
        description:
          "policies is a list of potential scaling polices which can be used during scaling. At least one policy must be specified, otherwise the HPAScalingRules will be discarded as invalid",
        items: {
          $ref: "#/definitions/io.k8s.api.autoscaling.v2.HPAScalingPolicy",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      selectPolicy: {
        description:
          "selectPolicy is used to specify which policy should be used. If not set, the default value Max is used.",
        type: "string",
      },
      stabilizationWindowSeconds: {
        description:
          "stabilizationWindowSeconds is the number of seconds for which past recommendations should be considered while scaling up or scaling down. StabilizationWindowSeconds must be greater than or equal to zero and less than or equal to 3600 (one hour). If not set, use the default values: - For scale up: 0 (i.e. no stabilization is done). - For scale down: 300 (i.e. the stabilization window is 300 seconds long).",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.HorizontalPodAutoscaler": {
    description:
      "HorizontalPodAutoscaler is the configuration for a horizontal pod autoscaler, which automatically manages the replica count of any resource implementing the scale subresource based on the metrics specified.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "metadata is the standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerSpec",
        description:
          "spec is the specification for the behaviour of the autoscaler. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerStatus",
        description: "status is the current information about the autoscaler.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "autoscaling",
        kind: "HorizontalPodAutoscaler",
        version: "v2",
      },
    ],
  },
  "io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerBehavior": {
    description:
      "HorizontalPodAutoscalerBehavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively).",
    properties: {
      scaleDown: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.HPAScalingRules",
        description:
          "scaleDown is scaling policy for scaling Down. If not set, the default value is to allow to scale down to minReplicas pods, with a 300 second stabilization window (i.e., the highest recommendation for the last 300sec is used).",
      },
      scaleUp: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.HPAScalingRules",
        description:
          "scaleUp is scaling policy for scaling Up. If not set, the default value is the higher of:\n  * increase no more than 4 pods per 60 seconds\n  * double the number of pods per 60 seconds\nNo stabilization is used.",
      },
    },
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerCondition": {
    description:
      "HorizontalPodAutoscalerCondition describes the state of a HorizontalPodAutoscaler at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastTransitionTime is the last time the condition transitioned from one status to another",
      },
      message: {
        description:
          "message is a human-readable explanation containing details about the transition",
        type: "string",
      },
      reason: {
        description:
          "reason is the reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "status is the status of the condition (True, False, Unknown)",
        type: "string",
      },
      type: {
        description: "type describes the current condition",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerList": {
    description:
      "HorizontalPodAutoscalerList is a list of horizontal pod autoscaler objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of horizontal pod autoscaler objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.autoscaling.v2.HorizontalPodAutoscaler",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "metadata is the standard list metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "autoscaling",
        kind: "HorizontalPodAutoscalerList",
        version: "v2",
      },
    ],
  },
  "io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerSpec": {
    description:
      "HorizontalPodAutoscalerSpec describes the desired functionality of the HorizontalPodAutoscaler.",
    properties: {
      behavior: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerBehavior",
        description:
          "behavior configures the scaling behavior of the target in both Up and Down directions (scaleUp and scaleDown fields respectively). If not set, the default HPAScalingRules for scale up and scale down are used.",
      },
      maxReplicas: {
        description:
          "maxReplicas is the upper limit for the number of replicas to which the autoscaler can scale up. It cannot be less that minReplicas.",
        format: "int32",
        type: "integer",
      },
      metrics: {
        description:
          "metrics contains the specifications for which to use to calculate the desired replica count (the maximum replica count across all metrics will be used).  The desired replica count is calculated multiplying the ratio between the target value and the current value by the current number of pods.  Ergo, metrics used must decrease as the pod count is increased, and vice-versa.  See the individual metric source types for more information about how each type of metric must respond. If not set, the default metric will be set to 80% average CPU utilization.",
        items: {
          $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricSpec",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      minReplicas: {
        description:
          "minReplicas is the lower limit for the number of replicas to which the autoscaler can scale down.  It defaults to 1 pod.  minReplicas is allowed to be 0 if the alpha feature gate HPAScaleToZero is enabled and at least one Object or External metric is configured.  Scaling is active as long as at least one metric value is available.",
        format: "int32",
        type: "integer",
      },
      scaleTargetRef: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.CrossVersionObjectReference",
        description:
          "scaleTargetRef points to the target resource to scale, and is used to the pods for which metrics should be collected, as well as to actually change the replica count.",
      },
    },
    required: ["scaleTargetRef", "maxReplicas"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerStatus": {
    description:
      "HorizontalPodAutoscalerStatus describes the current status of a horizontal pod autoscaler.",
    properties: {
      conditions: {
        description:
          "conditions is the set of conditions required for this autoscaler to scale its target, and indicates whether or not those conditions are met.",
        items: {
          $ref: "#/definitions/io.k8s.api.autoscaling.v2.HorizontalPodAutoscalerCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      currentMetrics: {
        description:
          "currentMetrics is the last read state of the metrics used by this autoscaler.",
        items: {
          $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricStatus",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      currentReplicas: {
        description:
          "currentReplicas is current number of replicas of pods managed by this autoscaler, as last seen by the autoscaler.",
        format: "int32",
        type: "integer",
      },
      desiredReplicas: {
        description:
          "desiredReplicas is the desired number of replicas of pods managed by this autoscaler, as last calculated by the autoscaler.",
        format: "int32",
        type: "integer",
      },
      lastScaleTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastScaleTime is the last time the HorizontalPodAutoscaler scaled the number of pods, used by the autoscaler to control how often the number of pods is changed.",
      },
      observedGeneration: {
        description:
          "observedGeneration is the most recent generation observed by this autoscaler.",
        format: "int64",
        type: "integer",
      },
    },
    required: ["desiredReplicas"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.MetricIdentifier": {
    description:
      "MetricIdentifier defines the name and optionally selector for a metric",
    properties: {
      name: {
        description: "name is the name of the given metric",
        type: "string",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "selector is the string-encoded form of a standard kubernetes label selector for the given metric When set, it is passed as an additional parameter to the metrics server for more specific metrics scoping. When unset, just the metricName will be used to gather metrics.",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.MetricSpec": {
    description:
      "MetricSpec specifies how to scale based on a single metric (only `type` and one other matching field should be set at once).",
    properties: {
      containerResource: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ContainerResourceMetricSource",
        description:
          'containerResource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod of the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source. This is an alpha feature and can be enabled by the HPAContainerMetrics feature flag.',
      },
      external: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ExternalMetricSource",
        description:
          "external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).",
      },
      object: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ObjectMetricSource",
        description:
          "object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object).",
      },
      pods: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.PodsMetricSource",
        description:
          "pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value.",
      },
      resource: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ResourceMetricSource",
        description:
          'resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.',
      },
      type: {
        description:
          'type is the type of metric source.  It should be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each mapping to a matching field in the object. Note: "ContainerResource" type is available on when the feature-gate HPAContainerMetrics is enabled',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.MetricStatus": {
    description:
      "MetricStatus describes the last-read state of a single metric.",
    properties: {
      containerResource: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ContainerResourceMetricStatus",
        description:
          'container resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing a single container in each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.',
      },
      external: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ExternalMetricStatus",
        description:
          "external refers to a global metric that is not associated with any Kubernetes object. It allows autoscaling based on information coming from components running outside of cluster (for example length of queue in cloud messaging service, or QPS from loadbalancer running outside of cluster).",
      },
      object: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ObjectMetricStatus",
        description:
          "object refers to a metric describing a single kubernetes object (for example, hits-per-second on an Ingress object).",
      },
      pods: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.PodsMetricStatus",
        description:
          "pods refers to a metric describing each pod in the current scale target (for example, transactions-processed-per-second).  The values will be averaged together before being compared to the target value.",
      },
      resource: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.ResourceMetricStatus",
        description:
          'resource refers to a resource metric (such as those specified in requests and limits) known to Kubernetes describing each pod in the current scale target (e.g. CPU or memory). Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.',
      },
      type: {
        description:
          'type is the type of metric source.  It will be one of "ContainerResource", "External", "Object", "Pods" or "Resource", each corresponds to a matching field in the object. Note: "ContainerResource" type is available on when the feature-gate HPAContainerMetrics is enabled',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.MetricTarget": {
    description:
      "MetricTarget defines the target value, average value, or average utilization of a specific metric",
    properties: {
      averageUtilization: {
        description:
          "averageUtilization is the target value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods. Currently only valid for Resource metric source type",
        format: "int32",
        type: "integer",
      },
      averageValue: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          "averageValue is the target value of the average of the metric across all relevant pods (as a quantity)",
      },
      type: {
        description:
          "type represents whether the metric type is Utilization, Value, or AverageValue",
        type: "string",
      },
      value: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description: "value is the target value of the metric (as a quantity).",
      },
    },
    required: ["type"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.MetricValueStatus": {
    description: "MetricValueStatus holds the current value for a metric",
    properties: {
      averageUtilization: {
        description:
          "currentAverageUtilization is the current value of the average of the resource metric across all relevant pods, represented as a percentage of the requested value of the resource for the pods.",
        format: "int32",
        type: "integer",
      },
      averageValue: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          "averageValue is the current value of the average of the metric across all relevant pods (as a quantity)",
      },
      value: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          "value is the current value of the metric (as a quantity).",
      },
    },
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ObjectMetricSource": {
    description:
      "ObjectMetricSource indicates how to scale on a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).",
    properties: {
      describedObject: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.CrossVersionObjectReference",
        description:
          "describedObject specifies the descriptions of a object,such as kind,name apiVersion",
      },
      metric: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricIdentifier",
        description: "metric identifies the target metric by name and selector",
      },
      target: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricTarget",
        description: "target specifies the target value for the given metric",
      },
    },
    required: ["describedObject", "target", "metric"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ObjectMetricStatus": {
    description:
      "ObjectMetricStatus indicates the current value of a metric describing a kubernetes object (for example, hits-per-second on an Ingress object).",
    properties: {
      current: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricValueStatus",
        description: "current contains the current value for the given metric",
      },
      describedObject: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.CrossVersionObjectReference",
        description:
          "DescribedObject specifies the descriptions of a object,such as kind,name apiVersion",
      },
      metric: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricIdentifier",
        description: "metric identifies the target metric by name and selector",
      },
    },
    required: ["metric", "current", "describedObject"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.PodsMetricSource": {
    description:
      "PodsMetricSource indicates how to scale on a metric describing each pod in the current scale target (for example, transactions-processed-per-second). The values will be averaged together before being compared to the target value.",
    properties: {
      metric: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricIdentifier",
        description: "metric identifies the target metric by name and selector",
      },
      target: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricTarget",
        description: "target specifies the target value for the given metric",
      },
    },
    required: ["metric", "target"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.PodsMetricStatus": {
    description:
      "PodsMetricStatus indicates the current value of a metric describing each pod in the current scale target (for example, transactions-processed-per-second).",
    properties: {
      current: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricValueStatus",
        description: "current contains the current value for the given metric",
      },
      metric: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricIdentifier",
        description: "metric identifies the target metric by name and selector",
      },
    },
    required: ["metric", "current"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ResourceMetricSource": {
    description:
      'ResourceMetricSource indicates how to scale on a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  The values will be averaged together before being compared to the target.  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.  Only one "target" type should be set.',
    properties: {
      name: {
        description: "name is the name of the resource in question.",
        type: "string",
      },
      target: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricTarget",
        description: "target specifies the target value for the given metric",
      },
    },
    required: ["name", "target"],
    type: "object",
  },
  "io.k8s.api.autoscaling.v2.ResourceMetricStatus": {
    description:
      'ResourceMetricStatus indicates the current value of a resource metric known to Kubernetes, as specified in requests and limits, describing each pod in the current scale target (e.g. CPU or memory).  Such metrics are built in to Kubernetes, and have special scaling options on top of those available to normal per-pod metrics using the "pods" source.',
    properties: {
      current: {
        $ref: "#/definitions/io.k8s.api.autoscaling.v2.MetricValueStatus",
        description: "current contains the current value for the given metric",
      },
      name: {
        description: "name is the name of the resource in question.",
        type: "string",
      },
    },
    required: ["name", "current"],
    type: "object",
  },
  "io.k8s.api.batch.v1.CronJob": {
    description: "CronJob represents the configuration of a single cron job.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.batch.v1.CronJobSpec",
        description:
          "Specification of the desired behavior of a cron job, including the schedule. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.batch.v1.CronJobStatus",
        description:
          "Current status of a cron job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "batch",
        kind: "CronJob",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.batch.v1.CronJobList": {
    description: "CronJobList is a collection of cron jobs.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of CronJobs.",
        items: {
          $ref: "#/definitions/io.k8s.api.batch.v1.CronJob",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "batch",
        kind: "CronJobList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.batch.v1.CronJobSpec": {
    description:
      "CronJobSpec describes how the job execution will look like and when it will actually run.",
    properties: {
      concurrencyPolicy: {
        description:
          'Specifies how to treat concurrent executions of a Job. Valid values are:\n\n- "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn\'t finished yet; - "Replace": cancels currently running job and replaces it with a new one',
        type: "string",
      },
      failedJobsHistoryLimit: {
        description:
          "The number of failed finished jobs to retain. Value must be non-negative integer. Defaults to 1.",
        format: "int32",
        type: "integer",
      },
      jobTemplate: {
        $ref: "#/definitions/io.k8s.api.batch.v1.JobTemplateSpec",
        description:
          "Specifies the job that will be created when executing a CronJob.",
      },
      schedule: {
        description:
          "The schedule in Cron format, see https://en.wikipedia.org/wiki/Cron.",
        type: "string",
      },
      startingDeadlineSeconds: {
        description:
          "Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones.",
        format: "int64",
        type: "integer",
      },
      successfulJobsHistoryLimit: {
        description:
          "The number of successful finished jobs to retain. Value must be non-negative integer. Defaults to 3.",
        format: "int32",
        type: "integer",
      },
      suspend: {
        description:
          "This flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false.",
        type: "boolean",
      },
      timeZone: {
        description:
          "The time zone name for the given schedule, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. If not specified, this will default to the time zone of the kube-controller-manager process. The set of valid time zone names and the time zone offset is loaded from the system-wide time zone database by the API server during CronJob validation and the controller manager during execution. If no system-wide time zone database can be found a bundled version of the database is used instead. If the time zone name becomes invalid during the lifetime of a CronJob or due to a change in host configuration, the controller will stop creating new new Jobs and will create a system event with the reason UnknownTimeZone. More information can be found in https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#time-zones",
        type: "string",
      },
    },
    required: ["schedule", "jobTemplate"],
    type: "object",
  },
  "io.k8s.api.batch.v1.CronJobStatus": {
    description: "CronJobStatus represents the current state of a cron job.",
    properties: {
      active: {
        description: "A list of pointers to currently running jobs.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      lastScheduleTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Information when was the last time the job was successfully scheduled.",
      },
      lastSuccessfulTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Information when was the last time the job successfully completed.",
      },
    },
    type: "object",
  },
  "io.k8s.api.batch.v1.Job": {
    description: "Job represents the configuration of a single job.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.batch.v1.JobSpec",
        description:
          "Specification of the desired behavior of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.batch.v1.JobStatus",
        description:
          "Current status of a job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "batch",
        kind: "Job",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.batch.v1.JobCondition": {
    description: "JobCondition describes current state of a job.",
    properties: {
      lastProbeTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "Last time the condition was checked.",
      },
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transit from one status to another.",
      },
      message: {
        description:
          "Human readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description: "(brief) reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of job condition, Complete or Failed.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.batch.v1.JobList": {
    description: "JobList is a collection of jobs.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of Jobs.",
        items: {
          $ref: "#/definitions/io.k8s.api.batch.v1.Job",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "batch",
        kind: "JobList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.batch.v1.JobSpec": {
    description: "JobSpec describes how the job execution will look like.",
    properties: {
      activeDeadlineSeconds: {
        description:
          "Specifies the duration in seconds relative to the startTime that the job may be continuously active before the system tries to terminate it; value must be positive integer. If a Job is suspended (at creation or through an update), this timer will effectively be stopped and reset when the Job is resumed again.",
        format: "int64",
        type: "integer",
      },
      backoffLimit: {
        description:
          "Specifies the number of retries before marking this job failed. Defaults to 6",
        format: "int32",
        type: "integer",
      },
      backoffLimitPerIndex: {
        description:
          "Specifies the limit for the number of retries within an index before marking this index as failed. When enabled the number of failures per index is kept in the pod's batch.kubernetes.io/job-index-failure-count annotation. It can only be set when Job's completionMode=Indexed, and the Pod's restart policy is Never. The field is immutable. This field is alpha-level. It can be used when the `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).",
        format: "int32",
        type: "integer",
      },
      completionMode: {
        description:
          "completionMode specifies how Pod completions are tracked. It can be `NonIndexed` (default) or `Indexed`.\n\n`NonIndexed` means that the Job is considered complete when there have been .spec.completions successfully completed Pods. Each Pod completion is homologous to each other.\n\n`Indexed` means that the Pods of a Job get an associated completion index from 0 to (.spec.completions - 1), available in the annotation batch.kubernetes.io/job-completion-index. The Job is considered complete when there is one successfully completed Pod for each index. When value is `Indexed`, .spec.completions must be specified and `.spec.parallelism` must be less than or equal to 10^5. In addition, The Pod name takes the form `$(job-name)-$(index)-$(random-string)`, the Pod hostname takes the form `$(job-name)-$(index)`.\n\nMore completion modes can be added in the future. If the Job controller observes a mode that it doesn't recognize, which is possible during upgrades due to version skew, the controller skips updates for the Job.",
        type: "string",
      },
      completions: {
        description:
          "Specifies the desired number of successfully finished pods the job should be run with.  Setting to null means that the success of any pod signals the success of all pods, and allows parallelism to have any positive value.  Setting to 1 means that parallelism is limited to 1 and the success of that pod signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/",
        format: "int32",
        type: "integer",
      },
      manualSelector: {
        description:
          "manualSelector controls generation of pod labels and pod selectors. Leave `manualSelector` unset unless you are certain what you are doing. When false or unset, the system pick labels unique to this job and appends those labels to the pod template.  When true, the user is responsible for picking unique labels and specifying the selector.  Failure to pick a unique label may cause this and other jobs to not function correctly.  However, You may see `manualSelector=true` in jobs that were created with the old `extensions/v1beta1` API. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/#specifying-your-own-pod-selector",
        type: "boolean",
      },
      maxFailedIndexes: {
        description:
          "Specifies the maximal number of failed indexes before marking the Job as failed, when backoffLimitPerIndex is set. Once the number of failed indexes exceeds this number the entire Job is marked as Failed and its execution is terminated. When left as null the job continues execution of all of its indexes and is marked with the `Complete` Job condition. It can only be specified when backoffLimitPerIndex is set. It can be null or up to completions. It is required and must be less than or equal to 10^4 when is completions greater than 10^5. This field is alpha-level. It can be used when the `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).",
        format: "int32",
        type: "integer",
      },
      parallelism: {
        description:
          "Specifies the maximum desired number of pods the job should run at any given time. The actual number of pods running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/",
        format: "int32",
        type: "integer",
      },
      podFailurePolicy: {
        $ref: "#/definitions/io.k8s.api.batch.v1.PodFailurePolicy",
        description:
          "Specifies the policy of handling failed pods. In particular, it allows to specify the set of actions and conditions which need to be satisfied to take the associated action. If empty, the default behaviour applies - the counter of failed pods, represented by the jobs's .status.failed field, is incremented and it is checked against the backoffLimit. This field cannot be used in combination with restartPolicy=OnFailure.\n\nThis field is beta-level. It can be used when the `JobPodFailurePolicy` feature gate is enabled (enabled by default).",
      },
      podReplacementPolicy: {
        description:
          "podReplacementPolicy specifies when to create replacement Pods. Possible values are: - TerminatingOrFailed means that we recreate pods\n  when they are terminating (has a metadata.deletionTimestamp) or failed.\n- Failed means to wait until a previously created Pod is fully terminated (has phase\n  Failed or Succeeded) before creating a replacement Pod.\n\nWhen using podFailurePolicy, Failed is the the only allowed value. TerminatingOrFailed and Failed are allowed values when podFailurePolicy is not in use. This is an alpha field. Enable JobPodReplacementPolicy to be able to use this field.",
        type: "string",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "A label query over pods that should match the pod count. Normally, the system sets this field for you. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors",
      },
      suspend: {
        description:
          "suspend specifies whether the Job controller should create Pods or not. If a Job is created with suspend set to true, no Pods are created by the Job controller. If a Job is suspended after creation (i.e. the flag goes from false to true), the Job controller will delete all active Pods associated with this Job. Users must design their workload to gracefully handle this. Suspending a Job will reset the StartTime field of the Job, effectively resetting the ActiveDeadlineSeconds timer too. Defaults to false.",
        type: "boolean",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          'Describes the pod that will be created when executing a job. The only allowed template.spec.restartPolicy values are "Never" or "OnFailure". More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/',
      },
      ttlSecondsAfterFinished: {
        description:
          "ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is unset, the Job won't be automatically deleted. If this field is set to zero, the Job becomes eligible to be deleted immediately after it finishes.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["template"],
    type: "object",
  },
  "io.k8s.api.batch.v1.JobStatus": {
    description: "JobStatus represents the current state of a Job.",
    properties: {
      active: {
        description: "The number of pending and running pods.",
        format: "int32",
        type: "integer",
      },
      completedIndexes: {
        description:
          'completedIndexes holds the completed indexes when .spec.completionMode = "Indexed" in a text format. The indexes are represented as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the completed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7".',
        type: "string",
      },
      completionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. The completion time is only set when the job finishes successfully.",
      },
      conditions: {
        description:
          'The latest available observations of an object\'s current state. When a Job fails, one of the conditions will have type "Failed" and status true. When a Job is suspended, one of the conditions will have type "Suspended" and status true; when the Job is resumed, the status of this condition will become false. When a Job is completed, one of the conditions will have type "Complete" and status true. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/',
        items: {
          $ref: "#/definitions/io.k8s.api.batch.v1.JobCondition",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      failed: {
        description: "The number of pods which reached phase Failed.",
        format: "int32",
        type: "integer",
      },
      failedIndexes: {
        description:
          'FailedIndexes holds the failed indexes when backoffLimitPerIndex=true. The indexes are represented in the text format analogous as for the `completedIndexes` field, ie. they are kept as decimal integers separated by commas. The numbers are listed in increasing order. Three or more consecutive numbers are compressed and represented by the first and last element of the series, separated by a hyphen. For example, if the failed indexes are 1, 3, 4, 5 and 7, they are represented as "1,3-5,7". This field is alpha-level. It can be used when the `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).',
        type: "string",
      },
      ready: {
        description:
          "The number of pods which have a Ready condition.\n\nThis field is beta-level. The job controller populates the field when the feature gate JobReadyPods is enabled (enabled by default).",
        format: "int32",
        type: "integer",
      },
      startTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Represents time when the job controller started processing a job. When a Job is created in the suspended state, this field is not set until the first time it is resumed. This field is reset every time a Job is resumed from suspension. It is represented in RFC3339 form and is in UTC.",
      },
      succeeded: {
        description: "The number of pods which reached phase Succeeded.",
        format: "int32",
        type: "integer",
      },
      terminating: {
        description:
          "The number of pods which are terminating (in phase Pending or Running and have a deletionTimestamp).\n\nThis field is alpha-level. The job controller populates the field when the feature gate JobPodReplacementPolicy is enabled (disabled by default).",
        format: "int32",
        type: "integer",
      },
      uncountedTerminatedPods: {
        $ref: "#/definitions/io.k8s.api.batch.v1.UncountedTerminatedPods",
        description:
          "uncountedTerminatedPods holds the UIDs of Pods that have terminated but the job controller hasn't yet accounted for in the status counters.\n\nThe job controller creates pods with a finalizer. When a pod terminates (succeeded or failed), the controller does three steps to account for it in the job status:\n\n1. Add the pod UID to the arrays in this field. 2. Remove the pod finalizer. 3. Remove the pod UID from the arrays while increasing the corresponding\n    counter.\n\nOld jobs might not be tracked using this field, in which case the field remains null.",
      },
    },
    type: "object",
  },
  "io.k8s.api.batch.v1.JobTemplateSpec": {
    description:
      "JobTemplateSpec describes the data a Job should have when created from a template",
    properties: {
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata of the jobs created from this template. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.batch.v1.JobSpec",
        description:
          "Specification of the desired behavior of the job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
  },
  "io.k8s.api.batch.v1.PodFailurePolicy": {
    description:
      "PodFailurePolicy describes how failed pods influence the backoffLimit.",
    properties: {
      rules: {
        description:
          "A list of pod failure policy rules. The rules are evaluated in order. Once a rule matches a Pod failure, the remaining of the rules are ignored. When no rule matches the Pod failure, the default handling applies - the counter of pod failures is incremented and it is checked against the backoffLimit. At most 20 elements are allowed.",
        items: {
          $ref: "#/definitions/io.k8s.api.batch.v1.PodFailurePolicyRule",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["rules"],
    type: "object",
  },
  "io.k8s.api.batch.v1.PodFailurePolicyOnExitCodesRequirement": {
    description:
      "PodFailurePolicyOnExitCodesRequirement describes the requirement for handling a failed pod based on its container exit codes. In particular, it lookups the .state.terminated.exitCode for each app container and init container status, represented by the .status.containerStatuses and .status.initContainerStatuses fields in the Pod status, respectively. Containers completed with success (exit code 0) are excluded from the requirement check.",
    properties: {
      containerName: {
        description:
          "Restricts the check for exit codes to the container with the specified name. When null, the rule applies to all containers. When specified, it should match one the container or initContainer names in the pod template.",
        type: "string",
      },
      operator: {
        description:
          "Represents the relationship between the container exit code(s) and the specified values. Containers completed with success (exit code 0) are excluded from the requirement check. Possible values are:\n\n- In: the requirement is satisfied if at least one container exit code\n  (might be multiple if there are multiple containers not restricted\n  by the 'containerName' field) is in the set of specified values.\n- NotIn: the requirement is satisfied if at least one container exit code\n  (might be multiple if there are multiple containers not restricted\n  by the 'containerName' field) is not in the set of specified values.\nAdditional values are considered to be added in the future. Clients should react to an unknown operator by assuming the requirement is not satisfied.",
        type: "string",
      },
      values: {
        description:
          "Specifies the set of values. Each returned container exit code (might be multiple in case of multiple containers) is checked against this set of values with respect to the operator. The list of values must be ordered and must not contain duplicates. Value '0' cannot be used for the In operator. At least one element is required. At most 255 elements are allowed.",
        items: {
          format: "int32",
          type: "integer",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    required: ["operator", "values"],
    type: "object",
  },
  "io.k8s.api.batch.v1.PodFailurePolicyOnPodConditionsPattern": {
    description:
      "PodFailurePolicyOnPodConditionsPattern describes a pattern for matching an actual pod condition type.",
    properties: {
      status: {
        description:
          "Specifies the required Pod condition status. To match a pod condition it is required that the specified status equals the pod condition status. Defaults to True.",
        type: "string",
      },
      type: {
        description:
          "Specifies the required Pod condition type. To match a pod condition it is required that specified type equals the pod condition type.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.batch.v1.PodFailurePolicyRule": {
    description:
      "PodFailurePolicyRule describes how a pod failure is handled when the requirements are met. One of onExitCodes and onPodConditions, but not both, can be used in each rule.",
    properties: {
      action: {
        description:
          "Specifies the action taken on a pod failure when the requirements are satisfied. Possible values are:\n\n- FailJob: indicates that the pod's job is marked as Failed and all\n  running pods are terminated.\n- FailIndex: indicates that the pod's index is marked as Failed and will\n  not be restarted.\n  This value is alpha-level. It can be used when the\n  `JobBackoffLimitPerIndex` feature gate is enabled (disabled by default).\n- Ignore: indicates that the counter towards the .backoffLimit is not\n  incremented and a replacement pod is created.\n- Count: indicates that the pod is handled in the default way - the\n  counter towards the .backoffLimit is incremented.\nAdditional values are considered to be added in the future. Clients should react to an unknown action by skipping the rule.",
        type: "string",
      },
      onExitCodes: {
        $ref: "#/definitions/io.k8s.api.batch.v1.PodFailurePolicyOnExitCodesRequirement",
        description: "Represents the requirement on the container exit codes.",
      },
      onPodConditions: {
        description:
          "Represents the requirement on the pod conditions. The requirement is represented as a list of pod condition patterns. The requirement is satisfied if at least one pattern matches an actual pod condition. At most 20 elements are allowed.",
        items: {
          $ref: "#/definitions/io.k8s.api.batch.v1.PodFailurePolicyOnPodConditionsPattern",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["action", "onPodConditions"],
    type: "object",
  },
  "io.k8s.api.batch.v1.UncountedTerminatedPods": {
    description:
      "UncountedTerminatedPods holds UIDs of Pods that have terminated but haven't been accounted in Job status counters.",
    properties: {
      failed: {
        description: "failed holds UIDs of failed Pods.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      succeeded: {
        description: "succeeded holds UIDs of succeeded Pods.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    type: "object",
  },
  "io.k8s.api.certificates.v1.CertificateSigningRequest": {
    description:
      'CertificateSigningRequest objects provide a mechanism to obtain x509 certificates by submitting a certificate signing request, and having it asynchronously approved and issued.\n\nKubelets use this API to obtain:\n 1. client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client-kubelet" signerName).\n 2. serving certificates for TLS endpoints kube-apiserver can connect to securely (with the "kubernetes.io/kubelet-serving" signerName).\n\nThis API can be used to request client certificates to authenticate to kube-apiserver (with the "kubernetes.io/kube-apiserver-client" signerName), or to obtain certificates from custom non-Kubernetes signers.',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.certificates.v1.CertificateSigningRequestSpec",
        description:
          "spec contains the certificate request, and is immutable after creation. Only the request, signerName, expirationSeconds, and usages fields can be set on creation. Other fields are derived by Kubernetes and cannot be modified by users.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.certificates.v1.CertificateSigningRequestStatus",
        description:
          "status contains information about whether the request is approved or denied, and the certificate issued by the signer, or the failure condition indicating signer failure.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "certificates.k8s.io",
        kind: "CertificateSigningRequest",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.certificates.v1.CertificateSigningRequestCondition": {
    description:
      "CertificateSigningRequestCondition describes a condition of a CertificateSigningRequest object",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastTransitionTime is the time the condition last transitioned from one status to another. If unset, when a new condition type is added or an existing condition's status is changed, the server defaults this to the current time.",
      },
      lastUpdateTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastUpdateTime is the time of the last update to this condition",
      },
      message: {
        description:
          "message contains a human readable message with details about the request state",
        type: "string",
      },
      reason: {
        description: "reason indicates a brief reason for the request state",
        type: "string",
      },
      status: {
        description:
          'status of the condition, one of True, False, Unknown. Approved, Denied, and Failed conditions may not be "False" or "Unknown".',
        type: "string",
      },
      type: {
        description:
          'type of the condition. Known conditions are "Approved", "Denied", and "Failed".\n\nAn "Approved" condition is added via the /approval subresource, indicating the request was approved and should be issued by the signer.\n\nA "Denied" condition is added via the /approval subresource, indicating the request was denied and should not be issued by the signer.\n\nA "Failed" condition is added via the /status subresource, indicating the signer failed to issue the certificate.\n\nApproved and Denied conditions are mutually exclusive. Approved, Denied, and Failed conditions cannot be removed once added.\n\nOnly one condition of a given type is allowed.',
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.certificates.v1.CertificateSigningRequestList": {
    description:
      "CertificateSigningRequestList is a collection of CertificateSigningRequest objects",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "items is a collection of CertificateSigningRequest objects",
        items: {
          $ref: "#/definitions/io.k8s.api.certificates.v1.CertificateSigningRequest",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "certificates.k8s.io",
        kind: "CertificateSigningRequestList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.certificates.v1.CertificateSigningRequestSpec": {
    description:
      "CertificateSigningRequestSpec contains the certificate request.",
    properties: {
      expirationSeconds: {
        description:
          "expirationSeconds is the requested duration of validity of the issued certificate. The certificate signer may issue a certificate with a different validity duration so a client must check the delta between the notBefore and and notAfter fields in the issued certificate to determine the actual duration.\n\nThe v1.22+ in-tree implementations of the well-known Kubernetes signers will honor this field as long as the requested duration is not greater than the maximum duration they will honor per the --cluster-signing-duration CLI flag to the Kubernetes controller manager.\n\nCertificate signers may not honor this field for various reasons:\n\n  1. Old signer that is unaware of the field (such as the in-tree\n     implementations prior to v1.22)\n  2. Signer whose configured maximum is shorter than the requested duration\n  3. Signer whose configured minimum is longer than the requested duration\n\nThe minimum valid value for expirationSeconds is 600, i.e. 10 minutes.",
        format: "int32",
        type: "integer",
      },
      extra: {
        additionalProperties: {
          items: {
            type: "string",
          },
          type: "array",
        },
        description:
          "extra contains extra attributes of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable.",
        type: "object",
      },
      groups: {
        description:
          "groups contains group membership of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      request: {
        description:
          'request contains an x509 certificate signing request encoded in a "CERTIFICATE REQUEST" PEM block. When serialized as JSON or YAML, the data is additionally base64-encoded.',
        format: "byte",
        type: "string",
        "x-kubernetes-list-type": "atomic",
      },
      signerName: {
        description:
          'signerName indicates the requested signer, and is a qualified name.\n\nList/watch requests for CertificateSigningRequests can filter on this field using a "spec.signerName=NAME" fieldSelector.\n\nWell-known Kubernetes signers are:\n 1. "kubernetes.io/kube-apiserver-client": issues client certificates that can be used to authenticate to kube-apiserver.\n  Requests for this signer are never auto-approved by kube-controller-manager, can be issued by the "csrsigning" controller in kube-controller-manager.\n 2. "kubernetes.io/kube-apiserver-client-kubelet": issues client certificates that kubelets use to authenticate to kube-apiserver.\n  Requests for this signer can be auto-approved by the "csrapproving" controller in kube-controller-manager, and can be issued by the "csrsigning" controller in kube-controller-manager.\n 3. "kubernetes.io/kubelet-serving" issues serving certificates that kubelets use to serve TLS endpoints, which kube-apiserver can connect to securely.\n  Requests for this signer are never auto-approved by kube-controller-manager, and can be issued by the "csrsigning" controller in kube-controller-manager.\n\nMore details are available at https://k8s.io/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers\n\nCustom signerNames can also be specified. The signer defines:\n 1. Trust distribution: how trust (CA bundles) are distributed.\n 2. Permitted subjects: and behavior when a disallowed subject is requested.\n 3. Required, permitted, or forbidden x509 extensions in the request (including whether subjectAltNames are allowed, which types, restrictions on allowed values) and behavior when a disallowed extension is requested.\n 4. Required, permitted, or forbidden key usages / extended key usages.\n 5. Expiration/certificate lifetime: whether it is fixed by the signer, configurable by the admin.\n 6. Whether or not requests for CA certificates are allowed.',
        type: "string",
      },
      uid: {
        description:
          "uid contains the uid of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable.",
        type: "string",
      },
      usages: {
        description:
          'usages specifies a set of key usages requested in the issued certificate.\n\nRequests for TLS client certificates typically request: "digital signature", "key encipherment", "client auth".\n\nRequests for TLS serving certificates typically request: "key encipherment", "digital signature", "server auth".\n\nValid values are:\n "signing", "digital signature", "content commitment",\n "key encipherment", "key agreement", "data encipherment",\n "cert sign", "crl sign", "encipher only", "decipher only", "any",\n "server auth", "client auth",\n "code signing", "email protection", "s/mime",\n "ipsec end system", "ipsec tunnel", "ipsec user",\n "timestamping", "ocsp signing", "microsoft sgc", "netscape sgc"',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      username: {
        description:
          "username contains the name of the user that created the CertificateSigningRequest. Populated by the API server on creation and immutable.",
        type: "string",
      },
    },
    required: ["request", "signerName"],
    type: "object",
  },
  "io.k8s.api.certificates.v1.CertificateSigningRequestStatus": {
    description:
      "CertificateSigningRequestStatus contains conditions used to indicate approved/denied/failed status of the request, and the issued certificate.",
    properties: {
      certificate: {
        description:
          'certificate is populated with an issued certificate by the signer after an Approved condition is present. This field is set via the /status subresource. Once populated, this field is immutable.\n\nIf the certificate signing request is denied, a condition of type "Denied" is added and this field remains empty. If the signer cannot issue the certificate, a condition of type "Failed" is added and this field remains empty.\n\nValidation requirements:\n 1. certificate must contain one or more PEM blocks.\n 2. All PEM blocks must have the "CERTIFICATE" label, contain no headers, and the encoded data\n  must be a BER-encoded ASN.1 Certificate structure as described in section 4 of RFC5280.\n 3. Non-PEM content may appear before or after the "CERTIFICATE" PEM blocks and is unvalidated,\n  to allow for explanatory text as described in section 5.2 of RFC7468.\n\nIf more than one PEM block is present, and the definition of the requested spec.signerName does not indicate otherwise, the first block is the issued certificate, and subsequent blocks should be treated as intermediate certificates and presented in TLS handshakes.\n\nThe certificate is encoded in PEM format.\n\nWhen serialized as JSON or YAML, the data is additionally base64-encoded, so it consists of:\n\n    base64(\n    -----BEGIN CERTIFICATE-----\n    ...\n    -----END CERTIFICATE-----\n    )',
        format: "byte",
        type: "string",
        "x-kubernetes-list-type": "atomic",
      },
      conditions: {
        description:
          'conditions applied to the request. Known conditions are "Approved", "Denied", and "Failed".',
        items: {
          $ref: "#/definitions/io.k8s.api.certificates.v1.CertificateSigningRequestCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
      },
    },
    type: "object",
  },
  "io.k8s.api.certificates.v1alpha1.ClusterTrustBundle": {
    description:
      "ClusterTrustBundle is a cluster-scoped container for X.509 trust anchors (root certificates).\n\nClusterTrustBundle objects are considered to be readable by any authenticated user in the cluster, because they can be mounted by pods using the `clusterTrustBundle` projection.  All service accounts have read access to ClusterTrustBundles by default.  Users who only have namespace-level access to a cluster can read ClusterTrustBundles by impersonating a serviceaccount that they have access to.\n\nIt can be optionally associated with a particular assigner, in which case it contains one valid set of trust anchors for that signer. Signers may have multiple associated ClusterTrustBundles; each is an independent set of trust anchors for that signer. Admission control is used to enforce that only users with permissions on the signer can create or modify the corresponding bundle.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "metadata contains the object metadata.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.certificates.v1alpha1.ClusterTrustBundleSpec",
        description: "spec contains the signer (if any) and trust anchors.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "certificates.k8s.io",
        kind: "ClusterTrustBundle",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.certificates.v1alpha1.ClusterTrustBundleList": {
    description:
      "ClusterTrustBundleList is a collection of ClusterTrustBundle objects",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is a collection of ClusterTrustBundle objects",
        items: {
          $ref: "#/definitions/io.k8s.api.certificates.v1alpha1.ClusterTrustBundle",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "metadata contains the list metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "certificates.k8s.io",
        kind: "ClusterTrustBundleList",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.certificates.v1alpha1.ClusterTrustBundleSpec": {
    description:
      "ClusterTrustBundleSpec contains the signer and trust anchors.",
    properties: {
      signerName: {
        description:
          "signerName indicates the associated signer, if any.\n\nIn order to create or update a ClusterTrustBundle that sets signerName, you must have the following cluster-scoped permission: group=certificates.k8s.io resource=signers resourceName=<the signer name> verb=attest.\n\nIf signerName is not empty, then the ClusterTrustBundle object must be named with the signer name as a prefix (translating slashes to colons). For example, for the signer name `example.com/foo`, valid ClusterTrustBundle object names include `example.com:foo:abc` and `example.com:foo:v1`.\n\nIf signerName is empty, then the ClusterTrustBundle object's name must not have such a prefix.\n\nList/watch requests for ClusterTrustBundles can filter on this field using a `spec.signerName=NAME` field selector.",
        type: "string",
      },
      trustBundle: {
        description:
          "trustBundle contains the individual X.509 trust anchors for this bundle, as PEM bundle of PEM-wrapped, DER-formatted X.509 certificates.\n\nThe data must consist only of PEM certificate blocks that parse as valid X.509 certificates.  Each certificate must include a basic constraints extension with the CA bit set.  The API server will reject objects that contain duplicate certificates, or that use PEM block headers.\n\nUsers of ClusterTrustBundles, including Kubelet, are free to reorder and deduplicate certificate blocks in this file according to their own logic, as well as to drop PEM block headers and inter-block data.",
        type: "string",
      },
    },
    required: ["trustBundle"],
    type: "object",
  },
  "io.k8s.api.coordination.v1.Lease": {
    description: "Lease defines a lease concept.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.coordination.v1.LeaseSpec",
        description:
          "spec contains the specification of the Lease. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "coordination.k8s.io",
        kind: "Lease",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.coordination.v1.LeaseList": {
    description: "LeaseList is a list of Lease objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is a list of schema objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.coordination.v1.Lease",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "coordination.k8s.io",
        kind: "LeaseList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.coordination.v1.LeaseSpec": {
    description: "LeaseSpec is a specification of a Lease.",
    properties: {
      acquireTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime",
        description:
          "acquireTime is a time when the current lease was acquired.",
      },
      holderIdentity: {
        description:
          "holderIdentity contains the identity of the holder of a current lease.",
        type: "string",
      },
      leaseDurationSeconds: {
        description:
          "leaseDurationSeconds is a duration that candidates for a lease need to wait to force acquire it. This is measure against time of last observed renewTime.",
        format: "int32",
        type: "integer",
      },
      leaseTransitions: {
        description:
          "leaseTransitions is the number of transitions of a lease between holders.",
        format: "int32",
        type: "integer",
      },
      renewTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime",
        description:
          "renewTime is a time when the current holder of a lease has last updated the lease.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.AWSElasticBlockStoreVolumeSource": {
    description:
      "Represents a Persistent Disk resource in AWS.\n\nAn AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore',
        type: "string",
      },
      partition: {
        description:
          'partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).',
        format: "int32",
        type: "integer",
      },
      readOnly: {
        description:
          "readOnly value true will force the readOnly setting in VolumeMounts. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore",
        type: "boolean",
      },
      volumeID: {
        description:
          "volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore",
        type: "string",
      },
    },
    required: ["volumeID"],
    type: "object",
  },
  "io.k8s.api.core.v1.Affinity": {
    description: "Affinity is a group of affinity scheduling rules.",
    properties: {
      nodeAffinity: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeAffinity",
        description: "Describes node affinity scheduling rules for the pod.",
      },
      podAffinity: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodAffinity",
        description:
          "Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).",
      },
      podAntiAffinity: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodAntiAffinity",
        description:
          "Describes pod anti-affinity scheduling rules (e.g. avoid putting this pod in the same node, zone, etc. as some other pod(s)).",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.AttachedVolume": {
    description: "AttachedVolume describes a volume attached to a node",
    properties: {
      devicePath: {
        description:
          "DevicePath represents the device path where the volume should be available",
        type: "string",
      },
      name: {
        description: "Name of the attached volume",
        type: "string",
      },
    },
    required: ["name", "devicePath"],
    type: "object",
  },
  "io.k8s.api.core.v1.AzureDiskVolumeSource": {
    description:
      "AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.",
    properties: {
      cachingMode: {
        description:
          "cachingMode is the Host Caching mode: None, Read Only, Read Write.",
        type: "string",
      },
      diskName: {
        description:
          "diskName is the Name of the data disk in the blob storage",
        type: "string",
      },
      diskURI: {
        description: "diskURI is the URI of data disk in the blob storage",
        type: "string",
      },
      fsType: {
        description:
          'fsType is Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      kind: {
        description:
          "kind expected values are Shared: multiple blob disks per storage account  Dedicated: single blob disk per storage account  Managed: azure managed data disk (only in managed availability set). defaults to shared",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
    },
    required: ["diskName", "diskURI"],
    type: "object",
  },
  "io.k8s.api.core.v1.AzureFilePersistentVolumeSource": {
    description:
      "AzureFile represents an Azure File Service mount on the host and bind mount to the pod.",
    properties: {
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretName: {
        description:
          "secretName is the name of secret that contains Azure Storage Account Name and Key",
        type: "string",
      },
      secretNamespace: {
        description:
          "secretNamespace is the namespace of the secret that contains Azure Storage Account Name and Key default is the same as the Pod",
        type: "string",
      },
      shareName: {
        description: "shareName is the azure Share Name",
        type: "string",
      },
    },
    required: ["secretName", "shareName"],
    type: "object",
  },
  "io.k8s.api.core.v1.AzureFileVolumeSource": {
    description:
      "AzureFile represents an Azure File Service mount on the host and bind mount to the pod.",
    properties: {
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretName: {
        description:
          "secretName is the  name of secret that contains Azure Storage Account Name and Key",
        type: "string",
      },
      shareName: {
        description: "shareName is the azure share Name",
        type: "string",
      },
    },
    required: ["secretName", "shareName"],
    type: "object",
  },
  "io.k8s.api.core.v1.Binding": {
    description:
      "Binding ties one object to another; for example, a pod is bound to a node by a scheduler. Deprecated in 1.7, please use the bindings subresource of pods instead.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      target: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description:
          "The target object that you want to bind to the standard object.",
      },
    },
    required: ["target"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Binding",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.CSIPersistentVolumeSource": {
    description:
      "Represents storage that is managed by an external CSI volume driver (Beta feature)",
    properties: {
      controllerExpandSecretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "controllerExpandSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI ControllerExpandVolume call. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.",
      },
      controllerPublishSecretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "controllerPublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI ControllerPublishVolume and ControllerUnpublishVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.",
      },
      driver: {
        description:
          "driver is the name of the driver to use for this volume. Required.",
        type: "string",
      },
      fsType: {
        description:
          'fsType to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs".',
        type: "string",
      },
      nodeExpandSecretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "nodeExpandSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodeExpandVolume call. This is a beta field which is enabled default by CSINodeExpandSecret feature gate. This field is optional, may be omitted if no secret is required. If the secret object contains more than one secret, all secrets are passed.",
      },
      nodePublishSecretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.",
      },
      nodeStageSecretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "nodeStageSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodeStageVolume and NodeStageVolume and NodeUnstageVolume calls. This field is optional, and may be empty if no secret is required. If the secret object contains more than one secret, all secrets are passed.",
      },
      readOnly: {
        description:
          "readOnly value to pass to ControllerPublishVolumeRequest. Defaults to false (read/write).",
        type: "boolean",
      },
      volumeAttributes: {
        additionalProperties: {
          type: "string",
        },
        description: "volumeAttributes of the volume to publish.",
        type: "object",
      },
      volumeHandle: {
        description:
          "volumeHandle is the unique volume name returned by the CSI volume plugin’s CreateVolume to refer to the volume on all subsequent calls. Required.",
        type: "string",
      },
    },
    required: ["driver", "volumeHandle"],
    type: "object",
  },
  "io.k8s.api.core.v1.CSIVolumeSource": {
    description:
      "Represents a source location of a volume to mount, managed by an external CSI driver",
    properties: {
      driver: {
        description:
          "driver is the name of the CSI driver that handles this volume. Consult with your admin for the correct name as registered in the cluster.",
        type: "string",
      },
      fsType: {
        description:
          'fsType to mount. Ex. "ext4", "xfs", "ntfs". If not provided, the empty value is passed to the associated CSI driver which will determine the default filesystem to apply.',
        type: "string",
      },
      nodePublishSecretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed.",
      },
      readOnly: {
        description:
          "readOnly specifies a read-only configuration for the volume. Defaults to false (read/write).",
        type: "boolean",
      },
      volumeAttributes: {
        additionalProperties: {
          type: "string",
        },
        description:
          "volumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values.",
        type: "object",
      },
    },
    required: ["driver"],
    type: "object",
  },
  "io.k8s.api.core.v1.Capabilities": {
    description: "Adds and removes POSIX capabilities from running containers.",
    properties: {
      add: {
        description: "Added capabilities",
        items: {
          type: "string",
        },
        type: "array",
      },
      drop: {
        description: "Removed capabilities",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.CephFSPersistentVolumeSource": {
    description:
      "Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.",
    properties: {
      monitors: {
        description:
          "monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        items: {
          type: "string",
        },
        type: "array",
      },
      path: {
        description:
          "path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        type: "boolean",
      },
      secretFile: {
        description:
          "secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        type: "string",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "secretRef is Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
      },
      user: {
        description:
          "user is Optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        type: "string",
      },
    },
    required: ["monitors"],
    type: "object",
  },
  "io.k8s.api.core.v1.CephFSVolumeSource": {
    description:
      "Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.",
    properties: {
      monitors: {
        description:
          "monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        items: {
          type: "string",
        },
        type: "array",
      },
      path: {
        description:
          "path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        type: "boolean",
      },
      secretFile: {
        description:
          "secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        type: "string",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef is Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
      },
      user: {
        description:
          "user is optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it",
        type: "string",
      },
    },
    required: ["monitors"],
    type: "object",
  },
  "io.k8s.api.core.v1.CinderPersistentVolumeSource": {
    description:
      "Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType Filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md',
        type: "string",
      },
      readOnly: {
        description:
          "readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "secretRef is Optional: points to a secret object containing parameters used to connect to OpenStack.",
      },
      volumeID: {
        description:
          "volumeID used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md",
        type: "string",
      },
    },
    required: ["volumeID"],
    type: "object",
  },
  "io.k8s.api.core.v1.CinderVolumeSource": {
    description:
      "Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md',
        type: "string",
      },
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef is optional: points to a secret object containing parameters used to connect to OpenStack.",
      },
      volumeID: {
        description:
          "volumeID used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md",
        type: "string",
      },
    },
    required: ["volumeID"],
    type: "object",
  },
  "io.k8s.api.core.v1.ClaimSource": {
    description:
      "ClaimSource describes a reference to a ResourceClaim.\n\nExactly one of these fields should be set.  Consumers of this type must treat an empty object as if it has an unknown value.",
    properties: {
      resourceClaimName: {
        description:
          "ResourceClaimName is the name of a ResourceClaim object in the same namespace as this pod.",
        type: "string",
      },
      resourceClaimTemplateName: {
        description:
          "ResourceClaimTemplateName is the name of a ResourceClaimTemplate object in the same namespace as this pod.\n\nThe template will be used to create a new ResourceClaim, which will be bound to this pod. When this pod is deleted, the ResourceClaim will also be deleted. The pod name and resource name, along with a generated component, will be used to form a unique name for the ResourceClaim, which will be recorded in pod.status.resourceClaimStatuses.\n\nThis field is immutable and no changes will be made to the corresponding ResourceClaim by the control plane after creating the ResourceClaim.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ClientIPConfig": {
    description:
      "ClientIPConfig represents the configurations of Client IP based session affinity.",
    properties: {
      timeoutSeconds: {
        description:
          'timeoutSeconds specifies the seconds of ClientIP type session sticky time. The value must be >0 && <=86400(for 1 day) if ServiceAffinity == "ClientIP". Default value is 10800(for 3 hours).',
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ComponentCondition": {
    description: "Information about the condition of a component.",
    properties: {
      error: {
        description:
          "Condition error code for a component. For example, a health check error code.",
        type: "string",
      },
      message: {
        description:
          "Message about the condition for a component. For example, information about a health check.",
        type: "string",
      },
      status: {
        description:
          'Status of the condition for a component. Valid values for "Healthy": "True", "False", or "Unknown".',
        type: "string",
      },
      type: {
        description:
          'Type of condition for a component. Valid value: "Healthy"',
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.core.v1.ComponentStatus": {
    description:
      "ComponentStatus (and ComponentStatusList) holds the cluster validation info. Deprecated: This API is deprecated in v1.19+",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      conditions: {
        description: "List of component conditions observed",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ComponentCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ComponentStatus",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ComponentStatusList": {
    description:
      "Status of all the conditions for the component as a list of ComponentStatus objects. Deprecated: This API is deprecated in v1.19+",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of ComponentStatus objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ComponentStatus",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ComponentStatusList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ConfigMap": {
    description: "ConfigMap holds configuration data for pods to consume.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      binaryData: {
        additionalProperties: {
          format: "byte",
          type: "string",
        },
        description:
          "BinaryData contains the binary data. Each key must consist of alphanumeric characters, '-', '_' or '.'. BinaryData can contain byte sequences that are not in the UTF-8 range. The keys stored in BinaryData must not overlap with the ones in the Data field, this is enforced during validation process. Using this field will require 1.10+ apiserver and kubelet.",
        type: "object",
      },
      data: {
        additionalProperties: {
          type: "string",
        },
        description:
          "Data contains the configuration data. Each key must consist of alphanumeric characters, '-', '_' or '.'. Values with non-UTF-8 byte sequences must use the BinaryData field. The keys stored in Data must not overlap with the keys in the BinaryData field, this is enforced during validation process.",
        type: "object",
      },
      immutable: {
        description:
          "Immutable, if set to true, ensures that data stored in the ConfigMap cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil.",
        type: "boolean",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ConfigMap",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ConfigMapEnvSource": {
    description:
      "ConfigMapEnvSource selects a ConfigMap to populate the environment variables with.\n\nThe contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.",
    properties: {
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description: "Specify whether the ConfigMap must be defined",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ConfigMapKeySelector": {
    description: "Selects a key from a ConfigMap.",
    properties: {
      key: {
        description: "The key to select.",
        type: "string",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description: "Specify whether the ConfigMap or its key must be defined",
        type: "boolean",
      },
    },
    required: ["key"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.ConfigMapList": {
    description:
      "ConfigMapList is a resource containing a list of ConfigMap objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of ConfigMaps.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ConfigMap",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ConfigMapList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ConfigMapNodeConfigSource": {
    description:
      "ConfigMapNodeConfigSource contains the information to reference a ConfigMap as a config source for the Node. This API is deprecated since 1.22: https://git.k8s.io/enhancements/keps/sig-node/281-dynamic-kubelet-configuration",
    properties: {
      kubeletConfigKey: {
        description:
          "KubeletConfigKey declares which key of the referenced ConfigMap corresponds to the KubeletConfiguration structure This field is required in all cases.",
        type: "string",
      },
      name: {
        description:
          "Name is the metadata.name of the referenced ConfigMap. This field is required in all cases.",
        type: "string",
      },
      namespace: {
        description:
          "Namespace is the metadata.namespace of the referenced ConfigMap. This field is required in all cases.",
        type: "string",
      },
      resourceVersion: {
        description:
          "ResourceVersion is the metadata.ResourceVersion of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.",
        type: "string",
      },
      uid: {
        description:
          "UID is the metadata.UID of the referenced ConfigMap. This field is forbidden in Node.Spec, and required in Node.Status.",
        type: "string",
      },
    },
    required: ["namespace", "name", "kubeletConfigKey"],
    type: "object",
  },
  "io.k8s.api.core.v1.ConfigMapProjection": {
    description:
      "Adapts a ConfigMap into a projected volume.\n\nThe contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.",
    properties: {
      items: {
        description:
          "items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.KeyToPath",
        },
        type: "array",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description:
          "optional specify whether the ConfigMap or its keys must be defined",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ConfigMapVolumeSource": {
    description:
      "Adapts a ConfigMap into a volume.\n\nThe contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling.",
    properties: {
      defaultMode: {
        description:
          "defaultMode is optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
        format: "int32",
        type: "integer",
      },
      items: {
        description:
          "items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.KeyToPath",
        },
        type: "array",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description:
          "optional specify whether the ConfigMap or its keys must be defined",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.Container": {
    description:
      "A single application container that you want to run within a pod.",
    properties: {
      args: {
        description:
          'Arguments to the entrypoint. The container image\'s CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container\'s environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell',
        items: {
          type: "string",
        },
        type: "array",
      },
      command: {
        description:
          'Entrypoint array. Not executed within a shell. The container image\'s ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container\'s environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell',
        items: {
          type: "string",
        },
        type: "array",
      },
      env: {
        description:
          "List of environment variables to set in the container. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EnvVar",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      envFrom: {
        description:
          "List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EnvFromSource",
        },
        type: "array",
      },
      image: {
        description:
          "Container image name. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.",
        type: "string",
      },
      imagePullPolicy: {
        description:
          "Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images",
        type: "string",
      },
      lifecycle: {
        $ref: "#/definitions/io.k8s.api.core.v1.Lifecycle",
        description:
          "Actions that the management system should take in response to container lifecycle events. Cannot be updated.",
      },
      livenessProbe: {
        $ref: "#/definitions/io.k8s.api.core.v1.Probe",
        description:
          "Periodic probe of container liveness. Container will be restarted if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
      },
      name: {
        description:
          "Name of the container specified as a DNS_LABEL. Each container in a pod must have a unique name (DNS_LABEL). Cannot be updated.",
        type: "string",
      },
      ports: {
        description:
          'List of ports to expose from the container. Not specifying a port here DOES NOT prevent that port from being exposed. Any port which is listening on the default "0.0.0.0" address inside a container will be accessible from the network. Modifying this array with strategic merge patch may corrupt the data. For more information See https://github.com/kubernetes/kubernetes/issues/108255. Cannot be updated.',
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerPort",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["containerPort", "protocol"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "containerPort",
        "x-kubernetes-patch-strategy": "merge",
      },
      readinessProbe: {
        $ref: "#/definitions/io.k8s.api.core.v1.Probe",
        description:
          "Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
      },
      resizePolicy: {
        description: "Resources resize policy for the container.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerResizePolicy",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resources: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceRequirements",
        description:
          "Compute Resources required by this container. Cannot be updated. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
      },
      restartPolicy: {
        description:
          'RestartPolicy defines the restart behavior of individual containers in a pod. This field may only be set for init containers, and the only allowed value is "Always". For non-init containers or when this field is not specified, the restart behavior is defined by the Pod\'s restart policy and the container type. Setting the RestartPolicy as "Always" for the init container will have the following effect: this init container will be continually restarted on exit until all regular containers have terminated. Once all regular containers have completed, all init containers with restartPolicy "Always" will be shut down. This lifecycle differs from normal init containers and is often referred to as a "sidecar" container. Although this init container still starts in the init container sequence, it does not wait for the container to complete before proceeding to the next init container. Instead, the next init container starts immediately after this init container is started, or after any startupProbe has successfully completed.',
        type: "string",
      },
      securityContext: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecurityContext",
        description:
          "SecurityContext defines the security options the container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext. More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/",
      },
      startupProbe: {
        $ref: "#/definitions/io.k8s.api.core.v1.Probe",
        description:
          "StartupProbe indicates that the Pod has successfully initialized. If specified, no other probes are executed until this completes successfully. If this probe fails, the Pod will be restarted, just as if the livenessProbe failed. This can be used to provide different probe parameters at the beginning of a Pod's lifecycle, when it might take a long time to load data or warm a cache, than during steady-state operation. This cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
      },
      stdin: {
        description:
          "Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.",
        type: "boolean",
      },
      stdinOnce: {
        description:
          "Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false",
        type: "boolean",
      },
      terminationMessagePath: {
        description:
          "Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.",
        type: "string",
      },
      terminationMessagePolicy: {
        description:
          "Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.",
        type: "string",
      },
      tty: {
        description:
          "Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.",
        type: "boolean",
      },
      volumeDevices: {
        description:
          "volumeDevices is the list of block devices to be used by the container.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.VolumeDevice",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "devicePath",
        "x-kubernetes-patch-strategy": "merge",
      },
      volumeMounts: {
        description:
          "Pod volumes to mount into the container's filesystem. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.VolumeMount",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "mountPath",
        "x-kubernetes-patch-strategy": "merge",
      },
      workingDir: {
        description:
          "Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerImage": {
    description: "Describe a container image",
    properties: {
      names: {
        description:
          'Names by which this image is known. e.g. ["kubernetes.example/hyperkube:v1.0.7", "cloud-vendor.registry.example/cloud-vendor/hyperkube:v1.0.7"]',
        items: {
          type: "string",
        },
        type: "array",
      },
      sizeBytes: {
        description: "The size of the image in bytes.",
        format: "int64",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerPort": {
    description:
      "ContainerPort represents a network port in a single container.",
    properties: {
      containerPort: {
        description:
          "Number of port to expose on the pod's IP address. This must be a valid port number, 0 < x < 65536.",
        format: "int32",
        type: "integer",
      },
      hostIP: {
        description: "What host IP to bind the external port to.",
        type: "string",
      },
      hostPort: {
        description:
          "Number of port to expose on the host. If specified, this must be a valid port number, 0 < x < 65536. If HostNetwork is specified, this must match ContainerPort. Most containers do not need this.",
        format: "int32",
        type: "integer",
      },
      name: {
        description:
          "If specified, this must be an IANA_SVC_NAME and unique within the pod. Each named port in a pod must have a unique name. Name for the port that can be referred to by services.",
        type: "string",
      },
      protocol: {
        description:
          'Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP".',
        type: "string",
      },
    },
    required: ["containerPort"],
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerResizePolicy": {
    description:
      "ContainerResizePolicy represents resource resize policy for the container.",
    properties: {
      resourceName: {
        description:
          "Name of the resource to which this resource resize policy applies. Supported values: cpu, memory.",
        type: "string",
      },
      restartPolicy: {
        description:
          "Restart policy to apply when specified resource is resized. If not specified, it defaults to NotRequired.",
        type: "string",
      },
    },
    required: ["resourceName", "restartPolicy"],
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerState": {
    description:
      "ContainerState holds a possible state of container. Only one of its members may be specified. If none of them is specified, the default one is ContainerStateWaiting.",
    properties: {
      running: {
        $ref: "#/definitions/io.k8s.api.core.v1.ContainerStateRunning",
        description: "Details about a running container",
      },
      terminated: {
        $ref: "#/definitions/io.k8s.api.core.v1.ContainerStateTerminated",
        description: "Details about a terminated container",
      },
      waiting: {
        $ref: "#/definitions/io.k8s.api.core.v1.ContainerStateWaiting",
        description: "Details about a waiting container",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerStateRunning": {
    description: "ContainerStateRunning is a running state of a container.",
    properties: {
      startedAt: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "Time at which the container was last (re-)started",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerStateTerminated": {
    description:
      "ContainerStateTerminated is a terminated state of a container.",
    properties: {
      containerID: {
        description: "Container's ID in the format '<type>://<container_id>'",
        type: "string",
      },
      exitCode: {
        description: "Exit status from the last termination of the container",
        format: "int32",
        type: "integer",
      },
      finishedAt: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "Time at which the container last terminated",
      },
      message: {
        description: "Message regarding the last termination of the container",
        type: "string",
      },
      reason: {
        description:
          "(brief) reason from the last termination of the container",
        type: "string",
      },
      signal: {
        description: "Signal from the last termination of the container",
        format: "int32",
        type: "integer",
      },
      startedAt: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Time at which previous execution of the container started",
      },
    },
    required: ["exitCode"],
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerStateWaiting": {
    description: "ContainerStateWaiting is a waiting state of a container.",
    properties: {
      message: {
        description: "Message regarding why the container is not yet running.",
        type: "string",
      },
      reason: {
        description: "(brief) reason the container is not yet running.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ContainerStatus": {
    description:
      "ContainerStatus contains details for the current status of this container.",
    properties: {
      allocatedResources: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "AllocatedResources represents the compute resources allocated for this container by the node. Kubelet sets this value to Container.Resources.Requests upon successful pod admission and after successfully admitting desired pod resize.",
        type: "object",
      },
      containerID: {
        description:
          "ContainerID is the ID of the container in the format '<type>://<container_id>'. Where type is a container runtime identifier, returned from Version call of CRI API (for example \"containerd\").",
        type: "string",
      },
      image: {
        description:
          "Image is the name of container image that the container is running. The container image may not match the image used in the PodSpec, as it may have been resolved by the runtime. More info: https://kubernetes.io/docs/concepts/containers/images.",
        type: "string",
      },
      imageID: {
        description:
          "ImageID is the image ID of the container's image. The image ID may not match the image ID of the image used in the PodSpec, as it may have been resolved by the runtime.",
        type: "string",
      },
      lastState: {
        $ref: "#/definitions/io.k8s.api.core.v1.ContainerState",
        description:
          "LastTerminationState holds the last termination state of the container to help debug container crashes and restarts. This field is not populated if the container is still running and RestartCount is 0.",
      },
      name: {
        description:
          "Name is a DNS_LABEL representing the unique name of the container. Each container in a pod must have a unique name across all container types. Cannot be updated.",
        type: "string",
      },
      ready: {
        description:
          "Ready specifies whether the container is currently passing its readiness check. The value will change as readiness probes keep executing. If no readiness probes are specified, this field defaults to true once the container is fully started (see Started field).\n\nThe value is typically used to determine whether a container is ready to accept traffic.",
        type: "boolean",
      },
      resources: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceRequirements",
        description:
          "Resources represents the compute resource requests and limits that have been successfully enacted on the running container after it has been started or has been successfully resized.",
      },
      restartCount: {
        description:
          "RestartCount holds the number of times the container has been restarted. Kubelet makes an effort to always increment the value, but there are cases when the state may be lost due to node restarts and then the value may be reset to 0. The value is never negative.",
        format: "int32",
        type: "integer",
      },
      started: {
        description:
          "Started indicates whether the container has finished its postStart lifecycle hook and passed its startup probe. Initialized as false, becomes true after startupProbe is considered successful. Resets to false when the container is restarted, or if kubelet loses state temporarily. In both cases, startup probes will run again. Is always true when no startupProbe is defined and container is running and has passed the postStart lifecycle hook. The null value must be treated the same as false.",
        type: "boolean",
      },
      state: {
        $ref: "#/definitions/io.k8s.api.core.v1.ContainerState",
        description:
          "State holds details about the container's current condition.",
      },
    },
    required: ["name", "ready", "restartCount", "image", "imageID"],
    type: "object",
  },
  "io.k8s.api.core.v1.DaemonEndpoint": {
    description:
      "DaemonEndpoint contains information about a single Daemon endpoint.",
    properties: {
      Port: {
        description: "Port number of the given endpoint.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["Port"],
    type: "object",
  },
  "io.k8s.api.core.v1.DownwardAPIProjection": {
    description:
      "Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode.",
    properties: {
      items: {
        description: "Items is a list of DownwardAPIVolume file",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.DownwardAPIVolumeFile",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.DownwardAPIVolumeFile": {
    description:
      "DownwardAPIVolumeFile represents information to create the file containing the pod field",
    properties: {
      fieldRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectFieldSelector",
        description:
          "Required: Selects a field of the pod: only annotations, labels, name and namespace are supported.",
      },
      mode: {
        description:
          "Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
        format: "int32",
        type: "integer",
      },
      path: {
        description:
          "Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'",
        type: "string",
      },
      resourceFieldRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceFieldSelector",
        description:
          "Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.",
      },
    },
    required: ["path"],
    type: "object",
  },
  "io.k8s.api.core.v1.DownwardAPIVolumeSource": {
    description:
      "DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.",
    properties: {
      defaultMode: {
        description:
          "Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
        format: "int32",
        type: "integer",
      },
      items: {
        description: "Items is a list of downward API volume file",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.DownwardAPIVolumeFile",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.EmptyDirVolumeSource": {
    description:
      "Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.",
    properties: {
      medium: {
        description:
          'medium represents what type of storage medium should back this directory. The default is "" which means to use the node\'s default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir',
        type: "string",
      },
      sizeLimit: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          "sizeLimit is the total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.EndpointAddress": {
    description: "EndpointAddress is a tuple that describes single IP address.",
    properties: {
      hostname: {
        description: "The Hostname of this endpoint",
        type: "string",
      },
      ip: {
        description:
          "The IP of this endpoint. May not be loopback (127.0.0.0/8 or ::1), link-local (169.254.0.0/16 or fe80::/10), or link-local multicast (224.0.0.0/24 or ff02::/16).",
        type: "string",
      },
      nodeName: {
        description:
          "Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.",
        type: "string",
      },
      targetRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description: "Reference to object providing the endpoint.",
      },
    },
    required: ["ip"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.EndpointPort": {
    description: "EndpointPort is a tuple that describes a single port.",
    properties: {
      appProtocol: {
        description:
          "The application protocol for this port. This is used as a hint for implementations to offer richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax. Valid values are either:\n\n* Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).\n\n* Kubernetes-defined prefixed names:\n  * 'kubernetes.io/h2c' - HTTP/2 over cleartext as described in https://www.rfc-editor.org/rfc/rfc7540\n  * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455\n  * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455\n\n* Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.",
        type: "string",
      },
      name: {
        description:
          "The name of this port.  This must match the 'name' field in the corresponding ServicePort. Must be a DNS_LABEL. Optional only if one port is defined.",
        type: "string",
      },
      port: {
        description: "The port number of the endpoint.",
        format: "int32",
        type: "integer",
      },
      protocol: {
        description:
          "The IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP.",
        type: "string",
      },
    },
    required: ["port"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.EndpointSubset": {
    description:
      'EndpointSubset is a group of addresses with a common set of ports. The expanded set of endpoints is the Cartesian product of Addresses x Ports. For example, given:\n\n\t{\n\t  Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],\n\t  Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]\n\t}\n\nThe resulting set of endpoints can be viewed as:\n\n\ta: [ 10.10.1.1:8675, 10.10.2.2:8675 ],\n\tb: [ 10.10.1.1:309, 10.10.2.2:309 ]',
    properties: {
      addresses: {
        description:
          "IP addresses which offer the related ports that are marked as ready. These endpoints should be considered safe for load balancers and clients to utilize.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EndpointAddress",
        },
        type: "array",
      },
      notReadyAddresses: {
        description:
          "IP addresses which offer the related ports but are not currently marked as ready because they have not yet finished starting, have recently failed a readiness check, or have recently failed a liveness check.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EndpointAddress",
        },
        type: "array",
      },
      ports: {
        description: "Port numbers available on the related IP addresses.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EndpointPort",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.Endpoints": {
    description:
      'Endpoints is a collection of endpoints that implement the actual service. Example:\n\n\t Name: "mysvc",\n\t Subsets: [\n\t   {\n\t     Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],\n\t     Ports: [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]\n\t   },\n\t   {\n\t     Addresses: [{"ip": "10.10.3.3"}],\n\t     Ports: [{"name": "a", "port": 93}, {"name": "b", "port": 76}]\n\t   },\n\t]',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      subsets: {
        description:
          "The set of all endpoints is the union of all subsets. Addresses are placed into subsets according to the IPs they share. A single address with multiple ports, some of which are ready and some of which are not (because they come from different containers) will result in the address being displayed in different subsets for the different ports. No address will appear in both Addresses and NotReadyAddresses in the same subset. Sets of addresses and ports that comprise a service.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EndpointSubset",
        },
        type: "array",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Endpoints",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.EndpointsList": {
    description: "EndpointsList is a list of endpoints.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of endpoints.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Endpoints",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "EndpointsList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.EnvFromSource": {
    description: "EnvFromSource represents the source of a set of ConfigMaps",
    properties: {
      configMapRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ConfigMapEnvSource",
        description: "The ConfigMap to select from",
      },
      prefix: {
        description:
          "An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.",
        type: "string",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretEnvSource",
        description: "The Secret to select from",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.EnvVar": {
    description:
      "EnvVar represents an environment variable present in a Container.",
    properties: {
      name: {
        description:
          "Name of the environment variable. Must be a C_IDENTIFIER.",
        type: "string",
      },
      value: {
        description:
          'Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".',
        type: "string",
      },
      valueFrom: {
        $ref: "#/definitions/io.k8s.api.core.v1.EnvVarSource",
        description:
          "Source for the environment variable's value. Cannot be used if value is not empty.",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.EnvVarSource": {
    description: "EnvVarSource represents a source for the value of an EnvVar.",
    properties: {
      configMapKeyRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ConfigMapKeySelector",
        description: "Selects a key of a ConfigMap.",
      },
      fieldRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectFieldSelector",
        description:
          "Selects a field of the pod: supports metadata.name, metadata.namespace, `metadata.labels['<KEY>']`, `metadata.annotations['<KEY>']`, spec.nodeName, spec.serviceAccountName, status.hostIP, status.podIP, status.podIPs.",
      },
      resourceFieldRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceFieldSelector",
        description:
          "Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, limits.ephemeral-storage, requests.cpu, requests.memory and requests.ephemeral-storage) are currently supported.",
      },
      secretKeyRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretKeySelector",
        description: "Selects a key of a secret in the pod's namespace",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.EphemeralContainer": {
    description:
      "An EphemeralContainer is a temporary container that you may add to an existing Pod for user-initiated activities such as debugging. Ephemeral containers have no resource or scheduling guarantees, and they will not be restarted when they exit or when a Pod is removed or restarted. The kubelet may evict a Pod if an ephemeral container causes the Pod to exceed its resource allocation.\n\nTo add an ephemeral container, use the ephemeralcontainers subresource of an existing Pod. Ephemeral containers may not be removed or restarted.",
    properties: {
      args: {
        description:
          'Arguments to the entrypoint. The image\'s CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container\'s environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell',
        items: {
          type: "string",
        },
        type: "array",
      },
      command: {
        description:
          'Entrypoint array. Not executed within a shell. The image\'s ENTRYPOINT is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container\'s environment. If a variable cannot be resolved, the reference in the input string will be unchanged. Double $$ are reduced to a single $, which allows for escaping the $(VAR_NAME) syntax: i.e. "$$(VAR_NAME)" will produce the string literal "$(VAR_NAME)". Escaped references will never be expanded, regardless of whether the variable exists or not. Cannot be updated. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell',
        items: {
          type: "string",
        },
        type: "array",
      },
      env: {
        description:
          "List of environment variables to set in the container. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EnvVar",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      envFrom: {
        description:
          "List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EnvFromSource",
        },
        type: "array",
      },
      image: {
        description:
          "Container image name. More info: https://kubernetes.io/docs/concepts/containers/images",
        type: "string",
      },
      imagePullPolicy: {
        description:
          "Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images",
        type: "string",
      },
      lifecycle: {
        $ref: "#/definitions/io.k8s.api.core.v1.Lifecycle",
        description: "Lifecycle is not allowed for ephemeral containers.",
      },
      livenessProbe: {
        $ref: "#/definitions/io.k8s.api.core.v1.Probe",
        description: "Probes are not allowed for ephemeral containers.",
      },
      name: {
        description:
          "Name of the ephemeral container specified as a DNS_LABEL. This name must be unique among all containers, init containers and ephemeral containers.",
        type: "string",
      },
      ports: {
        description: "Ports are not allowed for ephemeral containers.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerPort",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["containerPort", "protocol"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "containerPort",
        "x-kubernetes-patch-strategy": "merge",
      },
      readinessProbe: {
        $ref: "#/definitions/io.k8s.api.core.v1.Probe",
        description: "Probes are not allowed for ephemeral containers.",
      },
      resizePolicy: {
        description: "Resources resize policy for the container.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerResizePolicy",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resources: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceRequirements",
        description:
          "Resources are not allowed for ephemeral containers. Ephemeral containers use spare resources already allocated to the pod.",
      },
      restartPolicy: {
        description:
          "Restart policy for the container to manage the restart behavior of each container within a pod. This may only be set for init containers. You cannot set this field on ephemeral containers.",
        type: "string",
      },
      securityContext: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecurityContext",
        description:
          "Optional: SecurityContext defines the security options the ephemeral container should be run with. If set, the fields of SecurityContext override the equivalent fields of PodSecurityContext.",
      },
      startupProbe: {
        $ref: "#/definitions/io.k8s.api.core.v1.Probe",
        description: "Probes are not allowed for ephemeral containers.",
      },
      stdin: {
        description:
          "Whether this container should allocate a buffer for stdin in the container runtime. If this is not set, reads from stdin in the container will always result in EOF. Default is false.",
        type: "boolean",
      },
      stdinOnce: {
        description:
          "Whether the container runtime should close the stdin channel after it has been opened by a single attach. When stdin is true the stdin stream will remain open across multiple attach sessions. If stdinOnce is set to true, stdin is opened on container start, is empty until the first client attaches to stdin, and then remains open and accepts data until the client disconnects, at which time stdin is closed and remains closed until the container is restarted. If this flag is false, a container processes that reads from stdin will never receive an EOF. Default is false",
        type: "boolean",
      },
      targetContainerName: {
        description:
          "If set, the name of the container from PodSpec that this ephemeral container targets. The ephemeral container will be run in the namespaces (IPC, PID, etc) of this container. If not set then the ephemeral container uses the namespaces configured in the Pod spec.\n\nThe container runtime must implement support for this feature. If the runtime does not support namespace targeting then the result of setting this field is undefined.",
        type: "string",
      },
      terminationMessagePath: {
        description:
          "Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log. Cannot be updated.",
        type: "string",
      },
      terminationMessagePolicy: {
        description:
          "Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.",
        type: "string",
      },
      tty: {
        description:
          "Whether this container should allocate a TTY for itself, also requires 'stdin' to be true. Default is false.",
        type: "boolean",
      },
      volumeDevices: {
        description:
          "volumeDevices is the list of block devices to be used by the container.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.VolumeDevice",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "devicePath",
        "x-kubernetes-patch-strategy": "merge",
      },
      volumeMounts: {
        description:
          "Pod volumes to mount into the container's filesystem. Subpath mounts are not allowed for ephemeral containers. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.VolumeMount",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "mountPath",
        "x-kubernetes-patch-strategy": "merge",
      },
      workingDir: {
        description:
          "Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image. Cannot be updated.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.EphemeralVolumeSource": {
    description:
      "Represents an ephemeral volume that is handled by a normal storage driver.",
    properties: {
      volumeClaimTemplate: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaimTemplate",
        description:
          "Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `<pod name>-<volume name>` where `<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).\n\nAn existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.\n\nThis field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.\n\nRequired, must not be nil.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.Event": {
    description:
      "Event is a report of an event somewhere in the cluster.  Events have a limited retention time and triggers and messages may evolve with time.  Event consumers should not rely on the timing of an event with a given Reason reflecting a consistent underlying trigger, or the continued existence of events with that Reason.  Events should be treated as informative, best-effort, supplemental data.",
    properties: {
      action: {
        description:
          "What action was taken/failed regarding to the Regarding object.",
        type: "string",
      },
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      count: {
        description: "The number of times this event has occurred.",
        format: "int32",
        type: "integer",
      },
      eventTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime",
        description: "Time when this Event was first observed.",
      },
      firstTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "The time at which the event was first recorded. (Time of server receipt is in TypeMeta.)",
      },
      involvedObject: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description: "The object that this event is about.",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      lastTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "The time at which the most recent occurrence of this event was recorded.",
      },
      message: {
        description:
          "A human-readable description of the status of this operation.",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      reason: {
        description:
          "This should be a short, machine understandable string that gives the reason for the transition into the object's current status.",
        type: "string",
      },
      related: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description: "Optional secondary object for more complex actions.",
      },
      reportingComponent: {
        description:
          "Name of the controller that emitted this Event, e.g. `kubernetes.io/kubelet`.",
        type: "string",
      },
      reportingInstance: {
        description: "ID of the controller instance, e.g. `kubelet-xyzf`.",
        type: "string",
      },
      series: {
        $ref: "#/definitions/io.k8s.api.core.v1.EventSeries",
        description:
          "Data about the Event series this event represents or nil if it's a singleton Event.",
      },
      source: {
        $ref: "#/definitions/io.k8s.api.core.v1.EventSource",
        description:
          "The component reporting this event. Should be a short machine understandable string.",
      },
      type: {
        description:
          "Type of this event (Normal, Warning), new types could be added in the future",
        type: "string",
      },
    },
    required: ["metadata", "involvedObject"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Event",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.EventList": {
    description: "EventList is a list of events.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of events",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Event",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "EventList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.EventSeries": {
    description:
      "EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time.",
    properties: {
      count: {
        description:
          "Number of occurrences in this series up to the last heartbeat time",
        format: "int32",
        type: "integer",
      },
      lastObservedTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime",
        description: "Time of the last occurrence observed",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.EventSource": {
    description: "EventSource contains information for an event.",
    properties: {
      component: {
        description: "Component from which the event is generated.",
        type: "string",
      },
      host: {
        description: "Node name on which the event is generated.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ExecAction": {
    description: 'ExecAction describes a "run in container" action.',
    properties: {
      command: {
        description:
          "Command is the command line to execute inside the container, the working directory for the command  is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.FCVolumeSource": {
    description:
      "Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      lun: {
        description: "lun is Optional: FC target lun number",
        format: "int32",
        type: "integer",
      },
      readOnly: {
        description:
          "readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      targetWWNs: {
        description: "targetWWNs is Optional: FC target worldwide names (WWNs)",
        items: {
          type: "string",
        },
        type: "array",
      },
      wwids: {
        description:
          "wwids Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.FlexPersistentVolumeSource": {
    description:
      "FlexPersistentVolumeSource represents a generic persistent volume resource that is provisioned/attached using an exec based plugin.",
    properties: {
      driver: {
        description: "driver is the name of the driver to use for this volume.",
        type: "string",
      },
      fsType: {
        description:
          'fsType is the Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.',
        type: "string",
      },
      options: {
        additionalProperties: {
          type: "string",
        },
        description:
          "options is Optional: this field holds extra command options if any.",
        type: "object",
      },
      readOnly: {
        description:
          "readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "secretRef is Optional: SecretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.",
      },
    },
    required: ["driver"],
    type: "object",
  },
  "io.k8s.api.core.v1.FlexVolumeSource": {
    description:
      "FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.",
    properties: {
      driver: {
        description: "driver is the name of the driver to use for this volume.",
        type: "string",
      },
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.',
        type: "string",
      },
      options: {
        additionalProperties: {
          type: "string",
        },
        description:
          "options is Optional: this field holds extra command options if any.",
        type: "object",
      },
      readOnly: {
        description:
          "readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef is Optional: secretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.",
      },
    },
    required: ["driver"],
    type: "object",
  },
  "io.k8s.api.core.v1.FlockerVolumeSource": {
    description:
      "Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling.",
    properties: {
      datasetName: {
        description:
          "datasetName is Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated",
        type: "string",
      },
      datasetUUID: {
        description:
          "datasetUUID is the UUID of the dataset. This is unique identifier of a Flocker dataset",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.GCEPersistentDiskVolumeSource": {
    description:
      "Represents a Persistent Disk resource in Google Compute Engine.\n\nA GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType is filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk',
        type: "string",
      },
      partition: {
        description:
          'partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk',
        format: "int32",
        type: "integer",
      },
      pdName: {
        description:
          "pdName is unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk",
        type: "boolean",
      },
    },
    required: ["pdName"],
    type: "object",
  },
  "io.k8s.api.core.v1.GRPCAction": {
    properties: {
      port: {
        description:
          "Port number of the gRPC service. Number must be in the range 1 to 65535.",
        format: "int32",
        type: "integer",
      },
      service: {
        description:
          "Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md).\n\nIf this is not specified, the default behavior is defined by gRPC.",
        type: "string",
      },
    },
    required: ["port"],
    type: "object",
  },
  "io.k8s.api.core.v1.GitRepoVolumeSource": {
    description:
      "Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.\n\nDEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.",
    properties: {
      directory: {
        description:
          "directory is the target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.",
        type: "string",
      },
      repository: {
        description: "repository is the URL",
        type: "string",
      },
      revision: {
        description: "revision is the commit hash for the specified revision.",
        type: "string",
      },
    },
    required: ["repository"],
    type: "object",
  },
  "io.k8s.api.core.v1.GlusterfsPersistentVolumeSource": {
    description:
      "Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.",
    properties: {
      endpoints: {
        description:
          "endpoints is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "string",
      },
      endpointsNamespace: {
        description:
          "endpointsNamespace is the namespace that contains Glusterfs endpoint. If this field is empty, the EndpointNamespace defaults to the same namespace as the bound PVC. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "string",
      },
      path: {
        description:
          "path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "boolean",
      },
    },
    required: ["endpoints", "path"],
    type: "object",
  },
  "io.k8s.api.core.v1.GlusterfsVolumeSource": {
    description:
      "Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.",
    properties: {
      endpoints: {
        description:
          "endpoints is the endpoint name that details Glusterfs topology. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "string",
      },
      path: {
        description:
          "path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod",
        type: "boolean",
      },
    },
    required: ["endpoints", "path"],
    type: "object",
  },
  "io.k8s.api.core.v1.HTTPGetAction": {
    description:
      "HTTPGetAction describes an action based on HTTP Get requests.",
    properties: {
      host: {
        description:
          'Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.',
        type: "string",
      },
      httpHeaders: {
        description:
          "Custom headers to set in the request. HTTP allows repeated headers.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.HTTPHeader",
        },
        type: "array",
      },
      path: {
        description: "Path to access on the HTTP server.",
        type: "string",
      },
      port: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "Name or number of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.",
      },
      scheme: {
        description:
          "Scheme to use for connecting to the host. Defaults to HTTP.",
        type: "string",
      },
    },
    required: ["port"],
    type: "object",
  },
  "io.k8s.api.core.v1.HTTPHeader": {
    description:
      "HTTPHeader describes a custom header to be used in HTTP probes",
    properties: {
      name: {
        description:
          "The header field name. This will be canonicalized upon output, so case-variant names will be understood as the same header.",
        type: "string",
      },
      value: {
        description: "The header field value",
        type: "string",
      },
    },
    required: ["name", "value"],
    type: "object",
  },
  "io.k8s.api.core.v1.HostAlias": {
    description:
      "HostAlias holds the mapping between IP and hostnames that will be injected as an entry in the pod's hosts file.",
    properties: {
      hostnames: {
        description: "Hostnames for the above IP address.",
        items: {
          type: "string",
        },
        type: "array",
      },
      ip: {
        description: "IP address of the host file entry.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.HostIP": {
    description: "HostIP represents a single IP address allocated to the host.",
    properties: {
      ip: {
        description: "IP is the IP address assigned to the host",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.HostPathVolumeSource": {
    description:
      "Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.",
    properties: {
      path: {
        description:
          "path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath",
        type: "string",
      },
      type: {
        description:
          'type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath',
        type: "string",
      },
    },
    required: ["path"],
    type: "object",
  },
  "io.k8s.api.core.v1.ISCSIPersistentVolumeSource": {
    description:
      "ISCSIPersistentVolumeSource represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.",
    properties: {
      chapAuthDiscovery: {
        description:
          "chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication",
        type: "boolean",
      },
      chapAuthSession: {
        description:
          "chapAuthSession defines whether support iSCSI Session CHAP authentication",
        type: "boolean",
      },
      fsType: {
        description:
          'fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi',
        type: "string",
      },
      initiatorName: {
        description:
          "initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface <target portal>:<volume name> will be created for the connection.",
        type: "string",
      },
      iqn: {
        description: "iqn is Target iSCSI Qualified Name.",
        type: "string",
      },
      iscsiInterface: {
        description:
          "iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).",
        type: "string",
      },
      lun: {
        description: "lun is iSCSI Target Lun number.",
        format: "int32",
        type: "integer",
      },
      portals: {
        description:
          "portals is the iSCSI Target Portal List. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).",
        items: {
          type: "string",
        },
        type: "array",
      },
      readOnly: {
        description:
          "readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "secretRef is the CHAP Secret for iSCSI target and initiator authentication",
      },
      targetPortal: {
        description:
          "targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).",
        type: "string",
      },
    },
    required: ["targetPortal", "iqn", "lun"],
    type: "object",
  },
  "io.k8s.api.core.v1.ISCSIVolumeSource": {
    description:
      "Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.",
    properties: {
      chapAuthDiscovery: {
        description:
          "chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication",
        type: "boolean",
      },
      chapAuthSession: {
        description:
          "chapAuthSession defines whether support iSCSI Session CHAP authentication",
        type: "boolean",
      },
      fsType: {
        description:
          'fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi',
        type: "string",
      },
      initiatorName: {
        description:
          "initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface <target portal>:<volume name> will be created for the connection.",
        type: "string",
      },
      iqn: {
        description: "iqn is the target iSCSI Qualified Name.",
        type: "string",
      },
      iscsiInterface: {
        description:
          "iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).",
        type: "string",
      },
      lun: {
        description: "lun represents iSCSI Target Lun number.",
        format: "int32",
        type: "integer",
      },
      portals: {
        description:
          "portals is the iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).",
        items: {
          type: "string",
        },
        type: "array",
      },
      readOnly: {
        description:
          "readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef is the CHAP Secret for iSCSI target and initiator authentication",
      },
      targetPortal: {
        description:
          "targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).",
        type: "string",
      },
    },
    required: ["targetPortal", "iqn", "lun"],
    type: "object",
  },
  "io.k8s.api.core.v1.KeyToPath": {
    description: "Maps a string key to a path within a volume.",
    properties: {
      key: {
        description: "key is the key to project.",
        type: "string",
      },
      mode: {
        description:
          "mode is Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
        format: "int32",
        type: "integer",
      },
      path: {
        description:
          "path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.",
        type: "string",
      },
    },
    required: ["key", "path"],
    type: "object",
  },
  "io.k8s.api.core.v1.Lifecycle": {
    description:
      "Lifecycle describes actions that the management system should take in response to container lifecycle events. For the PostStart and PreStop lifecycle handlers, management of the container blocks until the action is complete, unless the container process fails, in which case the handler is aborted.",
    properties: {
      postStart: {
        $ref: "#/definitions/io.k8s.api.core.v1.LifecycleHandler",
        description:
          "PostStart is called immediately after a container is created. If the handler fails, the container is terminated and restarted according to its restart policy. Other management of the container blocks until the hook completes. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks",
      },
      preStop: {
        $ref: "#/definitions/io.k8s.api.core.v1.LifecycleHandler",
        description:
          "PreStop is called immediately before a container is terminated due to an API request or management event such as liveness/startup probe failure, preemption, resource contention, etc. The handler is not called if the container crashes or exits. The Pod's termination grace period countdown begins before the PreStop hook is executed. Regardless of the outcome of the handler, the container will eventually terminate within the Pod's termination grace period (unless delayed by finalizers). Other management of the container blocks until the hook completes or until the termination grace period is reached. More info: https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.LifecycleHandler": {
    description:
      "LifecycleHandler defines a specific action that should be taken in a lifecycle hook. One and only one of the fields, except TCPSocket must be specified.",
    properties: {
      exec: {
        $ref: "#/definitions/io.k8s.api.core.v1.ExecAction",
        description: "Exec specifies the action to take.",
      },
      httpGet: {
        $ref: "#/definitions/io.k8s.api.core.v1.HTTPGetAction",
        description: "HTTPGet specifies the http request to perform.",
      },
      tcpSocket: {
        $ref: "#/definitions/io.k8s.api.core.v1.TCPSocketAction",
        description:
          "Deprecated. TCPSocket is NOT supported as a LifecycleHandler and kept for the backward compatibility. There are no validation of this field and lifecycle hooks will fail in runtime when tcp handler is specified.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.LimitRange": {
    description:
      "LimitRange sets resource usage limits for each kind of resource in a Namespace.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.LimitRangeSpec",
        description:
          "Spec defines the limits enforced. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "LimitRange",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.LimitRangeItem": {
    description:
      "LimitRangeItem defines a min/max usage limit for any resource that matches on kind.",
    properties: {
      default: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Default resource requirement limit value by resource name if resource limit is omitted.",
        type: "object",
      },
      defaultRequest: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "DefaultRequest is the default resource requirement request value by resource name if resource request is omitted.",
        type: "object",
      },
      max: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description: "Max usage constraints on this kind by resource name.",
        type: "object",
      },
      maxLimitRequestRatio: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "MaxLimitRequestRatio if specified, the named resource must have a request and limit that are both non-zero where limit divided by request is less than or equal to the enumerated value; this represents the max burst for the named resource.",
        type: "object",
      },
      min: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description: "Min usage constraints on this kind by resource name.",
        type: "object",
      },
      type: {
        description: "Type of resource that this limit applies to.",
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
  },
  "io.k8s.api.core.v1.LimitRangeList": {
    description: "LimitRangeList is a list of LimitRange items.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "Items is a list of LimitRange objects. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.LimitRange",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "LimitRangeList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.LimitRangeSpec": {
    description:
      "LimitRangeSpec defines a min/max usage limit for resources that match on kind.",
    properties: {
      limits: {
        description:
          "Limits is the list of LimitRangeItem objects that are enforced.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.LimitRangeItem",
        },
        type: "array",
      },
    },
    required: ["limits"],
    type: "object",
  },
  "io.k8s.api.core.v1.LoadBalancerIngress": {
    description:
      "LoadBalancerIngress represents the status of a load-balancer ingress point: traffic intended for the service should be sent to an ingress point.",
    properties: {
      hostname: {
        description:
          "Hostname is set for load-balancer ingress points that are DNS based (typically AWS load-balancers)",
        type: "string",
      },
      ip: {
        description:
          "IP is set for load-balancer ingress points that are IP based (typically GCE or OpenStack load-balancers)",
        type: "string",
      },
      ipMode: {
        description:
          'IPMode specifies how the load-balancer IP behaves, and may only be specified when the ip field is specified. Setting this to "VIP" indicates that traffic is delivered to the node with the destination set to the load-balancer\'s IP and port. Setting this to "Proxy" indicates that traffic is delivered to the node or pod with the destination set to the node\'s IP and node port or the pod\'s IP and port. Service implementations may use this information to adjust traffic routing.',
        type: "string",
      },
      ports: {
        description:
          "Ports is a list of records of service ports If used, every port defined in the service should have an entry in it",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PortStatus",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.LoadBalancerStatus": {
    description: "LoadBalancerStatus represents the status of a load-balancer.",
    properties: {
      ingress: {
        description:
          "Ingress is a list containing ingress points for the load-balancer. Traffic intended for the service should be sent to these ingress points.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.LoadBalancerIngress",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.LocalObjectReference": {
    description:
      "LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace.",
    properties: {
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.LocalVolumeSource": {
    description:
      "Local represents directly-attached storage with node affinity (Beta feature)",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. It applies only when the Path is a block device. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default value is to auto-select a filesystem if unspecified.',
        type: "string",
      },
      path: {
        description:
          "path of the full path to the volume on the node. It can be either a directory or block device (disk, partition, ...).",
        type: "string",
      },
    },
    required: ["path"],
    type: "object",
  },
  "io.k8s.api.core.v1.NFSVolumeSource": {
    description:
      "Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.",
    properties: {
      path: {
        description:
          "path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs",
        type: "boolean",
      },
      server: {
        description:
          "server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs",
        type: "string",
      },
    },
    required: ["server", "path"],
    type: "object",
  },
  "io.k8s.api.core.v1.Namespace": {
    description:
      "Namespace provides a scope for Names. Use of multiple namespaces is optional.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.NamespaceSpec",
        description:
          "Spec defines the behavior of the Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.NamespaceStatus",
        description:
          "Status describes the current status of a Namespace. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Namespace",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.NamespaceCondition": {
    description:
      "NamespaceCondition contains details about state of namespace.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
      },
      message: {
        type: "string",
      },
      reason: {
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of namespace controller condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.core.v1.NamespaceList": {
    description: "NamespaceList is a list of Namespaces.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "Items is the list of Namespace objects in the list. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Namespace",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "NamespaceList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.NamespaceSpec": {
    description: "NamespaceSpec describes the attributes on a Namespace.",
    properties: {
      finalizers: {
        description:
          "Finalizers is an opaque list of values that must be empty to permanently remove object from storage. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NamespaceStatus": {
    description:
      "NamespaceStatus is information about the current status of a Namespace.",
    properties: {
      conditions: {
        description:
          "Represents the latest available observations of a namespace's current state.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.NamespaceCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      phase: {
        description:
          "Phase is the current lifecycle phase of the namespace. More info: https://kubernetes.io/docs/tasks/administer-cluster/namespaces/",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.Node": {
    description:
      "Node is a worker node in Kubernetes. Each node will have a unique identifier in the cache (i.e. in etcd).",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSpec",
        description:
          "Spec defines the behavior of a node. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeStatus",
        description:
          "Most recently observed status of the node. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Node",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.NodeAddress": {
    description: "NodeAddress contains information for the node's address.",
    properties: {
      address: {
        description: "The node address.",
        type: "string",
      },
      type: {
        description:
          "Node address type, one of Hostname, ExternalIP or InternalIP.",
        type: "string",
      },
    },
    required: ["type", "address"],
    type: "object",
  },
  "io.k8s.api.core.v1.NodeAffinity": {
    description: "Node affinity is a group of node affinity scheduling rules.",
    properties: {
      preferredDuringSchedulingIgnoredDuringExecution: {
        description:
          'The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node matches the corresponding matchExpressions; the node(s) with the highest sum are the most preferred.',
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PreferredSchedulingTerm",
        },
        type: "array",
      },
      requiredDuringSchedulingIgnoredDuringExecution: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSelector",
        description:
          "If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to an update), the system may or may not try to eventually evict the pod from its node.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NodeCondition": {
    description: "NodeCondition contains condition information for a node.",
    properties: {
      lastHeartbeatTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "Last time we got an update on a given condition.",
      },
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transit from one status to another.",
      },
      message: {
        description:
          "Human readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description: "(brief) reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of node condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.core.v1.NodeConfigSource": {
    description:
      "NodeConfigSource specifies a source of node configuration. Exactly one subfield (excluding metadata) must be non-nil. This API is deprecated since 1.22",
    properties: {
      configMap: {
        $ref: "#/definitions/io.k8s.api.core.v1.ConfigMapNodeConfigSource",
        description: "ConfigMap is a reference to a Node's ConfigMap",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NodeConfigStatus": {
    description:
      "NodeConfigStatus describes the status of the config assigned by Node.Spec.ConfigSource.",
    properties: {
      active: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeConfigSource",
        description:
          "Active reports the checkpointed config the node is actively using. Active will represent either the current version of the Assigned config, or the current LastKnownGood config, depending on whether attempting to use the Assigned config results in an error.",
      },
      assigned: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeConfigSource",
        description:
          "Assigned reports the checkpointed config the node will try to use. When Node.Spec.ConfigSource is updated, the node checkpoints the associated config payload to local disk, along with a record indicating intended config. The node refers to this record to choose its config checkpoint, and reports this record in Assigned. Assigned only updates in the status after the record has been checkpointed to disk. When the Kubelet is restarted, it tries to make the Assigned config the Active config by loading and validating the checkpointed payload identified by Assigned.",
      },
      error: {
        description:
          "Error describes any problems reconciling the Spec.ConfigSource to the Active config. Errors may occur, for example, attempting to checkpoint Spec.ConfigSource to the local Assigned record, attempting to checkpoint the payload associated with Spec.ConfigSource, attempting to load or validate the Assigned config, etc. Errors may occur at different points while syncing config. Earlier errors (e.g. download or checkpointing errors) will not result in a rollback to LastKnownGood, and may resolve across Kubelet retries. Later errors (e.g. loading or validating a checkpointed config) will result in a rollback to LastKnownGood. In the latter case, it is usually possible to resolve the error by fixing the config assigned in Spec.ConfigSource. You can find additional information for debugging by searching the error message in the Kubelet log. Error is a human-readable description of the error state; machines can check whether or not Error is empty, but should not rely on the stability of the Error text across Kubelet versions.",
        type: "string",
      },
      lastKnownGood: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeConfigSource",
        description:
          "LastKnownGood reports the checkpointed config the node will fall back to when it encounters an error attempting to use the Assigned config. The Assigned config becomes the LastKnownGood config when the node determines that the Assigned config is stable and correct. This is currently implemented as a 10-minute soak period starting when the local record of Assigned config is updated. If the Assigned config is Active at the end of this period, it becomes the LastKnownGood. Note that if Spec.ConfigSource is reset to nil (use local defaults), the LastKnownGood is also immediately reset to nil, because the local default config is always assumed good. You should not make assumptions about the node's method of determining config stability and correctness, as this may change or become configurable in the future.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NodeDaemonEndpoints": {
    description:
      "NodeDaemonEndpoints lists ports opened by daemons running on the Node.",
    properties: {
      kubeletEndpoint: {
        $ref: "#/definitions/io.k8s.api.core.v1.DaemonEndpoint",
        description: "Endpoint on which Kubelet is listening.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NodeList": {
    description:
      "NodeList is the whole list of all Nodes which have been registered with master.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of nodes",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Node",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "NodeList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.NodeSelector": {
    description:
      "A node selector represents the union of the results of one or more label queries over a set of nodes; that is, it represents the OR of the selectors represented by the node selector terms.",
    properties: {
      nodeSelectorTerms: {
        description:
          "Required. A list of node selector terms. The terms are ORed.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.NodeSelectorTerm",
        },
        type: "array",
      },
    },
    required: ["nodeSelectorTerms"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.NodeSelectorRequirement": {
    description:
      "A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values.",
    properties: {
      key: {
        description: "The label key that the selector applies to.",
        type: "string",
      },
      operator: {
        description:
          "Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.",
        type: "string",
      },
      values: {
        description:
          "An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["key", "operator"],
    type: "object",
  },
  "io.k8s.api.core.v1.NodeSelectorTerm": {
    description:
      "A null or empty node selector term matches no objects. The requirements of them are ANDed. The TopologySelectorTerm type implements a subset of the NodeSelectorTerm.",
    properties: {
      matchExpressions: {
        description: "A list of node selector requirements by node's labels.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.NodeSelectorRequirement",
        },
        type: "array",
      },
      matchFields: {
        description: "A list of node selector requirements by node's fields.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.NodeSelectorRequirement",
        },
        type: "array",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.NodeSpec": {
    description:
      "NodeSpec describes the attributes that a node is created with.",
    properties: {
      configSource: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeConfigSource",
        description:
          "Deprecated: Previously used to specify the source of the node's configuration for the DynamicKubeletConfig feature. This feature is removed.",
      },
      externalID: {
        description:
          "Deprecated. Not all kubelets will set this field. Remove field after 1.13. see: https://issues.k8s.io/61966",
        type: "string",
      },
      podCIDR: {
        description:
          "PodCIDR represents the pod IP range assigned to the node.",
        type: "string",
      },
      podCIDRs: {
        description:
          "podCIDRs represents the IP ranges assigned to the node for usage by Pods on that node. If this field is specified, the 0th entry must match the podCIDR field. It may contain at most 1 value for each of IPv4 and IPv6.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-patch-strategy": "merge",
      },
      providerID: {
        description:
          "ID of the node assigned by the cloud provider in the format: <ProviderName>://<ProviderSpecificNodeID>",
        type: "string",
      },
      taints: {
        description: "If specified, the node's taints.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Taint",
        },
        type: "array",
      },
      unschedulable: {
        description:
          "Unschedulable controls node schedulability of new pods. By default, node is schedulable. More info: https://kubernetes.io/docs/concepts/nodes/node/#manual-node-administration",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NodeStatus": {
    description:
      "NodeStatus is information about the current status of a node.",
    properties: {
      addresses: {
        description:
          "List of addresses reachable to the node. Queried from cloud provider, if available. More info: https://kubernetes.io/docs/concepts/nodes/node/#addresses Note: This field is declared as mergeable, but the merge key is not sufficiently unique, which can cause data corruption when it is merged. Callers should instead use a full-replacement patch. See https://pr.k8s.io/79391 for an example. Consumers should assume that addresses can change during the lifetime of a Node. However, there are some exceptions where this may not be possible, such as Pods that inherit a Node's address in its own status or consumers of the downward API (status.hostIP).",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.NodeAddress",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      allocatable: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity.",
        type: "object",
      },
      capacity: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Capacity represents the total resources of a node. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity",
        type: "object",
      },
      conditions: {
        description:
          "Conditions is an array of current observed node conditions. More info: https://kubernetes.io/docs/concepts/nodes/node/#condition",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.NodeCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      config: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeConfigStatus",
        description:
          "Status of the config assigned to the node via the dynamic Kubelet config feature.",
      },
      daemonEndpoints: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeDaemonEndpoints",
        description: "Endpoints of daemons running on the Node.",
      },
      images: {
        description: "List of container images on this node",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerImage",
        },
        type: "array",
      },
      nodeInfo: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSystemInfo",
        description:
          "Set of ids/uuids to uniquely identify the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#info",
      },
      phase: {
        description:
          "NodePhase is the recently observed lifecycle phase of the node. More info: https://kubernetes.io/docs/concepts/nodes/node/#phase The field is never populated, and now is deprecated.",
        type: "string",
      },
      volumesAttached: {
        description: "List of volumes that are attached to the node.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.AttachedVolume",
        },
        type: "array",
      },
      volumesInUse: {
        description: "List of attachable volumes in use (mounted) by the node.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.NodeSystemInfo": {
    description:
      "NodeSystemInfo is a set of ids/uuids to uniquely identify the node.",
    properties: {
      architecture: {
        description: "The Architecture reported by the node",
        type: "string",
      },
      bootID: {
        description: "Boot ID reported by the node.",
        type: "string",
      },
      containerRuntimeVersion: {
        description:
          "ContainerRuntime Version reported by the node through runtime remote API (e.g. containerd://1.4.2).",
        type: "string",
      },
      kernelVersion: {
        description:
          "Kernel Version reported by the node from 'uname -r' (e.g. 3.16.0-0.bpo.4-amd64).",
        type: "string",
      },
      kubeProxyVersion: {
        description: "KubeProxy Version reported by the node.",
        type: "string",
      },
      kubeletVersion: {
        description: "Kubelet Version reported by the node.",
        type: "string",
      },
      machineID: {
        description:
          "MachineID reported by the node. For unique machine identification in the cluster this field is preferred. Learn more from man(5) machine-id: http://man7.org/linux/man-pages/man5/machine-id.5.html",
        type: "string",
      },
      operatingSystem: {
        description: "The Operating System reported by the node",
        type: "string",
      },
      osImage: {
        description:
          "OS Image reported by the node from /etc/os-release (e.g. Debian GNU/Linux 7 (wheezy)).",
        type: "string",
      },
      systemUUID: {
        description:
          "SystemUUID reported by the node. For unique machine identification MachineID is preferred. This field is specific to Red Hat hosts https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/rhsm/uuid",
        type: "string",
      },
    },
    required: [
      "machineID",
      "systemUUID",
      "bootID",
      "kernelVersion",
      "osImage",
      "containerRuntimeVersion",
      "kubeletVersion",
      "kubeProxyVersion",
      "operatingSystem",
      "architecture",
    ],
    type: "object",
  },
  "io.k8s.api.core.v1.ObjectFieldSelector": {
    description:
      "ObjectFieldSelector selects an APIVersioned field of an object.",
    properties: {
      apiVersion: {
        description:
          'Version of the schema the FieldPath is written in terms of, defaults to "v1".',
        type: "string",
      },
      fieldPath: {
        description:
          "Path of the field to select in the specified API version.",
        type: "string",
      },
    },
    required: ["fieldPath"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.ObjectReference": {
    description:
      "ObjectReference contains enough information to let you inspect or modify the referred object.",
    properties: {
      apiVersion: {
        description: "API version of the referent.",
        type: "string",
      },
      fieldPath: {
        description:
          'If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.',
        type: "string",
      },
      kind: {
        description:
          "Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      namespace: {
        description:
          "Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/",
        type: "string",
      },
      resourceVersion: {
        description:
          "Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency",
        type: "string",
      },
      uid: {
        description:
          "UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.PersistentVolume": {
    description:
      "PersistentVolume (PV) is a storage resource provisioned by an administrator. It is analogous to a node. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeSpec",
        description:
          "spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeStatus",
        description:
          "status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PersistentVolume",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PersistentVolumeClaim": {
    description:
      "PersistentVolumeClaim is a user's request for and claim to a persistent volume",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaimSpec",
        description:
          "spec defines the desired characteristics of a volume requested by a pod author. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaimStatus",
        description:
          "status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PersistentVolumeClaim",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PersistentVolumeClaimCondition": {
    description:
      "PersistentVolumeClaimCondition contains details about state of pvc",
    properties: {
      lastProbeTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "lastProbeTime is the time we probed the condition.",
      },
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastTransitionTime is the time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "message is the human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          'reason is a unique, this should be a short, machine understandable string that gives the reason for condition\'s last transition. If it reports "ResizeStarted" that means the underlying persistent volume is being resized.',
        type: "string",
      },
      status: {
        type: "string",
      },
      type: {
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.core.v1.PersistentVolumeClaimList": {
    description:
      "PersistentVolumeClaimList is a list of PersistentVolumeClaim items.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "items is a list of persistent volume claims. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaim",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PersistentVolumeClaimList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PersistentVolumeClaimSpec": {
    description:
      "PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes",
    properties: {
      accessModes: {
        description:
          "accessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1",
        items: {
          type: "string",
        },
        type: "array",
      },
      dataSource: {
        $ref: "#/definitions/io.k8s.api.core.v1.TypedLocalObjectReference",
        description:
          "dataSource field can be used to specify either: * An existing VolumeSnapshot object (snapshot.storage.k8s.io/VolumeSnapshot) * An existing PVC (PersistentVolumeClaim) If the provisioner or an external controller can support the specified data source, it will create a new volume based on the contents of the specified data source. When the AnyVolumeDataSource feature gate is enabled, dataSource contents will be copied to dataSourceRef, and dataSourceRef contents will be copied to dataSource when dataSourceRef.namespace is not specified. If the namespace is specified, then dataSourceRef will not be copied to dataSource.",
      },
      dataSourceRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.TypedObjectReference",
        description:
          "dataSourceRef specifies the object from which to populate the volume with data, if a non-empty volume is desired. This may be any object from a non-empty API group (non core object) or a PersistentVolumeClaim object. When this field is specified, volume binding will only succeed if the type of the specified object matches some installed volume populator or dynamic provisioner. This field will replace the functionality of the dataSource field and as such if both fields are non-empty, they must have the same value. For backwards compatibility, when namespace isn't specified in dataSourceRef, both fields (dataSource and dataSourceRef) will be set to the same value automatically if one of them is empty and the other is non-empty. When namespace is specified in dataSourceRef, dataSource isn't set to the same value and must be empty. There are three important differences between dataSource and dataSourceRef: * While dataSource only allows two specific types of objects, dataSourceRef\n  allows any non-core object, as well as PersistentVolumeClaim objects.\n* While dataSource ignores disallowed values (dropping them), dataSourceRef\n  preserves all values, and generates an error if a disallowed value is\n  specified.\n* While dataSource only allows local objects, dataSourceRef allows objects\n  in any namespaces.\n(Beta) Using this field requires the AnyVolumeDataSource feature gate to be enabled. (Alpha) Using the namespace field of dataSourceRef requires the CrossNamespaceVolumeDataSource feature gate to be enabled.",
      },
      resources: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceRequirements",
        description:
          "resources represents the minimum resources the volume should have. If RecoverVolumeExpansionFailure feature is enabled users are allowed to specify resource requirements that are lower than previous value but must still be higher than capacity recorded in the status field of the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources",
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "selector is a label query over volumes to consider for binding.",
      },
      storageClassName: {
        description:
          "storageClassName is the name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1",
        type: "string",
      },
      volumeMode: {
        description:
          "volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec.",
        type: "string",
      },
      volumeName: {
        description:
          "volumeName is the binding reference to the PersistentVolume backing this claim.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PersistentVolumeClaimStatus": {
    description:
      "PersistentVolumeClaimStatus is the current status of a persistent volume claim.",
    properties: {
      accessModes: {
        description:
          "accessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1",
        items: {
          type: "string",
        },
        type: "array",
      },
      allocatedResourceStatuses: {
        additionalProperties: {
          type: "string",
        },
        description:
          'allocatedResourceStatuses stores status of resource being resized for the given PVC. Key names follow standard Kubernetes label syntax. Valid values are either:\n\t* Un-prefixed keys:\n\t\t- storage - the capacity of the volume.\n\t* Custom resources must use implementation-defined prefixed names such as "example.com/my-custom-resource"\nApart from above values - keys that are unprefixed or have kubernetes.io prefix are considered reserved and hence may not be used.\n\nClaimResourceStatus can be in any of following states:\n\t- ControllerResizeInProgress:\n\t\tState set when resize controller starts resizing the volume in control_plane.\n\t- ControllerResizeFailed:\n\t\tState set when resize has failed in resize controller with a terminal error.\n\t- NodeResizePending:\n\t\tState set when resize controller has finished resizing the volume but further resizing of\n\t\tvolume is needed on the node.\n\t- NodeResizeInProgress:\n\t\tState set when kubelet starts resizing the volume.\n\t- NodeResizeFailed:\n\t\tState set when resizing has failed in kubelet with a terminal error. Transient errors don\'t set\n\t\tNodeResizeFailed.\nFor example: if expanding a PVC for more capacity - this field can be one of the following states:\n\t- pvc.status.allocatedResourceStatus[\'storage\'] = "ControllerResizeInProgress"\n     - pvc.status.allocatedResourceStatus[\'storage\'] = "ControllerResizeFailed"\n     - pvc.status.allocatedResourceStatus[\'storage\'] = "NodeResizePending"\n     - pvc.status.allocatedResourceStatus[\'storage\'] = "NodeResizeInProgress"\n     - pvc.status.allocatedResourceStatus[\'storage\'] = "NodeResizeFailed"\nWhen this field is not set, it means that no resize operation is in progress for the given PVC.\n\nA controller that receives PVC update with previously unknown resourceName or ClaimResourceStatus should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.\n\nThis is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.',
        type: "object",
        "x-kubernetes-map-type": "granular",
      },
      allocatedResources: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          'allocatedResources tracks the resources allocated to a PVC including its capacity. Key names follow standard Kubernetes label syntax. Valid values are either:\n\t* Un-prefixed keys:\n\t\t- storage - the capacity of the volume.\n\t* Custom resources must use implementation-defined prefixed names such as "example.com/my-custom-resource"\nApart from above values - keys that are unprefixed or have kubernetes.io prefix are considered reserved and hence may not be used.\n\nCapacity reported here may be larger than the actual capacity when a volume expansion operation is requested. For storage quota, the larger value from allocatedResources and PVC.spec.resources is used. If allocatedResources is not set, PVC.spec.resources alone is used for quota calculation. If a volume expansion capacity request is lowered, allocatedResources is only lowered if there are no expansion operations in progress and if the actual volume capacity is equal or lower than the requested capacity.\n\nA controller that receives PVC update with previously unknown resourceName should ignore the update for the purpose it was designed. For example - a controller that only is responsible for resizing capacity of the volume, should ignore PVC updates that change other valid resources associated with PVC.\n\nThis is an alpha field and requires enabling RecoverVolumeExpansionFailure feature.',
        type: "object",
      },
      capacity: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "capacity represents the actual resources of the underlying volume.",
        type: "object",
      },
      conditions: {
        description:
          "conditions is the current Condition of persistent volume claim. If underlying persistent volume is being resized then the Condition will be set to 'ResizeStarted'.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaimCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      phase: {
        description:
          "phase represents the current phase of PersistentVolumeClaim.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PersistentVolumeClaimTemplate": {
    description:
      "PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource.",
    properties: {
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaimSpec",
        description:
          "The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here.",
      },
    },
    required: ["spec"],
    type: "object",
  },
  "io.k8s.api.core.v1.PersistentVolumeClaimVolumeSource": {
    description:
      "PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system).",
    properties: {
      claimName: {
        description:
          "claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly Will force the ReadOnly setting in VolumeMounts. Default false.",
        type: "boolean",
      },
    },
    required: ["claimName"],
    type: "object",
  },
  "io.k8s.api.core.v1.PersistentVolumeList": {
    description: "PersistentVolumeList is a list of PersistentVolume items.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "items is a list of persistent volumes. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolume",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PersistentVolumeList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PersistentVolumeSpec": {
    description:
      "PersistentVolumeSpec is the specification of a persistent volume.",
    properties: {
      accessModes: {
        description:
          "accessModes contains all ways the volume can be mounted. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes",
        items: {
          type: "string",
        },
        type: "array",
      },
      awsElasticBlockStore: {
        $ref: "#/definitions/io.k8s.api.core.v1.AWSElasticBlockStoreVolumeSource",
        description:
          "awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore",
      },
      azureDisk: {
        $ref: "#/definitions/io.k8s.api.core.v1.AzureDiskVolumeSource",
        description:
          "azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.",
      },
      azureFile: {
        $ref: "#/definitions/io.k8s.api.core.v1.AzureFilePersistentVolumeSource",
        description:
          "azureFile represents an Azure File Service mount on the host and bind mount to the pod.",
      },
      capacity: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "capacity is the description of the persistent volume's resources and capacity. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity",
        type: "object",
      },
      cephfs: {
        $ref: "#/definitions/io.k8s.api.core.v1.CephFSPersistentVolumeSource",
        description:
          "cephFS represents a Ceph FS mount on the host that shares a pod's lifetime",
      },
      cinder: {
        $ref: "#/definitions/io.k8s.api.core.v1.CinderPersistentVolumeSource",
        description:
          "cinder represents a cinder volume attached and mounted on kubelets host machine. More info: https://examples.k8s.io/mysql-cinder-pd/README.md",
      },
      claimRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description:
          "claimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding",
        "x-kubernetes-map-type": "granular",
      },
      csi: {
        $ref: "#/definitions/io.k8s.api.core.v1.CSIPersistentVolumeSource",
        description:
          "csi represents storage that is handled by an external CSI driver (Beta feature).",
      },
      fc: {
        $ref: "#/definitions/io.k8s.api.core.v1.FCVolumeSource",
        description:
          "fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.",
      },
      flexVolume: {
        $ref: "#/definitions/io.k8s.api.core.v1.FlexPersistentVolumeSource",
        description:
          "flexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.",
      },
      flocker: {
        $ref: "#/definitions/io.k8s.api.core.v1.FlockerVolumeSource",
        description:
          "flocker represents a Flocker volume attached to a kubelet's host machine and exposed to the pod for its usage. This depends on the Flocker control service being running",
      },
      gcePersistentDisk: {
        $ref: "#/definitions/io.k8s.api.core.v1.GCEPersistentDiskVolumeSource",
        description:
          "gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk",
      },
      glusterfs: {
        $ref: "#/definitions/io.k8s.api.core.v1.GlusterfsPersistentVolumeSource",
        description:
          "glusterfs represents a Glusterfs volume that is attached to a host and exposed to the pod. Provisioned by an admin. More info: https://examples.k8s.io/volumes/glusterfs/README.md",
      },
      hostPath: {
        $ref: "#/definitions/io.k8s.api.core.v1.HostPathVolumeSource",
        description:
          "hostPath represents a directory on the host. Provisioned by a developer or tester. This is useful for single-node development and testing only! On-host storage is not supported in any way and WILL NOT WORK in a multi-node cluster. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath",
      },
      iscsi: {
        $ref: "#/definitions/io.k8s.api.core.v1.ISCSIPersistentVolumeSource",
        description:
          "iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin.",
      },
      local: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalVolumeSource",
        description:
          "local represents directly-attached storage with node affinity",
      },
      mountOptions: {
        description:
          'mountOptions is the list of mount options, e.g. ["ro", "soft"]. Not validated - mount will simply fail if one is invalid. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#mount-options',
        items: {
          type: "string",
        },
        type: "array",
      },
      nfs: {
        $ref: "#/definitions/io.k8s.api.core.v1.NFSVolumeSource",
        description:
          "nfs represents an NFS mount on the host. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs",
      },
      nodeAffinity: {
        $ref: "#/definitions/io.k8s.api.core.v1.VolumeNodeAffinity",
        description:
          "nodeAffinity defines constraints that limit what nodes this volume can be accessed from. This field influences the scheduling of pods that use this volume.",
      },
      persistentVolumeReclaimPolicy: {
        description:
          "persistentVolumeReclaimPolicy defines what happens to a persistent volume when released from its claim. Valid options are Retain (default for manually created PersistentVolumes), Delete (default for dynamically provisioned PersistentVolumes), and Recycle (deprecated). Recycle must be supported by the volume plugin underlying this PersistentVolume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming",
        type: "string",
      },
      photonPersistentDisk: {
        $ref: "#/definitions/io.k8s.api.core.v1.PhotonPersistentDiskVolumeSource",
        description:
          "photonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine",
      },
      portworxVolume: {
        $ref: "#/definitions/io.k8s.api.core.v1.PortworxVolumeSource",
        description:
          "portworxVolume represents a portworx volume attached and mounted on kubelets host machine",
      },
      quobyte: {
        $ref: "#/definitions/io.k8s.api.core.v1.QuobyteVolumeSource",
        description:
          "quobyte represents a Quobyte mount on the host that shares a pod's lifetime",
      },
      rbd: {
        $ref: "#/definitions/io.k8s.api.core.v1.RBDPersistentVolumeSource",
        description:
          "rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/rbd/README.md",
      },
      scaleIO: {
        $ref: "#/definitions/io.k8s.api.core.v1.ScaleIOPersistentVolumeSource",
        description:
          "scaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes.",
      },
      storageClassName: {
        description:
          "storageClassName is the name of StorageClass to which this persistent volume belongs. Empty value means that this volume does not belong to any StorageClass.",
        type: "string",
      },
      storageos: {
        $ref: "#/definitions/io.k8s.api.core.v1.StorageOSPersistentVolumeSource",
        description:
          "storageOS represents a StorageOS volume that is attached to the kubelet's host machine and mounted into the pod More info: https://examples.k8s.io/volumes/storageos/README.md",
      },
      volumeMode: {
        description:
          "volumeMode defines if a volume is intended to be used with a formatted filesystem or to remain in raw block state. Value of Filesystem is implied when not included in spec.",
        type: "string",
      },
      vsphereVolume: {
        $ref: "#/definitions/io.k8s.api.core.v1.VsphereVirtualDiskVolumeSource",
        description:
          "vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PersistentVolumeStatus": {
    description:
      "PersistentVolumeStatus is the current status of a persistent volume.",
    properties: {
      lastPhaseTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastPhaseTransitionTime is the time the phase transitioned from one to another and automatically resets to current time everytime a volume phase transitions. This is an alpha field and requires enabling PersistentVolumeLastPhaseTransitionTime feature.",
      },
      message: {
        description:
          "message is a human-readable message indicating details about why the volume is in this state.",
        type: "string",
      },
      phase: {
        description:
          "phase indicates if a volume is available, bound to a claim, or released by a claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#phase",
        type: "string",
      },
      reason: {
        description:
          "reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PhotonPersistentDiskVolumeSource": {
    description: "Represents a Photon Controller persistent disk resource.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      pdID: {
        description:
          "pdID is the ID that identifies Photon Controller persistent disk",
        type: "string",
      },
    },
    required: ["pdID"],
    type: "object",
  },
  "io.k8s.api.core.v1.Pod": {
    description:
      "Pod is a collection of containers that can run on a host. This resource is created by clients and scheduled onto hosts.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodSpec",
        description:
          "Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodStatus",
        description:
          "Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Pod",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PodAffinity": {
    description:
      "Pod affinity is a group of inter pod affinity scheduling rules.",
    properties: {
      preferredDuringSchedulingIgnoredDuringExecution: {
        description:
          'The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.',
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.WeightedPodAffinityTerm",
        },
        type: "array",
      },
      requiredDuringSchedulingIgnoredDuringExecution: {
        description:
          "If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodAffinityTerm",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodAffinityTerm": {
    description:
      "Defines a set of pods (namely those matching the labelSelector relative to the given namespace(s)) that this pod should be co-located (affinity) or not co-located (anti-affinity) with, where co-located is defined as running on a node whose value of the label with key <topologyKey> matches that of any node on which a pod of the set of pods is running",
    properties: {
      labelSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "A label query over a set of resources, in this case pods.",
      },
      namespaceSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          'A label query over the set of namespaces that the term applies to. The term is applied to the union of the namespaces selected by this field and the ones listed in the namespaces field. null selector and null or empty namespaces list means "this pod\'s namespace". An empty selector ({}) matches all namespaces.',
      },
      namespaces: {
        description:
          'namespaces specifies a static list of namespace names that the term applies to. The term is applied to the union of the namespaces listed in this field and the ones selected by namespaceSelector. null or empty namespaces list and null namespaceSelector means "this pod\'s namespace".',
        items: {
          type: "string",
        },
        type: "array",
      },
      topologyKey: {
        description:
          "This pod should be co-located (affinity) or not co-located (anti-affinity) with the pods matching the labelSelector in the specified namespaces, where co-located is defined as running on a node whose value of the label with key topologyKey matches that of any node on which any of the selected pods is running. Empty topologyKey is not allowed.",
        type: "string",
      },
    },
    required: ["topologyKey"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodAntiAffinity": {
    description:
      "Pod anti affinity is a group of inter pod anti affinity scheduling rules.",
    properties: {
      preferredDuringSchedulingIgnoredDuringExecution: {
        description:
          'The scheduler will prefer to schedule pods to nodes that satisfy the anti-affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling anti-affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.',
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.WeightedPodAffinityTerm",
        },
        type: "array",
      },
      requiredDuringSchedulingIgnoredDuringExecution: {
        description:
          "If the anti-affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the anti-affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodAffinityTerm",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodCondition": {
    description:
      "PodCondition contains details for the current condition of this pod.",
    properties: {
      lastProbeTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "Last time we probed the condition.",
      },
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "Human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          "Unique, one-word, CamelCase reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "Status is the status of the condition. Can be True, False, Unknown. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions",
        type: "string",
      },
      type: {
        description:
          "Type is the type of the condition. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodDNSConfig": {
    description:
      "PodDNSConfig defines the DNS parameters of a pod in addition to those generated from DNSPolicy.",
    properties: {
      nameservers: {
        description:
          "A list of DNS name server IP addresses. This will be appended to the base nameservers generated from DNSPolicy. Duplicated nameservers will be removed.",
        items: {
          type: "string",
        },
        type: "array",
      },
      options: {
        description:
          "A list of DNS resolver options. This will be merged with the base options generated from DNSPolicy. Duplicated entries will be removed. Resolution options given in Options will override those that appear in the base DNSPolicy.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodDNSConfigOption",
        },
        type: "array",
      },
      searches: {
        description:
          "A list of DNS search domains for host-name lookup. This will be appended to the base search paths generated from DNSPolicy. Duplicated search paths will be removed.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodDNSConfigOption": {
    description: "PodDNSConfigOption defines DNS resolver options of a pod.",
    properties: {
      name: {
        description: "Required.",
        type: "string",
      },
      value: {
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodIP": {
    description: "PodIP represents a single IP address allocated to the pod.",
    properties: {
      ip: {
        description: "IP is the IP address assigned to the pod",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodList": {
    description: "PodList is a list of Pods.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "List of pods. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Pod",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PodList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PodOS": {
    description: "PodOS defines the OS parameters of a pod.",
    properties: {
      name: {
        description:
          "Name is the name of the operating system. The currently supported values are linux and windows. Additional value may be defined in future and can be one of: https://github.com/opencontainers/runtime-spec/blob/master/config.md#platform-specific-configuration Clients should expect to handle additional values and treat unrecognized values in this field as os: null",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodReadinessGate": {
    description: "PodReadinessGate contains the reference to a pod condition",
    properties: {
      conditionType: {
        description:
          "ConditionType refers to a condition in the pod's condition list with matching type.",
        type: "string",
      },
    },
    required: ["conditionType"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodResourceClaim": {
    description:
      "PodResourceClaim references exactly one ResourceClaim through a ClaimSource. It adds a name to it that uniquely identifies the ResourceClaim inside the Pod. Containers that need access to the ResourceClaim reference it with this name.",
    properties: {
      name: {
        description:
          "Name uniquely identifies this resource claim inside the pod. This must be a DNS_LABEL.",
        type: "string",
      },
      source: {
        $ref: "#/definitions/io.k8s.api.core.v1.ClaimSource",
        description: "Source describes where to find the ResourceClaim.",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodResourceClaimStatus": {
    description:
      "PodResourceClaimStatus is stored in the PodStatus for each PodResourceClaim which references a ResourceClaimTemplate. It stores the generated name for the corresponding ResourceClaim.",
    properties: {
      name: {
        description:
          "Name uniquely identifies this resource claim inside the pod. This must match the name of an entry in pod.spec.resourceClaims, which implies that the string must be a DNS_LABEL.",
        type: "string",
      },
      resourceClaimName: {
        description:
          "ResourceClaimName is the name of the ResourceClaim that was generated for the Pod in the namespace of the Pod. It this is unset, then generating a ResourceClaim was not necessary. The pod.spec.resourceClaims entry can be ignored in this case.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodSchedulingGate": {
    description:
      "PodSchedulingGate is associated to a Pod to guard its scheduling.",
    properties: {
      name: {
        description:
          "Name of the scheduling gate. Each scheduling gate must have a unique name field.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodSecurityContext": {
    description:
      "PodSecurityContext holds pod-level security attributes and common container settings. Some fields are also present in container.securityContext.  Field values of container.securityContext take precedence over field values of PodSecurityContext.",
    properties: {
      fsGroup: {
        description:
          "A special supplemental group that applies to all containers in a pod. Some volume types allow the Kubelet to change the ownership of that volume to be owned by the pod:\n\n1. The owning GID will be the FSGroup 2. The setgid bit is set (new files created in the volume will be owned by FSGroup) 3. The permission bits are OR'd with rw-rw----\n\nIf unset, the Kubelet will not modify the ownership and permissions of any volume. Note that this field cannot be set when spec.os.name is windows.",
        format: "int64",
        type: "integer",
      },
      fsGroupChangePolicy: {
        description:
          'fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod. This field will only apply to volume types which support fsGroup based ownership(and permissions). It will have no effect on ephemeral volume types such as: secret, configmaps and emptydir. Valid values are "OnRootMismatch" and "Always". If not specified, "Always" is used. Note that this field cannot be set when spec.os.name is windows.',
        type: "string",
      },
      runAsGroup: {
        description:
          "The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.",
        format: "int64",
        type: "integer",
      },
      runAsNonRoot: {
        description:
          "Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.",
        type: "boolean",
      },
      runAsUser: {
        description:
          "The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.",
        format: "int64",
        type: "integer",
      },
      seLinuxOptions: {
        $ref: "#/definitions/io.k8s.api.core.v1.SELinuxOptions",
        description:
          "The SELinux context to be applied to all containers. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in SecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence for that container. Note that this field cannot be set when spec.os.name is windows.",
      },
      seccompProfile: {
        $ref: "#/definitions/io.k8s.api.core.v1.SeccompProfile",
        description:
          "The seccomp options to use by the containers in this pod. Note that this field cannot be set when spec.os.name is windows.",
      },
      supplementalGroups: {
        description:
          "A list of groups applied to the first process run in each container, in addition to the container's primary GID, the fsGroup (if specified), and group memberships defined in the container image for the uid of the container process. If unspecified, no additional groups are added to any container. Note that group memberships defined in the container image for the uid of the container process are still effective, even if they are not included in this list. Note that this field cannot be set when spec.os.name is windows.",
        items: {
          format: "int64",
          type: "integer",
        },
        type: "array",
      },
      sysctls: {
        description:
          "Sysctls hold a list of namespaced sysctls used for the pod. Pods with unsupported sysctls (by the container runtime) might fail to launch. Note that this field cannot be set when spec.os.name is windows.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Sysctl",
        },
        type: "array",
      },
      windowsOptions: {
        $ref: "#/definitions/io.k8s.api.core.v1.WindowsSecurityContextOptions",
        description:
          "The Windows specific settings applied to all containers. If unspecified, the options within a container's SecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodSpec": {
    description: "PodSpec is a description of a pod.",
    properties: {
      activeDeadlineSeconds: {
        description:
          "Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated containers. Value must be a positive integer.",
        format: "int64",
        type: "integer",
      },
      affinity: {
        $ref: "#/definitions/io.k8s.api.core.v1.Affinity",
        description: "If specified, the pod's scheduling constraints",
      },
      automountServiceAccountToken: {
        description:
          "AutomountServiceAccountToken indicates whether a service account token should be automatically mounted.",
        type: "boolean",
      },
      containers: {
        description:
          "List of containers belonging to the pod. Containers cannot currently be added or removed. There must be at least one container in a Pod. Cannot be updated.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Container",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      dnsConfig: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodDNSConfig",
        description:
          "Specifies the DNS parameters of a pod. Parameters specified here will be merged to the generated DNS configuration based on DNSPolicy.",
      },
      dnsPolicy: {
        description:
          "Set DNS policy for the pod. Defaults to \"ClusterFirst\". Valid values are 'ClusterFirstWithHostNet', 'ClusterFirst', 'Default' or 'None'. DNS parameters given in DNSConfig will be merged with the policy selected with DNSPolicy. To have DNS options set along with hostNetwork, you have to specify DNS policy explicitly to 'ClusterFirstWithHostNet'.",
        type: "string",
      },
      enableServiceLinks: {
        description:
          "EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links. Optional: Defaults to true.",
        type: "boolean",
      },
      ephemeralContainers: {
        description:
          "List of ephemeral containers run in this pod. Ephemeral containers may be run in an existing pod to perform user-initiated actions such as debugging. This list cannot be specified when creating a pod, and it cannot be modified by updating the pod spec. In order to add an ephemeral container to an existing pod, use the pod's ephemeralcontainers subresource.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.EphemeralContainer",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      hostAliases: {
        description:
          "HostAliases is an optional list of hosts and IPs that will be injected into the pod's hosts file if specified. This is only valid for non-hostNetwork pods.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.HostAlias",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "ip",
        "x-kubernetes-patch-strategy": "merge",
      },
      hostIPC: {
        description:
          "Use the host's ipc namespace. Optional: Default to false.",
        type: "boolean",
      },
      hostNetwork: {
        description:
          "Host networking requested for this pod. Use the host's network namespace. If this option is set, the ports that will be used must be specified. Default to false.",
        type: "boolean",
      },
      hostPID: {
        description:
          "Use the host's pid namespace. Optional: Default to false.",
        type: "boolean",
      },
      hostUsers: {
        description:
          "Use the host's user namespace. Optional: Default to true. If set to true or not present, the pod will be run in the host user namespace, useful for when the pod needs a feature only available to the host user namespace, such as loading a kernel module with CAP_SYS_MODULE. When set to false, a new userns is created for the pod. Setting false is useful for mitigating container breakout vulnerabilities even allowing users to run their containers as root without actually having root privileges on the host. This field is alpha-level and is only honored by servers that enable the UserNamespacesSupport feature.",
        type: "boolean",
      },
      hostname: {
        description:
          "Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value.",
        type: "string",
      },
      imagePullSecrets: {
        description:
          "ImagePullSecrets is an optional list of references to secrets in the same namespace to use for pulling any of the images used by this PodSpec. If specified, these secrets will be passed to individual puller implementations for them to use. More info: https://kubernetes.io/docs/concepts/containers/images#specifying-imagepullsecrets-on-a-pod",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      initContainers: {
        description:
          "List of initialization containers belonging to the pod. Init containers are executed in order prior to containers being started. If any init container fails, the pod is considered to have failed and is handled according to its restartPolicy. The name for an init container or normal container must be unique among all containers. Init containers may not have Lifecycle actions, Readiness probes, Liveness probes, or Startup probes. The resourceRequirements of an init container are taken into account during scheduling by finding the highest request/limit for each resource type, and then using the max of of that value or the sum of the normal containers. Limits are applied to init containers in a similar fashion. Init containers cannot currently be added or removed. Cannot be updated. More info: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Container",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      nodeName: {
        description:
          "NodeName is a request to schedule this pod onto a specific node. If it is non-empty, the scheduler simply schedules this pod onto that node, assuming that it fits resource requirements.",
        type: "string",
      },
      nodeSelector: {
        additionalProperties: {
          type: "string",
        },
        description:
          "NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node's labels for the pod to be scheduled on that node. More info: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/",
        type: "object",
        "x-kubernetes-map-type": "atomic",
      },
      os: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodOS",
        description:
          "Specifies the OS of the containers in the pod. Some pod and container fields are restricted if this is set.\n\nIf the OS field is set to linux, the following fields must be unset: -securityContext.windowsOptions\n\nIf the OS field is set to windows, following fields must be unset: - spec.hostPID - spec.hostIPC - spec.hostUsers - spec.securityContext.seLinuxOptions - spec.securityContext.seccompProfile - spec.securityContext.fsGroup - spec.securityContext.fsGroupChangePolicy - spec.securityContext.sysctls - spec.shareProcessNamespace - spec.securityContext.runAsUser - spec.securityContext.runAsGroup - spec.securityContext.supplementalGroups - spec.containers[*].securityContext.seLinuxOptions - spec.containers[*].securityContext.seccompProfile - spec.containers[*].securityContext.capabilities - spec.containers[*].securityContext.readOnlyRootFilesystem - spec.containers[*].securityContext.privileged - spec.containers[*].securityContext.allowPrivilegeEscalation - spec.containers[*].securityContext.procMount - spec.containers[*].securityContext.runAsUser - spec.containers[*].securityContext.runAsGroup",
      },
      overhead: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Overhead represents the resource overhead associated with running a pod for a given RuntimeClass. This field will be autopopulated at admission time by the RuntimeClass admission controller. If the RuntimeClass admission controller is enabled, overhead must not be set in Pod create requests. The RuntimeClass admission controller will reject Pod create requests which have the overhead already set. If RuntimeClass is configured and selected in the PodSpec, Overhead will be set to the value defined in the corresponding RuntimeClass, otherwise it will remain unset and treated as zero. More info: https://git.k8s.io/enhancements/keps/sig-node/688-pod-overhead/README.md",
        type: "object",
      },
      preemptionPolicy: {
        description:
          "PreemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.",
        type: "string",
      },
      priority: {
        description:
          "The priority value. Various system components use this field to find the priority of the pod. When Priority Admission Controller is enabled, it prevents users from setting this field. The admission controller populates this field from PriorityClassName. The higher the value, the higher the priority.",
        format: "int32",
        type: "integer",
      },
      priorityClassName: {
        description:
          'If specified, indicates the pod\'s priority. "system-node-critical" and "system-cluster-critical" are two special keywords which indicate the highest priorities with the former being the highest priority. Any other name must be defined by creating a PriorityClass object with that name. If not specified, the pod priority will be default or zero if there is no default.',
        type: "string",
      },
      readinessGates: {
        description:
          'If specified, all readiness gates will be evaluated for pod readiness. A pod is ready when all its containers are ready AND all conditions specified in the readiness gates have status equal to "True" More info: https://git.k8s.io/enhancements/keps/sig-network/580-pod-readiness-gates',
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodReadinessGate",
        },
        type: "array",
      },
      resourceClaims: {
        description:
          "ResourceClaims defines which ResourceClaims must be allocated and reserved before the Pod is allowed to start. The resources will be made available to those containers which consume them by name.\n\nThis is an alpha field and requires enabling the DynamicResourceAllocation feature gate.\n\nThis field is immutable.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodResourceClaim",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge,retainKeys",
      },
      restartPolicy: {
        description:
          "Restart policy for all containers within the pod. One of Always, OnFailure, Never. In some contexts, only a subset of those values may be permitted. Default to Always. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy",
        type: "string",
      },
      runtimeClassName: {
        description:
          'RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod.  If no RuntimeClass resource matches the named class, the pod will not be run. If unset or empty, the "legacy" RuntimeClass will be used, which is an implicit class with an empty definition that uses the default runtime handler. More info: https://git.k8s.io/enhancements/keps/sig-node/585-runtime-class',
        type: "string",
      },
      schedulerName: {
        description:
          "If specified, the pod will be dispatched by specified scheduler. If not specified, the pod will be dispatched by default scheduler.",
        type: "string",
      },
      schedulingGates: {
        description:
          "SchedulingGates is an opaque list of values that if specified will block scheduling the pod. If schedulingGates is not empty, the pod will stay in the SchedulingGated state and the scheduler will not attempt to schedule the pod.\n\nSchedulingGates can only be set at pod creation time, and be removed only afterwards.\n\nThis is a beta feature enabled by the PodSchedulingReadiness feature gate.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodSchedulingGate",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
      securityContext: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodSecurityContext",
        description:
          "SecurityContext holds pod-level security attributes and common container settings. Optional: Defaults to empty.  See type description for default values of each field.",
      },
      serviceAccount: {
        description:
          "DeprecatedServiceAccount is a depreciated alias for ServiceAccountName. Deprecated: Use serviceAccountName instead.",
        type: "string",
      },
      serviceAccountName: {
        description:
          "ServiceAccountName is the name of the ServiceAccount to use to run this pod. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
        type: "string",
      },
      setHostnameAsFQDN: {
        description:
          "If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default). In Linux containers, this means setting the FQDN in the hostname field of the kernel (the nodename field of struct utsname). In Windows containers, this means setting the registry value of hostname for the registry key HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters to FQDN. If a pod does not have FQDN, this has no effect. Default to false.",
        type: "boolean",
      },
      shareProcessNamespace: {
        description:
          "Share a single process namespace between all of the containers in a pod. When this is set containers will be able to view and signal processes from other containers in the same pod, and the first process in each container will not be assigned PID 1. HostPID and ShareProcessNamespace cannot both be set. Optional: Default to false.",
        type: "boolean",
      },
      subdomain: {
        description:
          'If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". If not specified, the pod will not have a domainname at all.',
        type: "string",
      },
      terminationGracePeriodSeconds: {
        description:
          "Optional duration in seconds the pod needs to terminate gracefully. May be decreased in delete request. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). If this value is nil, the default grace period will be used instead. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. Defaults to 30 seconds.",
        format: "int64",
        type: "integer",
      },
      tolerations: {
        description: "If specified, the pod's tolerations.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Toleration",
        },
        type: "array",
      },
      topologySpreadConstraints: {
        description:
          "TopologySpreadConstraints describes how a group of pods ought to spread across topology domains. Scheduler will schedule pods in a way which abides by the constraints. All topologySpreadConstraints are ANDed.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.TopologySpreadConstraint",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["topologyKey", "whenUnsatisfiable"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "topologyKey",
        "x-kubernetes-patch-strategy": "merge",
      },
      volumes: {
        description:
          "List of volumes that can be mounted by containers belonging to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Volume",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge,retainKeys",
      },
    },
    required: ["containers"],
    type: "object",
  },
  "io.k8s.api.core.v1.PodStatus": {
    description:
      "PodStatus represents information about the status of a pod. Status may trail the actual state of a system, especially if the node that hosts the pod cannot contact the control plane.",
    properties: {
      conditions: {
        description:
          "Current service state of pod. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-conditions",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      containerStatuses: {
        description:
          "The list has one entry per container in the manifest. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerStatus",
        },
        type: "array",
      },
      ephemeralContainerStatuses: {
        description:
          "Status for any ephemeral containers that have run in this pod.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerStatus",
        },
        type: "array",
      },
      hostIP: {
        description:
          "hostIP holds the IP address of the host to which the pod is assigned. Empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns mean that HostIP will not be updated even if there is a node is assigned to pod",
        type: "string",
      },
      hostIPs: {
        description:
          "hostIPs holds the IP addresses allocated to the host. If this field is specified, the first entry must match the hostIP field. This list is empty if the pod has not started yet. A pod can be assigned to a node that has a problem in kubelet which in turns means that HostIPs will not be updated even if there is a node is assigned to this pod.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.HostIP",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
        "x-kubernetes-patch-merge-key": "ip",
        "x-kubernetes-patch-strategy": "merge",
      },
      initContainerStatuses: {
        description:
          "The list has one entry per init container in the manifest. The most recent successful init container will have ready = true, the most recently started container will have startTime set. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-and-container-status",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ContainerStatus",
        },
        type: "array",
      },
      message: {
        description:
          "A human readable message indicating details about why the pod is in this condition.",
        type: "string",
      },
      nominatedNodeName: {
        description:
          "nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful termination periods. This field does not guarantee that the pod will be scheduled on this node. Scheduler may decide to place the pod elsewhere if other nodes become available sooner. Scheduler may also decide to give the resources on this node to a higher priority pod that is created after preemption. As a result, this field may be different than PodSpec.nodeName when the pod is scheduled.",
        type: "string",
      },
      phase: {
        description:
          "The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle. The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status. There are five possible phase values:\n\nPending: The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while. Running: The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting. Succeeded: All containers in the pod have terminated in success, and will not be restarted. Failed: All containers in the pod have terminated, and at least one container has terminated in failure. The container either exited with non-zero status or was terminated by the system. Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.\n\nMore info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase",
        type: "string",
      },
      podIP: {
        description:
          "podIP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.",
        type: "string",
      },
      podIPs: {
        description:
          "podIPs holds the IP addresses allocated to the pod. If this field is specified, the 0th entry must match the podIP field. Pods may be allocated at most 1 value for each of IPv4 and IPv6. This list is empty if no IPs have been allocated yet.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodIP",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "ip",
        "x-kubernetes-patch-strategy": "merge",
      },
      qosClass: {
        description:
          "The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#quality-of-service-classes",
        type: "string",
      },
      reason: {
        description:
          "A brief CamelCase message indicating details about why the pod is in this state. e.g. 'Evicted'",
        type: "string",
      },
      resize: {
        description:
          'Status of resources resize desired for pod\'s containers. It is empty if no resources resize is pending. Any changes to container resources will automatically set this to "Proposed"',
        type: "string",
      },
      resourceClaimStatuses: {
        description: "Status of resource claims.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodResourceClaimStatus",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge,retainKeys",
      },
      startTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PodTemplate": {
    description:
      "PodTemplate describes a template for creating copies of a predefined pod.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          "Template defines the pods that will be created from this pod template. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PodTemplate",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PodTemplateList": {
    description: "PodTemplateList is a list of PodTemplates.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of pod templates",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.PodTemplate",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "PodTemplateList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.PodTemplateSpec": {
    description:
      "PodTemplateSpec describes the data a pod should have when created from a template",
    properties: {
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodSpec",
        description:
          "Specification of the desired behavior of the pod. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.PortStatus": {
    properties: {
      error: {
        description:
          "Error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified in this file and those shall use\n  CamelCase names\n- cloud provider specific error values must have names that comply with the\n  format foo.example.com/CamelCase.",
        type: "string",
      },
      port: {
        description:
          "Port is the port number of the service port of which status is recorded here",
        format: "int32",
        type: "integer",
      },
      protocol: {
        description:
          'Protocol is the protocol of the service port of which status is recorded here The supported values are: "TCP", "UDP", "SCTP"',
        type: "string",
      },
    },
    required: ["port", "protocol"],
    type: "object",
  },
  "io.k8s.api.core.v1.PortworxVolumeSource": {
    description: "PortworxVolumeSource represents a Portworx volume resource.",
    properties: {
      fsType: {
        description:
          'fSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      volumeID: {
        description: "volumeID uniquely identifies a Portworx volume",
        type: "string",
      },
    },
    required: ["volumeID"],
    type: "object",
  },
  "io.k8s.api.core.v1.PreferredSchedulingTerm": {
    description:
      "An empty preferred scheduling term matches all objects with implicit weight 0 (i.e. it's a no-op). A null preferred scheduling term matches no objects (i.e. is also a no-op).",
    properties: {
      preference: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSelectorTerm",
        description:
          "A node selector term, associated with the corresponding weight.",
      },
      weight: {
        description:
          "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["weight", "preference"],
    type: "object",
  },
  "io.k8s.api.core.v1.Probe": {
    description:
      "Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.",
    properties: {
      exec: {
        $ref: "#/definitions/io.k8s.api.core.v1.ExecAction",
        description: "Exec specifies the action to take.",
      },
      failureThreshold: {
        description:
          "Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.",
        format: "int32",
        type: "integer",
      },
      grpc: {
        $ref: "#/definitions/io.k8s.api.core.v1.GRPCAction",
        description: "GRPC specifies an action involving a GRPC port.",
      },
      httpGet: {
        $ref: "#/definitions/io.k8s.api.core.v1.HTTPGetAction",
        description: "HTTPGet specifies the http request to perform.",
      },
      initialDelaySeconds: {
        description:
          "Number of seconds after the container has started before liveness probes are initiated. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
        format: "int32",
        type: "integer",
      },
      periodSeconds: {
        description:
          "How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1.",
        format: "int32",
        type: "integer",
      },
      successThreshold: {
        description:
          "Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup. Minimum value is 1.",
        format: "int32",
        type: "integer",
      },
      tcpSocket: {
        $ref: "#/definitions/io.k8s.api.core.v1.TCPSocketAction",
        description: "TCPSocket specifies an action involving a TCP port.",
      },
      terminationGracePeriodSeconds: {
        description:
          "Optional duration in seconds the pod needs to terminate gracefully upon probe failure. The grace period is the duration in seconds after the processes running in the pod are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. If this value is nil, the pod's terminationGracePeriodSeconds will be used. Otherwise, this value overrides the value provided by the pod spec. Value must be non-negative integer. The value zero indicates stop immediately via the kill signal (no opportunity to shut down). This is a beta field and requires enabling ProbeTerminationGracePeriod feature gate. Minimum value is 1. spec.terminationGracePeriodSeconds is used if unset.",
        format: "int64",
        type: "integer",
      },
      timeoutSeconds: {
        description:
          "Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ProjectedVolumeSource": {
    description: "Represents a projected volume source",
    properties: {
      defaultMode: {
        description:
          "defaultMode are the mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
        format: "int32",
        type: "integer",
      },
      sources: {
        description: "sources is the list of volume projections",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.VolumeProjection",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.QuobyteVolumeSource": {
    description:
      "Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.",
    properties: {
      group: {
        description: "group to map volume access to Default is no group",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.",
        type: "boolean",
      },
      registry: {
        description:
          "registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes",
        type: "string",
      },
      tenant: {
        description:
          "tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin",
        type: "string",
      },
      user: {
        description:
          "user to map volume access to Defaults to serivceaccount user",
        type: "string",
      },
      volume: {
        description:
          "volume is a string that references an already created Quobyte volume by name.",
        type: "string",
      },
    },
    required: ["registry", "volume"],
    type: "object",
  },
  "io.k8s.api.core.v1.RBDPersistentVolumeSource": {
    description:
      "Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd',
        type: "string",
      },
      image: {
        description:
          "image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
      keyring: {
        description:
          "keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
      monitors: {
        description:
          "monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        items: {
          type: "string",
        },
        type: "array",
      },
      pool: {
        description:
          "pool is the rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
      },
      user: {
        description:
          "user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
    },
    required: ["monitors", "image"],
    type: "object",
  },
  "io.k8s.api.core.v1.RBDVolumeSource": {
    description:
      "Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd',
        type: "string",
      },
      image: {
        description:
          "image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
      keyring: {
        description:
          "keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
      monitors: {
        description:
          "monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        items: {
          type: "string",
        },
        type: "array",
      },
      pool: {
        description:
          "pool is the rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
      },
      user: {
        description:
          "user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it",
        type: "string",
      },
    },
    required: ["monitors", "image"],
    type: "object",
  },
  "io.k8s.api.core.v1.ReplicationController": {
    description:
      "ReplicationController represents the configuration of a replication controller.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "If the Labels of a ReplicationController are empty, they are defaulted to be the same as the Pod(s) that the replication controller manages. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.ReplicationControllerSpec",
        description:
          "Spec defines the specification of the desired behavior of the replication controller. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.ReplicationControllerStatus",
        description:
          "Status is the most recently observed status of the replication controller. This data may be out of date by some window of time. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ReplicationController",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ReplicationControllerCondition": {
    description:
      "ReplicationControllerCondition describes the state of a replication controller at a certain point.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "The last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "A human readable message indicating details about the transition.",
        type: "string",
      },
      reason: {
        description: "The reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description: "Status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type of replication controller condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.api.core.v1.ReplicationControllerList": {
    description:
      "ReplicationControllerList is a collection of replication controllers.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "List of replication controllers. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ReplicationController",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ReplicationControllerList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ReplicationControllerSpec": {
    description:
      "ReplicationControllerSpec is the specification of a replication controller.",
    properties: {
      minReadySeconds: {
        description:
          "Minimum number of seconds for which a newly created pod should be ready without any of its container crashing, for it to be considered available. Defaults to 0 (pod will be considered available as soon as it is ready)",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "Replicas is the number of desired replicas. This is a pointer to distinguish between explicit zero and unspecified. Defaults to 1. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller",
        format: "int32",
        type: "integer",
      },
      selector: {
        additionalProperties: {
          type: "string",
        },
        description:
          "Selector is a label query over pods that should match the Replicas count. If Selector is empty, it is defaulted to the labels present on the Pod template. Label keys and values that must match in order to be controlled by this replication controller, if empty defaulted to labels on Pod template. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors",
        type: "object",
        "x-kubernetes-map-type": "atomic",
      },
      template: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodTemplateSpec",
        description:
          'Template is the object that describes the pod that will be created if insufficient replicas are detected. This takes precedence over a TemplateRef. The only allowed template.spec.restartPolicy value is "Always". More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#pod-template',
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ReplicationControllerStatus": {
    description:
      "ReplicationControllerStatus represents the current status of a replication controller.",
    properties: {
      availableReplicas: {
        description:
          "The number of available replicas (ready for at least minReadySeconds) for this replication controller.",
        format: "int32",
        type: "integer",
      },
      conditions: {
        description:
          "Represents the latest available observations of a replication controller's current state.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ReplicationControllerCondition",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      fullyLabeledReplicas: {
        description:
          "The number of pods that have labels matching the labels of the pod template of the replication controller.",
        format: "int32",
        type: "integer",
      },
      observedGeneration: {
        description:
          "ObservedGeneration reflects the generation of the most recently observed replication controller.",
        format: "int64",
        type: "integer",
      },
      readyReplicas: {
        description:
          "The number of ready replicas for this replication controller.",
        format: "int32",
        type: "integer",
      },
      replicas: {
        description:
          "Replicas is the most recently observed number of replicas. More info: https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller#what-is-a-replicationcontroller",
        format: "int32",
        type: "integer",
      },
    },
    required: ["replicas"],
    type: "object",
  },
  "io.k8s.api.core.v1.ResourceClaim": {
    description:
      "ResourceClaim references one entry in PodSpec.ResourceClaims.",
    properties: {
      name: {
        description:
          "Name must match the name of one entry in pod.spec.resourceClaims of the Pod where this field is used. It makes that resource available inside a container.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.ResourceFieldSelector": {
    description:
      "ResourceFieldSelector represents container resources (cpu, memory) and their output format",
    properties: {
      containerName: {
        description:
          "Container name: required for volumes, optional for env vars",
        type: "string",
      },
      divisor: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          'Specifies the output format of the exposed resources, defaults to "1"',
      },
      resource: {
        description: "Required: resource to select",
        type: "string",
      },
    },
    required: ["resource"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.ResourceQuota": {
    description:
      "ResourceQuota sets aggregate quota restrictions enforced per namespace",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceQuotaSpec",
        description:
          "Spec defines the desired quota. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.ResourceQuotaStatus",
        description:
          "Status defines the actual enforced quota and its current usage. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ResourceQuota",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ResourceQuotaList": {
    description: "ResourceQuotaList is a list of ResourceQuota items.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "Items is a list of ResourceQuota objects. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ResourceQuota",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ResourceQuotaList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ResourceQuotaSpec": {
    description:
      "ResourceQuotaSpec defines the desired hard limits to enforce for Quota.",
    properties: {
      hard: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "hard is the set of desired hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/",
        type: "object",
      },
      scopeSelector: {
        $ref: "#/definitions/io.k8s.api.core.v1.ScopeSelector",
        description:
          "scopeSelector is also a collection of filters like scopes that must match each object tracked by a quota but expressed using ScopeSelectorOperator in combination with possible values. For a resource to match, both scopes AND scopeSelector (if specified in spec), must be matched.",
      },
      scopes: {
        description:
          "A collection of filters that must match each object tracked by a quota. If not specified, the quota matches all objects.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ResourceQuotaStatus": {
    description:
      "ResourceQuotaStatus defines the enforced hard limits and observed use.",
    properties: {
      hard: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Hard is the set of enforced hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/",
        type: "object",
      },
      used: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Used is the current observed total usage of the resource in the namespace.",
        type: "object",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ResourceRequirements": {
    description:
      "ResourceRequirements describes the compute resource requirements.",
    properties: {
      claims: {
        description:
          "Claims lists the names of resources, defined in spec.resourceClaims, that are used by this container.\n\nThis is an alpha field and requires enabling the DynamicResourceAllocation feature gate.\n\nThis field is immutable. It can only be set for containers.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ResourceClaim",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
      },
      limits: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Limits describes the maximum amount of compute resources allowed. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
        type: "object",
      },
      requests: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. Requests cannot exceed Limits. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
        type: "object",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.SELinuxOptions": {
    description: "SELinuxOptions are the labels to be applied to the container",
    properties: {
      level: {
        description:
          "Level is SELinux level label that applies to the container.",
        type: "string",
      },
      role: {
        description:
          "Role is a SELinux role label that applies to the container.",
        type: "string",
      },
      type: {
        description:
          "Type is a SELinux type label that applies to the container.",
        type: "string",
      },
      user: {
        description:
          "User is a SELinux user label that applies to the container.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ScaleIOPersistentVolumeSource": {
    description:
      "ScaleIOPersistentVolumeSource represents a persistent ScaleIO volume",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs"',
        type: "string",
      },
      gateway: {
        description: "gateway is the host address of the ScaleIO API Gateway.",
        type: "string",
      },
      protectionDomain: {
        description:
          "protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretReference",
        description:
          "secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.",
      },
      sslEnabled: {
        description:
          "sslEnabled is the flag to enable/disable SSL communication with Gateway, default false",
        type: "boolean",
      },
      storageMode: {
        description:
          "storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.",
        type: "string",
      },
      storagePool: {
        description:
          "storagePool is the ScaleIO Storage Pool associated with the protection domain.",
        type: "string",
      },
      system: {
        description:
          "system is the name of the storage system as configured in ScaleIO.",
        type: "string",
      },
      volumeName: {
        description:
          "volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.",
        type: "string",
      },
    },
    required: ["gateway", "system", "secretRef"],
    type: "object",
  },
  "io.k8s.api.core.v1.ScaleIOVolumeSource": {
    description: "ScaleIOVolumeSource represents a persistent ScaleIO volume",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs".',
        type: "string",
      },
      gateway: {
        description: "gateway is the host address of the ScaleIO API Gateway.",
        type: "string",
      },
      protectionDomain: {
        description:
          "protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.",
        type: "string",
      },
      readOnly: {
        description:
          "readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.",
      },
      sslEnabled: {
        description:
          "sslEnabled Flag enable/disable SSL communication with Gateway, default false",
        type: "boolean",
      },
      storageMode: {
        description:
          "storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.",
        type: "string",
      },
      storagePool: {
        description:
          "storagePool is the ScaleIO Storage Pool associated with the protection domain.",
        type: "string",
      },
      system: {
        description:
          "system is the name of the storage system as configured in ScaleIO.",
        type: "string",
      },
      volumeName: {
        description:
          "volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.",
        type: "string",
      },
    },
    required: ["gateway", "system", "secretRef"],
    type: "object",
  },
  "io.k8s.api.core.v1.ScopeSelector": {
    description:
      "A scope selector represents the AND of the selectors represented by the scoped-resource selector requirements.",
    properties: {
      matchExpressions: {
        description:
          "A list of scope selector requirements by scope of the resources.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ScopedResourceSelectorRequirement",
        },
        type: "array",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.ScopedResourceSelectorRequirement": {
    description:
      "A scoped-resource selector requirement is a selector that contains values, a scope name, and an operator that relates the scope name and values.",
    properties: {
      operator: {
        description:
          "Represents a scope's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist.",
        type: "string",
      },
      scopeName: {
        description: "The name of the scope that the selector applies to.",
        type: "string",
      },
      values: {
        description:
          "An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["scopeName", "operator"],
    type: "object",
  },
  "io.k8s.api.core.v1.SeccompProfile": {
    description:
      "SeccompProfile defines a pod/container's seccomp profile settings. Only one profile source may be set.",
    properties: {
      localhostProfile: {
        description:
          'localhostProfile indicates a profile defined in a file on the node should be used. The profile must be preconfigured on the node to work. Must be a descending path, relative to the kubelet\'s configured seccomp profile location. Must be set if type is "Localhost". Must NOT be set for any other type.',
        type: "string",
      },
      type: {
        description:
          "type indicates which kind of seccomp profile will be applied. Valid options are:\n\nLocalhost - a profile defined in a file on the node should be used. RuntimeDefault - the container runtime default profile should be used. Unconfined - no profile should be applied.",
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "type",
        "fields-to-discriminateBy": {
          localhostProfile: "LocalhostProfile",
        },
      },
    ],
  },
  "io.k8s.api.core.v1.Secret": {
    description:
      "Secret holds secret data of a certain type. The total bytes of the values in the Data field must be less than MaxSecretSize bytes.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      data: {
        additionalProperties: {
          format: "byte",
          type: "string",
        },
        description:
          "Data contains the secret data. Each key must consist of alphanumeric characters, '-', '_' or '.'. The serialized form of the secret data is a base64 encoded string, representing the arbitrary (possibly non-string) data value here. Described in https://tools.ietf.org/html/rfc4648#section-4",
        type: "object",
      },
      immutable: {
        description:
          "Immutable, if set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified). If not set to true, the field can be modified at any time. Defaulted to nil.",
        type: "boolean",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      stringData: {
        additionalProperties: {
          type: "string",
        },
        description:
          "stringData allows specifying non-binary secret data in string form. It is provided as a write-only input field for convenience. All keys and values are merged into the data field on write, overwriting any existing values. The stringData field is never output when reading from the API.",
        type: "object",
      },
      type: {
        description:
          "Used to facilitate programmatic handling of secret data. More info: https://kubernetes.io/docs/concepts/configuration/secret/#secret-types",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Secret",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.SecretEnvSource": {
    description:
      "SecretEnvSource selects a Secret to populate the environment variables with.\n\nThe contents of the target Secret's Data field will represent the key-value pairs as environment variables.",
    properties: {
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description: "Specify whether the Secret must be defined",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.SecretKeySelector": {
    description: "SecretKeySelector selects a key of a Secret.",
    properties: {
      key: {
        description:
          "The key of the secret to select from.  Must be a valid secret key.",
        type: "string",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description: "Specify whether the Secret or its key must be defined",
        type: "boolean",
      },
    },
    required: ["key"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.SecretList": {
    description: "SecretList is a list of Secret.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "Items is a list of secret objects. More info: https://kubernetes.io/docs/concepts/configuration/secret",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Secret",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "SecretList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.SecretProjection": {
    description:
      "Adapts a secret into a projected volume.\n\nThe contents of the target Secret's Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode.",
    properties: {
      items: {
        description:
          "items if unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.KeyToPath",
        },
        type: "array",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      optional: {
        description:
          "optional field specify whether the Secret or its key must be defined",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.SecretReference": {
    description:
      "SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace",
    properties: {
      name: {
        description:
          "name is unique within a namespace to reference a secret resource.",
        type: "string",
      },
      namespace: {
        description:
          "namespace defines the space within which the secret name must be unique.",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.SecretVolumeSource": {
    description:
      "Adapts a Secret into a volume.\n\nThe contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.",
    properties: {
      defaultMode: {
        description:
          "defaultMode is Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.",
        format: "int32",
        type: "integer",
      },
      items: {
        description:
          "items If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.KeyToPath",
        },
        type: "array",
      },
      optional: {
        description:
          "optional field specify whether the Secret or its keys must be defined",
        type: "boolean",
      },
      secretName: {
        description:
          "secretName is the name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.SecurityContext": {
    description:
      "SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext.  When both are set, the values in SecurityContext take precedence.",
    properties: {
      allowPrivilegeEscalation: {
        description:
          "AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process. This bool directly controls if the no_new_privs flag will be set on the container process. AllowPrivilegeEscalation is true always when the container is: 1) run as Privileged 2) has CAP_SYS_ADMIN Note that this field cannot be set when spec.os.name is windows.",
        type: "boolean",
      },
      capabilities: {
        $ref: "#/definitions/io.k8s.api.core.v1.Capabilities",
        description:
          "The capabilities to add/drop when running containers. Defaults to the default set of capabilities granted by the container runtime. Note that this field cannot be set when spec.os.name is windows.",
      },
      privileged: {
        description:
          "Run container in privileged mode. Processes in privileged containers are essentially equivalent to root on the host. Defaults to false. Note that this field cannot be set when spec.os.name is windows.",
        type: "boolean",
      },
      procMount: {
        description:
          "procMount denotes the type of proc mount to use for the containers. The default is DefaultProcMount which uses the container runtime defaults for readonly paths and masked paths. This requires the ProcMountType feature flag to be enabled. Note that this field cannot be set when spec.os.name is windows.",
        type: "string",
      },
      readOnlyRootFilesystem: {
        description:
          "Whether this container has a read-only root filesystem. Default is false. Note that this field cannot be set when spec.os.name is windows.",
        type: "boolean",
      },
      runAsGroup: {
        description:
          "The GID to run the entrypoint of the container process. Uses runtime default if unset. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.",
        format: "int64",
        type: "integer",
      },
      runAsNonRoot: {
        description:
          "Indicates that the container must run as a non-root user. If true, the Kubelet will validate the image at runtime to ensure that it does not run as UID 0 (root) and fail to start the container if it does. If unset or false, no such validation will be performed. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.",
        type: "boolean",
      },
      runAsUser: {
        description:
          "The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.",
        format: "int64",
        type: "integer",
      },
      seLinuxOptions: {
        $ref: "#/definitions/io.k8s.api.core.v1.SELinuxOptions",
        description:
          "The SELinux context to be applied to the container. If unspecified, the container runtime will allocate a random SELinux context for each container.  May also be set in PodSecurityContext.  If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is windows.",
      },
      seccompProfile: {
        $ref: "#/definitions/io.k8s.api.core.v1.SeccompProfile",
        description:
          "The seccomp options to use by this container. If seccomp options are provided at both the pod & container level, the container options override the pod options. Note that this field cannot be set when spec.os.name is windows.",
      },
      windowsOptions: {
        $ref: "#/definitions/io.k8s.api.core.v1.WindowsSecurityContextOptions",
        description:
          "The Windows specific settings applied to all containers. If unspecified, the options from the PodSecurityContext will be used. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence. Note that this field cannot be set when spec.os.name is linux.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.Service": {
    description:
      "Service is a named abstraction of software service (for example, mysql) consisting of local port (for example 3306) that the proxy listens on, and the selector that determines which pods will answer requests sent through the proxy.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.core.v1.ServiceSpec",
        description:
          "Spec defines the behavior of a service. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.core.v1.ServiceStatus",
        description:
          "Most recently observed status of the service. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Service",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ServiceAccount": {
    description:
      "ServiceAccount binds together: * a name, understood by users, and perhaps by peripheral systems, for an identity * a principal that can be authenticated and authorized * a set of secrets",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      automountServiceAccountToken: {
        description:
          "AutomountServiceAccountToken indicates whether pods running as this service account should have an API token automatically mounted. Can be overridden at the pod level.",
        type: "boolean",
      },
      imagePullSecrets: {
        description:
          "ImagePullSecrets is a list of references to secrets in the same namespace to use for pulling any images in pods that reference this ServiceAccount. ImagePullSecrets are distinct from Secrets because Secrets can be mounted in the pod, but ImagePullSecrets are only accessed by the kubelet. More info: https://kubernetes.io/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      secrets: {
        description:
          'Secrets is a list of the secrets in the same namespace that pods running using this ServiceAccount are allowed to use. Pods are only limited to this list if this service account has a "kubernetes.io/enforce-mountable-secrets" annotation set to "true". This field should not be used to find auto-generated service account token secrets for use outside of pods. Instead, tokens can be requested directly using the TokenRequest API, or service account token secrets can be manually created. More info: https://kubernetes.io/docs/concepts/configuration/secret',
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ServiceAccount",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ServiceAccountList": {
    description: "ServiceAccountList is a list of ServiceAccount objects",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description:
          "List of ServiceAccounts. More info: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ServiceAccount",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ServiceAccountList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ServiceAccountTokenProjection": {
    description:
      "ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise).",
    properties: {
      audience: {
        description:
          "audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver.",
        type: "string",
      },
      expirationSeconds: {
        description:
          "expirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes.",
        format: "int64",
        type: "integer",
      },
      path: {
        description:
          "path is the path relative to the mount point of the file to project the token into.",
        type: "string",
      },
    },
    required: ["path"],
    type: "object",
  },
  "io.k8s.api.core.v1.ServiceList": {
    description: "ServiceList holds a list of services.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "List of services",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Service",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "ServiceList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.core.v1.ServicePort": {
    description: "ServicePort contains information on service's port.",
    properties: {
      appProtocol: {
        description:
          "The application protocol for this port. This is used as a hint for implementations to offer richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax. Valid values are either:\n\n* Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).\n\n* Kubernetes-defined prefixed names:\n  * 'kubernetes.io/h2c' - HTTP/2 over cleartext as described in https://www.rfc-editor.org/rfc/rfc7540\n  * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455\n  * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455\n\n* Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.",
        type: "string",
      },
      name: {
        description:
          "The name of this port within the service. This must be a DNS_LABEL. All ports within a ServiceSpec must have unique names. When considering the endpoints for a Service, this must match the 'name' field in the EndpointPort. Optional if only one ServicePort is defined on this service.",
        type: "string",
      },
      nodePort: {
        description:
          "The port on each node on which this service is exposed when type is NodePort or LoadBalancer.  Usually assigned by the system. If a value is specified, in-range, and not in use it will be used, otherwise the operation will fail.  If not specified, a port will be allocated if this Service requires one.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type from NodePort to ClusterIP). More info: https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport",
        format: "int32",
        type: "integer",
      },
      port: {
        description: "The port that will be exposed by this service.",
        format: "int32",
        type: "integer",
      },
      protocol: {
        description:
          'The IP protocol for this port. Supports "TCP", "UDP", and "SCTP". Default is TCP.',
        type: "string",
      },
      targetPort: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "Number or name of the port to access on the pods targeted by the service. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. If this is a string, it will be looked up as a named port in the target Pod's container ports. If this is not specified, the value of the 'port' field is used (an identity map). This field is ignored for services with clusterIP=None, and should be omitted or set equal to the 'port' field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service",
      },
    },
    required: ["port"],
    type: "object",
  },
  "io.k8s.api.core.v1.ServiceSpec": {
    description:
      "ServiceSpec describes the attributes that a user creates on a service.",
    properties: {
      allocateLoadBalancerNodePorts: {
        description:
          'allocateLoadBalancerNodePorts defines if NodePorts will be automatically allocated for services with type LoadBalancer.  Default is "true". It may be set to "false" if the cluster load-balancer does not rely on NodePorts.  If the caller requests specific NodePorts (by specifying a value), those requests will be respected, regardless of this field. This field may only be set for services with type LoadBalancer and will be cleared if the type is changed to any other type.',
        type: "boolean",
      },
      clusterIP: {
        description:
          'clusterIP is the IP address of the service and is usually assigned randomly. If an address is specified manually, is in-range (as per system configuration), and is not in use, it will be allocated to the service; otherwise creation of the service will fail. This field may not be changed through updates unless the type field is also being changed to ExternalName (which requires this field to be blank) or the type field is being changed from ExternalName (in which case this field may optionally be specified, as describe above).  Valid values are "None", empty string (""), or a valid IP address. Setting this to "None" makes a "headless service" (no virtual IP), which is useful when direct endpoint connections are preferred and proxying is not required.  Only applies to types ClusterIP, NodePort, and LoadBalancer. If this field is specified when creating a Service of type ExternalName, creation will fail. This field will be wiped when updating a Service to type ExternalName. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies',
        type: "string",
      },
      clusterIPs: {
        description:
          'ClusterIPs is a list of IP addresses assigned to this service, and are usually assigned randomly.  If an address is specified manually, is in-range (as per system configuration), and is not in use, it will be allocated to the service; otherwise creation of the service will fail. This field may not be changed through updates unless the type field is also being changed to ExternalName (which requires this field to be empty) or the type field is being changed from ExternalName (in which case this field may optionally be specified, as describe above).  Valid values are "None", empty string (""), or a valid IP address.  Setting this to "None" makes a "headless service" (no virtual IP), which is useful when direct endpoint connections are preferred and proxying is not required.  Only applies to types ClusterIP, NodePort, and LoadBalancer. If this field is specified when creating a Service of type ExternalName, creation will fail. This field will be wiped when updating a Service to type ExternalName.  If this field is not specified, it will be initialized from the clusterIP field.  If this field is specified, clients must ensure that clusterIPs[0] and clusterIP have the same value.\n\nThis field may hold a maximum of two entries (dual-stack IPs, in either order). These IPs must correspond to the values of the ipFamilies field. Both clusterIPs and ipFamilies are governed by the ipFamilyPolicy field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      externalIPs: {
        description:
          "externalIPs is a list of IP addresses for which nodes in the cluster will also accept traffic for this service.  These IPs are not managed by Kubernetes.  The user is responsible for ensuring that traffic arrives at a node with this IP.  A common example is external load-balancers that are not part of the Kubernetes system.",
        items: {
          type: "string",
        },
        type: "array",
      },
      externalName: {
        description:
          'externalName is the external reference that discovery mechanisms will return as an alias for this service (e.g. a DNS CNAME record). No proxying will be involved.  Must be a lowercase RFC-1123 hostname (https://tools.ietf.org/html/rfc1123) and requires `type` to be "ExternalName".',
        type: "string",
      },
      externalTrafficPolicy: {
        description:
          'externalTrafficPolicy describes how nodes distribute service traffic they receive on one of the Service\'s "externally-facing" addresses (NodePorts, ExternalIPs, and LoadBalancer IPs). If set to "Local", the proxy will configure the service in a way that assumes that external load balancers will take care of balancing the service traffic between nodes, and so each node will deliver traffic only to the node-local endpoints of the service, without masquerading the client source IP. (Traffic mistakenly sent to a node with no endpoints will be dropped.) The default value, "Cluster", uses the standard behavior of routing to all endpoints evenly (possibly modified by topology and other features). Note that traffic sent to an External IP or LoadBalancer IP from within the cluster will always get "Cluster" semantics, but clients sending to a NodePort from within the cluster may need to take traffic policy into account when picking a node.',
        type: "string",
      },
      healthCheckNodePort: {
        description:
          "healthCheckNodePort specifies the healthcheck nodePort for the service. This only applies when type is set to LoadBalancer and externalTrafficPolicy is set to Local. If a value is specified, is in-range, and is not in use, it will be used.  If not specified, a value will be automatically allocated.  External systems (e.g. load-balancers) can use this port to determine if a given node holds endpoints for this service or not.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type). This field cannot be updated once set.",
        format: "int32",
        type: "integer",
      },
      internalTrafficPolicy: {
        description:
          'InternalTrafficPolicy describes how nodes distribute service traffic they receive on the ClusterIP. If set to "Local", the proxy will assume that pods only want to talk to endpoints of the service on the same node as the pod, dropping the traffic if there are no local endpoints. The default value, "Cluster", uses the standard behavior of routing to all endpoints evenly (possibly modified by topology and other features).',
        type: "string",
      },
      ipFamilies: {
        description:
          'IPFamilies is a list of IP families (e.g. IPv4, IPv6) assigned to this service. This field is usually assigned automatically based on cluster configuration and the ipFamilyPolicy field. If this field is specified manually, the requested family is available in the cluster, and ipFamilyPolicy allows it, it will be used; otherwise creation of the service will fail. This field is conditionally mutable: it allows for adding or removing a secondary IP family, but it does not allow changing the primary IP family of the Service. Valid values are "IPv4" and "IPv6".  This field only applies to Services of types ClusterIP, NodePort, and LoadBalancer, and does apply to "headless" services. This field will be wiped when updating a Service to type ExternalName.\n\nThis field may hold a maximum of two entries (dual-stack families, in either order).  These families must correspond to the values of the clusterIPs field, if specified. Both clusterIPs and ipFamilies are governed by the ipFamilyPolicy field.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      ipFamilyPolicy: {
        description:
          'IPFamilyPolicy represents the dual-stack-ness requested or required by this Service. If there is no value provided, then this field will be set to SingleStack. Services can be "SingleStack" (a single IP family), "PreferDualStack" (two IP families on dual-stack configured clusters or a single IP family on single-stack clusters), or "RequireDualStack" (two IP families on dual-stack configured clusters, otherwise fail). The ipFamilies and clusterIPs fields depend on the value of this field. This field will be wiped when updating a service to type ExternalName.',
        type: "string",
      },
      loadBalancerClass: {
        description:
          "loadBalancerClass is the class of the load balancer implementation this Service belongs to. If specified, the value of this field must be a label-style identifier, with an optional prefix, e.g. \"internal-vip\" or \"example.com/internal-vip\". Unprefixed names are reserved for end-users. This field can only be set when the Service type is 'LoadBalancer'. If not set, the default load balancer implementation is used, today this is typically done through the cloud provider integration, but should apply for any default implementation. If set, it is assumed that a load balancer implementation is watching for Services with a matching class. Any default load balancer implementation (e.g. cloud providers) should ignore Services that set this field. This field can only be set when creating or updating a Service to type 'LoadBalancer'. Once set, it can not be changed. This field will be wiped when a service is updated to a non 'LoadBalancer' type.",
        type: "string",
      },
      loadBalancerIP: {
        description:
          "Only applies to Service Type: LoadBalancer. This feature depends on whether the underlying cloud-provider supports specifying the loadBalancerIP when a load balancer is created. This field will be ignored if the cloud-provider does not support the feature. Deprecated: This field was under-specified and its meaning varies across implementations. Using it is non-portable and it may not support dual-stack. Users are encouraged to use implementation-specific annotations when available.",
        type: "string",
      },
      loadBalancerSourceRanges: {
        description:
          'If specified and supported by the platform, this will restrict traffic through the cloud-provider load-balancer will be restricted to the specified client IPs. This field will be ignored if the cloud-provider does not support the feature." More info: https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/',
        items: {
          type: "string",
        },
        type: "array",
      },
      ports: {
        description:
          "The list of ports that are exposed by this service. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.ServicePort",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["port", "protocol"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "port",
        "x-kubernetes-patch-strategy": "merge",
      },
      publishNotReadyAddresses: {
        description:
          'publishNotReadyAddresses indicates that any agent which deals with endpoints for this Service should disregard any indications of ready/not-ready. The primary use case for setting this field is for a StatefulSet\'s Headless Service to propagate SRV DNS records for its Pods for the purpose of peer discovery. The Kubernetes controllers that generate Endpoints and EndpointSlice resources for Services interpret this to mean that all endpoints are considered "ready" even if the Pods themselves are not. Agents which consume only Kubernetes generated endpoints through the Endpoints or EndpointSlice resources can safely assume this behavior.',
        type: "boolean",
      },
      selector: {
        additionalProperties: {
          type: "string",
        },
        description:
          "Route service traffic to pods with label keys and values matching this selector. If empty or not present, the service is assumed to have an external process managing its endpoints, which Kubernetes will not modify. Only applies to types ClusterIP, NodePort, and LoadBalancer. Ignored if type is ExternalName. More info: https://kubernetes.io/docs/concepts/services-networking/service/",
        type: "object",
        "x-kubernetes-map-type": "atomic",
      },
      sessionAffinity: {
        description:
          'Supports "ClientIP" and "None". Used to maintain session affinity. Enable client IP based session affinity. Must be ClientIP or None. Defaults to None. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies',
        type: "string",
      },
      sessionAffinityConfig: {
        $ref: "#/definitions/io.k8s.api.core.v1.SessionAffinityConfig",
        description:
          "sessionAffinityConfig contains the configurations of session affinity.",
      },
      type: {
        description:
          'type determines how the Service is exposed. Defaults to ClusterIP. Valid options are ExternalName, ClusterIP, NodePort, and LoadBalancer. "ClusterIP" allocates a cluster-internal IP address for load-balancing to endpoints. Endpoints are determined by the selector or if that is not specified, by manual construction of an Endpoints object or EndpointSlice objects. If clusterIP is "None", no virtual IP is allocated and the endpoints are published as a set of endpoints rather than a virtual IP. "NodePort" builds on ClusterIP and allocates a port on every node which routes to the same endpoints as the clusterIP. "LoadBalancer" builds on NodePort and creates an external load-balancer (if supported in the current cloud) which routes to the same endpoints as the clusterIP. "ExternalName" aliases this service to the specified externalName. Several other fields do not apply to ExternalName services. More info: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.ServiceStatus": {
    description: "ServiceStatus represents the current status of a service.",
    properties: {
      conditions: {
        description: "Current service state",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Condition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      loadBalancer: {
        $ref: "#/definitions/io.k8s.api.core.v1.LoadBalancerStatus",
        description:
          "LoadBalancer contains the current status of the load-balancer, if one is present.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.SessionAffinityConfig": {
    description:
      "SessionAffinityConfig represents the configurations of session affinity.",
    properties: {
      clientIP: {
        $ref: "#/definitions/io.k8s.api.core.v1.ClientIPConfig",
        description:
          "clientIP contains the configurations of Client IP based session affinity.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.StorageOSPersistentVolumeSource": {
    description: "Represents a StorageOS persistent volume resource.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description:
          "secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.",
      },
      volumeName: {
        description:
          "volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.",
        type: "string",
      },
      volumeNamespace: {
        description:
          'volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod\'s namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.StorageOSVolumeSource": {
    description: "Represents a StorageOS persistent volume resource.",
    properties: {
      fsType: {
        description:
          'fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      readOnly: {
        description:
          "readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.",
        type: "boolean",
      },
      secretRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.LocalObjectReference",
        description:
          "secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.",
      },
      volumeName: {
        description:
          "volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.",
        type: "string",
      },
      volumeNamespace: {
        description:
          'volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod\'s namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.Sysctl": {
    description: "Sysctl defines a kernel parameter to be set",
    properties: {
      name: {
        description: "Name of a property to set",
        type: "string",
      },
      value: {
        description: "Value of a property to set",
        type: "string",
      },
    },
    required: ["name", "value"],
    type: "object",
  },
  "io.k8s.api.core.v1.TCPSocketAction": {
    description:
      "TCPSocketAction describes an action based on opening a socket",
    properties: {
      host: {
        description:
          "Optional: Host name to connect to, defaults to the pod IP.",
        type: "string",
      },
      port: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME.",
      },
    },
    required: ["port"],
    type: "object",
  },
  "io.k8s.api.core.v1.Taint": {
    description:
      'The node this Taint is attached to has the "effect" on any pod that does not tolerate the Taint.',
    properties: {
      effect: {
        description:
          "Required. The effect of the taint on pods that do not tolerate the taint. Valid effects are NoSchedule, PreferNoSchedule and NoExecute.",
        type: "string",
      },
      key: {
        description: "Required. The taint key to be applied to a node.",
        type: "string",
      },
      timeAdded: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "TimeAdded represents the time at which the taint was added. It is only written for NoExecute taints.",
      },
      value: {
        description: "The taint value corresponding to the taint key.",
        type: "string",
      },
    },
    required: ["key", "effect"],
    type: "object",
  },
  "io.k8s.api.core.v1.Toleration": {
    description:
      "The pod this Toleration is attached to tolerates any taint that matches the triple <key,value,effect> using the matching operator <operator>.",
    properties: {
      effect: {
        description:
          "Effect indicates the taint effect to match. Empty means match all taint effects. When specified, allowed values are NoSchedule, PreferNoSchedule and NoExecute.",
        type: "string",
      },
      key: {
        description:
          "Key is the taint key that the toleration applies to. Empty means match all taint keys. If the key is empty, operator must be Exists; this combination means to match all values and all keys.",
        type: "string",
      },
      operator: {
        description:
          "Operator represents a key's relationship to the value. Valid operators are Exists and Equal. Defaults to Equal. Exists is equivalent to wildcard for value, so that a pod can tolerate all taints of a particular category.",
        type: "string",
      },
      tolerationSeconds: {
        description:
          "TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint. By default, it is not set, which means tolerate the taint forever (do not evict). Zero and negative values will be treated as 0 (evict immediately) by the system.",
        format: "int64",
        type: "integer",
      },
      value: {
        description:
          "Value is the taint value the toleration matches to. If the operator is Exists, the value should be empty, otherwise just a regular string.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.TopologySelectorLabelRequirement": {
    description:
      "A topology selector requirement is a selector that matches given label. This is an alpha feature and may change in the future.",
    properties: {
      key: {
        description: "The label key that the selector applies to.",
        type: "string",
      },
      values: {
        description:
          "An array of string values. One value must match the label to be selected. Each entry in Values is ORed.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["key", "values"],
    type: "object",
  },
  "io.k8s.api.core.v1.TopologySelectorTerm": {
    description:
      "A topology selector term represents the result of label queries. A null or empty topology selector term matches no objects. The requirements of them are ANDed. It provides a subset of functionality as NodeSelectorTerm. This is an alpha feature and may change in the future.",
    properties: {
      matchLabelExpressions: {
        description: "A list of topology selector requirements by labels.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.TopologySelectorLabelRequirement",
        },
        type: "array",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.TopologySpreadConstraint": {
    description:
      "TopologySpreadConstraint specifies how to spread matching pods among the given topology.",
    properties: {
      labelSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "LabelSelector is used to find matching pods. Pods that match this label selector are counted to determine the number of pods in their corresponding topology domain.",
      },
      matchLabelKeys: {
        description:
          "MatchLabelKeys is a set of pod label keys to select the pods over which spreading will be calculated. The keys are used to lookup values from the incoming pod labels, those key-value labels are ANDed with labelSelector to select the group of existing pods over which spreading will be calculated for the incoming pod. The same key is forbidden to exist in both MatchLabelKeys and LabelSelector. MatchLabelKeys cannot be set when LabelSelector isn't set. Keys that don't exist in the incoming pod labels will be ignored. A null or empty list means only match against labelSelector.\n\nThis is a beta field and requires the MatchLabelKeysInPodTopologySpread feature gate to be enabled (enabled by default).",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      maxSkew: {
        description:
          "MaxSkew describes the degree to which pods may be unevenly distributed. When `whenUnsatisfiable=DoNotSchedule`, it is the maximum permitted difference between the number of matching pods in the target topology and the global minimum. The global minimum is the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 2/2/1: In this case, the global minimum is 1. | zone1 | zone2 | zone3 | |  P P  |  P P  |   P   | - if MaxSkew is 1, incoming pod can only be scheduled to zone3 to become 2/2/2; scheduling it onto zone1(zone2) would make the ActualSkew(3-1) on zone1(zone2) violate MaxSkew(1). - if MaxSkew is 2, incoming pod can be scheduled onto any zone. When `whenUnsatisfiable=ScheduleAnyway`, it is used to give higher precedence to topologies that satisfy it. It's a required field. Default value is 1 and 0 is not allowed.",
        format: "int32",
        type: "integer",
      },
      minDomains: {
        description:
          'MinDomains indicates a minimum number of eligible domains. When the number of eligible domains with matching topology keys is less than minDomains, Pod Topology Spread treats "global minimum" as 0, and then the calculation of Skew is performed. And when the number of eligible domains with matching topology keys equals or greater than minDomains, this value has no effect on scheduling. As a result, when the number of eligible domains is less than minDomains, scheduler won\'t schedule more than maxSkew Pods to those domains. If value is nil, the constraint behaves as if MinDomains is equal to 1. Valid values are integers greater than 0. When value is not nil, WhenUnsatisfiable must be DoNotSchedule.\n\nFor example, in a 3-zone cluster, MaxSkew is set to 2, MinDomains is set to 5 and pods with the same labelSelector spread as 2/2/2: | zone1 | zone2 | zone3 | |  P P  |  P P  |  P P  | The number of domains is less than 5(MinDomains), so "global minimum" is treated as 0. In this situation, new pod with the same labelSelector cannot be scheduled, because computed skew will be 3(3 - 0) if new Pod is scheduled to any of the three zones, it will violate MaxSkew.\n\nThis is a beta field and requires the MinDomainsInPodTopologySpread feature gate to be enabled (enabled by default).',
        format: "int32",
        type: "integer",
      },
      nodeAffinityPolicy: {
        description:
          "NodeAffinityPolicy indicates how we will treat Pod's nodeAffinity/nodeSelector when calculating pod topology spread skew. Options are: - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations. - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.\n\nIf this value is nil, the behavior is equivalent to the Honor policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.",
        type: "string",
      },
      nodeTaintsPolicy: {
        description:
          "NodeTaintsPolicy indicates how we will treat node taints when calculating pod topology spread skew. Options are: - Honor: nodes without taints, along with tainted nodes for which the incoming pod has a toleration, are included. - Ignore: node taints are ignored. All nodes are included.\n\nIf this value is nil, the behavior is equivalent to the Ignore policy. This is a beta-level feature default enabled by the NodeInclusionPolicyInPodTopologySpread feature flag.",
        type: "string",
      },
      topologyKey: {
        description:
          'TopologyKey is the key of node labels. Nodes that have a label with this key and identical values are considered to be in the same topology. We consider each <key, value> as a "bucket", and try to put balanced number of pods into each bucket. We define a domain as a particular instance of a topology. Also, we define an eligible domain as a domain whose nodes meet the requirements of nodeAffinityPolicy and nodeTaintsPolicy. e.g. If TopologyKey is "kubernetes.io/hostname", each Node is a domain of that topology. And, if TopologyKey is "topology.kubernetes.io/zone", each zone is a domain of that topology. It\'s a required field.',
        type: "string",
      },
      whenUnsatisfiable: {
        description:
          'WhenUnsatisfiable indicates how to deal with a pod if it doesn\'t satisfy the spread constraint. - DoNotSchedule (default) tells the scheduler not to schedule it. - ScheduleAnyway tells the scheduler to schedule the pod in any location,\n  but giving higher precedence to topologies that would help reduce the\n  skew.\nA constraint is considered "Unsatisfiable" for an incoming pod if and only if every possible node assignment for that pod would violate "MaxSkew" on some topology. For example, in a 3-zone cluster, MaxSkew is set to 1, and pods with the same labelSelector spread as 3/1/1: | zone1 | zone2 | zone3 | | P P P |   P   |   P   | If WhenUnsatisfiable is set to DoNotSchedule, incoming pod can only be scheduled to zone2(zone3) to become 3/2/1(3/1/2) as ActualSkew(2-1) on zone2(zone3) satisfies MaxSkew(1). In other words, the cluster can still be imbalanced, but scheduler won\'t make it *more* imbalanced. It\'s a required field.',
        type: "string",
      },
    },
    required: ["maxSkew", "topologyKey", "whenUnsatisfiable"],
    type: "object",
  },
  "io.k8s.api.core.v1.TypedLocalObjectReference": {
    description:
      "TypedLocalObjectReference contains enough information to let you locate the typed referenced object inside the same namespace.",
    properties: {
      apiGroup: {
        description:
          "APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.",
        type: "string",
      },
      kind: {
        description: "Kind is the type of resource being referenced",
        type: "string",
      },
      name: {
        description: "Name is the name of resource being referenced",
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.core.v1.TypedObjectReference": {
    properties: {
      apiGroup: {
        description:
          "APIGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.",
        type: "string",
      },
      kind: {
        description: "Kind is the type of resource being referenced",
        type: "string",
      },
      name: {
        description: "Name is the name of resource being referenced",
        type: "string",
      },
      namespace: {
        description:
          "Namespace is the namespace of resource being referenced Note that when a namespace is specified, a gateway.networking.k8s.io/ReferenceGrant object is required in the referent namespace to allow that namespace's owner to accept the reference. See the ReferenceGrant documentation for details. (Alpha) This field requires the CrossNamespaceVolumeDataSource feature gate to be enabled.",
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
  },
  "io.k8s.api.core.v1.Volume": {
    description:
      "Volume represents a named volume in a pod that may be accessed by any container in the pod.",
    properties: {
      awsElasticBlockStore: {
        $ref: "#/definitions/io.k8s.api.core.v1.AWSElasticBlockStoreVolumeSource",
        description:
          "awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore",
      },
      azureDisk: {
        $ref: "#/definitions/io.k8s.api.core.v1.AzureDiskVolumeSource",
        description:
          "azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.",
      },
      azureFile: {
        $ref: "#/definitions/io.k8s.api.core.v1.AzureFileVolumeSource",
        description:
          "azureFile represents an Azure File Service mount on the host and bind mount to the pod.",
      },
      cephfs: {
        $ref: "#/definitions/io.k8s.api.core.v1.CephFSVolumeSource",
        description:
          "cephFS represents a Ceph FS mount on the host that shares a pod's lifetime",
      },
      cinder: {
        $ref: "#/definitions/io.k8s.api.core.v1.CinderVolumeSource",
        description:
          "cinder represents a cinder volume attached and mounted on kubelets host machine. More info: https://examples.k8s.io/mysql-cinder-pd/README.md",
      },
      configMap: {
        $ref: "#/definitions/io.k8s.api.core.v1.ConfigMapVolumeSource",
        description:
          "configMap represents a configMap that should populate this volume",
      },
      csi: {
        $ref: "#/definitions/io.k8s.api.core.v1.CSIVolumeSource",
        description:
          "csi (Container Storage Interface) represents ephemeral storage that is handled by certain external CSI drivers (Beta feature).",
      },
      downwardAPI: {
        $ref: "#/definitions/io.k8s.api.core.v1.DownwardAPIVolumeSource",
        description:
          "downwardAPI represents downward API about the pod that should populate this volume",
      },
      emptyDir: {
        $ref: "#/definitions/io.k8s.api.core.v1.EmptyDirVolumeSource",
        description:
          "emptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir",
      },
      ephemeral: {
        $ref: "#/definitions/io.k8s.api.core.v1.EphemeralVolumeSource",
        description:
          "ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.\n\nUse this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity\n   tracking are needed,\nc) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through\n   a PersistentVolumeClaim (see EphemeralVolumeSource for more\n   information on the connection between this volume type\n   and PersistentVolumeClaim).\n\nUse PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.\n\nUse CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.\n\nA pod can use both types of ephemeral volumes and persistent volumes at the same time.",
      },
      fc: {
        $ref: "#/definitions/io.k8s.api.core.v1.FCVolumeSource",
        description:
          "fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.",
      },
      flexVolume: {
        $ref: "#/definitions/io.k8s.api.core.v1.FlexVolumeSource",
        description:
          "flexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.",
      },
      flocker: {
        $ref: "#/definitions/io.k8s.api.core.v1.FlockerVolumeSource",
        description:
          "flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running",
      },
      gcePersistentDisk: {
        $ref: "#/definitions/io.k8s.api.core.v1.GCEPersistentDiskVolumeSource",
        description:
          "gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk",
      },
      gitRepo: {
        $ref: "#/definitions/io.k8s.api.core.v1.GitRepoVolumeSource",
        description:
          "gitRepo represents a git repository at a particular revision. DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.",
      },
      glusterfs: {
        $ref: "#/definitions/io.k8s.api.core.v1.GlusterfsVolumeSource",
        description:
          "glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/glusterfs/README.md",
      },
      hostPath: {
        $ref: "#/definitions/io.k8s.api.core.v1.HostPathVolumeSource",
        description:
          "hostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath",
      },
      iscsi: {
        $ref: "#/definitions/io.k8s.api.core.v1.ISCSIVolumeSource",
        description:
          "iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://examples.k8s.io/volumes/iscsi/README.md",
      },
      name: {
        description:
          "name of the volume. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names",
        type: "string",
      },
      nfs: {
        $ref: "#/definitions/io.k8s.api.core.v1.NFSVolumeSource",
        description:
          "nfs represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs",
      },
      persistentVolumeClaim: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeClaimVolumeSource",
        description:
          "persistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims",
      },
      photonPersistentDisk: {
        $ref: "#/definitions/io.k8s.api.core.v1.PhotonPersistentDiskVolumeSource",
        description:
          "photonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine",
      },
      portworxVolume: {
        $ref: "#/definitions/io.k8s.api.core.v1.PortworxVolumeSource",
        description:
          "portworxVolume represents a portworx volume attached and mounted on kubelets host machine",
      },
      projected: {
        $ref: "#/definitions/io.k8s.api.core.v1.ProjectedVolumeSource",
        description:
          "projected items for all in one resources secrets, configmaps, and downward API",
      },
      quobyte: {
        $ref: "#/definitions/io.k8s.api.core.v1.QuobyteVolumeSource",
        description:
          "quobyte represents a Quobyte mount on the host that shares a pod's lifetime",
      },
      rbd: {
        $ref: "#/definitions/io.k8s.api.core.v1.RBDVolumeSource",
        description:
          "rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://examples.k8s.io/volumes/rbd/README.md",
      },
      scaleIO: {
        $ref: "#/definitions/io.k8s.api.core.v1.ScaleIOVolumeSource",
        description:
          "scaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes.",
      },
      secret: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretVolumeSource",
        description:
          "secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret",
      },
      storageos: {
        $ref: "#/definitions/io.k8s.api.core.v1.StorageOSVolumeSource",
        description:
          "storageOS represents a StorageOS volume attached and mounted on Kubernetes nodes.",
      },
      vsphereVolume: {
        $ref: "#/definitions/io.k8s.api.core.v1.VsphereVirtualDiskVolumeSource",
        description:
          "vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.core.v1.VolumeDevice": {
    description:
      "volumeDevice describes a mapping of a raw block device within a container.",
    properties: {
      devicePath: {
        description:
          "devicePath is the path inside of the container that the device will be mapped to.",
        type: "string",
      },
      name: {
        description:
          "name must match the name of a persistentVolumeClaim in the pod",
        type: "string",
      },
    },
    required: ["name", "devicePath"],
    type: "object",
  },
  "io.k8s.api.core.v1.VolumeMount": {
    description:
      "VolumeMount describes a mounting of a Volume within a container.",
    properties: {
      mountPath: {
        description:
          "Path within the container at which the volume should be mounted.  Must not contain ':'.",
        type: "string",
      },
      mountPropagation: {
        description:
          "mountPropagation determines how mounts are propagated from the host to container and the other way around. When not set, MountPropagationNone is used. This field is beta in 1.10.",
        type: "string",
      },
      name: {
        description: "This must match the Name of a Volume.",
        type: "string",
      },
      readOnly: {
        description:
          "Mounted read-only if true, read-write otherwise (false or unspecified). Defaults to false.",
        type: "boolean",
      },
      subPath: {
        description:
          "Path within the volume from which the container's volume should be mounted. Defaults to \"\" (volume's root).",
        type: "string",
      },
      subPathExpr: {
        description:
          "Expanded path within the volume from which the container's volume should be mounted. Behaves similarly to SubPath but environment variable references $(VAR_NAME) are expanded using the container's environment. Defaults to \"\" (volume's root). SubPathExpr and SubPath are mutually exclusive.",
        type: "string",
      },
    },
    required: ["name", "mountPath"],
    type: "object",
  },
  "io.k8s.api.core.v1.VolumeNodeAffinity": {
    description:
      "VolumeNodeAffinity defines constraints that limit what nodes this volume can be accessed from.",
    properties: {
      required: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSelector",
        description:
          "required specifies hard node constraints that must be met.",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.VolumeProjection": {
    description:
      "Projection that may be projected along with other supported volume types",
    properties: {
      configMap: {
        $ref: "#/definitions/io.k8s.api.core.v1.ConfigMapProjection",
        description:
          "configMap information about the configMap data to project",
      },
      downwardAPI: {
        $ref: "#/definitions/io.k8s.api.core.v1.DownwardAPIProjection",
        description:
          "downwardAPI information about the downwardAPI data to project",
      },
      secret: {
        $ref: "#/definitions/io.k8s.api.core.v1.SecretProjection",
        description: "secret information about the secret data to project",
      },
      serviceAccountToken: {
        $ref: "#/definitions/io.k8s.api.core.v1.ServiceAccountTokenProjection",
        description:
          "serviceAccountToken is information about the serviceAccountToken data to project",
      },
    },
    type: "object",
  },
  "io.k8s.api.core.v1.VsphereVirtualDiskVolumeSource": {
    description: "Represents a vSphere volume resource.",
    properties: {
      fsType: {
        description:
          'fsType is filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.',
        type: "string",
      },
      storagePolicyID: {
        description:
          "storagePolicyID is the storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName.",
        type: "string",
      },
      storagePolicyName: {
        description:
          "storagePolicyName is the storage Policy Based Management (SPBM) profile name.",
        type: "string",
      },
      volumePath: {
        description:
          "volumePath is the path that identifies vSphere volume vmdk",
        type: "string",
      },
    },
    required: ["volumePath"],
    type: "object",
  },
  "io.k8s.api.core.v1.WeightedPodAffinityTerm": {
    description:
      "The weights of all of the matched WeightedPodAffinityTerm fields are added per-node to find the most preferred node(s)",
    properties: {
      podAffinityTerm: {
        $ref: "#/definitions/io.k8s.api.core.v1.PodAffinityTerm",
        description:
          "Required. A pod affinity term, associated with the corresponding weight.",
      },
      weight: {
        description:
          "weight associated with matching the corresponding podAffinityTerm, in the range 1-100.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["weight", "podAffinityTerm"],
    type: "object",
  },
  "io.k8s.api.core.v1.WindowsSecurityContextOptions": {
    description:
      "WindowsSecurityContextOptions contain Windows-specific options and credentials.",
    properties: {
      gmsaCredentialSpec: {
        description:
          "GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named by the GMSACredentialSpecName field.",
        type: "string",
      },
      gmsaCredentialSpecName: {
        description:
          "GMSACredentialSpecName is the name of the GMSA credential spec to use.",
        type: "string",
      },
      hostProcess: {
        description:
          "HostProcess determines if a container should be run as a 'Host Process' container. All of a Pod's containers must have the same effective HostProcess value (it is not allowed to have a mix of HostProcess containers and non-HostProcess containers). In addition, if HostProcess is true then HostNetwork must also be set to true.",
        type: "boolean",
      },
      runAsUserName: {
        description:
          "The UserName in Windows to run the entrypoint of the container process. Defaults to the user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.discovery.v1.Endpoint": {
    description:
      'Endpoint represents a single logical "backend" implementing a service.',
    properties: {
      addresses: {
        description:
          "addresses of this endpoint. The contents of this field are interpreted according to the corresponding EndpointSlice addressType field. Consumers must handle different types of addresses in the context of their own capabilities. This must contain at least one address but no more than 100. These are all assumed to be fungible and clients may choose to only use the first element. Refer to: https://issue.k8s.io/106267",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      conditions: {
        $ref: "#/definitions/io.k8s.api.discovery.v1.EndpointConditions",
        description:
          "conditions contains information about the current status of the endpoint.",
      },
      deprecatedTopology: {
        additionalProperties: {
          type: "string",
        },
        description:
          "deprecatedTopology contains topology information part of the v1beta1 API. This field is deprecated, and will be removed when the v1beta1 API is removed (no sooner than kubernetes v1.24).  While this field can hold values, it is not writable through the v1 API, and any attempts to write to it will be silently ignored. Topology information can be found in the zone and nodeName fields instead.",
        type: "object",
      },
      hints: {
        $ref: "#/definitions/io.k8s.api.discovery.v1.EndpointHints",
        description:
          "hints contains information associated with how an endpoint should be consumed.",
      },
      hostname: {
        description:
          "hostname of this endpoint. This field may be used by consumers of endpoints to distinguish endpoints from each other (e.g. in DNS names). Multiple endpoints which use the same hostname should be considered fungible (e.g. multiple A values in DNS). Must be lowercase and pass DNS Label (RFC 1123) validation.",
        type: "string",
      },
      nodeName: {
        description:
          "nodeName represents the name of the Node hosting this endpoint. This can be used to determine endpoints local to a Node.",
        type: "string",
      },
      targetRef: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description:
          "targetRef is a reference to a Kubernetes object that represents this endpoint.",
      },
      zone: {
        description: "zone is the name of the Zone this endpoint exists in.",
        type: "string",
      },
    },
    required: ["addresses"],
    type: "object",
  },
  "io.k8s.api.discovery.v1.EndpointConditions": {
    description:
      "EndpointConditions represents the current condition of an endpoint.",
    properties: {
      ready: {
        description:
          'ready indicates that this endpoint is prepared to receive traffic, according to whatever system is managing the endpoint. A nil value indicates an unknown state. In most cases consumers should interpret this unknown state as ready. For compatibility reasons, ready should never be "true" for terminating endpoints, except when the normal readiness behavior is being explicitly overridden, for example when the associated Service has set the publishNotReadyAddresses flag.',
        type: "boolean",
      },
      serving: {
        description:
          "serving is identical to ready except that it is set regardless of the terminating state of endpoints. This condition should be set to true for a ready endpoint that is terminating. If nil, consumers should defer to the ready condition.",
        type: "boolean",
      },
      terminating: {
        description:
          "terminating indicates that this endpoint is terminating. A nil value indicates an unknown state. Consumers should interpret this unknown state to mean that the endpoint is not terminating.",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.discovery.v1.EndpointHints": {
    description:
      "EndpointHints provides hints describing how an endpoint should be consumed.",
    properties: {
      forZones: {
        description:
          "forZones indicates the zone(s) this endpoint should be consumed by to enable topology aware routing.",
        items: {
          $ref: "#/definitions/io.k8s.api.discovery.v1.ForZone",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.discovery.v1.EndpointPort": {
    description: "EndpointPort represents a Port used by an EndpointSlice",
    properties: {
      appProtocol: {
        description:
          "The application protocol for this port. This is used as a hint for implementations to offer richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax. Valid values are either:\n\n* Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).\n\n* Kubernetes-defined prefixed names:\n  * 'kubernetes.io/h2c' - HTTP/2 over cleartext as described in https://www.rfc-editor.org/rfc/rfc7540\n  * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455\n  * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455\n\n* Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.",
        type: "string",
      },
      name: {
        description:
          "name represents the name of this port. All ports in an EndpointSlice must have a unique name. If the EndpointSlice is dervied from a Kubernetes service, this corresponds to the Service.ports[].name. Name must either be an empty string or pass DNS_LABEL validation: * must be no more than 63 characters long. * must consist of lower case alphanumeric characters or '-'. * must start and end with an alphanumeric character. Default is empty string.",
        type: "string",
      },
      port: {
        description:
          "port represents the port number of the endpoint. If this is not specified, ports are not restricted and must be interpreted in the context of the specific consumer.",
        format: "int32",
        type: "integer",
      },
      protocol: {
        description:
          "protocol represents the IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP.",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.discovery.v1.EndpointSlice": {
    description:
      "EndpointSlice represents a subset of the endpoints that implement a service. For a given service there may be multiple EndpointSlice objects, selected by labels, which must be joined to produce the full set of endpoints.",
    properties: {
      addressType: {
        description:
          "addressType specifies the type of address carried by this EndpointSlice. All addresses in this slice must be the same type. This field is immutable after creation. The following address types are currently supported: * IPv4: Represents an IPv4 Address. * IPv6: Represents an IPv6 Address. * FQDN: Represents a Fully Qualified Domain Name.",
        type: "string",
      },
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      endpoints: {
        description:
          "endpoints is a list of unique endpoints in this slice. Each slice may include a maximum of 1000 endpoints.",
        items: {
          $ref: "#/definitions/io.k8s.api.discovery.v1.Endpoint",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object's metadata.",
      },
      ports: {
        description:
          'ports specifies the list of network ports exposed by each endpoint in this slice. Each port must have a unique name. When ports is empty, it indicates that there are no defined ports. When a port is defined with a nil port value, it indicates "all ports". Each slice may include a maximum of 100 ports.',
        items: {
          $ref: "#/definitions/io.k8s.api.discovery.v1.EndpointPort",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["addressType", "endpoints"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "discovery.k8s.io",
        kind: "EndpointSlice",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.discovery.v1.EndpointSliceList": {
    description: "EndpointSliceList represents a list of endpoint slices",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of endpoint slices",
        items: {
          $ref: "#/definitions/io.k8s.api.discovery.v1.EndpointSlice",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "discovery.k8s.io",
        kind: "EndpointSliceList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.discovery.v1.ForZone": {
    description:
      "ForZone provides information about which zones should consume this endpoint.",
    properties: {
      name: {
        description: "name represents the name of the zone.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.events.v1.Event": {
    description:
      "Event is a report of an event somewhere in the cluster. It generally denotes some state change in the system. Events have a limited retention time and triggers and messages may evolve with time.  Event consumers should not rely on the timing of an event with a given Reason reflecting a consistent underlying trigger, or the continued existence of events with that Reason.  Events should be treated as informative, best-effort, supplemental data.",
    properties: {
      action: {
        description:
          "action is what action was taken/failed regarding to the regarding object. It is machine-readable. This field cannot be empty for new Events and it can have at most 128 characters.",
        type: "string",
      },
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      deprecatedCount: {
        description:
          "deprecatedCount is the deprecated field assuring backward compatibility with core.v1 Event type.",
        format: "int32",
        type: "integer",
      },
      deprecatedFirstTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "deprecatedFirstTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type.",
      },
      deprecatedLastTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "deprecatedLastTimestamp is the deprecated field assuring backward compatibility with core.v1 Event type.",
      },
      deprecatedSource: {
        $ref: "#/definitions/io.k8s.api.core.v1.EventSource",
        description:
          "deprecatedSource is the deprecated field assuring backward compatibility with core.v1 Event type.",
      },
      eventTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime",
        description:
          "eventTime is the time when this Event was first observed. It is required.",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      note: {
        description:
          "note is a human-readable description of the status of this operation. Maximal length of the note is 1kB, but libraries should be prepared to handle values up to 64kB.",
        type: "string",
      },
      reason: {
        description:
          "reason is why the action was taken. It is human-readable. This field cannot be empty for new Events and it can have at most 128 characters.",
        type: "string",
      },
      regarding: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description:
          "regarding contains the object this Event is about. In most cases it's an Object reporting controller implements, e.g. ReplicaSetController implements ReplicaSets and this event is emitted because it acts on some changes in a ReplicaSet object.",
      },
      related: {
        $ref: "#/definitions/io.k8s.api.core.v1.ObjectReference",
        description:
          "related is the optional secondary object for more complex actions. E.g. when regarding object triggers a creation or deletion of related object.",
      },
      reportingController: {
        description:
          "reportingController is the name of the controller that emitted this Event, e.g. `kubernetes.io/kubelet`. This field cannot be empty for new Events.",
        type: "string",
      },
      reportingInstance: {
        description:
          "reportingInstance is the ID of the controller instance, e.g. `kubelet-xyzf`. This field cannot be empty for new Events and it can have at most 128 characters.",
        type: "string",
      },
      series: {
        $ref: "#/definitions/io.k8s.api.events.v1.EventSeries",
        description:
          "series is data about the Event series this event represents or nil if it's a singleton Event.",
      },
      type: {
        description:
          "type is the type of this event (Normal, Warning), new types could be added in the future. It is machine-readable. This field cannot be empty for new Events.",
        type: "string",
      },
    },
    required: ["eventTime"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "events.k8s.io",
        kind: "Event",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.events.v1.EventList": {
    description: "EventList is a list of Event objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is a list of schema objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.events.v1.Event",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "events.k8s.io",
        kind: "EventList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.events.v1.EventSeries": {
    description:
      'EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time. How often to update the EventSeries is up to the event reporters. The default event reporter in "k8s.io/client-go/tools/events/event_broadcaster.go" shows how this struct is updated on heartbeats and can guide customized reporter implementations.',
    properties: {
      count: {
        description:
          "count is the number of occurrences in this series up to the last heartbeat time.",
        format: "int32",
        type: "integer",
      },
      lastObservedTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime",
        description:
          "lastObservedTime is the time when last Event from the series was seen before last heartbeat.",
      },
    },
    required: ["count", "lastObservedTime"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.ExemptPriorityLevelConfiguration": {
    description:
      "ExemptPriorityLevelConfiguration describes the configurable aspects of the handling of exempt requests. In the mandatory exempt configuration object the values in the fields here can be modified by authorized users, unlike the rest of the `spec`.",
    properties: {
      lendablePercent: {
        description:
          "`lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels.  This value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.\n\nLendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )",
        format: "int32",
        type: "integer",
      },
      nominalConcurrencyShares: {
        description:
          "`nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats nominally reserved for this priority level. This DOES NOT limit the dispatching from this priority level but affects the other priority levels through the borrowing mechanism. The server's concurrency limit (ServerCL) is divided among all the priority levels in proportion to their NCS values:\n\nNominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)\n\nBigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level. This field has a default value of zero.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.FlowDistinguisherMethod": {
    description:
      "FlowDistinguisherMethod specifies the method of a flow distinguisher.",
    properties: {
      type: {
        description:
          '`type` is the type of flow distinguisher method The supported types are "ByUser" and "ByNamespace". Required.',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.FlowSchema": {
    description:
      'FlowSchema defines the schema of a group of flows. Note that a flow is made up of a set of inbound API requests with similar attributes and is identified by a pair of strings: the name of the FlowSchema and a "flow distinguisher".',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "`metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.FlowSchemaSpec",
        description:
          "`spec` is the specification of the desired behavior of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.FlowSchemaStatus",
        description:
          "`status` is the current status of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "FlowSchema",
        version: "v1beta2",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.FlowSchemaCondition": {
    description: "FlowSchemaCondition describes conditions for a FlowSchema.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "`lastTransitionTime` is the last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "`message` is a human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          "`reason` is a unique, one-word, CamelCase reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "`status` is the status of the condition. Can be True, False, Unknown. Required.",
        type: "string",
      },
      type: {
        description: "`type` is the type of the condition. Required.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.FlowSchemaList": {
    description: "FlowSchemaList is a list of FlowSchema objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "`items` is a list of FlowSchemas.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.FlowSchema",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "`metadata` is the standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "FlowSchemaList",
        version: "v1beta2",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.FlowSchemaSpec": {
    description:
      "FlowSchemaSpec describes how the FlowSchema's specification looks like.",
    properties: {
      distinguisherMethod: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.FlowDistinguisherMethod",
        description:
          "`distinguisherMethod` defines how to compute the flow distinguisher for requests that match this schema. `nil` specifies that the distinguisher is disabled and thus will always be the empty string.",
      },
      matchingPrecedence: {
        description:
          "`matchingPrecedence` is used to choose among the FlowSchemas that match a given request. The chosen FlowSchema is among those with the numerically lowest (which we take to be logically highest) MatchingPrecedence.  Each MatchingPrecedence value must be ranged in [1,10000]. Note that if the precedence is not specified, it will be set to 1000 as default.",
        format: "int32",
        type: "integer",
      },
      priorityLevelConfiguration: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationReference",
        description:
          "`priorityLevelConfiguration` should reference a PriorityLevelConfiguration in the cluster. If the reference cannot be resolved, the FlowSchema will be ignored and marked as invalid in its status. Required.",
      },
      rules: {
        description:
          "`rules` describes which requests will match this flow schema. This FlowSchema matches a request if and only if at least one member of rules matches the request. if it is an empty slice, there will be no requests matching the FlowSchema.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.PolicyRulesWithSubjects",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["priorityLevelConfiguration"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.FlowSchemaStatus": {
    description:
      "FlowSchemaStatus represents the current state of a FlowSchema.",
    properties: {
      conditions: {
        description:
          "`conditions` is a list of the current states of FlowSchema.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.FlowSchemaCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.GroupSubject": {
    description:
      "GroupSubject holds detailed information for group-kind subject.",
    properties: {
      name: {
        description:
          'name is the user group that matches, or "*" to match all user groups. See https://github.com/kubernetes/apiserver/blob/master/pkg/authentication/user/user.go for some well-known group names. Required.',
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.LimitResponse": {
    description:
      "LimitResponse defines how to handle requests that can not be executed right now.",
    properties: {
      queuing: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.QueuingConfiguration",
        description:
          '`queuing` holds the configuration parameters for queuing. This field may be non-empty only if `type` is `"Queue"`.',
      },
      type: {
        description:
          '`type` is "Queue" or "Reject". "Queue" means that requests that can not be executed upon arrival are held in a queue until they can be executed or a queuing limit is reached. "Reject" means that requests that can not be executed upon arrival are rejected. Required.',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "type",
        "fields-to-discriminateBy": {
          queuing: "Queuing",
        },
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.LimitedPriorityLevelConfiguration": {
    description:
      "LimitedPriorityLevelConfiguration specifies how to handle requests that are subject to limits. It addresses two issues:\n  - How are requests for this priority level limited?\n  - What should be done with requests that exceed the limit?",
    properties: {
      assuredConcurrencyShares: {
        description:
          "`assuredConcurrencyShares` (ACS) configures the execution limit, which is a limit on the number of requests of this priority level that may be exeucting at a given time.  ACS must be a positive number. The server's concurrency limit (SCL) is divided among the concurrency-controlled priority levels in proportion to their assured concurrency shares. This produces the assured concurrency value (ACV) --- the number of requests that may be executing at a time --- for each such priority level:\n\n            ACV(l) = ceil( SCL * ACS(l) / ( sum[priority levels k] ACS(k) ) )\n\nbigger numbers of ACS mean more reserved concurrent requests (at the expense of every other PL). This field has a default value of 30.",
        format: "int32",
        type: "integer",
      },
      borrowingLimitPercent: {
        description:
          "`borrowingLimitPercent`, if present, configures a limit on how many seats this priority level can borrow from other priority levels. The limit is known as this level's BorrowingConcurrencyLimit (BorrowingCL) and is a limit on the total number of seats that this level may borrow at any one time. This field holds the ratio of that limit to the level's nominal concurrency limit. When this field is non-nil, it must hold a non-negative integer and the limit is calculated as follows.\n\nBorrowingCL(i) = round( NominalCL(i) * borrowingLimitPercent(i)/100.0 )\n\nThe value of this field can be more than 100, implying that this priority level can borrow a number of seats that is greater than its own nominal concurrency limit (NominalCL). When this field is left `nil`, the limit is effectively infinite.",
        format: "int32",
        type: "integer",
      },
      lendablePercent: {
        description:
          "`lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels. The value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.\n\nLendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )",
        format: "int32",
        type: "integer",
      },
      limitResponse: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.LimitResponse",
        description:
          "`limitResponse` indicates what to do with requests that can not be executed right now",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.NonResourcePolicyRule": {
    description:
      "NonResourcePolicyRule is a predicate that matches non-resource requests according to their verb and the target non-resource URL. A NonResourcePolicyRule matches a request if and only if both (a) at least one member of verbs matches the request and (b) at least one member of nonResourceURLs matches the request.",
    properties: {
      nonResourceURLs: {
        description:
          '`nonResourceURLs` is a set of url prefixes that a user should have access to and may not be empty. For example:\n  - "/healthz" is legal\n  - "/hea*" is illegal\n  - "/hea" is legal but matches nothing\n  - "/hea/*" also matches nothing\n  - "/healthz/*" matches all per-component health checks.\n"*" matches all non-resource urls. if it is present, it must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      verbs: {
        description:
          '`verbs` is a list of matching verbs and may not be empty. "*" matches all verbs. If it is present, it must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    required: ["verbs", "nonResourceURLs"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.PolicyRulesWithSubjects": {
    description:
      "PolicyRulesWithSubjects prescribes a test that applies to a request to an apiserver. The test considers the subject making the request, the verb being requested, and the resource to be acted upon. This PolicyRulesWithSubjects matches a request if and only if both (a) at least one member of subjects matches the request and (b) at least one member of resourceRules or nonResourceRules matches the request.",
    properties: {
      nonResourceRules: {
        description:
          "`nonResourceRules` is a list of NonResourcePolicyRules that identify matching requests according to their verb and the target non-resource URL.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.NonResourcePolicyRule",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resourceRules: {
        description:
          "`resourceRules` is a slice of ResourcePolicyRules that identify matching requests according to their verb and the target resource. At least one of `resourceRules` and `nonResourceRules` has to be non-empty.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.ResourcePolicyRule",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      subjects: {
        description:
          "subjects is the list of normal user, serviceaccount, or group that this rule cares about. There must be at least one member in this slice. A slice that includes both the system:authenticated and system:unauthenticated user groups matches every request. Required.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.Subject",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["subjects"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfiguration": {
    description:
      "PriorityLevelConfiguration represents the configuration of a priority level.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "`metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationSpec",
        description:
          '`spec` is the specification of the desired behavior of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status',
      },
      status: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationStatus",
        description:
          '`status` is the current status of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status',
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "PriorityLevelConfiguration",
        version: "v1beta2",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationCondition": {
    description:
      "PriorityLevelConfigurationCondition defines the condition of priority level.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "`lastTransitionTime` is the last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "`message` is a human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          "`reason` is a unique, one-word, CamelCase reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "`status` is the status of the condition. Can be True, False, Unknown. Required.",
        type: "string",
      },
      type: {
        description: "`type` is the type of the condition. Required.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationList": {
    description:
      "PriorityLevelConfigurationList is a list of PriorityLevelConfiguration objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "`items` is a list of request-priorities.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfiguration",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "`metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "PriorityLevelConfigurationList",
        version: "v1beta2",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationReference": {
    description:
      'PriorityLevelConfigurationReference contains information that points to the "request-priority" being used.',
    properties: {
      name: {
        description:
          "`name` is the name of the priority level configuration being referenced Required.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationSpec": {
    description:
      "PriorityLevelConfigurationSpec specifies the configuration of a priority level.",
    properties: {
      exempt: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.ExemptPriorityLevelConfiguration",
        description:
          '`exempt` specifies how requests are handled for an exempt priority level. This field MUST be empty if `type` is `"Limited"`. This field MAY be non-empty if `type` is `"Exempt"`. If empty and `type` is `"Exempt"` then the default values for `ExemptPriorityLevelConfiguration` apply.',
      },
      limited: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.LimitedPriorityLevelConfiguration",
        description:
          '`limited` specifies how requests are handled for a Limited priority level. This field must be non-empty if and only if `type` is `"Limited"`.',
      },
      type: {
        description:
          '`type` indicates whether this priority level is subject to limitation on request execution.  A value of `"Exempt"` means that requests of this priority level are not subject to a limit (and thus are never queued) and do not detract from the capacity made available to other priority levels.  A value of `"Limited"` means that (a) requests of this priority level _are_ subject to limits and (b) some of the server\'s limited capacity is made available exclusively to this priority level. Required.',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "type",
        "fields-to-discriminateBy": {
          exempt: "Exempt",
          limited: "Limited",
        },
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationStatus": {
    description:
      'PriorityLevelConfigurationStatus represents the current state of a "request-priority".',
    properties: {
      conditions: {
        description: '`conditions` is the current state of "request-priority".',
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.PriorityLevelConfigurationCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.QueuingConfiguration": {
    description:
      "QueuingConfiguration holds the configuration parameters for queuing",
    properties: {
      handSize: {
        description:
          "`handSize` is a small positive number that configures the shuffle sharding of requests into queues.  When enqueuing a request at this priority level the request's flow identifier (a string pair) is hashed and the hash value is used to shuffle the list of queues and deal a hand of the size specified here.  The request is put into one of the shortest queues in that hand. `handSize` must be no larger than `queues`, and should be significantly smaller (so that a few heavy flows do not saturate most of the queues).  See the user-facing documentation for more extensive guidance on setting this field.  This field has a default value of 8.",
        format: "int32",
        type: "integer",
      },
      queueLengthLimit: {
        description:
          "`queueLengthLimit` is the maximum number of requests allowed to be waiting in a given queue of this priority level at a time; excess requests are rejected.  This value must be positive.  If not specified, it will be defaulted to 50.",
        format: "int32",
        type: "integer",
      },
      queues: {
        description:
          "`queues` is the number of queues for this priority level. The queues exist independently at each apiserver. The value must be positive.  Setting it to 1 effectively precludes shufflesharding and thus makes the distinguisher method of associated flow schemas irrelevant.  This field has a default value of 64.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.ResourcePolicyRule": {
    description:
      "ResourcePolicyRule is a predicate that matches some resource requests, testing the request's verb and the target resource. A ResourcePolicyRule matches a resource request if and only if: (a) at least one member of verbs matches the request, (b) at least one member of apiGroups matches the request, (c) at least one member of resources matches the request, and (d) either (d1) the request does not specify a namespace (i.e., `Namespace==\"\"`) and clusterScope is true or (d2) the request specifies a namespace and least one member of namespaces matches the request's namespace.",
    properties: {
      apiGroups: {
        description:
          '`apiGroups` is a list of matching API groups and may not be empty. "*" matches all API groups and, if present, must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      clusterScope: {
        description:
          "`clusterScope` indicates whether to match requests that do not specify a namespace (which happens either because the resource is not namespaced or the request targets all namespaces). If this field is omitted or false then the `namespaces` field must contain a non-empty list.",
        type: "boolean",
      },
      namespaces: {
        description:
          '`namespaces` is a list of target namespaces that restricts matches.  A request that specifies a target namespace matches only if either (a) this list contains that target namespace or (b) this list contains "*".  Note that "*" matches any specified namespace but does not match a request that _does not specify_ a namespace (see the `clusterScope` field for that). This list may be empty, but only if `clusterScope` is true.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      resources: {
        description:
          '`resources` is a list of matching resources (i.e., lowercase and plural) with, if desired, subresource.  For example, [ "services", "nodes/status" ].  This list may not be empty. "*" matches all resources and, if present, must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      verbs: {
        description:
          '`verbs` is a list of matching verbs and may not be empty. "*" matches all verbs and, if present, must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    required: ["verbs", "apiGroups", "resources"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.ServiceAccountSubject": {
    description:
      "ServiceAccountSubject holds detailed information for service-account-kind subject.",
    properties: {
      name: {
        description:
          '`name` is the name of matching ServiceAccount objects, or "*" to match regardless of name. Required.',
        type: "string",
      },
      namespace: {
        description:
          "`namespace` is the namespace of matching ServiceAccount objects. Required.",
        type: "string",
      },
    },
    required: ["namespace", "name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta2.Subject": {
    description:
      "Subject matches the originator of a request, as identified by the request authentication system. There are three ways of matching an originator; by user, group, or service account.",
    properties: {
      group: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.GroupSubject",
        description: "`group` matches based on user group name.",
      },
      kind: {
        description:
          "`kind` indicates which one of the other fields is non-empty. Required",
        type: "string",
      },
      serviceAccount: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.ServiceAccountSubject",
        description: "`serviceAccount` matches ServiceAccounts.",
      },
      user: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta2.UserSubject",
        description: "`user` matches based on username.",
      },
    },
    required: ["kind"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "kind",
        "fields-to-discriminateBy": {
          group: "Group",
          serviceAccount: "ServiceAccount",
          user: "User",
        },
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta2.UserSubject": {
    description:
      "UserSubject holds detailed information for user-kind subject.",
    properties: {
      name: {
        description:
          '`name` is the username that matches, or "*" to match all usernames. Required.',
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.ExemptPriorityLevelConfiguration": {
    description:
      "ExemptPriorityLevelConfiguration describes the configurable aspects of the handling of exempt requests. In the mandatory exempt configuration object the values in the fields here can be modified by authorized users, unlike the rest of the `spec`.",
    properties: {
      lendablePercent: {
        description:
          "`lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels.  This value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.\n\nLendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )",
        format: "int32",
        type: "integer",
      },
      nominalConcurrencyShares: {
        description:
          "`nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats nominally reserved for this priority level. This DOES NOT limit the dispatching from this priority level but affects the other priority levels through the borrowing mechanism. The server's concurrency limit (ServerCL) is divided among all the priority levels in proportion to their NCS values:\n\nNominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)\n\nBigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level. This field has a default value of zero.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.FlowDistinguisherMethod": {
    description:
      "FlowDistinguisherMethod specifies the method of a flow distinguisher.",
    properties: {
      type: {
        description:
          '`type` is the type of flow distinguisher method The supported types are "ByUser" and "ByNamespace". Required.',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.FlowSchema": {
    description:
      'FlowSchema defines the schema of a group of flows. Note that a flow is made up of a set of inbound API requests with similar attributes and is identified by a pair of strings: the name of the FlowSchema and a "flow distinguisher".',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "`metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.FlowSchemaSpec",
        description:
          "`spec` is the specification of the desired behavior of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.FlowSchemaStatus",
        description:
          "`status` is the current status of a FlowSchema. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "FlowSchema",
        version: "v1beta3",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.FlowSchemaCondition": {
    description: "FlowSchemaCondition describes conditions for a FlowSchema.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "`lastTransitionTime` is the last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "`message` is a human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          "`reason` is a unique, one-word, CamelCase reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "`status` is the status of the condition. Can be True, False, Unknown. Required.",
        type: "string",
      },
      type: {
        description: "`type` is the type of the condition. Required.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.FlowSchemaList": {
    description: "FlowSchemaList is a list of FlowSchema objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "`items` is a list of FlowSchemas.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.FlowSchema",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "`metadata` is the standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "FlowSchemaList",
        version: "v1beta3",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.FlowSchemaSpec": {
    description:
      "FlowSchemaSpec describes how the FlowSchema's specification looks like.",
    properties: {
      distinguisherMethod: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.FlowDistinguisherMethod",
        description:
          "`distinguisherMethod` defines how to compute the flow distinguisher for requests that match this schema. `nil` specifies that the distinguisher is disabled and thus will always be the empty string.",
      },
      matchingPrecedence: {
        description:
          "`matchingPrecedence` is used to choose among the FlowSchemas that match a given request. The chosen FlowSchema is among those with the numerically lowest (which we take to be logically highest) MatchingPrecedence.  Each MatchingPrecedence value must be ranged in [1,10000]. Note that if the precedence is not specified, it will be set to 1000 as default.",
        format: "int32",
        type: "integer",
      },
      priorityLevelConfiguration: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationReference",
        description:
          "`priorityLevelConfiguration` should reference a PriorityLevelConfiguration in the cluster. If the reference cannot be resolved, the FlowSchema will be ignored and marked as invalid in its status. Required.",
      },
      rules: {
        description:
          "`rules` describes which requests will match this flow schema. This FlowSchema matches a request if and only if at least one member of rules matches the request. if it is an empty slice, there will be no requests matching the FlowSchema.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.PolicyRulesWithSubjects",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["priorityLevelConfiguration"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.FlowSchemaStatus": {
    description:
      "FlowSchemaStatus represents the current state of a FlowSchema.",
    properties: {
      conditions: {
        description:
          "`conditions` is a list of the current states of FlowSchema.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.FlowSchemaCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.GroupSubject": {
    description:
      "GroupSubject holds detailed information for group-kind subject.",
    properties: {
      name: {
        description:
          'name is the user group that matches, or "*" to match all user groups. See https://github.com/kubernetes/apiserver/blob/master/pkg/authentication/user/user.go for some well-known group names. Required.',
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.LimitResponse": {
    description:
      "LimitResponse defines how to handle requests that can not be executed right now.",
    properties: {
      queuing: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.QueuingConfiguration",
        description:
          '`queuing` holds the configuration parameters for queuing. This field may be non-empty only if `type` is `"Queue"`.',
      },
      type: {
        description:
          '`type` is "Queue" or "Reject". "Queue" means that requests that can not be executed upon arrival are held in a queue until they can be executed or a queuing limit is reached. "Reject" means that requests that can not be executed upon arrival are rejected. Required.',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "type",
        "fields-to-discriminateBy": {
          queuing: "Queuing",
        },
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.LimitedPriorityLevelConfiguration": {
    description:
      "LimitedPriorityLevelConfiguration specifies how to handle requests that are subject to limits. It addresses two issues:\n  - How are requests for this priority level limited?\n  - What should be done with requests that exceed the limit?",
    properties: {
      borrowingLimitPercent: {
        description:
          "`borrowingLimitPercent`, if present, configures a limit on how many seats this priority level can borrow from other priority levels. The limit is known as this level's BorrowingConcurrencyLimit (BorrowingCL) and is a limit on the total number of seats that this level may borrow at any one time. This field holds the ratio of that limit to the level's nominal concurrency limit. When this field is non-nil, it must hold a non-negative integer and the limit is calculated as follows.\n\nBorrowingCL(i) = round( NominalCL(i) * borrowingLimitPercent(i)/100.0 )\n\nThe value of this field can be more than 100, implying that this priority level can borrow a number of seats that is greater than its own nominal concurrency limit (NominalCL). When this field is left `nil`, the limit is effectively infinite.",
        format: "int32",
        type: "integer",
      },
      lendablePercent: {
        description:
          "`lendablePercent` prescribes the fraction of the level's NominalCL that can be borrowed by other priority levels. The value of this field must be between 0 and 100, inclusive, and it defaults to 0. The number of seats that other levels can borrow from this level, known as this level's LendableConcurrencyLimit (LendableCL), is defined as follows.\n\nLendableCL(i) = round( NominalCL(i) * lendablePercent(i)/100.0 )",
        format: "int32",
        type: "integer",
      },
      limitResponse: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.LimitResponse",
        description:
          "`limitResponse` indicates what to do with requests that can not be executed right now",
      },
      nominalConcurrencyShares: {
        description:
          "`nominalConcurrencyShares` (NCS) contributes to the computation of the NominalConcurrencyLimit (NominalCL) of this level. This is the number of execution seats available at this priority level. This is used both for requests dispatched from this priority level as well as requests dispatched from other priority levels borrowing seats from this level. The server's concurrency limit (ServerCL) is divided among the Limited priority levels in proportion to their NCS values:\n\nNominalCL(i)  = ceil( ServerCL * NCS(i) / sum_ncs ) sum_ncs = sum[priority level k] NCS(k)\n\nBigger numbers mean a larger nominal concurrency limit, at the expense of every other priority level. This field has a default value of 30.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.NonResourcePolicyRule": {
    description:
      "NonResourcePolicyRule is a predicate that matches non-resource requests according to their verb and the target non-resource URL. A NonResourcePolicyRule matches a request if and only if both (a) at least one member of verbs matches the request and (b) at least one member of nonResourceURLs matches the request.",
    properties: {
      nonResourceURLs: {
        description:
          '`nonResourceURLs` is a set of url prefixes that a user should have access to and may not be empty. For example:\n  - "/healthz" is legal\n  - "/hea*" is illegal\n  - "/hea" is legal but matches nothing\n  - "/hea/*" also matches nothing\n  - "/healthz/*" matches all per-component health checks.\n"*" matches all non-resource urls. if it is present, it must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      verbs: {
        description:
          '`verbs` is a list of matching verbs and may not be empty. "*" matches all verbs. If it is present, it must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    required: ["verbs", "nonResourceURLs"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.PolicyRulesWithSubjects": {
    description:
      "PolicyRulesWithSubjects prescribes a test that applies to a request to an apiserver. The test considers the subject making the request, the verb being requested, and the resource to be acted upon. This PolicyRulesWithSubjects matches a request if and only if both (a) at least one member of subjects matches the request and (b) at least one member of resourceRules or nonResourceRules matches the request.",
    properties: {
      nonResourceRules: {
        description:
          "`nonResourceRules` is a list of NonResourcePolicyRules that identify matching requests according to their verb and the target non-resource URL.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.NonResourcePolicyRule",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      resourceRules: {
        description:
          "`resourceRules` is a slice of ResourcePolicyRules that identify matching requests according to their verb and the target resource. At least one of `resourceRules` and `nonResourceRules` has to be non-empty.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.ResourcePolicyRule",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      subjects: {
        description:
          "subjects is the list of normal user, serviceaccount, or group that this rule cares about. There must be at least one member in this slice. A slice that includes both the system:authenticated and system:unauthenticated user groups matches every request. Required.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.Subject",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["subjects"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfiguration": {
    description:
      "PriorityLevelConfiguration represents the configuration of a priority level.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "`metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationSpec",
        description:
          '`spec` is the specification of the desired behavior of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status',
      },
      status: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationStatus",
        description:
          '`status` is the current status of a "request-priority". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status',
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "PriorityLevelConfiguration",
        version: "v1beta3",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationCondition": {
    description:
      "PriorityLevelConfigurationCondition defines the condition of priority level.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "`lastTransitionTime` is the last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "`message` is a human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          "`reason` is a unique, one-word, CamelCase reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "`status` is the status of the condition. Can be True, False, Unknown. Required.",
        type: "string",
      },
      type: {
        description: "`type` is the type of the condition. Required.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationList": {
    description:
      "PriorityLevelConfigurationList is a list of PriorityLevelConfiguration objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "`items` is a list of request-priorities.",
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfiguration",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "`metadata` is the standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "PriorityLevelConfigurationList",
        version: "v1beta3",
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationReference": {
    description:
      'PriorityLevelConfigurationReference contains information that points to the "request-priority" being used.',
    properties: {
      name: {
        description:
          "`name` is the name of the priority level configuration being referenced Required.",
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationSpec": {
    description:
      "PriorityLevelConfigurationSpec specifies the configuration of a priority level.",
    properties: {
      exempt: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.ExemptPriorityLevelConfiguration",
        description:
          '`exempt` specifies how requests are handled for an exempt priority level. This field MUST be empty if `type` is `"Limited"`. This field MAY be non-empty if `type` is `"Exempt"`. If empty and `type` is `"Exempt"` then the default values for `ExemptPriorityLevelConfiguration` apply.',
      },
      limited: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.LimitedPriorityLevelConfiguration",
        description:
          '`limited` specifies how requests are handled for a Limited priority level. This field must be non-empty if and only if `type` is `"Limited"`.',
      },
      type: {
        description:
          '`type` indicates whether this priority level is subject to limitation on request execution.  A value of `"Exempt"` means that requests of this priority level are not subject to a limit (and thus are never queued) and do not detract from the capacity made available to other priority levels.  A value of `"Limited"` means that (a) requests of this priority level _are_ subject to limits and (b) some of the server\'s limited capacity is made available exclusively to this priority level. Required.',
        type: "string",
      },
    },
    required: ["type"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "type",
        "fields-to-discriminateBy": {
          exempt: "Exempt",
          limited: "Limited",
        },
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationStatus": {
    description:
      'PriorityLevelConfigurationStatus represents the current state of a "request-priority".',
    properties: {
      conditions: {
        description: '`conditions` is the current state of "request-priority".',
        items: {
          $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.PriorityLevelConfigurationCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.QueuingConfiguration": {
    description:
      "QueuingConfiguration holds the configuration parameters for queuing",
    properties: {
      handSize: {
        description:
          "`handSize` is a small positive number that configures the shuffle sharding of requests into queues.  When enqueuing a request at this priority level the request's flow identifier (a string pair) is hashed and the hash value is used to shuffle the list of queues and deal a hand of the size specified here.  The request is put into one of the shortest queues in that hand. `handSize` must be no larger than `queues`, and should be significantly smaller (so that a few heavy flows do not saturate most of the queues).  See the user-facing documentation for more extensive guidance on setting this field.  This field has a default value of 8.",
        format: "int32",
        type: "integer",
      },
      queueLengthLimit: {
        description:
          "`queueLengthLimit` is the maximum number of requests allowed to be waiting in a given queue of this priority level at a time; excess requests are rejected.  This value must be positive.  If not specified, it will be defaulted to 50.",
        format: "int32",
        type: "integer",
      },
      queues: {
        description:
          "`queues` is the number of queues for this priority level. The queues exist independently at each apiserver. The value must be positive.  Setting it to 1 effectively precludes shufflesharding and thus makes the distinguisher method of associated flow schemas irrelevant.  This field has a default value of 64.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.ResourcePolicyRule": {
    description:
      "ResourcePolicyRule is a predicate that matches some resource requests, testing the request's verb and the target resource. A ResourcePolicyRule matches a resource request if and only if: (a) at least one member of verbs matches the request, (b) at least one member of apiGroups matches the request, (c) at least one member of resources matches the request, and (d) either (d1) the request does not specify a namespace (i.e., `Namespace==\"\"`) and clusterScope is true or (d2) the request specifies a namespace and least one member of namespaces matches the request's namespace.",
    properties: {
      apiGroups: {
        description:
          '`apiGroups` is a list of matching API groups and may not be empty. "*" matches all API groups and, if present, must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      clusterScope: {
        description:
          "`clusterScope` indicates whether to match requests that do not specify a namespace (which happens either because the resource is not namespaced or the request targets all namespaces). If this field is omitted or false then the `namespaces` field must contain a non-empty list.",
        type: "boolean",
      },
      namespaces: {
        description:
          '`namespaces` is a list of target namespaces that restricts matches.  A request that specifies a target namespace matches only if either (a) this list contains that target namespace or (b) this list contains "*".  Note that "*" matches any specified namespace but does not match a request that _does not specify_ a namespace (see the `clusterScope` field for that). This list may be empty, but only if `clusterScope` is true.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      resources: {
        description:
          '`resources` is a list of matching resources (i.e., lowercase and plural) with, if desired, subresource.  For example, [ "services", "nodes/status" ].  This list may not be empty. "*" matches all resources and, if present, must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      verbs: {
        description:
          '`verbs` is a list of matching verbs and may not be empty. "*" matches all verbs and, if present, must be the only entry. Required.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    required: ["verbs", "apiGroups", "resources"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.ServiceAccountSubject": {
    description:
      "ServiceAccountSubject holds detailed information for service-account-kind subject.",
    properties: {
      name: {
        description:
          '`name` is the name of matching ServiceAccount objects, or "*" to match regardless of name. Required.',
        type: "string",
      },
      namespace: {
        description:
          "`namespace` is the namespace of matching ServiceAccount objects. Required.",
        type: "string",
      },
    },
    required: ["namespace", "name"],
    type: "object",
  },
  "io.k8s.api.flowcontrol.v1beta3.Subject": {
    description:
      "Subject matches the originator of a request, as identified by the request authentication system. There are three ways of matching an originator; by user, group, or service account.",
    properties: {
      group: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.GroupSubject",
        description: "`group` matches based on user group name.",
      },
      kind: {
        description:
          "`kind` indicates which one of the other fields is non-empty. Required",
        type: "string",
      },
      serviceAccount: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.ServiceAccountSubject",
        description: "`serviceAccount` matches ServiceAccounts.",
      },
      user: {
        $ref: "#/definitions/io.k8s.api.flowcontrol.v1beta3.UserSubject",
        description: "`user` matches based on username.",
      },
    },
    required: ["kind"],
    type: "object",
    "x-kubernetes-unions": [
      {
        discriminator: "kind",
        "fields-to-discriminateBy": {
          group: "Group",
          serviceAccount: "ServiceAccount",
          user: "User",
        },
      },
    ],
  },
  "io.k8s.api.flowcontrol.v1beta3.UserSubject": {
    description:
      "UserSubject holds detailed information for user-kind subject.",
    properties: {
      name: {
        description:
          '`name` is the username that matches, or "*" to match all usernames. Required.',
        type: "string",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.networking.v1.HTTPIngressPath": {
    description:
      "HTTPIngressPath associates a path with a backend. Incoming urls matching the path are forwarded to the backend.",
    properties: {
      backend: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressBackend",
        description:
          "backend defines the referenced service endpoint to which the traffic will be forwarded to.",
      },
      path: {
        description:
          'path is matched against the path of an incoming request. Currently it can contain characters disallowed from the conventional "path" part of a URL as defined by RFC 3986. Paths must begin with a \'/\' and must be present when using PathType with value "Exact" or "Prefix".',
        type: "string",
      },
      pathType: {
        description:
          "pathType determines the interpretation of the path matching. PathType can be one of the following values: * Exact: Matches the URL path exactly. * Prefix: Matches based on a URL path prefix split by '/'. Matching is\n  done on a path element by element basis. A path element refers is the\n  list of labels in the path split by the '/' separator. A request is a\n  match for path p if every p is an element-wise prefix of p of the\n  request path. Note that if the last element of the path is a substring\n  of the last element in request path, it is not a match (e.g. /foo/bar\n  matches /foo/bar/baz, but does not match /foo/barbaz).\n* ImplementationSpecific: Interpretation of the Path matching is up to\n  the IngressClass. Implementations can treat this as a separate PathType\n  or treat it identically to Prefix or Exact path types.\nImplementations are required to support all path types.",
        type: "string",
      },
    },
    required: ["pathType", "backend"],
    type: "object",
  },
  "io.k8s.api.networking.v1.HTTPIngressRuleValue": {
    description:
      "HTTPIngressRuleValue is a list of http selectors pointing to backends. In the example: http://<host>/<path>?<searchpart> -> backend where where parts of the url correspond to RFC 3986, this resource will be used to match against everything after the last '/' and before the first '?' or '#'.",
    properties: {
      paths: {
        description:
          "paths is a collection of paths that map requests to backends.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.HTTPIngressPath",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    required: ["paths"],
    type: "object",
  },
  "io.k8s.api.networking.v1.IPBlock": {
    description:
      'IPBlock describes a particular CIDR (Ex. "192.168.1.0/24","2001:db8::/64") that is allowed to the pods matched by a NetworkPolicySpec\'s podSelector. The except entry describes CIDRs that should not be included within this rule.',
    properties: {
      cidr: {
        description:
          'cidr is a string representing the IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64"',
        type: "string",
      },
      except: {
        description:
          'except is a slice of CIDRs that should not be included within an IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64" Except values will be rejected if they are outside the cidr range',
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["cidr"],
    type: "object",
  },
  "io.k8s.api.networking.v1.Ingress": {
    description:
      "Ingress is a collection of rules that allow inbound connections to reach the endpoints defined by a backend. An Ingress can be configured to give services externally-reachable urls, load balance traffic, terminate SSL, offer name based virtual hosting etc.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressSpec",
        description:
          "spec is the desired state of the Ingress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressStatus",
        description:
          "status is the current state of the Ingress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "Ingress",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.networking.v1.IngressBackend": {
    description:
      "IngressBackend describes all endpoints for a given service and port.",
    properties: {
      resource: {
        $ref: "#/definitions/io.k8s.api.core.v1.TypedLocalObjectReference",
        description:
          'resource is an ObjectRef to another Kubernetes resource in the namespace of the Ingress object. If resource is specified, a service.Name and service.Port must not be specified. This is a mutually exclusive setting with "Service".',
      },
      service: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressServiceBackend",
        description:
          'service references a service as a backend. This is a mutually exclusive setting with "Resource".',
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressClass": {
    description:
      "IngressClass represents the class of the Ingress, referenced by the Ingress Spec. The `ingressclass.kubernetes.io/is-default-class` annotation can be used to indicate that an IngressClass should be considered default. When a single IngressClass resource has this annotation set to true, new Ingress resources without a class specified will be assigned this default class.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressClassSpec",
        description:
          "spec is the desired state of the IngressClass. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "IngressClass",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.networking.v1.IngressClassList": {
    description: "IngressClassList is a collection of IngressClasses.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of IngressClasses.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.IngressClass",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "IngressClassList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.networking.v1.IngressClassParametersReference": {
    description:
      "IngressClassParametersReference identifies an API object. This can be used to specify a cluster or namespace-scoped resource.",
    properties: {
      apiGroup: {
        description:
          "apiGroup is the group for the resource being referenced. If APIGroup is not specified, the specified Kind must be in the core API group. For any other third-party types, APIGroup is required.",
        type: "string",
      },
      kind: {
        description: "kind is the type of resource being referenced.",
        type: "string",
      },
      name: {
        description: "name is the name of resource being referenced.",
        type: "string",
      },
      namespace: {
        description:
          'namespace is the namespace of the resource being referenced. This field is required when scope is set to "Namespace" and must be unset when scope is set to "Cluster".',
        type: "string",
      },
      scope: {
        description:
          'scope represents if this refers to a cluster or namespace scoped resource. This may be set to "Cluster" (default) or "Namespace".',
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressClassSpec": {
    description:
      "IngressClassSpec provides information about the class of an Ingress.",
    properties: {
      controller: {
        description:
          'controller refers to the name of the controller that should handle this class. This allows for different "flavors" that are controlled by the same controller. For example, you may have different parameters for the same implementing controller. This should be specified as a domain-prefixed path no more than 250 characters in length, e.g. "acme.io/ingress-controller". This field is immutable.',
        type: "string",
      },
      parameters: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressClassParametersReference",
        description:
          "parameters is a link to a custom resource containing additional configuration for the controller. This is optional if the controller does not require extra parameters.",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressList": {
    description: "IngressList is a collection of Ingress.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of Ingress.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.Ingress",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "IngressList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.networking.v1.IngressLoadBalancerIngress": {
    description:
      "IngressLoadBalancerIngress represents the status of a load-balancer ingress point.",
    properties: {
      hostname: {
        description:
          "hostname is set for load-balancer ingress points that are DNS based.",
        type: "string",
      },
      ip: {
        description:
          "ip is set for load-balancer ingress points that are IP based.",
        type: "string",
      },
      ports: {
        description:
          "ports provides information about the ports exposed by this LoadBalancer.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.IngressPortStatus",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressLoadBalancerStatus": {
    description:
      "IngressLoadBalancerStatus represents the status of a load-balancer.",
    properties: {
      ingress: {
        description:
          "ingress is a list containing ingress points for the load-balancer.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.IngressLoadBalancerIngress",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressPortStatus": {
    description:
      "IngressPortStatus represents the error condition of a service port",
    properties: {
      error: {
        description:
          "error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified in this file and those shall use\n  CamelCase names\n- cloud provider specific error values must have names that comply with the\n  format foo.example.com/CamelCase.",
        type: "string",
      },
      port: {
        description: "port is the port number of the ingress port.",
        format: "int32",
        type: "integer",
      },
      protocol: {
        description:
          'protocol is the protocol of the ingress port. The supported values are: "TCP", "UDP", "SCTP"',
        type: "string",
      },
    },
    required: ["port", "protocol"],
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressRule": {
    description:
      "IngressRule represents the rules mapping the paths under a specified host to the related backend services. Incoming requests are first evaluated for a host match, then routed to the backend associated with the matching IngressRuleValue.",
    properties: {
      host: {
        description:
          'host is the fully qualified domain name of a network host, as defined by RFC 3986. Note the following deviations from the "host" part of the URI as defined in RFC 3986: 1. IPs are not allowed. Currently an IngressRuleValue can only apply to\n   the IP in the Spec of the parent Ingress.\n2. The `:` delimiter is not respected because ports are not allowed.\n\t  Currently the port of an Ingress is implicitly :80 for http and\n\t  :443 for https.\nBoth these may change in the future. Incoming requests are matched against the host before the IngressRuleValue. If the host is unspecified, the Ingress routes all traffic based on the specified IngressRuleValue.\n\nhost can be "precise" which is a domain name without the terminating dot of a network host (e.g. "foo.bar.com") or "wildcard", which is a domain name prefixed with a single wildcard label (e.g. "*.foo.com"). The wildcard character \'*\' must appear by itself as the first DNS label and matches only a single label. You cannot have a wildcard label by itself (e.g. Host == "*"). Requests will be matched against the Host field in the following way: 1. If host is precise, the request matches this rule if the http host header is equal to Host. 2. If host is a wildcard, then the request matches this rule if the http host header is to equal to the suffix (removing the first label) of the wildcard rule.',
        type: "string",
      },
      http: {
        $ref: "#/definitions/io.k8s.api.networking.v1.HTTPIngressRuleValue",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressServiceBackend": {
    description:
      "IngressServiceBackend references a Kubernetes Service as a Backend.",
    properties: {
      name: {
        description:
          "name is the referenced service. The service must exist in the same namespace as the Ingress object.",
        type: "string",
      },
      port: {
        $ref: "#/definitions/io.k8s.api.networking.v1.ServiceBackendPort",
        description:
          "port of the referenced service. A port name or port number is required for a IngressServiceBackend.",
      },
    },
    required: ["name"],
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressSpec": {
    description: "IngressSpec describes the Ingress the user wishes to exist.",
    properties: {
      defaultBackend: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressBackend",
        description:
          "defaultBackend is the backend that should handle requests that don't match any rule. If Rules are not specified, DefaultBackend must be specified. If DefaultBackend is not set, the handling of requests that do not match any of the rules will be up to the Ingress controller.",
      },
      ingressClassName: {
        description:
          "ingressClassName is the name of an IngressClass cluster resource. Ingress controller implementations use this field to know whether they should be serving this Ingress resource, by a transitive connection (controller -> IngressClass -> Ingress resource). Although the `kubernetes.io/ingress.class` annotation (simple constant name) was never formally defined, it was widely supported by Ingress controllers to create a direct binding between Ingress controller and Ingress resources. Newly created Ingress resources should prefer using the field. However, even though the annotation is officially deprecated, for backwards compatibility reasons, ingress controllers should still honor that annotation if present.",
        type: "string",
      },
      rules: {
        description:
          "rules is a list of host rules used to configure the Ingress. If unspecified, or no rule matches, all traffic is sent to the default backend.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.IngressRule",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      tls: {
        description:
          "tls represents the TLS configuration. Currently the Ingress only supports a single TLS port, 443. If multiple members of this list specify different hosts, they will be multiplexed on the same port according to the hostname specified through the SNI TLS extension, if the ingress controller fulfilling the ingress supports SNI.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.IngressTLS",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressStatus": {
    description: "IngressStatus describe the current state of the Ingress.",
    properties: {
      loadBalancer: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IngressLoadBalancerStatus",
        description:
          "loadBalancer contains the current status of the load-balancer.",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.IngressTLS": {
    description:
      "IngressTLS describes the transport layer security associated with an ingress.",
    properties: {
      hosts: {
        description:
          "hosts is a list of hosts included in the TLS certificate. The values in this list must match the name/s used in the tlsSecret. Defaults to the wildcard host setting for the loadbalancer controller fulfilling this Ingress, if left unspecified.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      secretName: {
        description:
          'secretName is the name of the secret used to terminate TLS traffic on port 443. Field is left optional to allow TLS routing based on SNI hostname alone. If the SNI host in a listener conflicts with the "Host" header field used by an IngressRule, the SNI host is used for termination and value of the "Host" header is used for routing.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.NetworkPolicy": {
    description:
      "NetworkPolicy describes what network traffic is allowed for a set of Pods",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicySpec",
        description:
          "spec represents the specification of the desired behavior for this NetworkPolicy.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "NetworkPolicy",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.networking.v1.NetworkPolicyEgressRule": {
    description:
      "NetworkPolicyEgressRule describes a particular set of traffic that is allowed out of pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and to. This type is beta-level in 1.8",
    properties: {
      ports: {
        description:
          "ports is a list of destination ports for outgoing traffic. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicyPort",
        },
        type: "array",
      },
      to: {
        description:
          "to is a list of destinations for outgoing traffic of pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all destinations (traffic not restricted by destination). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the to list.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicyPeer",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.NetworkPolicyIngressRule": {
    description:
      "NetworkPolicyIngressRule describes a particular set of traffic that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and from.",
    properties: {
      from: {
        description:
          "from is a list of sources which should be able to access the pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all sources (traffic not restricted by source). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the from list.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicyPeer",
        },
        type: "array",
      },
      ports: {
        description:
          "ports is a list of ports which should be made accessible on the pods selected for this rule. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicyPort",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.NetworkPolicyList": {
    description: "NetworkPolicyList is a list of NetworkPolicy objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is a list of schema objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicy",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "NetworkPolicyList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.networking.v1.NetworkPolicyPeer": {
    description:
      "NetworkPolicyPeer describes a peer to allow traffic to/from. Only certain combinations of fields are allowed",
    properties: {
      ipBlock: {
        $ref: "#/definitions/io.k8s.api.networking.v1.IPBlock",
        description:
          "ipBlock defines policy on a particular IPBlock. If this field is set then neither of the other fields can be.",
      },
      namespaceSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "namespaceSelector selects namespaces using cluster-scoped labels. This field follows standard label selector semantics; if present but empty, it selects all namespaces.\n\nIf podSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the namespaces selected by namespaceSelector. Otherwise it selects all pods in the namespaces selected by namespaceSelector.",
      },
      podSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "podSelector is a label selector which selects pods. This field follows standard label selector semantics; if present but empty, it selects all pods.\n\nIf namespaceSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects the pods matching podSelector in the policy's own namespace.",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.NetworkPolicyPort": {
    description: "NetworkPolicyPort describes a port to allow traffic on",
    properties: {
      endPort: {
        description:
          "endPort indicates that the range of ports from port to endPort if set, inclusive, should be allowed by the policy. This field cannot be defined if the port field is not defined or if the port field is defined as a named (string) port. The endPort must be equal or greater than port.",
        format: "int32",
        type: "integer",
      },
      port: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          "port represents the port on the given protocol. This can either be a numerical or named port on a pod. If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched.",
      },
      protocol: {
        description:
          "protocol represents the protocol (TCP, UDP, or SCTP) which traffic must match. If not specified, this field defaults to TCP.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1.NetworkPolicySpec": {
    description:
      "NetworkPolicySpec provides the specification of a NetworkPolicy",
    properties: {
      egress: {
        description:
          "egress is a list of egress rules to be applied to the selected pods. Outgoing traffic is allowed if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic matches at least one egress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy limits all outgoing traffic (and serves solely to ensure that the pods it selects are isolated by default). This field is beta-level in 1.8",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicyEgressRule",
        },
        type: "array",
      },
      ingress: {
        description:
          "ingress is a list of ingress rules to be applied to the selected pods. Traffic is allowed to a pod if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic source is the pod's local node, OR if the traffic matches at least one ingress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy does not allow any traffic (and serves solely to ensure that the pods it selects are isolated by default)",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1.NetworkPolicyIngressRule",
        },
        type: "array",
      },
      podSelector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "podSelector selects the pods to which this NetworkPolicy object applies. The array of ingress rules is applied to any pods selected by this field. Multiple network policies can select the same set of pods. In this case, the ingress rules for each are combined additively. This field is NOT optional and follows standard label selector semantics. An empty podSelector matches all pods in this namespace.",
      },
      policyTypes: {
        description:
          'policyTypes is a list of rule types that the NetworkPolicy relates to. Valid options are ["Ingress"], ["Egress"], or ["Ingress", "Egress"]. If this field is not specified, it will default based on the existence of ingress or egress rules; policies that contain an egress section are assumed to affect egress, and all policies (whether or not they contain an ingress section) are assumed to affect ingress. If you want to write an egress-only policy, you must explicitly specify policyTypes [ "Egress" ]. Likewise, if you want to write a policy that specifies that no egress is allowed, you must specify a policyTypes value that include "Egress" (since such a policy would not include an egress section and would otherwise default to just [ "Ingress" ]). This field is beta-level in 1.8',
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["podSelector"],
    type: "object",
  },
  "io.k8s.api.networking.v1.ServiceBackendPort": {
    description: "ServiceBackendPort is the service port being referenced.",
    properties: {
      name: {
        description:
          'name is the name of the port on the Service. This is a mutually exclusive setting with "Number".',
        type: "string",
      },
      number: {
        description:
          'number is the numerical port number (e.g. 80) on the Service. This is a mutually exclusive setting with "Name".',
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1alpha1.ClusterCIDR": {
    description:
      "ClusterCIDR represents a single configuration for per-Node Pod CIDR allocations when the MultiCIDRRangeAllocator is enabled (see the config for kube-controller-manager).  A cluster may have any number of ClusterCIDR resources, all of which will be considered when allocating a CIDR for a Node.  A ClusterCIDR is eligible to be used for a given Node when the node selector matches the node in question and has free CIDRs to allocate.  In case of multiple matching ClusterCIDR resources, the allocator will attempt to break ties using internal heuristics, but any ClusterCIDR whose node selector matches the Node may be used.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.networking.v1alpha1.ClusterCIDRSpec",
        description:
          "spec is the desired state of the ClusterCIDR. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "ClusterCIDR",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.networking.v1alpha1.ClusterCIDRList": {
    description: "ClusterCIDRList contains a list of ClusterCIDR.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of ClusterCIDRs.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1alpha1.ClusterCIDR",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "ClusterCIDRList",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.networking.v1alpha1.ClusterCIDRSpec": {
    description: "ClusterCIDRSpec defines the desired state of ClusterCIDR.",
    properties: {
      ipv4: {
        description:
          'ipv4 defines an IPv4 IP block in CIDR notation(e.g. "10.0.0.0/8"). At least one of ipv4 and ipv6 must be specified. This field is immutable.',
        type: "string",
      },
      ipv6: {
        description:
          'ipv6 defines an IPv6 IP block in CIDR notation(e.g. "2001:db8::/64"). At least one of ipv4 and ipv6 must be specified. This field is immutable.',
        type: "string",
      },
      nodeSelector: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSelector",
        description:
          "nodeSelector defines which nodes the config is applicable to. An empty or nil nodeSelector selects all nodes. This field is immutable.",
      },
      perNodeHostBits: {
        description:
          "perNodeHostBits defines the number of host bits to be configured per node. A subnet mask determines how much of the address is used for network bits and host bits. For example an IPv4 address of 192.168.0.0/24, splits the address into 24 bits for the network portion and 8 bits for the host portion. To allocate 256 IPs, set this field to 8 (a /24 mask for IPv4 or a /120 for IPv6). Minimum value is 4 (16 IPs). This field is immutable.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["perNodeHostBits"],
    type: "object",
  },
  "io.k8s.api.networking.v1alpha1.IPAddress": {
    description:
      "IPAddress represents a single IP of a single IP Family. The object is designed to be used by APIs that operate on IP addresses. The object is used by the Service core API for allocation of IP addresses. An IP address can be represented in different formats, to guarantee the uniqueness of the IP, the name of the object is the IP address in canonical format, four decimal digits separated by dots suppressing leading zeros for IPv4 and the representation defined by RFC 5952 for IPv6. Valid: 192.168.1.5 or 2001:db8::1 or 2001:db8:aaaa:bbbb:cccc:dddd:eeee:1 Invalid: 10.01.2.3 or 2001:db8:0:0:0::1",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.networking.v1alpha1.IPAddressSpec",
        description:
          "spec is the desired state of the IPAddress. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "IPAddress",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.networking.v1alpha1.IPAddressList": {
    description: "IPAddressList contains a list of IPAddress.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of IPAddresses.",
        items: {
          $ref: "#/definitions/io.k8s.api.networking.v1alpha1.IPAddress",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "networking.k8s.io",
        kind: "IPAddressList",
        version: "v1alpha1",
      },
    ],
  },
  "io.k8s.api.networking.v1alpha1.IPAddressSpec": {
    description: "IPAddressSpec describe the attributes in an IP Address.",
    properties: {
      parentRef: {
        $ref: "#/definitions/io.k8s.api.networking.v1alpha1.ParentReference",
        description:
          "ParentRef references the resource that an IPAddress is attached to. An IPAddress must reference a parent object.",
      },
    },
    type: "object",
  },
  "io.k8s.api.networking.v1alpha1.ParentReference": {
    description: "ParentReference describes a reference to a parent object.",
    properties: {
      group: {
        description: "Group is the group of the object being referenced.",
        type: "string",
      },
      name: {
        description: "Name is the name of the object being referenced.",
        type: "string",
      },
      namespace: {
        description:
          "Namespace is the namespace of the object being referenced.",
        type: "string",
      },
      resource: {
        description: "Resource is the resource of the object being referenced.",
        type: "string",
      },
      uid: {
        description: "UID is the uid of the object being referenced.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.node.v1.Overhead": {
    description:
      "Overhead structure represents the resource overhead associated with running a pod.",
    properties: {
      podFixed: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        },
        description:
          "podFixed represents the fixed resource overhead associated with running a pod.",
        type: "object",
      },
    },
    type: "object",
  },
  "io.k8s.api.node.v1.RuntimeClass": {
    description:
      "RuntimeClass defines a class of container runtime supported in the cluster. The RuntimeClass is used to determine which container runtime is used to run all containers in a pod. RuntimeClasses are manually defined by a user or cluster provisioner, and referenced in the PodSpec. The Kubelet is responsible for resolving the RuntimeClassName reference before running the pod.  For more details, see https://kubernetes.io/docs/concepts/containers/runtime-class/",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      handler: {
        description:
          'handler specifies the underlying runtime and configuration that the CRI implementation will use to handle pods of this class. The possible values are specific to the node & CRI configuration.  It is assumed that all handlers are available on every node, and handlers of the same name are equivalent on every node. For example, a handler called "runc" might specify that the runc OCI runtime (using native Linux containers) will be used to run the containers in a pod. The Handler must be lowercase, conform to the DNS Label (RFC 1123) requirements, and is immutable.',
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      overhead: {
        $ref: "#/definitions/io.k8s.api.node.v1.Overhead",
        description:
          "overhead represents the resource overhead associated with running a pod for a given RuntimeClass. For more details, see\n https://kubernetes.io/docs/concepts/scheduling-eviction/pod-overhead/",
      },
      scheduling: {
        $ref: "#/definitions/io.k8s.api.node.v1.Scheduling",
        description:
          "scheduling holds the scheduling constraints to ensure that pods running with this RuntimeClass are scheduled to nodes that support it. If scheduling is nil, this RuntimeClass is assumed to be supported by all nodes.",
      },
    },
    required: ["handler"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "node.k8s.io",
        kind: "RuntimeClass",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.node.v1.RuntimeClassList": {
    description: "RuntimeClassList is a list of RuntimeClass objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is a list of schema objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.node.v1.RuntimeClass",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "node.k8s.io",
        kind: "RuntimeClassList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.node.v1.Scheduling": {
    description:
      "Scheduling specifies the scheduling constraints for nodes supporting a RuntimeClass.",
    properties: {
      nodeSelector: {
        additionalProperties: {
          type: "string",
        },
        description:
          "nodeSelector lists labels that must be present on nodes that support this RuntimeClass. Pods using this RuntimeClass can only be scheduled to a node matched by this selector. The RuntimeClass nodeSelector is merged with a pod's existing nodeSelector. Any conflicts will cause the pod to be rejected in admission.",
        type: "object",
        "x-kubernetes-map-type": "atomic",
      },
      tolerations: {
        description:
          "tolerations are appended (excluding duplicates) to pods running with this RuntimeClass during admission, effectively unioning the set of nodes tolerated by the pod and the RuntimeClass.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.Toleration",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
    },
    type: "object",
  },
  "io.k8s.api.policy.v1.Eviction": {
    description:
      "Eviction evicts a pod from its node subject to certain policies and safety constraints. This is a subresource of Pod.  A request to cause such an eviction is created by POSTing to .../pods/<pod name>/evictions.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      deleteOptions: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.DeleteOptions",
        description: "DeleteOptions may be provided",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "ObjectMeta describes the pod that is being evicted.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "policy",
        kind: "Eviction",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.policy.v1.PodDisruptionBudget": {
    description:
      "PodDisruptionBudget is an object to define the max disruption that can be caused to a collection of pods",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.policy.v1.PodDisruptionBudgetSpec",
        description:
          "Specification of the desired behavior of the PodDisruptionBudget.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.policy.v1.PodDisruptionBudgetStatus",
        description:
          "Most recently observed status of the PodDisruptionBudget.",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "policy",
        kind: "PodDisruptionBudget",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.policy.v1.PodDisruptionBudgetList": {
    description:
      "PodDisruptionBudgetList is a collection of PodDisruptionBudgets.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is a list of PodDisruptionBudgets",
        items: {
          $ref: "#/definitions/io.k8s.api.policy.v1.PodDisruptionBudget",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "policy",
        kind: "PodDisruptionBudgetList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.policy.v1.PodDisruptionBudgetSpec": {
    description:
      "PodDisruptionBudgetSpec is a description of a PodDisruptionBudget.",
    properties: {
      maxUnavailable: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          'An eviction is allowed if at most "maxUnavailable" pods selected by "selector" are unavailable after the eviction, i.e. even in absence of the evicted pod. For example, one can prevent all voluntary evictions by specifying 0. This is a mutually exclusive setting with "minAvailable".',
      },
      minAvailable: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.util.intstr.IntOrString",
        description:
          'An eviction is allowed if at least "minAvailable" pods selected by "selector" will still be available after the eviction, i.e. even in the absence of the evicted pod.  So for example you can prevent all voluntary evictions by specifying "100%".',
      },
      selector: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "Label query over pods whose evictions are managed by the disruption budget. A null selector will match no pods, while an empty ({}) selector will select all pods within the namespace.",
        "x-kubernetes-patch-strategy": "replace",
      },
      unhealthyPodEvictionPolicy: {
        description:
          'UnhealthyPodEvictionPolicy defines the criteria for when unhealthy pods should be considered for eviction. Current implementation considers healthy pods, as pods that have status.conditions item with type="Ready",status="True".\n\nValid policies are IfHealthyBudget and AlwaysAllow. If no policy is specified, the default behavior will be used, which corresponds to the IfHealthyBudget policy.\n\nIfHealthyBudget policy means that running pods (status.phase="Running"), but not yet healthy can be evicted only if the guarded application is not disrupted (status.currentHealthy is at least equal to status.desiredHealthy). Healthy pods will be subject to the PDB for eviction.\n\nAlwaysAllow policy means that all running pods (status.phase="Running"), but not yet healthy are considered disrupted and can be evicted regardless of whether the criteria in a PDB is met. This means perspective running pods of a disrupted application might not get a chance to become healthy. Healthy pods will be subject to the PDB for eviction.\n\nAdditional policies may be added in the future. Clients making eviction decisions should disallow eviction of unhealthy pods if they encounter an unrecognized policy in this field.\n\nThis field is beta-level. The eviction API uses this field when the feature gate PDBUnhealthyPodEvictionPolicy is enabled (enabled by default).',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.policy.v1.PodDisruptionBudgetStatus": {
    description:
      "PodDisruptionBudgetStatus represents information about the status of a PodDisruptionBudget. Status may trail the actual state of a system.",
    properties: {
      conditions: {
        description:
          "Conditions contain conditions for PDB. The disruption controller sets the DisruptionAllowed condition. The following are known values for the reason field (additional reasons could be added in the future): - SyncFailed: The controller encountered an error and wasn't able to compute\n              the number of allowed disruptions. Therefore no disruptions are\n              allowed and the status of the condition will be False.\n- InsufficientPods: The number of pods are either at or below the number\n                    required by the PodDisruptionBudget. No disruptions are\n                    allowed and the status of the condition will be False.\n- SufficientPods: There are more pods than required by the PodDisruptionBudget.\n                  The condition will be True, and the number of allowed\n                  disruptions are provided by the disruptionsAllowed property.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Condition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
      currentHealthy: {
        description: "current number of healthy pods",
        format: "int32",
        type: "integer",
      },
      desiredHealthy: {
        description: "minimum desired number of healthy pods",
        format: "int32",
        type: "integer",
      },
      disruptedPods: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        },
        description:
          "DisruptedPods contains information about pods whose eviction was processed by the API server eviction subresource handler but has not yet been observed by the PodDisruptionBudget controller. A pod will be in this map from the time when the API server processed the eviction request to the time when the pod is seen by PDB controller as having been marked for deletion (or after a timeout). The key in the map is the name of the pod and the value is the time when the API server processed the eviction request. If the deletion didn't occur and a pod is still there it will be removed from the list automatically by PodDisruptionBudget controller after some time. If everything goes smooth this map should be empty for the most of the time. Large number of entries in the map may indicate problems with pod deletions.",
        type: "object",
      },
      disruptionsAllowed: {
        description: "Number of pod disruptions that are currently allowed.",
        format: "int32",
        type: "integer",
      },
      expectedPods: {
        description: "total number of pods counted by this disruption budget",
        format: "int32",
        type: "integer",
      },
      observedGeneration: {
        description:
          "Most recent generation observed when updating this PDB status. DisruptionsAllowed and other status information is valid only if observedGeneration equals to PDB's object generation.",
        format: "int64",
        type: "integer",
      },
    },
    required: [
      "disruptionsAllowed",
      "currentHealthy",
      "desiredHealthy",
      "expectedPods",
    ],
    type: "object",
  },
  "io.k8s.api.rbac.v1.AggregationRule": {
    description:
      "AggregationRule describes how to locate ClusterRoles to aggregate into the ClusterRole",
    properties: {
      clusterRoleSelectors: {
        description:
          "ClusterRoleSelectors holds a list of selectors which will be used to find ClusterRoles and create the rules. If any of the selectors match, then the ClusterRole's permissions will be added",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        },
        type: "array",
      },
    },
    type: "object",
  },
  "io.k8s.api.rbac.v1.ClusterRole": {
    description:
      "ClusterRole is a cluster level, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding or ClusterRoleBinding.",
    properties: {
      aggregationRule: {
        $ref: "#/definitions/io.k8s.api.rbac.v1.AggregationRule",
        description:
          "AggregationRule is an optional field that describes how to build the Rules for this ClusterRole. If AggregationRule is set, then the Rules are controller managed and direct changes to Rules will be stomped by the controller.",
      },
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object's metadata.",
      },
      rules: {
        description: "Rules holds all the PolicyRules for this ClusterRole",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.PolicyRule",
        },
        type: "array",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.ClusterRoleBinding": {
    description:
      "ClusterRoleBinding references a ClusterRole, but not contain it.  It can reference a ClusterRole in the global namespace, and adds who information via Subject.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object's metadata.",
      },
      roleRef: {
        $ref: "#/definitions/io.k8s.api.rbac.v1.RoleRef",
        description:
          "RoleRef can only reference a ClusterRole in the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error. This field is immutable.",
      },
      subjects: {
        description:
          "Subjects holds references to the objects the role applies to.",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.Subject",
        },
        type: "array",
      },
    },
    required: ["roleRef"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "ClusterRoleBinding",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.ClusterRoleBindingList": {
    description:
      "ClusterRoleBindingList is a collection of ClusterRoleBindings",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is a list of ClusterRoleBindings",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.ClusterRoleBinding",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard object's metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "ClusterRoleBindingList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.ClusterRoleList": {
    description: "ClusterRoleList is a collection of ClusterRoles",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is a list of ClusterRoles",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.ClusterRole",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard object's metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "ClusterRoleList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.PolicyRule": {
    description:
      "PolicyRule holds information that describes a policy rule, but does not contain information about who the rule applies to or which namespace the rule applies to.",
    properties: {
      apiGroups: {
        description:
          'APIGroups is the name of the APIGroup that contains the resources.  If multiple API groups are specified, any action requested against one of the enumerated resources in any API group will be allowed. "" represents the core API group and "*" represents all API groups.',
        items: {
          type: "string",
        },
        type: "array",
      },
      nonResourceURLs: {
        description:
          'NonResourceURLs is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path Since non-resource URLs are not namespaced, this field is only applicable for ClusterRoles referenced from a ClusterRoleBinding. Rules can either apply to API resources (such as "pods" or "secrets") or non-resource URL paths (such as "/api"),  but not both.',
        items: {
          type: "string",
        },
        type: "array",
      },
      resourceNames: {
        description:
          "ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.",
        items: {
          type: "string",
        },
        type: "array",
      },
      resources: {
        description:
          "Resources is a list of resources this rule applies to. '*' represents all resources.",
        items: {
          type: "string",
        },
        type: "array",
      },
      verbs: {
        description:
          "Verbs is a list of Verbs that apply to ALL the ResourceKinds contained in this rule. '*' represents all verbs.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["verbs"],
    type: "object",
  },
  "io.k8s.api.rbac.v1.Role": {
    description:
      "Role is a namespaced, logical grouping of PolicyRules that can be referenced as a unit by a RoleBinding.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object's metadata.",
      },
      rules: {
        description: "Rules holds all the PolicyRules for this Role",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.PolicyRule",
        },
        type: "array",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "Role",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.RoleBinding": {
    description:
      "RoleBinding references a role, but does not contain it.  It can reference a Role in the same namespace or a ClusterRole in the global namespace. It adds who information via Subjects and namespace information by which namespace it exists in.  RoleBindings in a given namespace only have effect in that namespace.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object's metadata.",
      },
      roleRef: {
        $ref: "#/definitions/io.k8s.api.rbac.v1.RoleRef",
        description:
          "RoleRef can reference a Role in the current namespace or a ClusterRole in the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error. This field is immutable.",
      },
      subjects: {
        description:
          "Subjects holds references to the objects the role applies to.",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.Subject",
        },
        type: "array",
      },
    },
    required: ["roleRef"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "RoleBinding",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.RoleBindingList": {
    description: "RoleBindingList is a collection of RoleBindings",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is a list of RoleBindings",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.RoleBinding",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard object's metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "RoleBindingList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.RoleList": {
    description: "RoleList is a collection of Roles",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is a list of Roles",
        items: {
          $ref: "#/definitions/io.k8s.api.rbac.v1.Role",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard object's metadata.",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "rbac.authorization.k8s.io",
        kind: "RoleList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.rbac.v1.RoleRef": {
    description:
      "RoleRef contains information that points to the role being used",
    properties: {
      apiGroup: {
        description: "APIGroup is the group for the resource being referenced",
        type: "string",
      },
      kind: {
        description: "Kind is the type of resource being referenced",
        type: "string",
      },
      name: {
        description: "Name is the name of resource being referenced",
        type: "string",
      },
    },
    required: ["apiGroup", "kind", "name"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.rbac.v1.Subject": {
    description:
      "Subject contains a reference to the object or user identities a role binding applies to.  This can either hold a direct API object reference, or a value for non-objects such as user and group names.",
    properties: {
      apiGroup: {
        description:
          'APIGroup holds the API group of the referenced subject. Defaults to "" for ServiceAccount subjects. Defaults to "rbac.authorization.k8s.io" for User and Group subjects.',
        type: "string",
      },
      kind: {
        description:
          'Kind of object being referenced. Values defined by this API group are "User", "Group", and "ServiceAccount". If the Authorizer does not recognized the kind value, the Authorizer should report an error.',
        type: "string",
      },
      name: {
        description: "Name of the object being referenced.",
        type: "string",
      },
      namespace: {
        description:
          'Namespace of the referenced object.  If the object kind is non-namespace, such as "User" or "Group", and this value is not empty the Authorizer should report an error.',
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.api.resource.v1alpha2.AllocationResult": {
    description:
      "AllocationResult contains attributes of an allocated resource.",
    properties: {
      availableOnNodes: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSelector",
        description:
          "This field will get set by the resource driver after it has allocated the resource to inform the scheduler where it can schedule Pods using the ResourceClaim.\n\nSetting this field is optional. If null, the resource is available everywhere.",
      },
      resourceHandles: {
        description:
          "ResourceHandles contain the state associated with an allocation that should be maintained throughout the lifetime of a claim. Each ResourceHandle contains data that should be passed to a specific kubelet plugin once it lands on a node. This data is returned by the driver after a successful allocation and is opaque to Kubernetes. Driver documentation may explain to users how to interpret this data if needed.\n\nSetting this field is optional. It has a maximum size of 32 entries. If null (or empty), it is assumed this allocation will be processed by a single kubelet plugin with no ResourceHandle data attached. The name of the kubelet plugin invoked will match the DriverName set in the ResourceClaimStatus this AllocationResult is embedded in.",
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceHandle",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      shareable: {
        description:
          "Shareable determines whether the resource supports more than one consumer at a time.",
        type: "boolean",
      },
    },
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.PodSchedulingContext": {
    description:
      'PodSchedulingContext objects hold information that is needed to schedule a Pod with ResourceClaims that use "WaitForFirstConsumer" allocation mode.\n\nThis is an alpha type and requires enabling the DynamicResourceAllocation feature gate.',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.PodSchedulingContextSpec",
        description: "Spec describes where resources for the Pod are needed.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.PodSchedulingContextStatus",
        description:
          "Status describes where resources for the Pod can be allocated.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "PodSchedulingContext",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.PodSchedulingContextList": {
    description:
      "PodSchedulingContextList is a collection of Pod scheduling objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of PodSchedulingContext objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.PodSchedulingContext",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "PodSchedulingContextList",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.PodSchedulingContextSpec": {
    description:
      "PodSchedulingContextSpec describes where resources for the Pod are needed.",
    properties: {
      potentialNodes: {
        description:
          "PotentialNodes lists nodes where the Pod might be able to run.\n\nThe size of this field is limited to 128. This is large enough for many clusters. Larger clusters may need more attempts to find a node that suits all pending resources. This may get increased in the future, but not reduced.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
      selectedNode: {
        description:
          'SelectedNode is the node for which allocation of ResourceClaims that are referenced by the Pod and that use "WaitForFirstConsumer" allocation is to be attempted.',
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.PodSchedulingContextStatus": {
    description:
      "PodSchedulingContextStatus describes where resources for the Pod can be allocated.",
    properties: {
      resourceClaims: {
        description:
          'ResourceClaims describes resource availability for each pod.spec.resourceClaim entry where the corresponding ResourceClaim uses "WaitForFirstConsumer" allocation mode.',
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimSchedulingStatus",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
      },
    },
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaim": {
    description:
      "ResourceClaim describes which resources are needed by a resource consumer. Its status tracks whether the resource has been allocated and what the resulting attributes are.\n\nThis is an alpha type and requires enabling the DynamicResourceAllocation feature gate.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimSpec",
        description:
          "Spec describes the desired attributes of a resource that then needs to be allocated. It can only be set once when creating the ResourceClaim.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimStatus",
        description:
          "Status describes whether the resource is available and with which attributes.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "ResourceClaim",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimConsumerReference": {
    description:
      "ResourceClaimConsumerReference contains enough information to let you locate the consumer of a ResourceClaim. The user must be a resource in the same namespace as the ResourceClaim.",
    properties: {
      apiGroup: {
        description:
          "APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.",
        type: "string",
      },
      name: {
        description: "Name is the name of resource being referenced.",
        type: "string",
      },
      resource: {
        description:
          'Resource is the type of resource being referenced, for example "pods".',
        type: "string",
      },
      uid: {
        description: "UID identifies exactly one incarnation of the resource.",
        type: "string",
      },
    },
    required: ["resource", "name", "uid"],
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimList": {
    description: "ResourceClaimList is a collection of claims.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of resource claims.",
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaim",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "ResourceClaimList",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimParametersReference": {
    description:
      "ResourceClaimParametersReference contains enough information to let you locate the parameters for a ResourceClaim. The object must be in the same namespace as the ResourceClaim.",
    properties: {
      apiGroup: {
        description:
          "APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.",
        type: "string",
      },
      kind: {
        description:
          'Kind is the type of resource being referenced. This is the same value as in the parameter object\'s metadata, for example "ConfigMap".',
        type: "string",
      },
      name: {
        description: "Name is the name of resource being referenced.",
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimSchedulingStatus": {
    description:
      'ResourceClaimSchedulingStatus contains information about one particular ResourceClaim with "WaitForFirstConsumer" allocation mode.',
    properties: {
      name: {
        description: "Name matches the pod.spec.resourceClaims[*].Name field.",
        type: "string",
      },
      unsuitableNodes: {
        description:
          "UnsuitableNodes lists nodes that the ResourceClaim cannot be allocated for.\n\nThe size of this field is limited to 128, the same as for PodSchedulingSpec.PotentialNodes. This may get increased in the future, but not reduced.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimSpec": {
    description: "ResourceClaimSpec defines how a resource is to be allocated.",
    properties: {
      allocationMode: {
        description:
          'Allocation can start immediately or when a Pod wants to use the resource. "WaitForFirstConsumer" is the default.',
        type: "string",
      },
      parametersRef: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimParametersReference",
        description:
          "ParametersRef references a separate object with arbitrary parameters that will be used by the driver when allocating a resource for the claim.\n\nThe object must be in the same namespace as the ResourceClaim.",
      },
      resourceClassName: {
        description:
          "ResourceClassName references the driver and additional parameters via the name of a ResourceClass that was created as part of the driver deployment.",
        type: "string",
      },
    },
    required: ["resourceClassName"],
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimStatus": {
    description:
      "ResourceClaimStatus tracks whether the resource has been allocated and what the resulting attributes are.",
    properties: {
      allocation: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.AllocationResult",
        description:
          "Allocation is set by the resource driver once a resource or set of resources has been allocated successfully. If this is not specified, the resources have not been allocated yet.",
      },
      deallocationRequested: {
        description:
          "DeallocationRequested indicates that a ResourceClaim is to be deallocated.\n\nThe driver then must deallocate this claim and reset the field together with clearing the Allocation field.\n\nWhile DeallocationRequested is set, no new consumers may be added to ReservedFor.",
        type: "boolean",
      },
      driverName: {
        description:
          "DriverName is a copy of the driver name from the ResourceClass at the time when allocation started.",
        type: "string",
      },
      reservedFor: {
        description:
          "ReservedFor indicates which entities are currently allowed to use the claim. A Pod which references a ResourceClaim which is not reserved for that Pod will not be started.\n\nThere can be at most 32 such reservations. This may get increased in the future, but not reduced.",
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimConsumerReference",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["uid"],
        "x-kubernetes-list-type": "map",
      },
    },
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimTemplate": {
    description:
      "ResourceClaimTemplate is used to produce ResourceClaim objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimTemplateSpec",
        description:
          "Describes the ResourceClaim that is to be generated.\n\nThis field is immutable. A ResourceClaim will get created by the control plane for a Pod when needed and then not get updated anymore.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "ResourceClaimTemplate",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimTemplateList": {
    description:
      "ResourceClaimTemplateList is a collection of claim templates.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of resource claim templates.",
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimTemplate",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "ResourceClaimTemplateList",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.ResourceClaimTemplateSpec": {
    description:
      "ResourceClaimTemplateSpec contains the metadata and fields for a ResourceClaim.",
    properties: {
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "ObjectMeta may contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClaimSpec",
        description:
          "Spec for the ResourceClaim. The entire content is copied unchanged into the ResourceClaim that gets created from this template. The same fields as in a ResourceClaim are also valid here.",
      },
    },
    required: ["spec"],
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceClass": {
    description:
      "ResourceClass is used by administrators to influence how resources are allocated.\n\nThis is an alpha type and requires enabling the DynamicResourceAllocation feature gate.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      driverName: {
        description:
          "DriverName defines the name of the dynamic resource driver that is used for allocation of a ResourceClaim that uses this class.\n\nResource drivers have a unique name in forward domain order (acme.example.com).",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description: "Standard object metadata",
      },
      parametersRef: {
        $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClassParametersReference",
        description:
          "ParametersRef references an arbitrary separate object that may hold parameters that will be used by the driver when allocating a resource that uses this class. A dynamic resource driver can distinguish between parameters stored here and and those stored in ResourceClaimSpec.",
      },
      suitableNodes: {
        $ref: "#/definitions/io.k8s.api.core.v1.NodeSelector",
        description:
          "Only nodes matching the selector will be considered by the scheduler when trying to find a Node that fits a Pod when that Pod uses a ResourceClaim that has not been allocated yet.\n\nSetting this field is optional. If null, all nodes are candidates.",
      },
    },
    required: ["driverName"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "ResourceClass",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.ResourceClassList": {
    description: "ResourceClassList is a collection of classes.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of resource classes.",
        items: {
          $ref: "#/definitions/io.k8s.api.resource.v1alpha2.ResourceClass",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description: "Standard list metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "resource.k8s.io",
        kind: "ResourceClassList",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.api.resource.v1alpha2.ResourceClassParametersReference": {
    description:
      "ResourceClassParametersReference contains enough information to let you locate the parameters for a ResourceClass.",
    properties: {
      apiGroup: {
        description:
          "APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.",
        type: "string",
      },
      kind: {
        description:
          "Kind is the type of resource being referenced. This is the same value as in the parameter object's metadata.",
        type: "string",
      },
      name: {
        description: "Name is the name of resource being referenced.",
        type: "string",
      },
      namespace: {
        description:
          "Namespace that contains the referenced resource. Must be empty for cluster-scoped resources and non-empty for namespaced resources.",
        type: "string",
      },
    },
    required: ["kind", "name"],
    type: "object",
  },
  "io.k8s.api.resource.v1alpha2.ResourceHandle": {
    description:
      "ResourceHandle holds opaque resource data for processing by a specific kubelet plugin.",
    properties: {
      data: {
        description:
          "Data contains the opaque data associated with this ResourceHandle. It is set by the controller component of the resource driver whose name matches the DriverName set in the ResourceClaimStatus this ResourceHandle is embedded in. It is set at allocation time and is intended for processing by the kubelet plugin whose name matches the DriverName set in this ResourceHandle.\n\nThe maximum size of this field is 16KiB. This may get increased in the future, but not reduced.",
        type: "string",
      },
      driverName: {
        description:
          "DriverName specifies the name of the resource driver whose kubelet plugin should be invoked to process this ResourceHandle's data once it lands on a node. This may differ from the DriverName set in ResourceClaimStatus this ResourceHandle is embedded in.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.scheduling.v1.PriorityClass": {
    description:
      "PriorityClass defines mapping from a priority class name to the priority integer value. The value can be any valid integer.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      description: {
        description:
          "description is an arbitrary string that usually provides guidelines on when this priority class should be used.",
        type: "string",
      },
      globalDefault: {
        description:
          "globalDefault specifies whether this PriorityClass should be considered as the default priority for pods that do not have any priority class. Only one PriorityClass can be marked as `globalDefault`. However, if more than one PriorityClasses exists with their `globalDefault` field set to true, the smallest value of such global default PriorityClasses will be used as the default priority.",
        type: "boolean",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      preemptionPolicy: {
        description:
          "preemptionPolicy is the Policy for preempting pods with lower priority. One of Never, PreemptLowerPriority. Defaults to PreemptLowerPriority if unset.",
        type: "string",
      },
      value: {
        description:
          "value represents the integer value of this priority class. This is the actual priority that pods receive when they have the name of this class in their pod spec.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["value"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "scheduling.k8s.io",
        kind: "PriorityClass",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.scheduling.v1.PriorityClassList": {
    description: "PriorityClassList is a collection of priority classes.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of PriorityClasses",
        items: {
          $ref: "#/definitions/io.k8s.api.scheduling.v1.PriorityClass",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "scheduling.k8s.io",
        kind: "PriorityClassList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.CSIDriver": {
    description:
      "CSIDriver captures information about a Container Storage Interface (CSI) volume driver deployed on the cluster. Kubernetes attach detach controller uses this object to determine whether attach is required. Kubelet uses this object to determine whether pod information needs to be passed on mount. CSIDriver objects are non-namespaced.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata. metadata.Name indicates the name of the CSI driver that this object refers to; it MUST be the same name returned by the CSI GetPluginName() call for that driver. The driver name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), dots (.), and alphanumerics between. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.storage.v1.CSIDriverSpec",
        description: "spec represents the specification of the CSI Driver.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "CSIDriver",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.CSIDriverList": {
    description: "CSIDriverList is a collection of CSIDriver objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of CSIDriver",
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.CSIDriver",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "CSIDriverList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.CSIDriverSpec": {
    description: "CSIDriverSpec is the specification of a CSIDriver.",
    properties: {
      attachRequired: {
        description:
          "attachRequired indicates this CSI volume driver requires an attach operation (because it implements the CSI ControllerPublishVolume() method), and that the Kubernetes attach detach controller should call the attach volume interface which checks the volumeattachment status and waits until the volume is attached before proceeding to mounting. The CSI external-attacher coordinates with CSI volume driver and updates the volumeattachment status when the attach operation is complete. If the CSIDriverRegistry feature gate is enabled and the value is specified to false, the attach operation will be skipped. Otherwise the attach operation will be called.\n\nThis field is immutable.",
        type: "boolean",
      },
      fsGroupPolicy: {
        description:
          "fsGroupPolicy defines if the underlying volume supports changing ownership and permission of the volume before being mounted. Refer to the specific FSGroupPolicy values for additional details.\n\nThis field is immutable.\n\nDefaults to ReadWriteOnceWithFSType, which will examine each volume to determine if Kubernetes should modify ownership and permissions of the volume. With the default policy the defined fsGroup will only be applied if a fstype is defined and the volume's access mode contains ReadWriteOnce.",
        type: "string",
      },
      podInfoOnMount: {
        description:
          'podInfoOnMount indicates this CSI volume driver requires additional pod information (like podName, podUID, etc.) during mount operations, if set to true. If set to false, pod information will not be passed on mount. Default is false.\n\nThe CSI driver specifies podInfoOnMount as part of driver deployment. If true, Kubelet will pass pod information as VolumeContext in the CSI NodePublishVolume() calls. The CSI driver is responsible for parsing and validating the information passed in as VolumeContext.\n\nThe following VolumeConext will be passed if podInfoOnMount is set to true. This list might grow, but the prefix will be used. "csi.storage.k8s.io/pod.name": pod.Name "csi.storage.k8s.io/pod.namespace": pod.Namespace "csi.storage.k8s.io/pod.uid": string(pod.UID) "csi.storage.k8s.io/ephemeral": "true" if the volume is an ephemeral inline volume\n                                defined by a CSIVolumeSource, otherwise "false"\n\n"csi.storage.k8s.io/ephemeral" is a new feature in Kubernetes 1.16. It is only required for drivers which support both the "Persistent" and "Ephemeral" VolumeLifecycleMode. Other drivers can leave pod info disabled and/or ignore this field. As Kubernetes 1.15 doesn\'t support this field, drivers can only support one mode when deployed on such a cluster and the deployment determines which mode that is, for example via a command line parameter of the driver.\n\nThis field is immutable.',
        type: "boolean",
      },
      requiresRepublish: {
        description:
          "requiresRepublish indicates the CSI driver wants `NodePublishVolume` being periodically called to reflect any possible change in the mounted volume. This field defaults to false.\n\nNote: After a successful initial NodePublishVolume call, subsequent calls to NodePublishVolume should only update the contents of the volume. New mount points will not be seen by a running container.",
        type: "boolean",
      },
      seLinuxMount: {
        description:
          'seLinuxMount specifies if the CSI driver supports "-o context" mount option.\n\nWhen "true", the CSI driver must ensure that all volumes provided by this CSI driver can be mounted separately with different `-o context` options. This is typical for storage backends that provide volumes as filesystems on block devices or as independent shared volumes. Kubernetes will call NodeStage / NodePublish with "-o context=xyz" mount option when mounting a ReadWriteOncePod volume used in Pod that has explicitly set SELinux context. In the future, it may be expanded to other volume AccessModes. In any case, Kubernetes will ensure that the volume is mounted only with a single SELinux context.\n\nWhen "false", Kubernetes won\'t pass any special SELinux mount options to the driver. This is typical for volumes that represent subdirectories of a bigger shared filesystem.\n\nDefault is "false".',
        type: "boolean",
      },
      storageCapacity: {
        description:
          "storageCapacity indicates that the CSI volume driver wants pod scheduling to consider the storage capacity that the driver deployment will report by creating CSIStorageCapacity objects with capacity information, if set to true.\n\nThe check can be enabled immediately when deploying a driver. In that case, provisioning new volumes with late binding will pause until the driver deployment has published some suitable CSIStorageCapacity object.\n\nAlternatively, the driver can be deployed with the field unset or false and it can be flipped later when storage capacity information has been published.\n\nThis field was immutable in Kubernetes <= 1.22 and now is mutable.",
        type: "boolean",
      },
      tokenRequests: {
        description:
          'tokenRequests indicates the CSI driver needs pods\' service account tokens it is mounting volume for to do necessary authentication. Kubelet will pass the tokens in VolumeContext in the CSI NodePublishVolume calls. The CSI driver should parse and validate the following VolumeContext: "csi.storage.k8s.io/serviceAccount.tokens": {\n  "<audience>": {\n    "token": <token>,\n    "expirationTimestamp": <expiration timestamp in RFC3339>,\n  },\n  ...\n}\n\nNote: Audience in each TokenRequest should be different and at most one token is empty string. To receive a new token after expiry, RequiresRepublish can be used to trigger NodePublishVolume periodically.',
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.TokenRequest",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      volumeLifecycleModes: {
        description:
          'volumeLifecycleModes defines what kind of volumes this CSI volume driver supports. The default if the list is empty is "Persistent", which is the usage defined by the CSI specification and implemented in Kubernetes via the usual PV/PVC mechanism.\n\nThe other mode is "Ephemeral". In this mode, volumes are defined inline inside the pod spec with CSIVolumeSource and their lifecycle is tied to the lifecycle of that pod. A driver has to be aware of this because it is only going to get a NodePublishVolume call for such a volume.\n\nFor more information about implementing this mode, see https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html A driver can support one or more of these modes and more modes may be added in the future.\n\nThis field is beta. This field is immutable.',
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-list-type": "set",
      },
    },
    type: "object",
  },
  "io.k8s.api.storage.v1.CSINode": {
    description:
      "CSINode holds information about all CSI drivers installed on a node. CSI drivers do not need to create the CSINode object directly. As long as they use the node-driver-registrar sidecar container, the kubelet will automatically populate the CSINode object for the CSI driver as part of kubelet plugin registration. CSINode has the same name as a node. If the object is missing, it means either there are no CSI Drivers available on the node, or the Kubelet version is low enough that it doesn't create this object. CSINode has an OwnerReference that points to the corresponding node object.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. metadata.name must be the Kubernetes node name.",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.storage.v1.CSINodeSpec",
        description: "spec is the specification of CSINode",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "CSINode",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.CSINodeDriver": {
    description:
      "CSINodeDriver holds information about the specification of one CSI driver installed on a node",
    properties: {
      allocatable: {
        $ref: "#/definitions/io.k8s.api.storage.v1.VolumeNodeResources",
        description:
          "allocatable represents the volume resources of a node that are available for scheduling. This field is beta.",
      },
      name: {
        description:
          "name represents the name of the CSI driver that this object refers to. This MUST be the same name returned by the CSI GetPluginName() call for that driver.",
        type: "string",
      },
      nodeID: {
        description:
          'nodeID of the node from the driver point of view. This field enables Kubernetes to communicate with storage systems that do not share the same nomenclature for nodes. For example, Kubernetes may refer to a given node as "node1", but the storage system may refer to the same node as "nodeA". When Kubernetes issues a command to the storage system to attach a volume to a specific node, it can use this field to refer to the node name using the ID that the storage system will understand, e.g. "nodeA" instead of "node1". This field is required.',
        type: "string",
      },
      topologyKeys: {
        description:
          'topologyKeys is the list of keys supported by the driver. When a driver is initialized on a cluster, it provides a set of topology keys that it understands (e.g. "company.com/zone", "company.com/region"). When a driver is initialized on a node, it provides the same topology keys along with values. Kubelet will expose these topology keys as labels on its own node object. When Kubernetes does topology aware provisioning, it can use this list to determine which labels it should retrieve from the node object and pass back to the driver. It is possible for different nodes to use different topology keys. This can be empty if driver does not support topology.',
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["name", "nodeID"],
    type: "object",
  },
  "io.k8s.api.storage.v1.CSINodeList": {
    description: "CSINodeList is a collection of CSINode objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of CSINode",
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.CSINode",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "CSINodeList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.CSINodeSpec": {
    description:
      "CSINodeSpec holds information about the specification of all CSI drivers installed on a node",
    properties: {
      drivers: {
        description:
          "drivers is a list of information of all CSI Drivers existing on a node. If all drivers in the list are uninstalled, this can become empty.",
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.CSINodeDriver",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "name",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    required: ["drivers"],
    type: "object",
  },
  "io.k8s.api.storage.v1.CSIStorageCapacity": {
    description:
      'CSIStorageCapacity stores the result of one CSI GetCapacity call. For a given StorageClass, this describes the available capacity in a particular topology segment.  This can be used when considering where to instantiate new PersistentVolumes.\n\nFor example this can express things like: - StorageClass "standard" has "1234 GiB" available in "topology.kubernetes.io/zone=us-east1" - StorageClass "localssd" has "10 GiB" available in "kubernetes.io/hostname=knode-abc123"\n\nThe following three cases all imply that no capacity is available for a certain combination: - no object exists with suitable topology and storage class name - such an object exists, but the capacity is unset - such an object exists, but the capacity is zero\n\nThe producer of these objects can decide which approach is more suitable.\n\nThey are consumed by the kube-scheduler when a CSI driver opts into capacity-aware scheduling with CSIDriverSpec.StorageCapacity. The scheduler compares the MaximumVolumeSize against the requested size of pending volumes to filter out unsuitable nodes. If MaximumVolumeSize is unset, it falls back to a comparison against the less precise Capacity. If that is also unset, the scheduler assumes that capacity is insufficient and tries some other node.',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      capacity: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          "capacity is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.\n\nThe semantic is currently (CSI spec 1.2) defined as: The available capacity, in bytes, of the storage that can be used to provision volumes. If not set, that information is currently unavailable.",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      maximumVolumeSize: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.api.resource.Quantity",
        description:
          "maximumVolumeSize is the value reported by the CSI driver in its GetCapacityResponse for a GetCapacityRequest with topology and parameters that match the previous fields.\n\nThis is defined since CSI spec 1.4.0 as the largest size that may be used in a CreateVolumeRequest.capacity_range.required_bytes field to create a volume with the same parameters as those in GetCapacityRequest. The corresponding value in the Kubernetes API is ResourceRequirements.Requests in a volume claim.",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. The name has no particular meaning. It must be a DNS subdomain (dots allowed, 253 characters). To ensure that there are no conflicts with other CSI drivers on the cluster, the recommendation is to use csisc-<uuid>, a generated name, or a reverse-domain name which ends with the unique CSI driver name.\n\nObjects are namespaced.\n\nMore info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      nodeTopology: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector",
        description:
          "nodeTopology defines which nodes have access to the storage for which capacity was reported. If not set, the storage is not accessible from any node in the cluster. If empty, the storage is accessible from all nodes. This field is immutable.",
      },
      storageClassName: {
        description:
          "storageClassName represents the name of the StorageClass that the reported capacity applies to. It must meet the same requirements as the name of a StorageClass object (non-empty, DNS subdomain). If that object no longer exists, the CSIStorageCapacity object is obsolete and should be removed by its creator. This field is immutable.",
        type: "string",
      },
    },
    required: ["storageClassName"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "CSIStorageCapacity",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.CSIStorageCapacityList": {
    description:
      "CSIStorageCapacityList is a collection of CSIStorageCapacity objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of CSIStorageCapacity objects.",
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.CSIStorageCapacity",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["name"],
        "x-kubernetes-list-type": "map",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "CSIStorageCapacityList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.StorageClass": {
    description:
      "StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.\n\nStorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name.",
    properties: {
      allowVolumeExpansion: {
        description:
          "allowVolumeExpansion shows whether the storage class allow volume expand.",
        type: "boolean",
      },
      allowedTopologies: {
        description:
          "allowedTopologies restrict the node topologies where volumes can be dynamically provisioned. Each volume plugin defines its own supported topology specifications. An empty TopologySelectorTerm list means there is no topology restriction. This field is only honored by servers that enable the VolumeScheduling feature.",
        items: {
          $ref: "#/definitions/io.k8s.api.core.v1.TopologySelectorTerm",
        },
        type: "array",
        "x-kubernetes-list-type": "atomic",
      },
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      mountOptions: {
        description:
          'mountOptions controls the mountOptions for dynamically provisioned PersistentVolumes of this storage class. e.g. ["ro", "soft"]. Not validated - mount of the PVs will simply fail if one is invalid.',
        items: {
          type: "string",
        },
        type: "array",
      },
      parameters: {
        additionalProperties: {
          type: "string",
        },
        description:
          "parameters holds the parameters for the provisioner that should create volumes of this storage class.",
        type: "object",
      },
      provisioner: {
        description: "provisioner indicates the type of the provisioner.",
        type: "string",
      },
      reclaimPolicy: {
        description:
          "reclaimPolicy controls the reclaimPolicy for dynamically provisioned PersistentVolumes of this storage class. Defaults to Delete.",
        type: "string",
      },
      volumeBindingMode: {
        description:
          "volumeBindingMode indicates how PersistentVolumeClaims should be provisioned and bound.  When unset, VolumeBindingImmediate is used. This field is only honored by servers that enable the VolumeScheduling feature.",
        type: "string",
      },
    },
    required: ["provisioner"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "StorageClass",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.StorageClassList": {
    description: "StorageClassList is a collection of storage classes.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of StorageClasses",
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.StorageClass",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "StorageClassList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.TokenRequest": {
    description: "TokenRequest contains parameters of a service account token.",
    properties: {
      audience: {
        description:
          'audience is the intended audience of the token in "TokenRequestSpec". It will default to the audiences of kube apiserver.',
        type: "string",
      },
      expirationSeconds: {
        description:
          'expirationSeconds is the duration of validity of the token in "TokenRequestSpec". It has the same default value of "ExpirationSeconds" in "TokenRequestSpec".',
        format: "int64",
        type: "integer",
      },
    },
    required: ["audience"],
    type: "object",
  },
  "io.k8s.api.storage.v1.VolumeAttachment": {
    description:
      "VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node.\n\nVolumeAttachment objects are non-namespaced.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.api.storage.v1.VolumeAttachmentSpec",
        description:
          "spec represents specification of the desired attach/detach volume behavior. Populated by the Kubernetes system.",
      },
      status: {
        $ref: "#/definitions/io.k8s.api.storage.v1.VolumeAttachmentStatus",
        description:
          "status represents status of the VolumeAttachment request. Populated by the entity completing the attach or detach operation, i.e. the external-attacher.",
      },
    },
    required: ["spec"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "VolumeAttachment",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.VolumeAttachmentList": {
    description:
      "VolumeAttachmentList is a collection of VolumeAttachment objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "items is the list of VolumeAttachments",
        items: {
          $ref: "#/definitions/io.k8s.api.storage.v1.VolumeAttachment",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "storage.k8s.io",
        kind: "VolumeAttachmentList",
        version: "v1",
      },
    ],
  },
  "io.k8s.api.storage.v1.VolumeAttachmentSource": {
    description:
      "VolumeAttachmentSource represents a volume that should be attached. Right now only PersistenVolumes can be attached via external attacher, in future we may allow also inline volumes in pods. Exactly one member can be set.",
    properties: {
      inlineVolumeSpec: {
        $ref: "#/definitions/io.k8s.api.core.v1.PersistentVolumeSpec",
        description:
          "inlineVolumeSpec contains all the information necessary to attach a persistent volume defined by a pod's inline VolumeSource. This field is populated only for the CSIMigration feature. It contains translated fields from a pod's inline VolumeSource to a PersistentVolumeSpec. This field is beta-level and is only honored by servers that enabled the CSIMigration feature.",
      },
      persistentVolumeName: {
        description:
          "persistentVolumeName represents the name of the persistent volume to attach.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.api.storage.v1.VolumeAttachmentSpec": {
    description:
      "VolumeAttachmentSpec is the specification of a VolumeAttachment request.",
    properties: {
      attacher: {
        description:
          "attacher indicates the name of the volume driver that MUST handle this request. This is the name returned by GetPluginName().",
        type: "string",
      },
      nodeName: {
        description:
          "nodeName represents the node that the volume should be attached to.",
        type: "string",
      },
      source: {
        $ref: "#/definitions/io.k8s.api.storage.v1.VolumeAttachmentSource",
        description: "source represents the volume that should be attached.",
      },
    },
    required: ["attacher", "source", "nodeName"],
    type: "object",
  },
  "io.k8s.api.storage.v1.VolumeAttachmentStatus": {
    description:
      "VolumeAttachmentStatus is the status of a VolumeAttachment request.",
    properties: {
      attachError: {
        $ref: "#/definitions/io.k8s.api.storage.v1.VolumeError",
        description:
          "attachError represents the last error encountered during attach operation, if any. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.",
      },
      attached: {
        description:
          "attached indicates the volume is successfully attached. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.",
        type: "boolean",
      },
      attachmentMetadata: {
        additionalProperties: {
          type: "string",
        },
        description:
          "attachmentMetadata is populated with any information returned by the attach operation, upon successful attach, that must be passed into subsequent WaitForAttach or Mount calls. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.",
        type: "object",
      },
      detachError: {
        $ref: "#/definitions/io.k8s.api.storage.v1.VolumeError",
        description:
          "detachError represents the last error encountered during detach operation, if any. This field must only be set by the entity completing the detach operation, i.e. the external-attacher.",
      },
    },
    required: ["attached"],
    type: "object",
  },
  "io.k8s.api.storage.v1.VolumeError": {
    description:
      "VolumeError captures an error encountered during a volume operation.",
    properties: {
      message: {
        description:
          "message represents the error encountered during Attach or Detach operation. This string may be logged, so it should not contain sensitive information.",
        type: "string",
      },
      time: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description: "time represents the time the error was encountered.",
      },
    },
    type: "object",
  },
  "io.k8s.api.storage.v1.VolumeNodeResources": {
    description:
      "VolumeNodeResources is a set of resource limits for scheduling of volumes.",
    properties: {
      count: {
        description:
          "count indicates the maximum number of unique volumes managed by the CSI driver that can be used on a node. A volume that is both attached and mounted on a node is considered to be used once, not twice. The same rule applies for a unique volume that is shared among multiple pods on the same node. If this field is not specified, then the supported number of volumes on this node is unbounded.",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceColumnDefinition":
    {
      description:
        "CustomResourceColumnDefinition specifies a column for server side printing.",
      properties: {
        description: {
          description:
            "description is a human readable description of this column.",
          type: "string",
        },
        format: {
          description:
            "format is an optional OpenAPI type definition for this column. The 'name' format is applied to the primary identifier column to assist in clients identifying column is the resource name. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.",
          type: "string",
        },
        jsonPath: {
          description:
            "jsonPath is a simple JSON path (i.e. with array notation) which is evaluated against each custom resource to produce the value for this column.",
          type: "string",
        },
        name: {
          description: "name is a human readable name for the column.",
          type: "string",
        },
        priority: {
          description:
            "priority is an integer defining the relative importance of this column compared to others. Lower numbers are considered higher priority. Columns that may be omitted in limited space scenarios should be given a priority greater than 0.",
          format: "int32",
          type: "integer",
        },
        type: {
          description:
            "type is an OpenAPI type definition for this column. See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types for details.",
          type: "string",
        },
      },
      required: ["name", "type", "jsonPath"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceConversion":
    {
      description:
        "CustomResourceConversion describes how to convert different versions of a CR.",
      properties: {
        strategy: {
          description:
            'strategy specifies how custom resources are converted between versions. Allowed values are: - `"None"`: The converter only change the apiVersion and would not touch any other field in the custom resource. - `"Webhook"`: API Server will call to an external webhook to do the conversion. Additional information\n  is needed for this option. This requires spec.preserveUnknownFields to be false, and spec.conversion.webhook to be set.',
          type: "string",
        },
        webhook: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookConversion",
          description:
            'webhook describes how to call the conversion webhook. Required when `strategy` is set to `"Webhook"`.',
        },
      },
      required: ["strategy"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinition":
    {
      description:
        "CustomResourceDefinition represents a resource that should be exposed on the API server.  Its name MUST be in the format <.spec.name>.<.spec.group>.",
      properties: {
        apiVersion: {
          description:
            "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
          type: "string",
        },
        kind: {
          description:
            "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
          type: "string",
        },
        metadata: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
          description:
            "Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
        },
        spec: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec",
          description:
            "spec describes how the user wants the resources to appear",
        },
        status: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionStatus",
          description:
            "status indicates the actual state of the CustomResourceDefinition",
        },
      },
      required: ["spec"],
      type: "object",
      "x-kubernetes-group-version-kind": [
        {
          group: "apiextensions.k8s.io",
          kind: "CustomResourceDefinition",
          version: "v1",
        },
      ],
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionCondition":
    {
      description:
        "CustomResourceDefinitionCondition contains details for the current condition of this pod.",
      properties: {
        lastTransitionTime: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
          description:
            "lastTransitionTime last time the condition transitioned from one status to another.",
        },
        message: {
          description:
            "message is a human-readable message indicating details about last transition.",
          type: "string",
        },
        reason: {
          description:
            "reason is a unique, one-word, CamelCase reason for the condition's last transition.",
          type: "string",
        },
        status: {
          description:
            "status is the status of the condition. Can be True, False, Unknown.",
          type: "string",
        },
        type: {
          description:
            "type is the type of the condition. Types include Established, NamesAccepted and Terminating.",
          type: "string",
        },
      },
      required: ["type", "status"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionList":
    {
      description:
        "CustomResourceDefinitionList is a list of CustomResourceDefinition objects.",
      properties: {
        apiVersion: {
          description:
            "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
          type: "string",
        },
        items: {
          description: "items list individual CustomResourceDefinition objects",
          items: {
            $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinition",
          },
          type: "array",
        },
        kind: {
          description:
            "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
          type: "string",
        },
        metadata: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
          description:
            "Standard object's metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
        },
      },
      required: ["items"],
      type: "object",
      "x-kubernetes-group-version-kind": [
        {
          group: "apiextensions.k8s.io",
          kind: "CustomResourceDefinitionList",
          version: "v1",
        },
      ],
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionNames":
    {
      description:
        "CustomResourceDefinitionNames indicates the names to serve this CustomResourceDefinition",
      properties: {
        categories: {
          description:
            "categories is a list of grouped resources this custom resource belongs to (e.g. 'all'). This is published in API discovery documents, and used by clients to support invocations like `kubectl get all`.",
          items: {
            type: "string",
          },
          type: "array",
        },
        kind: {
          description:
            "kind is the serialized kind of the resource. It is normally CamelCase and singular. Custom resource instances will use this value as the `kind` attribute in API calls.",
          type: "string",
        },
        listKind: {
          description:
            'listKind is the serialized kind of the list for this resource. Defaults to "`kind`List".',
          type: "string",
        },
        plural: {
          description:
            "plural is the plural name of the resource to serve. The custom resources are served under `/apis/<group>/<version>/.../<plural>`. Must match the name of the CustomResourceDefinition (in the form `<names.plural>.<group>`). Must be all lowercase.",
          type: "string",
        },
        shortNames: {
          description:
            "shortNames are short names for the resource, exposed in API discovery documents, and used by clients to support invocations like `kubectl get <shortname>`. It must be all lowercase.",
          items: {
            type: "string",
          },
          type: "array",
        },
        singular: {
          description:
            "singular is the singular name of the resource. It must be all lowercase. Defaults to lowercased `kind`.",
          type: "string",
        },
      },
      required: ["plural", "kind"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec":
    {
      description:
        "CustomResourceDefinitionSpec describes how a user wants their resource to appear",
      properties: {
        conversion: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceConversion",
          description: "conversion defines conversion settings for the CRD.",
        },
        group: {
          description:
            "group is the API group of the defined custom resource. The custom resources are served under `/apis/<group>/...`. Must match the name of the CustomResourceDefinition (in the form `<names.plural>.<group>`).",
          type: "string",
        },
        names: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionNames",
          description:
            "names specify the resource and kind names for the custom resource.",
        },
        preserveUnknownFields: {
          description:
            "preserveUnknownFields indicates that object fields which are not specified in the OpenAPI schema should be preserved when persisting to storage. apiVersion, kind, metadata and known fields inside metadata are always preserved. This field is deprecated in favor of setting `x-preserve-unknown-fields` to true in `spec.versions[*].schema.openAPIV3Schema`. See https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning for details.",
          type: "boolean",
        },
        scope: {
          description:
            "scope indicates whether the defined custom resource is cluster- or namespace-scoped. Allowed values are `Cluster` and `Namespaced`.",
          type: "string",
        },
        versions: {
          description:
            'versions is the list of all API versions of the defined custom resource. Version names are used to compute the order in which served versions are listed in API discovery. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.',
          items: {
            $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionVersion",
          },
          type: "array",
        },
      },
      required: ["group", "names", "scope", "versions"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionStatus":
    {
      description:
        "CustomResourceDefinitionStatus indicates the state of the CustomResourceDefinition",
      properties: {
        acceptedNames: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionNames",
          description:
            "acceptedNames are the names that are actually being used to serve discovery. They may be different than the names in spec.",
        },
        conditions: {
          description:
            "conditions indicate state for particular aspects of a CustomResourceDefinition",
          items: {
            $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionCondition",
          },
          type: "array",
          "x-kubernetes-list-map-keys": ["type"],
          "x-kubernetes-list-type": "map",
        },
        storedVersions: {
          description:
            "storedVersions lists all versions of CustomResources that were ever persisted. Tracking these versions allows a migration path for stored versions in etcd. The field is mutable so a migration controller can finish a migration to another version (ensuring no old objects are left in storage), and then remove the rest of the versions from this list. Versions may not be removed from `spec.versions` while they exist in this list.",
          items: {
            type: "string",
          },
          type: "array",
        },
      },
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionVersion":
    {
      description:
        "CustomResourceDefinitionVersion describes a version for CRD.",
      properties: {
        additionalPrinterColumns: {
          description:
            "additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If no columns are specified, a single column displaying the age of the custom resource is used.",
          items: {
            $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceColumnDefinition",
          },
          type: "array",
        },
        deprecated: {
          description:
            "deprecated indicates this version of the custom resource API is deprecated. When set to true, API requests to this version receive a warning header in the server response. Defaults to false.",
          type: "boolean",
        },
        deprecationWarning: {
          description:
            "deprecationWarning overrides the default warning returned to API clients. May only be set when `deprecated` is true. The default warning indicates this version is deprecated and recommends use of the newest served version of equal or greater stability, if one exists.",
          type: "string",
        },
        name: {
          description:
            "name is the version name, e.g. “v1”, “v2beta1”, etc. The custom resources are served under this version at `/apis/<group>/<version>/...` if `served` is true.",
          type: "string",
        },
        schema: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceValidation",
          description:
            "schema describes the schema used for validation, pruning, and defaulting of this version of the custom resource.",
        },
        served: {
          description:
            "served is a flag enabling/disabling this version from being served via REST APIs",
          type: "boolean",
        },
        storage: {
          description:
            "storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true.",
          type: "boolean",
        },
        subresources: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresources",
          description:
            "subresources specify what subresources this version of the defined custom resource have.",
        },
      },
      required: ["name", "served", "storage"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceScale":
    {
      description:
        "CustomResourceSubresourceScale defines how to serve the scale subresource for CustomResources.",
      properties: {
        labelSelectorPath: {
          description:
            "labelSelectorPath defines the JSON path inside of a custom resource that corresponds to Scale `status.selector`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status` or `.spec`. Must be set to work with HorizontalPodAutoscaler. The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form. More info: https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource If there is no value under the given path in the custom resource, the `status.selector` value in the `/scale` subresource will default to the empty string.",
          type: "string",
        },
        specReplicasPath: {
          description:
            "specReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `spec.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.spec`. If there is no value under the given path in the custom resource, the `/scale` subresource will return an error on GET.",
          type: "string",
        },
        statusReplicasPath: {
          description:
            "statusReplicasPath defines the JSON path inside of a custom resource that corresponds to Scale `status.replicas`. Only JSON paths without the array notation are allowed. Must be a JSON Path under `.status`. If there is no value under the given path in the custom resource, the `status.replicas` value in the `/scale` subresource will default to 0.",
          type: "string",
        },
      },
      required: ["specReplicasPath", "statusReplicasPath"],
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceStatus":
    {
      description:
        "CustomResourceSubresourceStatus defines how to serve the status subresource for CustomResources. Status is represented by the `.status` JSON path inside of a CustomResource. When set, * exposes a /status subresource for the custom resource * PUT requests to the /status subresource take a custom resource object, and ignore changes to anything except the status stanza * PUT/POST/PATCH requests to the custom resource ignore changes to the status stanza",
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresources":
    {
      description:
        "CustomResourceSubresources defines the status and scale subresources for CustomResources.",
      properties: {
        scale: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceScale",
          description:
            "scale indicates the custom resource should serve a `/scale` subresource that returns an `autoscaling/v1` Scale object.",
        },
        status: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceStatus",
          description:
            "status indicates the custom resource should serve a `/status` subresource. When enabled: 1. requests to the custom resource primary endpoint ignore changes to the `status` stanza of the object. 2. requests to the custom resource `/status` subresource ignore changes to anything other than the `status` stanza of the object.",
        },
      },
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceValidation":
    {
      description:
        "CustomResourceValidation is a list of validation methods for CustomResources.",
      properties: {
        openAPIV3Schema: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
          description:
            "openAPIV3Schema is the OpenAPI v3 schema to use for validation and pruning.",
        },
      },
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ExternalDocumentation":
    {
      description:
        "ExternalDocumentation allows referencing an external resource for extended documentation.",
      properties: {
        description: {
          type: "string",
        },
        url: {
          type: "string",
        },
      },
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON": {
    description:
      "JSON represents any valid JSON value. These types are supported: bool, int64, float64, string, []interface{}, map[string]interface{} and nil.",
  },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps": {
    description:
      "JSONSchemaProps is a JSON-Schema following Specification Draft 4 (http://json-schema.org/).",
    properties: {
      $ref: {
        type: "string",
      },
      $schema: {
        type: "string",
      },
      additionalItems: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrBool",
      },
      additionalProperties: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrBool",
      },
      allOf: {
        items: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
        },
        type: "array",
      },
      anyOf: {
        items: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
        },
        type: "array",
      },
      default: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON",
        description:
          "default is a default value for undefined object fields. Defaulting is a beta feature under the CustomResourceDefaulting feature gate. Defaulting requires spec.preserveUnknownFields to be false.",
      },
      definitions: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
        },
        type: "object",
      },
      dependencies: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrStringArray",
        },
        type: "object",
      },
      description: {
        type: "string",
      },
      enum: {
        items: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON",
        },
        type: "array",
      },
      example: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSON",
      },
      exclusiveMaximum: {
        type: "boolean",
      },
      exclusiveMinimum: {
        type: "boolean",
      },
      externalDocs: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ExternalDocumentation",
      },
      format: {
        description:
          'format is an OpenAPI v3 format string. Unknown formats are ignored. The following formats are validated:\n\n- bsonobjectid: a bson object ID, i.e. a 24 characters hex string - uri: an URI as parsed by Golang net/url.ParseRequestURI - email: an email address as parsed by Golang net/mail.ParseAddress - hostname: a valid representation for an Internet host name, as defined by RFC 1034, section 3.1 [RFC1034]. - ipv4: an IPv4 IP as parsed by Golang net.ParseIP - ipv6: an IPv6 IP as parsed by Golang net.ParseIP - cidr: a CIDR as parsed by Golang net.ParseCIDR - mac: a MAC address as parsed by Golang net.ParseMAC - uuid: an UUID that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid3: an UUID3 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$ - uuid4: an UUID4 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - uuid5: an UUID5 that allows uppercase defined by the regex (?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$ - isbn: an ISBN10 or ISBN13 number string like "0321751043" or "978-0321751041" - isbn10: an ISBN10 number string like "0321751043" - isbn13: an ISBN13 number string like "978-0321751041" - creditcard: a credit card number defined by the regex ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$ with any non digit characters mixed in - ssn: a U.S. social security number following the regex ^\\d{3}[- ]?\\d{2}[- ]?\\d{4}$ - hexcolor: an hexadecimal color code like "#FFFFFF: following the regex ^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$ - rgbcolor: an RGB color code like rgb like "rgb(255,255,2559" - byte: base64 encoded binary data - password: any kind of string - date: a date string like "2006-01-02" as defined by full-date in RFC3339 - duration: a duration string like "22 ns" as parsed by Golang time.ParseDuration or compatible with Scala duration format - datetime: a date time string like "2014-12-15T19:30:20.000Z" as defined by date-time in RFC3339.',
        type: "string",
      },
      id: {
        type: "string",
      },
      items: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrArray",
      },
      maxItems: {
        format: "int64",
        type: "integer",
      },
      maxLength: {
        format: "int64",
        type: "integer",
      },
      maxProperties: {
        format: "int64",
        type: "integer",
      },
      maximum: {
        format: "double",
        type: "number",
      },
      minItems: {
        format: "int64",
        type: "integer",
      },
      minLength: {
        format: "int64",
        type: "integer",
      },
      minProperties: {
        format: "int64",
        type: "integer",
      },
      minimum: {
        format: "double",
        type: "number",
      },
      multipleOf: {
        format: "double",
        type: "number",
      },
      not: {
        $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
      },
      nullable: {
        type: "boolean",
      },
      oneOf: {
        items: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
        },
        type: "array",
      },
      pattern: {
        type: "string",
      },
      patternProperties: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
        },
        type: "object",
      },
      properties: {
        additionalProperties: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaProps",
        },
        type: "object",
      },
      required: {
        items: {
          type: "string",
        },
        type: "array",
      },
      title: {
        type: "string",
      },
      type: {
        type: "string",
      },
      uniqueItems: {
        type: "boolean",
      },
      "x-kubernetes-embedded-resource": {
        description:
          "x-kubernetes-embedded-resource defines that the value is an embedded Kubernetes runtime.Object, with TypeMeta and ObjectMeta. The type must be object. It is allowed to further restrict the embedded object. kind, apiVersion and metadata are validated automatically. x-kubernetes-preserve-unknown-fields is allowed to be true, but does not have to be if the object is fully specified (up to kind, apiVersion, metadata).",
        type: "boolean",
      },
      "x-kubernetes-int-or-string": {
        description:
          "x-kubernetes-int-or-string specifies that this value is either an integer or a string. If this is true, an empty type is allowed and type as child of anyOf is permitted if following one of the following patterns:\n\n1) anyOf:\n   - type: integer\n   - type: string\n2) allOf:\n   - anyOf:\n     - type: integer\n     - type: string\n   - ... zero or more",
        type: "boolean",
      },
      "x-kubernetes-list-map-keys": {
        description:
          'x-kubernetes-list-map-keys annotates an array with the x-kubernetes-list-type `map` by specifying the keys used as the index of the map.\n\nThis tag MUST only be used on lists that have the "x-kubernetes-list-type" extension set to "map". Also, the values specified for this attribute must be a scalar typed field of the child structure (no nesting is supported).\n\nThe properties specified must either be required or have a default value, to ensure those properties are present for all list items.',
        items: {
          type: "string",
        },
        type: "array",
      },
      "x-kubernetes-list-type": {
        description:
          "x-kubernetes-list-type annotates an array to further describe its topology. This extension must only be used on lists and may have 3 possible values:\n\n1) `atomic`: the list is treated as a single entity, like a scalar.\n     Atomic lists will be entirely replaced when updated. This extension\n     may be used on any type of list (struct, scalar, ...).\n2) `set`:\n     Sets are lists that must not have multiple items with the same value. Each\n     value must be a scalar, an object with x-kubernetes-map-type `atomic` or an\n     array with x-kubernetes-list-type `atomic`.\n3) `map`:\n     These lists are like maps in that their elements have a non-index key\n     used to identify them. Order is preserved upon merge. The map tag\n     must only be used on a list with elements of type object.\nDefaults to atomic for arrays.",
        type: "string",
      },
      "x-kubernetes-map-type": {
        description:
          "x-kubernetes-map-type annotates an object to further describe its topology. This extension must only be used when type is object and may have 2 possible values:\n\n1) `granular`:\n     These maps are actual maps (key-value pairs) and each fields are independent\n     from each other (they can each be manipulated by separate actors). This is\n     the default behaviour for all maps.\n2) `atomic`: the list is treated as a single entity, like a scalar.\n     Atomic maps will be entirely replaced when updated.",
        type: "string",
      },
      "x-kubernetes-preserve-unknown-fields": {
        description:
          "x-kubernetes-preserve-unknown-fields stops the API server decoding step from pruning fields which are not specified in the validation schema. This affects fields recursively, but switches back to normal pruning behaviour if nested properties or additionalProperties are specified in the schema. This can either be true or undefined. False is forbidden.",
        type: "boolean",
      },
      "x-kubernetes-validations": {
        description:
          "x-kubernetes-validations describes a list of validation rules written in the CEL expression language. This field is an alpha-level. Using this field requires the feature gate `CustomResourceValidationExpressions` to be enabled.",
        items: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ValidationRule",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["rule"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "rule",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
  },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrArray":
    {
      description:
        "JSONSchemaPropsOrArray represents a value that can either be a JSONSchemaProps or an array of JSONSchemaProps. Mainly here for serialization purposes.",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrBool":
    {
      description:
        "JSONSchemaPropsOrBool represents JSONSchemaProps or a boolean value. Defaults to true for the boolean property.",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.JSONSchemaPropsOrStringArray":
    {
      description:
        "JSONSchemaPropsOrStringArray represents a JSONSchemaProps or a string array.",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ServiceReference": {
    description: "ServiceReference holds a reference to Service.legacy.k8s.io",
    properties: {
      name: {
        description: "name is the name of the service. Required",
        type: "string",
      },
      namespace: {
        description: "namespace is the namespace of the service. Required",
        type: "string",
      },
      path: {
        description:
          "path is an optional URL path at which the webhook will be contacted.",
        type: "string",
      },
      port: {
        description:
          "port is an optional service port at which the webhook will be contacted. `port` should be a valid port number (1-65535, inclusive). Defaults to 443 for backward compatibility.",
        format: "int32",
        type: "integer",
      },
    },
    required: ["namespace", "name"],
    type: "object",
  },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ValidationRule": {
    description:
      "ValidationRule describes a validation rule written in the CEL expression language.",
    properties: {
      fieldPath: {
        description:
          "fieldPath represents the field path returned when the validation fails. It must be a relative JSON path (i.e. with array notation) scoped to the location of this x-kubernetes-validations extension in the schema and refer to an existing field. e.g. when validation checks if a specific attribute `foo` under a map `testMap`, the fieldPath could be set to `.testMap.foo` If the validation checks two lists must have unique attributes, the fieldPath could be set to either of the list: e.g. `.testList` It does not support list numeric index. It supports child operation to refer to an existing field currently. Refer to [JSONPath support in Kubernetes](https://kubernetes.io/docs/reference/kubectl/jsonpath/) for more info. Numeric index of array is not supported. For field name which contains special characters, use `['specialName']` to refer the field name. e.g. for attribute `foo.34$` appears in a list `testList`, the fieldPath could be set to `.testList['foo.34$']`",
        type: "string",
      },
      message: {
        description:
          'Message represents the message displayed when validation fails. The message is required if the Rule contains line breaks. The message must not contain line breaks. If unset, the message is "failed rule: {Rule}". e.g. "must be a URL with the host matching spec.host"',
        type: "string",
      },
      messageExpression: {
        description:
          'MessageExpression declares a CEL expression that evaluates to the validation failure message that is returned when this rule fails. Since messageExpression is used as a failure message, it must evaluate to a string. If both message and messageExpression are present on a rule, then messageExpression will be used if validation fails. If messageExpression results in a runtime error, the runtime error is logged, and the validation failure message is produced as if the messageExpression field were unset. If messageExpression evaluates to an empty string, a string with only spaces, or a string that contains line breaks, then the validation failure message will also be produced as if the messageExpression field were unset, and the fact that messageExpression produced an empty string/string with only spaces/string with line breaks will be logged. messageExpression has access to all the same variables as the rule; the only difference is the return type. Example: "x must be less than max ("+string(self.max)+")"',
        type: "string",
      },
      reason: {
        description:
          'reason provides a machine-readable validation failure reason that is returned to the caller when a request fails this validation rule. The HTTP status code returned to the caller will match the reason of the reason of the first failed validation rule. The currently supported reasons are: "FieldValueInvalid", "FieldValueForbidden", "FieldValueRequired", "FieldValueDuplicate". If not set, default to use "FieldValueInvalid". All future added reasons must be accepted by clients when reading this value and unknown reasons should be treated as FieldValueInvalid.',
        type: "string",
      },
      rule: {
        description:
          'Rule represents the expression which will be evaluated by CEL. ref: https://github.com/google/cel-spec The Rule is scoped to the location of the x-kubernetes-validations extension in the schema. The `self` variable in the CEL expression is bound to the scoped value. Example: - Rule scoped to the root of a resource with a status subresource: {"rule": "self.status.actual <= self.spec.maxDesired"}\n\nIf the Rule is scoped to an object with properties, the accessible properties of the object are field selectable via `self.field` and field presence can be checked via `has(self.field)`. Null valued fields are treated as absent fields in CEL expressions. If the Rule is scoped to an object with additionalProperties (i.e. a map) the value of the map are accessible via `self[mapKey]`, map containment can be checked via `mapKey in self` and all entries of the map are accessible via CEL macros and functions such as `self.all(...)`. If the Rule is scoped to an array, the elements of the array are accessible via `self[i]` and also by macros and functions. If the Rule is scoped to a scalar, `self` is bound to the scalar value. Examples: - Rule scoped to a map of objects: {"rule": "self.components[\'Widget\'].priority < 10"} - Rule scoped to a list of integers: {"rule": "self.values.all(value, value >= 0 && value < 100)"} - Rule scoped to a string value: {"rule": "self.startsWith(\'kube\')"}\n\nThe `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from the root of the object and from any x-kubernetes-embedded-resource annotated objects. No other metadata properties are accessible.\n\nUnknown data preserved in custom resources via x-kubernetes-preserve-unknown-fields is not accessible in CEL expressions. This includes: - Unknown field values that are preserved by object schemas with x-kubernetes-preserve-unknown-fields. - Object properties where the property schema is of an "unknown type". An "unknown type" is recursively defined as:\n  - A schema with no type and x-kubernetes-preserve-unknown-fields set to true\n  - An array where the items schema is of an "unknown type"\n  - An object where the additionalProperties schema is of an "unknown type"\n\nOnly property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible. Accessible property names are escaped according to the following rules when accessed in the expression: - \'__\' escapes to \'__underscores__\' - \'.\' escapes to \'__dot__\' - \'-\' escapes to \'__dash__\' - \'/\' escapes to \'__slash__\' - Property names that exactly match a CEL RESERVED keyword escape to \'__{keyword}__\'. The keywords are:\n\t  "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if",\n\t  "import", "let", "loop", "package", "namespace", "return".\nExamples:\n  - Rule accessing a property named "namespace": {"rule": "self.__namespace__ > 0"}\n  - Rule accessing a property named "x-prop": {"rule": "self.x__dash__prop > 0"}\n  - Rule accessing a property named "redact__d": {"rule": "self.redact__underscores__d > 0"}\n\nEquality on arrays with x-kubernetes-list-type of \'set\' or \'map\' ignores element order, i.e. [1, 2] == [2, 1]. Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:\n  - \'set\': `X + Y` performs a union where the array positions of all elements in `X` are preserved and\n    non-intersecting elements in `Y` are appended, retaining their partial order.\n  - \'map\': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values\n    are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with\n    non-intersecting keys are appended, retaining their partial order.',
        type: "string",
      },
    },
    required: ["rule"],
    type: "object",
  },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookClientConfig":
    {
      description:
        "WebhookClientConfig contains the information to make a TLS connection with the webhook.",
      properties: {
        caBundle: {
          description:
            "caBundle is a PEM encoded CA bundle which will be used to validate the webhook's server certificate. If unspecified, system trust roots on the apiserver are used.",
          format: "byte",
          type: "string",
        },
        service: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ServiceReference",
          description:
            "service is a reference to the service for this webhook. Either service or url must be specified.\n\nIf the webhook is running within the cluster, then you should use `service`.",
        },
        url: {
          description:
            'url gives the location of the webhook, in standard URL form (`scheme://host:port/path`). Exactly one of `url` or `service` must be specified.\n\nThe `host` should not refer to a service running in the cluster; use the `service` field instead. The host might be resolved via external DNS in some apiservers (e.g., `kube-apiserver` cannot resolve in-cluster DNS as that would be a layering violation). `host` may also be an IP address.\n\nPlease note that using `localhost` or `127.0.0.1` as a `host` is risky unless you take great care to run this webhook on all hosts which run an apiserver which might need to make calls to this webhook. Such installs are likely to be non-portable, i.e., not easy to turn up in a new cluster.\n\nThe scheme must be "https"; the URL must begin with "https://".\n\nA path is optional, and if present may be any string permissible in a URL. You may use the path to pass an arbitrary string to the webhook, for example, a cluster identifier.\n\nAttempting to use a user or basic auth e.g. "user:password@" is not allowed. Fragments ("#...") and query parameters ("?...") are not allowed, either.',
          type: "string",
        },
      },
      type: "object",
    },
  "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookConversion":
    {
      description:
        "WebhookConversion describes how to call a conversion webhook",
      properties: {
        clientConfig: {
          $ref: "#/definitions/io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookClientConfig",
          description:
            "clientConfig is the instructions for how to call the webhook if strategy is `Webhook`.",
        },
        conversionReviewVersions: {
          description:
            "conversionReviewVersions is an ordered list of preferred `ConversionReview` versions the Webhook expects. The API server will use the first version in the list which it supports. If none of the versions specified in this list are supported by API server, conversion will fail for the custom resource. If a persisted Webhook configuration specifies allowed versions and does not include any versions known to the API Server, calls to the webhook will fail.",
          items: {
            type: "string",
          },
          type: "array",
        },
      },
      required: ["conversionReviewVersions"],
      type: "object",
    },
  "io.k8s.apimachinery.pkg.api.resource.Quantity": {
    description:
      'Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.\n\nThe serialization format is:\n\n``` <quantity>        ::= <signedNumber><suffix>\n\n\t(Note that <suffix> may be empty, from the "" case in <decimalSI>.)\n\n<digit>           ::= 0 | 1 | ... | 9 <digits>          ::= <digit> | <digit><digits> <number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> <sign>            ::= "+" | "-" <signedNumber>    ::= <number> | <sign><number> <suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> <binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei\n\n\t(International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)\n\n<decimalSI>       ::= m | "" | k | M | G | T | P | E\n\n\t(Note that 1024 = 1Ki but 1000 = 1k; I didn\'t choose the capitalization.)\n\n<decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber> ```\n\nNo matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.\n\nWhen a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.\n\nBefore serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:\n\n- No precision is lost - No fractional digits will be emitted - The exponent (or suffix) is as large as possible.\n\nThe sign will be omitted unless the number is negative.\n\nExamples:\n\n- 1.5 will be serialized as "1500m" - 1.5Gi will be serialized as "1536Mi"\n\nNote that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.\n\nNon-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don\'t diff.)\n\nThis format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.',
    type: "string",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.APIGroup": {
    description:
      "APIGroup contains the name, the supported versions, and the preferred version of a group.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      name: {
        description: "name is the name of the group.",
        type: "string",
      },
      preferredVersion: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery",
        description:
          "preferredVersion is the version preferred by the API server, which probably is the storage version.",
      },
      serverAddressByClientCIDRs: {
        description:
          "a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR",
        },
        type: "array",
      },
      versions: {
        description: "versions are the versions supported in this group.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery",
        },
        type: "array",
      },
    },
    required: ["name", "versions"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "APIGroup",
        version: "v1",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.APIGroupList": {
    description:
      "APIGroupList is a list of APIGroup, to allow clients to discover the API at /apis.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      groups: {
        description: "groups is a list of APIGroup.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.APIGroup",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
    },
    required: ["groups"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "APIGroupList",
        version: "v1",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.APIResource": {
    description:
      "APIResource specifies the name of a resource and whether it is namespaced.",
    properties: {
      categories: {
        description:
          "categories is a list of the grouped resources this resource belongs to (e.g. 'all')",
        items: {
          type: "string",
        },
        type: "array",
      },
      group: {
        description:
          'group is the preferred group of the resource.  Empty implies the group of the containing resource list. For subresources, this may have a different value, for example: Scale".',
        type: "string",
      },
      kind: {
        description:
          "kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo')",
        type: "string",
      },
      name: {
        description: "name is the plural name of the resource.",
        type: "string",
      },
      namespaced: {
        description: "namespaced indicates if a resource is namespaced or not.",
        type: "boolean",
      },
      shortNames: {
        description:
          "shortNames is a list of suggested short names of the resource.",
        items: {
          type: "string",
        },
        type: "array",
      },
      singularName: {
        description:
          "singularName is the singular name of the resource.  This allows clients to handle plural and singular opaquely. The singularName is more correct for reporting status on a single item and both singular and plural are allowed from the kubectl CLI interface.",
        type: "string",
      },
      storageVersionHash: {
        description:
          "The hash value of the storage version, the version this resource is converted to when written to the data store. Value must be treated as opaque by clients. Only equality comparison on the value is valid. This is an alpha feature and may change or be removed in the future. The field is populated by the apiserver only if the StorageVersionHash feature gate is enabled. This field will remain optional even if it graduates.",
        type: "string",
      },
      verbs: {
        description:
          "verbs is a list of supported kube verbs (this includes get, list, watch, create, update, patch, delete, deletecollection, and proxy)",
        items: {
          type: "string",
        },
        type: "array",
      },
      version: {
        description:
          "version is the preferred version of the resource.  Empty implies the version of the containing resource list For subresources, this may have a different value, for example: v1 (while inside a v1beta1 version of the core resource's group)\".",
        type: "string",
      },
    },
    required: ["name", "singularName", "namespaced", "kind", "verbs"],
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.APIResourceList": {
    description:
      "APIResourceList is a list of APIResource, it is used to expose the name of the resources supported in a specific group and version, and if the resource is namespaced.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      groupVersion: {
        description:
          "groupVersion is the group and version this APIResourceList is for.",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      resources: {
        description:
          "resources contains the name of the resources and if they are namespaced.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.APIResource",
        },
        type: "array",
      },
    },
    required: ["groupVersion", "resources"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "APIResourceList",
        version: "v1",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.APIVersions": {
    description:
      "APIVersions lists the versions that are available, to allow clients to discover the API at /api, which is the root path of the legacy v1 API.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      serverAddressByClientCIDRs: {
        description:
          "a map of client CIDR to server address that is serving this group. This is to help clients reach servers in the most network-efficient way possible. Clients can use the appropriate server address as per the CIDR that they match. In case of multiple matches, clients should use the longest matching CIDR. The server returns only those CIDRs that it thinks that the client can match. For example: the master will return an internal IP CIDR only, if the client reaches the server using an internal IP. Server looks at X-Forwarded-For header or X-Real-Ip header or request.RemoteAddr (in that order) to get the client IP.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR",
        },
        type: "array",
      },
      versions: {
        description: "versions are the api versions that are available.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["versions", "serverAddressByClientCIDRs"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "APIVersions",
        version: "v1",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.Condition": {
    description:
      "Condition contains details for one aspect of the current state of this API Resource.",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.",
      },
      message: {
        description:
          "message is a human readable message indicating details about the transition. This may be an empty string.",
        type: "string",
      },
      observedGeneration: {
        description:
          "observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance.",
        format: "int64",
        type: "integer",
      },
      reason: {
        description:
          "reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty.",
        type: "string",
      },
      status: {
        description: "status of the condition, one of True, False, Unknown.",
        type: "string",
      },
      type: {
        description:
          "type of condition in CamelCase or in foo.example.com/CamelCase.",
        type: "string",
      },
    },
    required: ["type", "status", "lastTransitionTime", "reason", "message"],
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.DeleteOptions": {
    description: "DeleteOptions may be provided when deleting an API object.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      dryRun: {
        description:
          "When present, indicates that modifications should not be persisted. An invalid or unrecognized dryRun directive will result in an error response and no further processing of the request. Valid values are: - All: all dry run stages will be processed",
        items: {
          type: "string",
        },
        type: "array",
      },
      gracePeriodSeconds: {
        description:
          "The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.",
        format: "int64",
        type: "integer",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      orphanDependents: {
        description:
          'Deprecated: please use the PropagationPolicy, this field will be deprecated in 1.7. Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object\'s finalizers list. Either this field or PropagationPolicy may be set, but not both.',
        type: "boolean",
      },
      preconditions: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Preconditions",
        description:
          "Must be fulfilled before a deletion is carried out. If not possible, a 409 Conflict status will be returned.",
      },
      propagationPolicy: {
        description:
          "Whether and how garbage collection will be performed. Either this field or OrphanDependents may be set, but not both. The default policy is decided by the existing finalizer set in the metadata.finalizers and the resource-specific default policy. Acceptable values are: 'Orphan' - orphan the dependents; 'Background' - allow the garbage collector to delete the dependents in the background; 'Foreground' - a cascading policy that deletes all dependents in the foreground.",
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "admission.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "admission.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "admissionregistration.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "admissionregistration.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "admissionregistration.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "apiextensions.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "apiextensions.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "apiregistration.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "apiregistration.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "apps",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "apps",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "apps",
        kind: "DeleteOptions",
        version: "v1beta2",
      },
      {
        group: "authentication.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "authentication.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "authentication.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "authorization.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "authorization.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "autoscaling",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "autoscaling",
        kind: "DeleteOptions",
        version: "v2",
      },
      {
        group: "autoscaling",
        kind: "DeleteOptions",
        version: "v2beta1",
      },
      {
        group: "autoscaling",
        kind: "DeleteOptions",
        version: "v2beta2",
      },
      {
        group: "batch",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "batch",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "certificates.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "certificates.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "certificates.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "coordination.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "coordination.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "discovery.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "discovery.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "events.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "events.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "extensions",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta2",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta3",
      },
      {
        group: "imagepolicy.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "internal.apiserver.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "networking.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "networking.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "networking.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "node.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "node.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "node.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "policy",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "policy",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "rbac.authorization.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "rbac.authorization.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "rbac.authorization.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "resource.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha2",
      },
      {
        group: "scheduling.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "scheduling.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "scheduling.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
      {
        group: "storage.k8s.io",
        kind: "DeleteOptions",
        version: "v1",
      },
      {
        group: "storage.k8s.io",
        kind: "DeleteOptions",
        version: "v1alpha1",
      },
      {
        group: "storage.k8s.io",
        kind: "DeleteOptions",
        version: "v1beta1",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.FieldsV1": {
    description:
      "FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.\n\nEach key is either a '.' representing the field itself, and will always map to an empty set, or a string representing a sub-field or item. The string will follow one of these four formats: 'f:<name>', where <name> is the name of a field in a struct, or key in a map 'v:<value>', where <value> is the exact json formatted value of a list item 'i:<index>', where <index> is position of a item in a list 'k:<keys>', where <keys> is a map of  a list item's key fields to their unique values If a key maps to an empty Fields value, the field that key represents is part of the set.\n\nThe exact format is defined in sigs.k8s.io/structured-merge-diff",
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery": {
    description:
      'GroupVersion contains the "group/version" and "version" string of a version. It is made a struct to keep extensibility.',
    properties: {
      groupVersion: {
        description:
          'groupVersion specifies the API group and version in the form "group/version"',
        type: "string",
      },
      version: {
        description:
          'version specifies the version in the form of "version". This is to save the clients the trouble of splitting the GroupVersion.',
        type: "string",
      },
    },
    required: ["groupVersion", "version"],
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelector": {
    description:
      "A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.",
    properties: {
      matchExpressions: {
        description:
          "matchExpressions is a list of label selector requirements. The requirements are ANDed.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement",
        },
        type: "array",
      },
      matchLabels: {
        additionalProperties: {
          type: "string",
        },
        description:
          'matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.',
        type: "object",
      },
    },
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement": {
    description:
      "A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.",
    properties: {
      key: {
        description: "key is the label key that the selector applies to.",
        type: "string",
      },
      operator: {
        description:
          "operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.",
        type: "string",
      },
      values: {
        description:
          "values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.",
        items: {
          type: "string",
        },
        type: "array",
      },
    },
    required: ["key", "operator"],
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta": {
    description:
      "ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.",
    properties: {
      continue: {
        description:
          "continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a consistent list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response, unless you have received this token from an error message.",
        type: "string",
      },
      remainingItemCount: {
        description:
          "remainingItemCount is the number of subsequent items in the list which are not included in this list response. If the list request contained label or field selectors, then the number of remaining items is unknown and the field will be left unset and omitted during serialization. If the list is complete (either because it is not chunking or because this is the last chunk), then there are no more remaining items and this field will be left unset and omitted during serialization. Servers older than v1.15 do not set this field. The intended use of the remainingItemCount is *estimating* the size of a collection. Clients should not rely on the remainingItemCount to be set or to be exact.",
        format: "int64",
        type: "integer",
      },
      resourceVersion: {
        description:
          "String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency",
        type: "string",
      },
      selfLink: {
        description:
          "Deprecated: selfLink is a legacy read-only field that is no longer populated by the system.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.ManagedFieldsEntry": {
    description:
      "ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the resource that the fieldset applies to.",
    properties: {
      apiVersion: {
        description:
          'APIVersion defines the version of this resource that this field set applies to. The format is "group/version" just like the top-level APIVersion field. It is necessary to track the version of a field set because it cannot be automatically converted.',
        type: "string",
      },
      fieldsType: {
        description:
          'FieldsType is the discriminator for the different fields format and version. There is currently only one possible value: "FieldsV1"',
        type: "string",
      },
      fieldsV1: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.FieldsV1",
        description:
          'FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.',
      },
      manager: {
        description:
          "Manager is an identifier of the workflow managing these fields.",
        type: "string",
      },
      operation: {
        description:
          "Operation is the type of operation which lead to this ManagedFieldsEntry being created. The only valid values for this field are 'Apply' and 'Update'.",
        type: "string",
      },
      subresource: {
        description:
          "Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource. The value of this field is used to distinguish between managers, even if they share the same name. For example, a status update will be distinct from a regular update using the same manager name. Note that the APIVersion field is not related to the Subresource field and it always corresponds to the version of the main resource.",
        type: "string",
      },
      time: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Time is the timestamp of when the ManagedFields entry was added. The timestamp will also be updated if a field is added, the manager changes any of the owned fields value or removes a field. The timestamp does not update when a field is removed from the entry because another manager took it over.",
      },
    },
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.MicroTime": {
    description:
      "MicroTime is version of Time with microsecond level precision.",
    format: "date-time",
    type: "string",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta": {
    description:
      "ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.",
    properties: {
      annotations: {
        additionalProperties: {
          type: "string",
        },
        description:
          "Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations",
        type: "object",
      },
      creationTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.\n\nPopulated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      deletionGracePeriodSeconds: {
        description:
          "Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.",
        format: "int64",
        type: "integer",
      },
      deletionTimestamp: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested.\n\nPopulated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      finalizers: {
        description:
          "Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. Finalizers may be processed and removed in any order.  Order is NOT enforced because it introduces significant risk of stuck finalizers. finalizers is a shared field, any actor with permission can reorder it. If the finalizer list is processed in order, then this can lead to a situation in which the component responsible for the first finalizer in the list is waiting for a signal (field value, external system, or other) produced by a component responsible for a finalizer later in the list, resulting in a deadlock. Without enforced ordering finalizers are free to order amongst themselves and are not vulnerable to ordering changes in the list.",
        items: {
          type: "string",
        },
        type: "array",
        "x-kubernetes-patch-strategy": "merge",
      },
      generateName: {
        description:
          "GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server.\n\nIf this field is specified and the generated name exists, the server will return a 409.\n\nApplied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency",
        type: "string",
      },
      generation: {
        description:
          "A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.",
        format: "int64",
        type: "integer",
      },
      labels: {
        additionalProperties: {
          type: "string",
        },
        description:
          "Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels",
        type: "object",
      },
      managedFields: {
        description:
          "ManagedFields maps workflow-id and version to the set of fields that are managed by that workflow. This is mostly for internal housekeeping, and users typically shouldn't need to set or understand this field. A workflow can be the user's name, a controller's name, or the name of a specific apply path like \"ci-cd\". The set of fields is always in the version that the workflow used when modifying the object.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ManagedFieldsEntry",
        },
        type: "array",
      },
      name: {
        description:
          "Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names",
        type: "string",
      },
      namespace: {
        description:
          'Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.\n\nMust be a DNS_LABEL. Cannot be updated. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces',
        type: "string",
      },
      ownerReferences: {
        description:
          "List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference",
        },
        type: "array",
        "x-kubernetes-patch-merge-key": "uid",
        "x-kubernetes-patch-strategy": "merge",
      },
      resourceVersion: {
        description:
          "An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server. They may only be valid for a particular resource or set of resources.\n\nPopulated by the system. Read-only. Value must be treated as opaque by clients and . More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency",
        type: "string",
      },
      selfLink: {
        description:
          "Deprecated: selfLink is a legacy read-only field that is no longer populated by the system.",
        type: "string",
      },
      uid: {
        description:
          "UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations.\n\nPopulated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference": {
    description:
      "OwnerReference contains enough information to let you identify an owning object. An owning object must be in the same namespace as the dependent, or be cluster-scoped, so there is no namespace field.",
    properties: {
      apiVersion: {
        description: "API version of the referent.",
        type: "string",
      },
      blockOwnerDeletion: {
        description:
          'If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. See https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion for how the garbage collector interacts with this field and enforces the foreground deletion. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned.',
        type: "boolean",
      },
      controller: {
        description:
          "If true, this reference points to the managing controller.",
        type: "boolean",
      },
      kind: {
        description:
          "Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      name: {
        description:
          "Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names",
        type: "string",
      },
      uid: {
        description:
          "UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids",
        type: "string",
      },
    },
    required: ["apiVersion", "kind", "name", "uid"],
    type: "object",
    "x-kubernetes-map-type": "atomic",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.Patch": {
    description:
      "Patch is provided to give a concrete name and type to the Kubernetes PATCH request body.",
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.Preconditions": {
    description:
      "Preconditions must be fulfilled before an operation (update, delete, etc.) is carried out.",
    properties: {
      resourceVersion: {
        description: "Specifies the target ResourceVersion",
        type: "string",
      },
      uid: {
        description: "Specifies the target UID.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR": {
    description:
      "ServerAddressByClientCIDR helps the client to determine the server address that they should use, depending on the clientCIDR that they match.",
    properties: {
      clientCIDR: {
        description:
          "The CIDR with which clients can match their IP to figure out the server address that they should use.",
        type: "string",
      },
      serverAddress: {
        description:
          "Address of this server, suitable for a client that matches the above CIDR. This can be a hostname, hostname:port, IP or IP:port.",
        type: "string",
      },
    },
    required: ["clientCIDR", "serverAddress"],
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.Status": {
    description:
      "Status is a return value for calls that don't return other objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      code: {
        description:
          "Suggested HTTP return code for this status, 0 if not set.",
        format: "int32",
        type: "integer",
      },
      details: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.StatusDetails",
        description:
          "Extended data associated with the reason.  Each reason may define its own extended details. This field is optional and the data returned is not guaranteed to conform to any schema except that defined by the reason type.",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      message: {
        description:
          "A human-readable description of the status of this operation.",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
      },
      reason: {
        description:
          'A machine-readable description of why this operation is in the "Failure" status. If this value is empty there is no information available. A Reason clarifies an HTTP status code but does not override it.',
        type: "string",
      },
      status: {
        description:
          'Status of the operation. One of: "Success" or "Failure". More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status',
        type: "string",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "Status",
        version: "v1",
      },
      {
        group: "resource.k8s.io",
        kind: "Status",
        version: "v1alpha2",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.StatusCause": {
    description:
      "StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered.",
    properties: {
      field: {
        description:
          'The field of the resource that has caused this error, as named by its JSON serialization. May include dot and postfix notation for nested attributes. Arrays are zero-indexed.  Fields may appear more than once in an array of causes due to fields having multiple errors. Optional.\n\nExamples:\n  "name" - the field "name" on the current resource\n  "items[0].name" - the field "name" on the first array entry in "items"',
        type: "string",
      },
      message: {
        description:
          "A human-readable description of the cause of the error.  This field may be presented as-is to a reader.",
        type: "string",
      },
      reason: {
        description:
          "A machine-readable description of the cause of the error. If this value is empty there is no information available.",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.StatusDetails": {
    description:
      "StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined.",
    properties: {
      causes: {
        description:
          "The Causes array includes more details associated with the StatusReason failure. Not all StatusReasons may provide detailed causes.",
        items: {
          $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.StatusCause",
        },
        type: "array",
      },
      group: {
        description:
          "The group attribute of the resource associated with the status StatusReason.",
        type: "string",
      },
      kind: {
        description:
          "The kind attribute of the resource associated with the status StatusReason. On some operations may differ from the requested resource Kind. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      name: {
        description:
          "The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described).",
        type: "string",
      },
      retryAfterSeconds: {
        description:
          "If specified, the time in seconds before the operation should be retried. Some errors may indicate the client must take an alternate action - for those errors this field may indicate how long to wait before taking the alternate action.",
        format: "int32",
        type: "integer",
      },
      uid: {
        description:
          "UID of the resource. (when there is a single resource which can be described). More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids",
        type: "string",
      },
    },
    type: "object",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.Time": {
    description:
      "Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.",
    format: "date-time",
    type: "string",
  },
  "io.k8s.apimachinery.pkg.apis.meta.v1.WatchEvent": {
    description: "Event represents a single event to a watched resource.",
    properties: {
      object: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.runtime.RawExtension",
        description:
          "Object is:\n * If Type is Added or Modified: the new state of the object.\n * If Type is Deleted: the state of the object immediately before deletion.\n * If Type is Error: *Status is recommended; other types may make sense\n   depending on context.",
      },
      type: {
        type: "string",
      },
    },
    required: ["type", "object"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "admission.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "admission.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "admissionregistration.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "admissionregistration.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "admissionregistration.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "apiextensions.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "apiextensions.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "apiregistration.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "apiregistration.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "apps",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "apps",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "apps",
        kind: "WatchEvent",
        version: "v1beta2",
      },
      {
        group: "authentication.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "authentication.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "authentication.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "authorization.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "authorization.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "autoscaling",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "autoscaling",
        kind: "WatchEvent",
        version: "v2",
      },
      {
        group: "autoscaling",
        kind: "WatchEvent",
        version: "v2beta1",
      },
      {
        group: "autoscaling",
        kind: "WatchEvent",
        version: "v2beta2",
      },
      {
        group: "batch",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "batch",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "certificates.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "certificates.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "certificates.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "coordination.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "coordination.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "discovery.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "discovery.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "events.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "events.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "extensions",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "WatchEvent",
        version: "v1beta2",
      },
      {
        group: "flowcontrol.apiserver.k8s.io",
        kind: "WatchEvent",
        version: "v1beta3",
      },
      {
        group: "imagepolicy.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "internal.apiserver.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "networking.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "networking.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "networking.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "node.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "node.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "node.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "policy",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "policy",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "rbac.authorization.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "rbac.authorization.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "rbac.authorization.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "resource.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha2",
      },
      {
        group: "scheduling.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "scheduling.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "scheduling.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
      {
        group: "storage.k8s.io",
        kind: "WatchEvent",
        version: "v1",
      },
      {
        group: "storage.k8s.io",
        kind: "WatchEvent",
        version: "v1alpha1",
      },
      {
        group: "storage.k8s.io",
        kind: "WatchEvent",
        version: "v1beta1",
      },
    ],
  },
  "io.k8s.apimachinery.pkg.runtime.RawExtension": {
    description:
      'RawExtension is used to hold extensions in external versions.\n\nTo use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.\n\n// Internal package:\n\n\ttype MyAPIObject struct {\n\t\truntime.TypeMeta `json:",inline"`\n\t\tMyPlugin runtime.Object `json:"myPlugin"`\n\t}\n\n\ttype PluginA struct {\n\t\tAOption string `json:"aOption"`\n\t}\n\n// External package:\n\n\ttype MyAPIObject struct {\n\t\truntime.TypeMeta `json:",inline"`\n\t\tMyPlugin runtime.RawExtension `json:"myPlugin"`\n\t}\n\n\ttype PluginA struct {\n\t\tAOption string `json:"aOption"`\n\t}\n\n// On the wire, the JSON will look something like this:\n\n\t{\n\t\t"kind":"MyAPIObject",\n\t\t"apiVersion":"v1",\n\t\t"myPlugin": {\n\t\t\t"kind":"PluginA",\n\t\t\t"aOption":"foo",\n\t\t},\n\t}\n\nSo what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package\'s DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)',
    type: "object",
  },
  "io.k8s.apimachinery.pkg.util.intstr.IntOrString": {
    description:
      "IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.",
    format: "int-or-string",
    type: "string",
  },
  "io.k8s.apimachinery.pkg.version.Info": {
    description:
      "Info contains versioning information. how we'll want to distribute that information.",
    properties: {
      buildDate: {
        type: "string",
      },
      compiler: {
        type: "string",
      },
      gitCommit: {
        type: "string",
      },
      gitTreeState: {
        type: "string",
      },
      gitVersion: {
        type: "string",
      },
      goVersion: {
        type: "string",
      },
      major: {
        type: "string",
      },
      minor: {
        type: "string",
      },
      platform: {
        type: "string",
      },
    },
    required: [
      "major",
      "minor",
      "gitVersion",
      "gitCommit",
      "gitTreeState",
      "buildDate",
      "goVersion",
      "compiler",
      "platform",
    ],
    type: "object",
  },
  "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIService": {
    description:
      'APIService represents a server for a particular GroupVersion. Name must be "version.group".',
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta",
        description:
          "Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
      spec: {
        $ref: "#/definitions/io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceSpec",
        description:
          "Spec contains information for locating and communicating with a server",
      },
      status: {
        $ref: "#/definitions/io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceStatus",
        description: "Status contains derived information about an API server",
      },
    },
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apiregistration.k8s.io",
        kind: "APIService",
        version: "v1",
      },
    ],
  },
  "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceCondition": {
    description:
      "APIServiceCondition describes the state of an APIService at a particular point",
    properties: {
      lastTransitionTime: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.Time",
        description:
          "Last time the condition transitioned from one status to another.",
      },
      message: {
        description:
          "Human-readable message indicating details about last transition.",
        type: "string",
      },
      reason: {
        description:
          "Unique, one-word, CamelCase reason for the condition's last transition.",
        type: "string",
      },
      status: {
        description:
          "Status is the status of the condition. Can be True, False, Unknown.",
        type: "string",
      },
      type: {
        description: "Type is the type of the condition.",
        type: "string",
      },
    },
    required: ["type", "status"],
    type: "object",
  },
  "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceList": {
    description: "APIServiceList is a list of APIService objects.",
    properties: {
      apiVersion: {
        description:
          "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources",
        type: "string",
      },
      items: {
        description: "Items is the list of APIService",
        items: {
          $ref: "#/definitions/io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIService",
        },
        type: "array",
      },
      kind: {
        description:
          "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds",
        type: "string",
      },
      metadata: {
        $ref: "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta",
        description:
          "Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata",
      },
    },
    required: ["items"],
    type: "object",
    "x-kubernetes-group-version-kind": [
      {
        group: "apiregistration.k8s.io",
        kind: "APIServiceList",
        version: "v1",
      },
    ],
  },
  "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceSpec": {
    description:
      "APIServiceSpec contains information for locating and communicating with a server. Only https is supported, though you are able to disable certificate verification.",
    properties: {
      caBundle: {
        description:
          "CABundle is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. If unspecified, system trust roots on the apiserver are used.",
        format: "byte",
        type: "string",
        "x-kubernetes-list-type": "atomic",
      },
      group: {
        description: "Group is the API group name this server hosts",
        type: "string",
      },
      groupPriorityMinimum: {
        description:
          "GroupPriorityMininum is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones. Note that other versions of this group might specify even higher GroupPriorityMininum values such that the whole group gets a higher priority. The primary sort is based on GroupPriorityMinimum, ordered highest number to lowest (20 before 10). The secondary sort is based on the alphabetical comparison of the name of the object.  (v1.bar before v1.foo) We'd recommend something like: *.k8s.io (except extensions) at 18000 and PaaSes (OpenShift, Deis) are recommended to be in the 2000s",
        format: "int32",
        type: "integer",
      },
      insecureSkipTLSVerify: {
        description:
          "InsecureSkipTLSVerify disables TLS certificate verification when communicating with this server. This is strongly discouraged.  You should use the CABundle instead.",
        type: "boolean",
      },
      service: {
        $ref: "#/definitions/io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.ServiceReference",
        description:
          "Service is a reference to the service for this API server.  It must communicate on port 443. If the Service is nil, that means the handling for the API groupversion is handled locally on this server. The call will simply delegate to the normal handler chain to be fulfilled.",
      },
      version: {
        description:
          'Version is the API version this server hosts.  For example, "v1"',
        type: "string",
      },
      versionPriority: {
        description:
          'VersionPriority controls the ordering of this API version inside of its group.  Must be greater than zero. The primary sort is based on VersionPriority, ordered highest to lowest (20 before 10). Since it\'s inside of a group, the number can be small, probably in the 10s. In case of equal version priorities, the version string will be used to compute the order inside a group. If the version string is "kube-like", it will sort above non "kube-like" version strings, which are ordered lexicographically. "Kube-like" versions start with a "v", then are followed by a number (the major version), then optionally the string "alpha" or "beta" and another number (the minor version). These are sorted first by GA > beta > alpha (where GA is a version with no suffix such as beta or alpha), and then by comparing major version, then minor version. An example sorted list of versions: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.',
        format: "int32",
        type: "integer",
      },
    },
    required: ["groupPriorityMinimum", "versionPriority"],
    type: "object",
  },
  "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceStatus": {
    description:
      "APIServiceStatus contains derived information about an API server",
    properties: {
      conditions: {
        description: "Current service state of apiService.",
        items: {
          $ref: "#/definitions/io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceCondition",
        },
        type: "array",
        "x-kubernetes-list-map-keys": ["type"],
        "x-kubernetes-list-type": "map",
        "x-kubernetes-patch-merge-key": "type",
        "x-kubernetes-patch-strategy": "merge",
      },
    },
    type: "object",
  },
  "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.ServiceReference": {
    description: "ServiceReference holds a reference to Service.legacy.k8s.io",
    properties: {
      name: {
        description: "Name is the name of the service",
        type: "string",
      },
      namespace: {
        description: "Namespace is the namespace of the service",
        type: "string",
      },
      port: {
        description:
          "If specified, the port on the service that hosting webhook. Default to 443 for backward compatibility. `port` should be a valid port number (1-65535, inclusive).",
        format: "int32",
        type: "integer",
      },
    },
    type: "object",
  },
};
