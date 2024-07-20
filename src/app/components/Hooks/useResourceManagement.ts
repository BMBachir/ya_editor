"use client";
import { useState, Dispatch, SetStateAction } from "react";
import {
  updateNestedObject,
  resolveRef,
  getDefaultForType,
  getLastWord,
} from "../UtilityFunctions/utils";
import { k8sDefinitions } from "../data/definitions";
import { stringify as yamlStringify } from "yaml";

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

  const handleAddResource = (resourceType: string) => {
    if (!(resourceType in k8sDefinitions)) {
      console.error(`Invalid resource type: ${resourceType}`);
      return;
    }

    const resource =
      k8sDefinitions[resourceType as keyof typeof k8sDefinitions];

    if (!("properties" in resource)) {
      console.error(`No properties found for resource type: ${resourceType}`);
      return;
    }

    const properties = resource.properties as {
      [key: string]: { type?: string; items?: any; $ref?: string };
    };

    const newResource = Object.keys(properties).reduce((acc, key) => {
      const property = properties[key];
      if (key === "kind") {
        acc[key] = getLastWord(resourceType);
      } else if (property.items && property.items.$ref) {
        const refValue = property.items.$ref.replace("#/definitions/", "");
        acc[key] = [resolveRef(refValue)];
      } else if (property.$ref) {
        const refValue = property.$ref.replace("#/definitions/", "");
        acc[key] = resolveRef(refValue);
      } else {
        const propertyType = property.type;
        acc[key] = getDefaultForType(propertyType || "");
      }
      return acc;
    }, {} as { [key: string]: any });

    setJsonObjects((prev) => {
      const updated = [...prev, newResource];
      setYamlValue(yamlStringify(updated));
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
      updated.splice(index, 1); // Remove the resource at the specified index
      setYamlValue(yamlStringify(updated));
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
