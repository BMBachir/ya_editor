"use client";
import { useState, useRef } from "react";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";

export const useYamlEditorState = () => {
  const [yamlValue, setYamlValue] = useState<string>("");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const [isYamlToJson, setIsYamlToJson] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setYamlValue(text);
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

  const handleYamlToJson = () => {
    try {
      const parsedDocuments = parseAllDocuments(yamlValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      const json = jsonStringify(parsedObjects, null, 2);
      setYamlValue(json);
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
    }
  };

  const handleJsonToYaml = () => {
    try {
      const obj = jsonParse(yamlValue);
      const yamlString = obj
        .map((item: any) => yamlStringify(item))
        .join("---\n");
      setYamlValue(yamlString);
      setJsonObjects(obj);
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
    }
  };

  const handleClearYaml = () => {
    setYamlValue("");
    setJsonObjects([]);
  };
  const handleEditorChange = (newValue: string) => {
    setYamlValue(newValue);
    try {
      const parsedDocuments = parseAllDocuments(newValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error parsing YAML:", error);
    }
  };

  const handleAddRefProp = (
    resourceIndex: number,
    selectedKey: string, // Updated parameter name
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
      if (parentObj[segment]) {
        parentObj = parentObj[segment];
      } else {
        parentObj[segment] = {}; // Create a new object if it doesn't exist
        parentObj = parentObj[segment];
      }
    }

    // Add the new property
    if (parentObj[lastSegment]) {
      parentObj[lastSegment][refProp] = ""; // Initialize with an empty string or any default value
    } else {
      parentObj[lastSegment] = { [refProp]: "" };
    }

    // Update the state with the new JSON objects
    setJsonObjects(newJsonObjects);

    // Convert updated JSON objects back to YAML and update the editor value
    const updatedYaml = newJsonObjects
      .map((item) => yamlStringify(item))
      .join("---\n");
    setYamlValue(updatedYaml);
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
    setYamlValue(updatedYaml);
  };

  const handleInputChange = (index: number, path: string, newValue: any) => {
    const parts = path.split(".");
    const updatedObjects = [...jsonObjects]; // Copy the current state

    let obj: any = updatedObjects[index];
    for (let i = 0; i < parts.length - 1; i++) {
      if (obj[parts[i]] === undefined) {
        obj[parts[i]] = {}; // Create empty object if undefined
      }
      obj = obj[parts[i]];
    }

    obj[parts[parts.length - 1]] = newValue;

    // Update state with new jsonObjects array
    setJsonObjects(updatedObjects);
  };

  return {
    yamlValue,
    setYamlValue,
    jsonObjects,
    setJsonObjects,
    isYamlToJson,
    setIsYamlToJson,
    fileInputRef,
    handleFileChange,
    handleYamlToJson,
    handleJsonToYaml,
    handleClearYaml,
    handleEditorChange,
    handleAddRefProp,
    handleDeleteLabel,
    handleInputChange,
  };
};
