"use client";
import React, { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { FaFileUpload } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import NavBar from "./NavBar";
import Stepper from "./Stepper";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";

// Define types for Kubernetes templates
type KubernetesTemplate = {
  kind: string;
  metadata: {
    name: string;
    namespace: string;
  };
  spec?: any;
  data?: any;
};

type KubernetesTemplates = {
  Service: KubernetesTemplate;
  Deployment: KubernetesTemplate;
  ConfigMap: KubernetesTemplate;
};

const kubernetesTemplates: KubernetesTemplates = {
  Service: {
    kind: "Service",
    metadata: {
      name: "example-service",
      namespace: "default",
    },
    spec: {
      selector: {
        app: "example",
      },
      ports: [
        {
          port: 80,
          targetPort: 8080,
        },
      ],
    },
  },
  Deployment: {
    kind: "Deployment",
    metadata: {
      name: "example-deployment",
      namespace: "default",
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: "example",
        },
      },
      template: {
        metadata: {
          labels: {
            app: "example",
          },
        },
        spec: {
          containers: [
            {
              name: "example-container",
              image: "nginx:latest",
              ports: [
                {
                  containerPort: 80,
                },
              ],
            },
          ],
        },
      },
    },
  },
  ConfigMap: {
    kind: "ConfigMap",
    metadata: {
      name: "example-configmap",
      namespace: "default",
    },
    data: {
      "example.property.1": "value-1",
      "example.property.2": "value-2",
    },
  },
};

const YamlEditor: React.FC = () => {
  const [yamlValue, setYamlValue] = useState<string>(":::::YAML:::::");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedResourceIndex, setExpandedResourceIndex] = useState<
    number | null
  >(null);
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle file upload and parse YAML
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

  // Function to convert YAML to JSON
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

  // Function to convert JSON to YAML
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

  // Function to clear YAML editor
  const handleClearYaml = () => {
    setYamlValue("");
    setJsonObjects([]);
  };

  // Function to handle adding a new nested field
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

  // Function to update nested object
  const updateNestedObject = (obj: any, path: string, newValue: any) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = newValue;
  };

  // Function to handle key change in nested objects
  const handleKeyChange = (index: number, oldPath: string, newKey: string) => {
    setJsonObjects((prev) => {
      const updated = [...prev];
      const updatedObj = { ...updated[index] };
      const updateNestedKey = (obj: any, path: string, newKey: string) => {
        const keys = path.split(".");
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] = current[keys[i]] || {};
        }
        current[newKey] = current[keys[keys.length - 1]];
        delete current[keys[keys.length - 1]];
      };
      updateNestedKey(updatedObj, oldPath, newKey);
      updated[index] = updatedObj;
      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);
      return updated;
    });
  };

  // Function to handle editor change in CodeMirror
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

  // Function to toggle visibility of kind in YAML editor
  const toggleKindVisibility = (index: number) => {
    setExpandedResourceIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  // Function to handle adding a new Kubernetes resource
  const handleAddResource = (resourceType: keyof KubernetesTemplates) => {
    const newResource = kubernetesTemplates[resourceType];
    setJsonObjects((prev) => [...prev, { ...newResource }]);
    try {
      const updatedYaml = [
        ...jsonObjects.map((obj) => yamlStringify(obj)),
        yamlStringify({ ...newResource }),
      ].join("---s\n");
      setYamlValue(updatedYaml);
    } catch (error) {
      console.error("Error updating YAML value:", error);
    }
  };

  // Function to handle deleting a resource
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

  // Function to render input fields recursively
  const renderInputs = (obj: any, index: number, path = "") => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
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

  // Function to handle input change in nested fields
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

  return (
    <div className="flex bg-gray-900">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ml-64">
        <div className="flex-1 bg-gray-800 overflow-auto custom-scrollbar">
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <div className="container">
              <div className="mt-24 flex flex-col items-center gap-5 mb-10"></div>
              <Stepper />
              <div className="flex flex-col md:flex-row flex-1 ">
                {/****************************** */}
                <div className="bg-gray-800 p-6 w-full md:w-1/3 flex flex-col rounded-lg gap-6 h-[720px] overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit from inputs</h2>
                    <div className="flex gap-5">
                      <></>
                      <button
                        className=" text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm"
                        onClick={handleClearYaml}
                      >
                        <MdDeleteOutline className="h-5 w-5" />
                      </button>

                      <div className="mt-1">
                        <Dropdown backdrop="blur">
                          <DropdownTrigger>
                            <button className=" text-green-400 hover:text-green-400 font-semibold rounded-md shadow-sm">
                              <IoAdd className="h-5 w-5" />
                            </button>
                          </DropdownTrigger>
                          <DropdownMenu
                            variant="faded"
                            aria-label="Static Actions"
                            className=" text-gray-900"
                          >
                            <DropdownItem
                              key="new"
                              onClick={() => {
                                handleAddResource("Deployment");
                              }}
                            >
                              Service
                            </DropdownItem>
                            <DropdownItem
                              key="copy"
                              onClick={() => {
                                handleAddResource("Deployment");
                                togglePopup();
                              }}
                            >
                              Deployment
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              onClick={() => {
                                handleAddResource("ConfigMap");
                              }}
                            >
                              ConfigMap
                            </DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              color="danger"
                            >
                              Close
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <div id="jsonInputs" className="flex flex-col gap-4">
                    {jsonObjects.map((obj, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleKindVisibility(index)}
                        >
                          <h3 className="text-lg font-medium mb-2">
                            Kind: {obj.kind || "Unknown"}
                          </h3>
                          <span>
                            {expandedResourceIndex === index ? "-" : "+"}
                          </span>
                        </div>
                        {expandedResourceIndex === index && (
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
                  </div>
                </div>
                {/****************************** */}
                <div className="flex-1 ml-7 bg-gray-800">
                  <div className="flex flex-col items-center justify-center">
                    <CodeMirror
                      value={yamlValue}
                      height="680px"
                      theme={oneDark}
                      extensions={[yaml()]}
                      onChange={handleEditorChange}
                      className="w-full"
                    />
                    <div>
                      <div className="flex items-center justify-center gap-5">
                        <div className="relative w-[130px] h-[50px]">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept=".yaml,.yml"
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                          />
                          <div
                            className="flex items-center justify-center absolute top-0 left-0 h-full text-[15px] text-gray-100 hover:text-hoverColor cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="flex items-center justify-center gap-3">
                              <FaFileUpload className="h-5 w-5" />{" "}
                              <span>Upload YAML</span>
                            </div>
                          </div>
                        </div>
                        <GiCardExchange />
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
