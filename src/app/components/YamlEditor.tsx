"use client";
import React, { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";
import { MdDeleteForever } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import NavBar from "./NavBar";

const YamlEditor: React.FC = () => {
  const [yamlValue, setYamlValue] = useState<string>(":::::YAML:::::");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

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

    // Reset file input value to allow the same file to be uploaded again
    event.target.value = ""; //
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const updateNestedObject = (obj: any, path: string, newValue: any) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = newValue;
  };

  const updateNestedKey = (obj: any, oldPath: string, newKey: string) => {
    const keys = oldPath.split(".");
    const lastKey = keys.pop();

    if (!lastKey) return;

    const parent = keys.reduce((acc, key) => {
      return (acc[key] = acc[key] || {});
    }, obj);

    if (parent && lastKey in parent) {
      parent[newKey] = parent[lastKey];
      delete parent[lastKey];
    }
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

  const handleAddResource = () => {
    setJsonObjects((prev) => [...prev, { spec: {} }]);
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

  const handleKeyChange = (index: number, oldPath: string, newKey: string) => {
    setJsonObjects((prev) => {
      // Create a deep copy of the array to avoid mutating state directly
      const updated = [...prev];

      // Retrieve the object at the specified index
      const updatedObj = { ...updated[index] };

      // Function to update nested keys in an object
      const updateNestedKey = (obj: any, path: string, newKey: string) => {
        const keys = path.split(".");
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] = current[keys[i]] || {};
        }
        current[newKey] = current[keys[keys.length - 1]];
        delete current[keys[keys.length - 1]];
      };

      // Update the nested key in the copied object
      updateNestedKey(updatedObj, oldPath, newKey);

      // Update the object at the specified index in the copied array
      updated[index] = updatedObj;

      // Convert the updated array to YAML string for display
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");

      // Update the state with the updated array and YAML string
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  const renderInputs = (obj: any, index: number, path = "") => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      // Use a unique key for each input based on its path
      const inputKey = `${index}-${currentPath}`;

      return (
        <div key={inputKey} className="mb-2 flex-1">
          <div>
            <label
              htmlFor={`${inputKey}-key`}
              className="block text-sm font-medium text-white mt-2"
            >
              Key:
            </label>
            <div>
              <input
                id={`${inputKey}-key`}
                type="text"
                value={key}
                onChange={(e) =>
                  handleKeyChange(
                    index,
                    path ? `${path}.${key}` : key,
                    e.target.value
                  )
                }
                className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor={`${inputKey}-value`}
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
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="text"
                  value={value}
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
    <div className="flex bg-gray-900">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ml-64">
        <div className="flex-1 bg-gray-800 overflow-auto custom-scrollbar">
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <div className="container">
              <div className="mt-24 flex flex-col items-center gap-5 mb-10">
                <div className="flex items-center justify-center gap-5">
                  <div className="relative w-[130px] h-[50px]">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".yaml,.yml"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <button
                      className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-6 py-2 text-[15px] leading-6 bg-gray-200 text-gray-900 hover:text-gray-200 hover:bg-gray-800 font-semibold rounded-lg cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload File
                    </button>
                  </div>
                  <button
                    className="btn bg-gray-500 hover:bg-gray-600 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={handleYamlToJson}
                  >
                    YAML to JSON
                  </button>
                  <button
                    className="btn bg-gray-500 hover:bg-gray-600 inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    onClick={handleJsonToYaml}
                  >
                    JSON to YAML
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row flex-1 ">
                {/****************************** */}
                <div className="bg-gray-800 p-6 w-full md:w-1/3 flex flex-col rounded-lg gap-6 h-[720px] overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit from inputs</h2>
                    <button
                      className="btn bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-semibold rounded-md shadow-sm"
                      onClick={handleClearYaml}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                  <div id="jsonInputs" className="flex flex-col gap-4">
                    {jsonObjects.map((obj, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={toggleNavVisibility}
                        >
                          <h3 className="text-lg font-medium mb-2">
                            Document {index + 1}
                          </h3>
                          <span>{isNavVisible ? "-" : "+"}</span>
                        </div>
                        {isNavVisible && (
                          <div className="rounded-md">
                            {renderInputs(obj, index)}
                            <button
                              className="btn bg-red-400 hover:bg-red-500 w-full mt-2"
                              onClick={() => handleDeleteResource(index)}
                            >
                              Delete Resource
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      className="btn bg-blue-500 hover:bg-blue-600 w-full mt-4"
                      onClick={handleAddResource}
                    >
                      Add Resource
                    </button>
                  </div>
                </div>
                {/****************************** */}
                <div className="flex-1 ml-7 bg-gray-800">
                  <div className="flex items-center justify-center">
                    <CodeMirror
                      value={yamlValue}
                      height="720px"
                      theme={oneDark}
                      extensions={[yaml()]}
                      onChange={handleEditorChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YamlEditor;
