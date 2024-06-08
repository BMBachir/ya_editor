"use client";
import React, { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";

const YamlEditor: React.FC = () => {
  const [value, setValue] = useState<string>("//Yaml Code ::");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]); // State for storing parsed JSON objects
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file input changes (file selection)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setValue(text);
        try {
          const parsedDocuments = parseAllDocuments(text); // Parse multiple YAML documents
          const parsedObjects = parsedDocuments.map((doc) => doc.toJSON()); // Convert parsed YAML documents to JSON objects
          setJsonObjects(parsedObjects); // Store parsed JSON objects
        } catch (error) {
          console.error("Error parsing YAML:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Function to convert YAML content to JSON and update the states
  const handleYamlToJson = () => {
    try {
      const parsedDocuments = parseAllDocuments(value); // Parse multiple YAML documents
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON()); // Convert parsed YAML documents to JSON objects
      const json = jsonStringify(parsedObjects, null, 2); // Convert JSON objects to formatted JSON string
      setValue(json); // Update the editor content with JSON string
      setJsonObjects(parsedObjects); // Update the JSON objects state
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
    }
  };

  // Function to convert JSON content to YAML and update the states
  const handleJsonToYaml = () => {
    try {
      const obj = jsonParse(value); // Parse JSON string to JSON object
      const yaml = obj.map((item: any) => yamlStringify(item)).join("---\n"); // Convert JSON objects to YAML string
      setValue(yaml); // Update the editor content with YAML string
      setJsonObjects(obj); // Update the JSON objects state
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
    }
  };

  // Function to simulate a click on the hidden file input element
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Utility function to update nested objects
  const updateNestedObject = (obj: any, path: string, value: any) => {
    // Split the path string into an array of keys
    const keys = path.split(".");

    // Start at the top level of the object
    let current = obj;

    // Iterate over the keys, except for the last one
    for (let i = 0; i < keys.length - 1; i++) {
      // If the current key doesn't exist, create an empty object
      current = current[keys[i]] = current[keys[i]] || {};
    }

    // Set the value at the last key
    current[keys[keys.length - 1]] = value;
  };

  // Function to handle changes in the dynamically created input fields
  const handleInputChange = (index: number, path: string, newValue: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev]; // Create a copy of the previous JSON objects array
      updateNestedObject(updated[index], path, newValue); // Update the nested key with the new value
      setValue(updated.map((item) => yamlStringify(item)).join("---\n")); // Update the editor content with the updated YAML string
      return updated; // Return the updated JSON objects array
    });
  };

  // Recursive function to render input fields dynamically based on the keys
  const renderInputs = (obj: any, index: number, path = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      return (
        <div key={currentPath} className="mb-2">
          <label
            htmlFor={currentPath}
            className="block text-sm font-medium text-white"
          >
            {key}
          </label>
          {typeof value === "object" && value !== null ? (
            renderInputs(value, index, currentPath)
          ) : (
            <input
              id={currentPath}
              type="text"
              value={value as string | number | readonly string[] | undefined} // Set the input value with appropriate type assertion
              onChange={(e) =>
                handleInputChange(index, currentPath, e.target.value)
              }
              className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
            />
          )}
        </div>
      );
    });
  };

  return (
    <section>
      <div className="container mt-24 grid grid-cols-1 items-center justify-center gap-5 ">
        <div className="flex items-center justify-center gap-5">
          <div className="relative w-[130px] h-[50px] ">
            <input
              type="file"
              ref={fileInputRef}
              accept=".yaml,.yml"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center
                     px-6 py-2 text-[15px] leading-6 overflow-hidden
                     bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
              onClick={handleButtonClick}
            >
              Upload File
            </label>
          </div>
          <button
            className="btn bg-gray-500 hover:bg-gray-600 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-white dark:focus:ring-gray-300"
            onClick={handleYamlToJson}
          >
            YAML to JSON
          </button>
          <button
            className="btn bg-gray-500 hover:bg-gray-600 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-white dark:focus:ring-gray-300"
            onClick={handleJsonToYaml}
          >
            JSON to YAML
          </button>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div>
            <label htmlFor="jsonInput" className="text__para">
              Edit JSON
            </label>
            <div id="jsonInputs">
              {jsonObjects.map((obj, index) => (
                <div key={index}>
                  <h3>Document {index + 1}</h3>
                  {renderInputs(obj, index)}
                  JSON object
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <CodeMirror
              className=""
              value={value}
              height="1200px"
              width="400px"
              theme={oneDark}
              extensions={[yaml()]}
              onChange={(value) => setValue(value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default YamlEditor;
