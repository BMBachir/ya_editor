"use client";
import { useState } from "react";
import { updateNestedObject } from "../UtilityFunctions/utils";
import { stringify as yamlStringify } from "yaml";
import { simpleSchemas } from "../data/schemas";
import yaml from "js-yaml";

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

  const handleKeyChange = (
    index: number,
    oldPath: string,
    newKey: string
  ) => {};

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

  const filterPropertiesRecursively = (
    obj: any,
    searchTerm: string,
    path = ""
  ): string[] => {
    const result: string[] = [];

    if (typeof obj === "object" && obj !== null) {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
          result.push(currentPath);
        }

        if (typeof value === "object") {
          const nestedResults = filterPropertiesRecursively(
            value,
            searchTerm,
            currentPath
          );
          if (nestedResults.length > 0) {
            result.push(...nestedResults);
          }
        }
      }
    }

    return result;
  };

  return {
    expandedResourceIndex,
    handleAddResource,
    toggleKindVisibility,
    handleDeleteResource,
    handleInputChange,
    handleKeyChange,
    filterPropertiesRecursively,
  };
}
