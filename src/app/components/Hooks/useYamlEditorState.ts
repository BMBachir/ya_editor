"use client";
import { useState, useRef } from "react";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";
interface Tab {
  id: number;
  title: string;
  content?: string;
}
interface TabState {
  id: number;
  title: string;
  value?: string;
}
export const useYamlEditorState = (
  activeTabId: number,
  tabs: TabState[],
  setTabs: React.Dispatch<React.SetStateAction<TabState[]>>,
  yamlValues: Tab[],
  setYamlValue: (tabId: number, title: string, value: string) => void
) => {
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const [isYamlToJson, setIsYamlToJson] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to get YAML value for a specific tab
  const getYamlValue = (tabId: number) => {
    return yamlValues[tabId] || "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;

        setYamlValue(activeTabId, `Tab ${activeTabId}`, text);
        try {
          const parsedDocuments = parseAllDocuments(text);
          const parsedObjects = parsedDocuments.map((doc) => {
            const obj = doc.toJSON();
            obj.kind = obj.kind || "Unknown";
            return obj;
          });
          setJsonObjects(parsedObjects);
        } catch (error) {
          console.error("Error parsing YAML:", error);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  {
    /* 
  const handleYamlToJson = () => {
    try {
      const parsedDocuments = parseAllDocuments(yamlValues[1]); // Use active tab ID here
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      const json = jsonStringify(parsedObjects, null, 2);
      setYamlValue(1, json); // Set JSON as YAML in the active tab
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
    }
  };*/
  }
  {
    /* 
  const handleJsonToYaml = () => {
    try {
      const obj = jsonParse(yamlValues[1]); // Use active tab ID here
      const yamlString = yamlStringify(obj);
      setYamlValue(1, yamlString); // Set YAML in the active tab
      setJsonObjects(obj);
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
    }
  };*/
  }

  const handleClearYaml = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, value: "" } : tab
      )
    );
    setJsonObjects([]);
  };

  const updateNestedObject = (obj: any, path: string, newValue: any) => {
    const keys = path.split(".");
    let current = obj;

    // Traverse through the path to update the nested value
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {}; // Create the key if it doesn't exist
      }
      current = current[key]; // Move deeper into the object
    }

    // Update the final key with the new value
    current[keys[keys.length - 1]] = newValue;
  };

  const handleEditorChange = (id: number, newValue: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, value: newValue } : tab))
    );

    // Update the YAML value in the active tab
    if (id === activeTabId) {
      setYamlValue(activeTabId, `Tab ${activeTabId}`, newValue);
    }

    try {
      // Parse the YAML content into JSON
      const parsedDocuments = parseAllDocuments(newValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());

      // Update the state with parsed JSON objects
      setJsonObjects(parsedObjects);
    } catch (error) {
      // Log any parsing errors
      console.error("Error parsing YAML:", error);
    }
  };

  const handleAddRefProp = (
    resourceIndex: number,
    selectedKey: string,
    refProp: string
  ) => {
    // Split the selectedKey into segments
    const segments = selectedKey.split(".");
    const lastSegment = segments.pop(); // The property to which we want to add new properties

    if (!lastSegment) {
      console.error("Invalid selectedKey provided.");
      return;
    }

    // Create a new object to avoid direct mutation of the existing state
    const newJsonObjects = [...jsonObjects];
    let parentObj = newJsonObjects[resourceIndex];

    // Navigate to the parent object where the property should be added
    for (const segment of segments) {
      if (!parentObj[segment]) {
        parentObj[segment] = {}; // Create a new object if it doesn't exist
      }
      parentObj = parentObj[segment];
    }

    // Add the new property
    parentObj[lastSegment] = {
      ...parentObj[lastSegment], // Preserve existing properties
      [refProp]: "", // Initialize with an empty string or any default value
    };

    // Update the state with the new JSON objects
    setJsonObjects(newJsonObjects);

    // Convert updated JSON objects back to YAML and update the editor value
    const updatedYaml = newJsonObjects
      .map((item) => yamlStringify(item))
      .join("---\n");

    // Assuming you have a way to determine which tab is active, use activeTabId here:
    setYamlValue(activeTabId, `Tab ${activeTabId}`, updatedYaml); // Update YAML for the current active tab
  };

  const handleDeleteLabel = (index: number, path: string, key: string) => {
    const parts = path.split(".");
    let updatedObj = { ...jsonObjects[index] }; // Clone the object

    let obj: any = updatedObj;
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];

      // If at any point the object path doesn't exist, exit early
      if (obj === undefined || obj === null) {
        return;
      }
    }

    // Delete the specific key from the labels object
    if (obj && typeof obj === "object") {
      delete obj[parts[parts.length - 1]][key];
    }

    // Update the state with the modified object
    const updatedJsonObjects = [...jsonObjects];
    updatedJsonObjects[index] = updatedObj;

    setJsonObjects(updatedJsonObjects);

    // Convert the updated JSON objects back to YAML and update the editor value
    const updatedYaml = updatedJsonObjects
      .map((item) => yamlStringify(item))
      .join("---\n");
    setYamlValue(activeTabId, `Tab ${activeTabId}`, updatedYaml);
  };

  return {
    yamlValues,
    setYamlValue,
    getYamlValue,
    jsonObjects,
    setJsonObjects,
    isYamlToJson,
    setIsYamlToJson,
    fileInputRef,
    handleFileChange,
    // handleYamlToJson,
    // handleJsonToYaml,
    handleClearYaml,
    handleEditorChange,
    handleAddRefProp,
    handleDeleteLabel,
  };
};
