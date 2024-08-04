"use client";
import { useState, useRef } from "react";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";
import { updateNestedObject } from "../UtilityFunctions/utils";
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
    path: string,
    refProp: string
  ) => {
    // Split the path into segments
    const segments = path.split(".");
    const lastSegment = segments.pop();

    if (!lastSegment) {
      console.error("Invalid path provided.");
      return;
    }

    // Create a new object to avoid direct mutation
    const newJsonObjects = [...jsonObjects];
    let parentObj = newJsonObjects[resourceIndex];

    // Navigate to the parent object
    for (const segment of segments) {
      if (parentObj[segment]) {
        parentObj = parentObj[segment];
      } else {
        parentObj[segment] = {};
        parentObj = parentObj[segment];
      }
    }

    // Add the new property
    if (parentObj[lastSegment]) {
      parentObj[lastSegment][refProp] = ""; // Initialize with an empty string or any default value
    } else {
      parentObj[lastSegment] = { [refProp]: "" };
    }

    // Update the state
    setJsonObjects(newJsonObjects);

    // Convert updated JSON objects back to YAML
    const updatedYaml = newJsonObjects
      .map((item) => yamlStringify(item))
      .join("---\n");
    setYamlValue(updatedYaml);
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
  };
};
