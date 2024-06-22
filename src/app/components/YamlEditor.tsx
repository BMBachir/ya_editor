"use client";
import React, { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";

const YamlEditor: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file change and parse YAML content
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setValue(text);
        try {
          const parsedDocuments = parseAllDocuments(text);
          const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
          setJsonObjects(parsedObjects);
        } catch (error) {
          console.error("Error parsing YAML:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Convert YAML to JSON
  const handleYamlToJson = () => {
    try {
      const parsedDocuments = parseAllDocuments(value);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      const json = jsonStringify(parsedObjects, null, 2);
      setValue(json);
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
    }
  };

  // Convert JSON to YAML
  const handleJsonToYaml = () => {
    try {
      const obj = jsonParse(value);
      const yaml = obj.map((item: any) => yamlStringify(item)).join("---\n");
      setValue(yaml);
      setJsonObjects(obj);
    } catch (error) {
      console.error("Error converting JSON to YAML:", error);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Update nested object with new value
  const updateNestedObject = (obj: any, path: string, newValue: any) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = newValue;
  };

  // Handle input change and update JSON object
  const handleInputChange = (index: number, path: string, newValue: any) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updateNestedObject(updated[index], path, newValue);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setValue(updatedYaml);
      return updated;
    });
  };

  // Add nested field in JSON object
  const handleAddNestedField = (index: number, path: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      const nestedPath = `${path}.newField`; // Example: Adjust this based on your actual nested path
      updateNestedObject(updated[index], nestedPath, "");
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setValue(updatedYaml);
      return updated;
    });
  };

  // Add new resource to JSON object
  const handleAddResource = () => {
    setJsonObjects((prev) => [...prev, { spec: {} }]);
  };

  // Delete a resource from JSON object
  const handleDeleteResource = (index: number) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setValue(updatedYaml);
      return updated;
    });
  };

  // Render inputs for nested objects
  const renderInputs = (obj: any, index: number, path = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      return (
        <div key={currentPath} className="mb-2">
          <label
            htmlFor={currentPath}
            className="block text-sm font-medium text-white mt-2"
          >
            {key}:
          </label>
          {typeof value === "object" && value !== null ? (
            <div className="ml-4">
              {renderInputs(value, index, currentPath)}
              <button
                className="btn bg-blue-400 mt-2"
                onClick={() => handleAddNestedField(index, currentPath)}
              >
                Add Field
              </button>
            </div>
          ) : (
            <input
              id={currentPath}
              type="text"
              value={value as string | number | readonly string[] | undefined}
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

  // Handle CodeMirror editor change and update state
  const handleEditorChange = (newValue: string) => {
    setValue(newValue);
    try {
      const parsedDocuments = parseAllDocuments(newValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error parsing YAML:", error);
    }
  };

  return (
    <section>
      <div className="container mt-24 grid grid-cols-1  gap-5 mb-10 ">
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
      </div>

      <div className="flex ">
        <div className="bg-background p-6 w-[700px] flex flex-col gap-6 h-[600px] overflow-auto">
          <div className="flex items-center justify-center gap-5">
            <div>
              <label htmlFor="jsonInput" className="text__para">
                Edit JSON
              </label>
              <div id="jsonInputs" className="flex flex-col gap-4">
                {jsonObjects.map((obj, index) => (
                  <div key={index}>
                    <h3>Document {index + 1}</h3>
                    {renderInputs(obj, index)}
                    <button
                      className="btn w-full bg-red-400"
                      onClick={() => handleDeleteResource(index)}
                    >
                      Delete Resource
                    </button>
                  </div>
                ))}
                <button className="btn" onClick={handleAddResource}>
                  Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center ">
            <CodeMirror
              className=""
              value={value}
              height="600px"
              width="700px"
              theme={oneDark}
              extensions={[yaml()]}
              onChange={handleEditorChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default YamlEditor;
