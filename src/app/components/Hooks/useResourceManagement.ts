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

export const useResourceManagement = (
  setYamlValue: Dispatch<SetStateAction<string>>
) => {
  const [expandedResourceIndex, setExpandedResourceIndex] = useState<
    number | null
  >(null);
  const [jsonObjects, setJsonObjects] = useState<JsonObject[]>([]);

  const handleAddResource = (resourceType: string) => {
    if (!(resourceType in k8sDefinitions)) {
      console.error(`Invalid resource type: ${resourceType}`);
      return;
    }

    const resource = k8sDefinitions[
      resourceType as keyof typeof k8sDefinitions
    ] as KubernetesResource;
    if (!resource.properties) {
      console.error(`No properties found for resource type: ${resourceType}`);
      return;
    }

    const properties = resource.properties;
    const newResource = Object.keys(properties).reduce((acc, key) => {
      const property = properties[key];
      if (key === "kind") {
        acc[key] = getLastWord(resourceType);
      } else if (property.items?.$ref) {
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
    }, {} as JsonObject);

    setJsonObjects((prev) => {
      const updated = [...prev, newResource];
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
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
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
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

      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);

      return updated;
    });
  };

  const handleInputChange = (index: number, path: string, newValue: any) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updateNestedObject(updated[index], path, newValue);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  return {
    jsonObjects,
    expandedResourceIndex,
    setExpandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    handleAddNestedField,
    handleKeyChange,
  };
};
