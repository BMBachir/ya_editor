"use client";
import { useState } from "react";
import {
  updateNestedObject,
  resolveRef,
  getDefaultForType,
  getLastWord,
} from "../UtilityFunctions/utils";
import { k8sDefinitions } from "../data/definitions";
import { stringify as yamlStringify } from "yaml";
import { simpleSchemas } from "../data/schemas";
import yaml from "js-yaml";
type ResourceProperties = {
  [key: string]: {
    type?: string;
    items?: {
      $ref?: string;
    };
    $ref?: string;
  };
};

type KubernetesResource = {
  properties?: ResourceProperties;
};

type JsonObject = {
  [key: string]: any;
};

// Custom Hook for Resource Management
export function useResourceManagement(
  setYamlValue: React.Dispatch<React.SetStateAction<string>>,
  setJsonObjects: React.Dispatch<React.SetStateAction<JsonObject[]>>
) {
  const [expandedResourceIndex, setExpandedResourceIndex] = useState<
    number | null
  >(null);

  {
    /* Handel Add Resource */
  }

  const handleAddResource = (resourceType: string) => {
    if (!(resourceType in simpleSchemas)) {
      console.error(`Invalid resource type: ${resourceType}`);
      return;
    }

    const resource = simpleSchemas[resourceType as keyof typeof simpleSchemas];

    const newResource = { ...resource };

    setJsonObjects((prev) => {
      const updated = [...prev, newResource];
      setYamlValue(yaml.dump(updated)); // Converting JSON to YAML
      return updated;
    });
  };
  const toggleKindVisibility = (index: number) => {
    setExpandedResourceIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleDeleteResource = (index: number) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  const handleAddNestedField = (index: number, path: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      const nestedPath = `${path}.newField`;
      updateNestedObject(updated[index], nestedPath, "");
      setYamlValue(yamlStringify(updated));
      return updated;
    });
  };

  const handleKeyChange = (index: number, oldPath: string, newKey: string) => {
    const editableMetadataKeys = [
      "metadata.name",
      "metadata.namespace",
      "metadata.labels",
      "metadata.annotations",
    ];
    const editableSpecKeys = [
      "spec.replicas",
      "spec.selector",
      "spec.template.metadata",
      "spec.template.metadata.labels",
      "spec.template.metadata.annotations",
      "spec.template.spec.containers",
      "spec.template.spec.containers.name",
      "spec.template.spec.containers.image",
      "spec.template.spec.containers.ports",
      "spec.template.spec.containers.resources",
      "spec.template.spec.containers.env",
      "spec.template.spec.containers.volumeMounts",
      "spec.ports",
      "spec.ports.port",
      "spec.ports.targetPort",
      "spec.ports.nodePort",
      "spec.ports.protocol",
      "data",
    ];

    if (
      !editableMetadataKeys.some((key) => oldPath.startsWith(key)) &&
      !editableSpecKeys.some((key) => oldPath.startsWith(key))
    ) {
      return;
    }

    setJsonObjects((prev) => {
      const updated = [...prev];
      const keys = oldPath.split(".");
      let current: any = updated[index];

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }

      const lastKey = keys[keys.length - 1];
      if (current.hasOwnProperty(lastKey)) {
        const value = current[lastKey];
        delete current[lastKey];
        current[newKey] = value;
      }

      setYamlValue(yamlStringify(updated));

      return updated;
    });
  };

  const handleInputChange = (index: number, path: string, newValue: any) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updateNestedObject(updated[index], path, newValue);
      setYamlValue(yamlStringify(updated));
      return updated;
    });
  };

  return {
    expandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    handleKeyChange,
  };
}
