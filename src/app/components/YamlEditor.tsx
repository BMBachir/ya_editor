"use client";
import React, { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";
import { MdDeleteForever } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";

const YamlEditor: React.FC = () => {
  const [yamlValue, setYamlValue] = useState<string>("");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file change and parse YAML content
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setYamlValue(text);
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
      const parsedDocuments = parseAllDocuments(yamlValue);
      const parsedObjects = parsedDocuments.map((doc) => doc.toJSON());
      const json = jsonStringify(parsedObjects, null, 2);
      setYamlValue(json);
      setJsonObjects(parsedObjects);
    } catch (error) {
      console.error("Error converting YAML to JSON:", error);
    }
  };

  // Convert JSON to YAML
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

  // Clear YAML content
  const handleClearYaml = () => {
    setYamlValue("");
    setJsonObjects([]);
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
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  // Function to handle key change
  const handleKeyChange = (index: number, oldKey: string, newKey: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updateNestedKey(updated[index], oldKey, newKey);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  // Function to update nested key in the object
  const updateNestedKey = (obj: any, oldKey: string, newKey: string) => {
    const value = obj[oldKey];
    delete obj[oldKey];
    obj[newKey] = value;
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
      setYamlValue(updatedYaml);
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
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  // Render inputs for nested objects
  const renderInputs = (obj: any, index: number, path = "") => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];

      if (typeof key !== "string") {
        return null;
      }

      const currentPath = path ? `${path}.${key}` : key;

      return (
        <div key={currentPath} className="mb-2 flex-1">
          <div className="">
            <label
              htmlFor={`${currentPath}-key`}
              className="block text-sm font-medium text-white mt-2"
            >
              Key:
            </label>
            <input
              id={`${currentPath}-key`}
              type="text"
              value={key}
              onChange={(e) => handleKeyChange(index, key, e.target.value)}
              className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
            />
          </div>
          <div className="">
            <label
              htmlFor={`${currentPath}-value`}
              className="block text-sm font-medium text-white mt-2"
            >
              Value:
            </label>
            {typeof value === "object" && value !== null ? (
              <div className="ml-4">
                {renderInputs(value, index, currentPath)}
                <button
                  className="btn bg-blue-400 mt-2"
                  onClick={() => handleAddNestedField(index, currentPath)}
                >
                  <IoIosAdd />
                </button>
              </div>
            ) : (
              <div className="">
                <input
                  id={`${currentPath}-value`}
                  type="text"
                  value={
                    value as string | number | readonly string[] | undefined
                  }
                  onChange={(e) =>
                    handleInputChange(index, currentPath, e.target.value)
                  }
                  className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // Handle CodeMirror editor change and update state
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
              <div className="flex justify-between items-center mb-4 gap-10">
                <h2 className="text__para">Edit JSON</h2>
                <button
                  className="btn bg-red-400 px-4 py-2 text-white font-semibold rounded-md shadow-sm hover:bg-red-500"
                  onClick={handleClearYaml}
                >
                  <MdDeleteForever />
                </button>
              </div>
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
              value={yamlValue}
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
