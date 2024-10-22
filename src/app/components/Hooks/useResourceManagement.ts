"use client";
import { useState } from "react";
import { updateNestedObject } from "../UtilityFunctions/utils";
import { stringify as yamlStringify } from "yaml";
import { simpleSchemas } from "../data/schemas";
import yaml from "js-yaml";

type JsonObject = {
  [key: string]: any;
};

interface TabState {
  id: number;
  title: string;
  value?: string;
}

// Custom Hook for Resource Management
export function useResourceManagement(
  setYamlValue: (tabId: number, title: string, value: string) => void,
  setJsonObjects: React.Dispatch<React.SetStateAction<JsonObject[]>>,
  activeTab: number,
  setTabs: React.Dispatch<React.SetStateAction<TabState[]>>
) {
  const [expandedResourceIndex, setExpandedResourceIndex] = useState<
    number | null
  >(null);

  {
    /* Handel Add Resource */
  }

  const handleAddResource = (resourceType: string) => {
    // Check if the resource type is valid
    if (!(resourceType in simpleSchemas)) {
      console.error(`Invalid resource type: ${resourceType}`);
      return;
    }

    // Retrieve the resource schema from simpleSchemas
    const resource = simpleSchemas[resourceType as keyof typeof simpleSchemas];

    // Create a new resource object by copying the resource schema
    const newResource = { ...resource };

    // Update the active tab's content only
    setTabs((prevTabs) => {
      return prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          // Parse the existing content of the active tab to JSON
          const currentContent = yaml.load(tab.value || "[]") as any[];

          // Add the new resource to the parsed content
          const updatedContent = [...currentContent, newResource];

          // Convert the updated content back to YAML and update the tab's value
          const updatedYaml = yaml.dump(updatedContent);

          // Update the tab's value (content)
          setYamlValue(activeTab, tab.title, updatedYaml);

          // Update the JSON state for the active tab
          setJsonObjects(updatedContent);

          // Return the updated tab with new content
          return { ...tab, value: updatedYaml };
        }

        // Return other tabs as they are
        return tab;
      });
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
      setYamlValue(activeTab, `Tab ${activeTab}`, updatedYaml);
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
      const updated = [...prev]; // Copy previous JSON objects
      updateNestedObject(updated[index], path, newValue); // Update nested object at the specified index

      const updatedYaml = updated
        .map((item) => yamlStringify(item)) // Convert each JSON object back to YAML
        .join("---\n"); // Combine YAML documents

      // Update the YAML content of the active tab in yamlValues
      setYamlValue(activeTab, `Tab ${activeTab}`, updatedYaml);

      // Sync tabs with updated yamlValues
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab
            ? { ...tab, value: updatedYaml } // Update the active tab with the new YAML
            : tab
        )
      );

      return updated; // Return the updated JSON objects
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

  // Handle deleting a specific label within a resource
  const handleDeleteLabel = (index: number, label: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      if (updated[index][label]) {
        delete updated[index][label];
      }
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(activeTab, `Tab ${activeTab}`, updatedYaml);
      return updated;
    });
  };

  // Handle adding a reference property to a resource
  const handleAddRefProp = (index: number, refProp: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev]; // Copy previous JSON objects

      // Add refProp if it doesn't exist in the current object
      if (!updated[index][refProp]) {
        updated[index][refProp] = ""; // Add the new property with an empty string
      }

      // Convert updated jsonObjects back to YAML
      const updatedYaml = updated
        .map((item) => yamlStringify(item)) // Convert each JSON object to YAML
        .join("---\n"); // Join them with "---" separator for multiple YAML docs

      // Update the YAML content of the active tab in yamlValues
      setYamlValue(activeTab, `Tab ${activeTab}`, updatedYaml);

      // Ensure the active tab is updated with the new YAML value in `tabs`
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab ? { ...tab, value: updatedYaml } : tab
        )
      );
      // Return the updated JSON objects
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
    filterPropertiesRecursively,
    handleDeleteLabel,
    handleAddRefProp,
  };
}
