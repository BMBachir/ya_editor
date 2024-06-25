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

  const handleKeyChange = (index: number, oldPath: string, newPath: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      updateNestedKey(updated[index], oldPath, newPath);
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  const updateNestedKey = (obj: any, oldPath: string, newKey: string) => {
    const keys = oldPath.split(".");
    const lastKey = keys.pop();
    if (!lastKey) return;

    const parent = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);

    if (parent && parent.hasOwnProperty(lastKey)) {
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

  const renderInputs = (obj: any, index: number, path = "") => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      return (
        <div key={currentPath} className="mb-2 flex-1 ">
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
              onChange={(e) => {
                const newKey = e.target.value;
                handleKeyChange(
                  index,
                  currentPath,
                  newKey ? `${path}.${newKey}` : newKey
                );
              }}
              className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
            />
          </div>
          <div>
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
              <div>
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
    <section className="flex flex-col min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="container">
        <div className=" mt-24 flex flex-col items-center gap-5 mb-10">
          <div className="flex items-center justify-center gap-5">
            <div className="relative w-[130px] h-[50px]">
              <input
                type="file"
                ref={fileInputRef}
                accept=".yaml,.yml"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <label
                htmlFor="customFile"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center
                         px-6 py-2 text-[15px] leading-6 overflow-hidden
                         bg-gray-200 text-gray-900 hover:text-gray-200 hover:bg-gray-800 font-semibold rounded-lg truncate cursor-pointer"
                onClick={handleButtonClick}
              >
                Upload File
              </label>
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

        <div className="flex flex-col md:flex-row flex-1">
          <div className="bg-gray-800 p-6 w-full md:w-1/3 flex flex-col gap-6 h-[600px] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit JSON</h2>
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
                  <h3 className="text-lg font-medium mb-2">
                    Document {index + 1}
                  </h3>
                  <div className="rounded-md">{renderInputs(obj, index)}</div>
                  <button
                    className="btn bg-red-400 hover:bg-red-500 w-full mt-2"
                    onClick={() => handleDeleteResource(index)}
                  >
                    Delete Resource
                  </button>
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
          <div className="flex-1 pl-5 bg-gray-800">
            <div className="flex items-center justify-center ">
              <CodeMirror
                value={yamlValue}
                height="580px"
                theme={oneDark}
                extensions={[yaml()]}
                onChange={handleEditorChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YamlEditor;
