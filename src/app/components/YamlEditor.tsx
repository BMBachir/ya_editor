"use client";
import React, { useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import { parseAllDocuments, stringify as yamlStringify } from "yaml";
import { parse as jsonParse, stringify as jsonStringify } from "json5";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import NavBar from "./NavBar";
import Stepper from "./Stepper";
import { k8sDefinitions } from "./definitions";
import { FaSearch } from "react-icons/fa";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
// Define types for Kubernetes templates

const numberKeys = [
  "spec.replicas",
  "spec.ports.port",
  "spec.ports.targetPort",
  "spec.ports.nodePort",
  "spec.template.spec.containers.0.ports.0.containerPort",
  "spec.template.spec.containers.0.resources.limits.cpu",
  "spec.template.spec.containers.0.resources.limits.memory",
  "spec.template.spec.containers.0.resources.requests.cpu",
  "spec.template.spec.containers.0.resources.requests.memory",
];

const isNumberKey = (path: string) => {
  const normalizedPath = path.replace(/\[(\d+)\]/g, ".$1");
  return numberKeys.includes(normalizedPath);
};
interface Resource {
  description: string;
  properties?: Record<string, any>;
}

const YamlEditor: React.FC = () => {
  const [yamlValue, setYamlValue] = useState<string>("");
  const [jsonObjects, setJsonObjects] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedResourceIndex, setExpandedResourceIndex] = useState<
    number | null
  >(null);
  const [isYamlToJson, setIsYamlToJson] = useState(true);

  const toggleConvert = () => {
    setIsYamlToJson(!isYamlToJson);
  };

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
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

  const updateNestedObject = (obj: any, path: string, newValue: any) => {
    const keys = path.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = current[keys[i]] || {};
    }
    current[keys[keys.length - 1]] = newValue;
  };

  const handleKeyChange = (index: number, oldPath: string, newKey: string) => {
    const editableMetadataKeys = [
      "metadata.name",
      "metadata.namespace",
      "metadata.labels",
      "metadata.annotations",
    ];
    const editableSpecKeys = [
      "spec.replicas",
      "spec.selector",
      "spec.template.metadata",
      "spec.template.metadata.labels",
      "spec.template.metadata.annotations",
      "spec.template.spec.containers",
      "spec.template.spec.containers.name",
      "spec.template.spec.containers.image",
      "spec.template.spec.containers.ports",
      "spec.template.spec.containers.resources",
      "spec.template.spec.containers.env",
      "spec.template.spec.containers.volumeMounts",
      "spec.ports",
      "spec.ports.port",
      "spec.ports.targetPort",
      "spec.ports.nodePort",
      "spec.ports.protocol",
      "data",
    ];

    if (
      !editableMetadataKeys.some((key) => oldPath.startsWith(key)) &&
      !editableSpecKeys.some((key) => oldPath.startsWith(key))
    ) {
      return;
    }

    setJsonObjects((prev) => {
      const updated = [...prev];
      const keys = oldPath.split(".");
      let current: any = updated[index];

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }

      const lastKey = keys[keys.length - 1];
      if (current.hasOwnProperty(lastKey)) {
        const value = current[lastKey];
        delete current[lastKey];
        current[newKey] = value;
      }

      const updatedYaml = updated
        .map((item) => yamlStringify(item))
        .join("---\n");
      setYamlValue(updatedYaml);

      return updated;
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

  const toggleKindVisibility = (index: number) => {
    setExpandedResourceIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const getDefaultForType = (type: string) => {
    switch (type) {
      case "string":
        return "";
      case "number":
        return 0;
      case "boolean":
        return false;
      case "array":
        return [];
      case "object":
        return {};
      case "integer":
        return 0;
      default:
        return null;
    }
  };

  const handleAddResource = (resourceType: string) => {
    // Ensure resourceType is a valid key of k8sDefinitions
    if (!(resourceType in k8sDefinitions)) {
      console.error(`Invalid resource type: ${resourceType}`);
      return;
    }

    // Extract the resource object with type assertion
    const resource =
      k8sDefinitions[resourceType as keyof typeof k8sDefinitions];

    // Check if the resource has properties
    if (!("properties" in resource)) {
      console.error(`No properties found for resource type: ${resourceType}`);
      return;
    }

    // Access the properties with type assertion
    const properties = resource.properties as {
      [key: string]: { type?: string; items?: any };
    };

    // Create a new resource object with only the properties of the selected kind
    const newResource = Object.keys(properties).reduce((acc, key) => {
      const property = properties[key];
      if (property.items) {
        // If items property exists, initialize it with an empty array
        acc[key] = [];
        // Add nested items key with null value for YAML
        acc[key].push({ items: null });
      } else {
        const propertyType = property.type;
        acc[key] = getDefaultForType(propertyType || "");
      }
      return acc;
    }, {} as { [key: string]: any });

    setJsonObjects((prev) => [...prev, newResource]);

    try {
      const updatedYaml = [
        ...jsonObjects.map((obj) => yamlStringify(obj)),
        yamlStringify(newResource),
      ].join("---\n");
      setYamlValue(updatedYaml);
    } catch (error) {
      console.error("Error updating YAML value:", error);
    }
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
      const inputKey = `${index}-${currentPath}`;
      const isNumber = isNumberKey(currentPath);

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
                  handleKeyChange(index, currentPath, e.target.value)
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
            ) : isNumber ? (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="number"
                  value={value === null ? "" : value} // Ensure value is not null
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      currentPath,
                      Number(e.target.value)
                    )
                  }
                  className="input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-irisBlueColor focus:ring-irisBlueColor sm:text-sm"
                />
              </div>
            ) : (
              <div>
                <input
                  id={`${inputKey}-value`}
                  type="text"
                  value={value === null ? "" : value} // Ensure value is not null
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

  // Extract kind names from k8sDefinitions

  const kinds = Object.keys(k8sDefinitions) as (keyof typeof k8sDefinitions)[];

  // Now kinds will be an array of string literals of the keys in k8sDefinitions
  const getLastWord = (str: string): string => {
    const segments = str.split(".");
    return segments[segments.length - 1];
  };

  {
    /******************************************************************** */
  }

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const filteredSuggestions = kinds.filter((kind) => {
    const resource = k8sDefinitions[
      kind as keyof typeof k8sDefinitions
    ] as Resource;
    return (
      kind.toLowerCase().includes(searchTerm.toLowerCase()) &&
      resource.properties &&
      "kind" in resource.properties
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(getLastWord(suggestion));
    setShowSuggestions(false);
    handleAddResource(suggestion); // Call the function with the selected suggestion
  };
  return (
    <div className="flex bg-gray-900">
      <NavBar />
      <div className="flex flex-col md:flex-row flex-1 ml-64">
        <div className="flex-1 bg-gray-800 overflow-auto custom-scrollbar">
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <div className="container">
              <div className="mt-24 flex flex-col items-center gap-5 mb-10">
                <Stepper />
              </div>
              <div className="flex flex-col md:flex-row flex-1 ">
                <div className="bg-gray-800 p-6 w-full md:w-1/3 flex flex-col rounded-lg gap-6 h-[720px] overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Edit from inputs</h2>
                    <div className="flex gap-5">
                      <>
                        <button
                          className="text-red-500 hover:text-red-600 font-semibold rounded-md shadow-sm"
                          onClick={handleClearYaml}
                        >
                          <MdDeleteOutline className="h-5 w-5" />
                        </button>
                      </>
                    </div>
                  </div>
                  {/*********************************************** */}

                  <div className="flex items-center justify-center w-full flex-wrap md:flex-nowrap gap-4">
                    <div className="w-full max-w-md top-4 left-1/2 ">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => setShowSuggestions(false)}
                          className=" text-gray-400 bg-gray-900 w-full rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-10  "
                        />
                        <div className="text-gray-400 absolute inset-y-0 right-0 flex items-center pr-3">
                          <FaSearch className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="mt-2 rounded-lg bg-background shadow-lg">
                          <ul className="max-h-64 overflow-y-auto">
                            {filteredSuggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="cursor-pointer px-4 py-2 text-sm hover:bg-muted"
                                onMouseDown={() =>
                                  handleSuggestionClick(suggestion)
                                } // Use onMouseDown to avoid closing the suggestion list prematurely
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col">
                                    <span>{getLastWord(suggestion)}</span>
                                    <span className="text-sm text-gray-500">
                                      {getLastWord(suggestion)}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/*********************************************** */}
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
                            className="flex items-center justify-center absolute top-0 left-0 h-full text-[15px] text-gray-100 hover:text-hoverColor cursor-pointer  transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="flex items-center justify-center gap-3">
                              <FaFileUpload className="h-5 w-5" />{" "}
                              <span>Upload YAML</span>
                            </div>
                          </div>
                        </div>

                        <>
                          {isYamlToJson ? (
                            <button
                              className="inline-flex gap-3 items-center justify-center px-6 py-3 text-gray-100 hover:text-hoverColor cursor-pointer transition-colors "
                              onClick={() => {
                                handleYamlToJson();
                                toggleConvert();
                              }}
                            >
                              <GiCardExchange className="h-5 w-5" />
                              YAML to JSON
                            </button>
                          ) : null}

                          {!isYamlToJson ? (
                            <button
                              className="inline-flex gap-3 items-center justify-center px-6 py-3 text-gray-100 hover:text-hoverColor cursor-pointer transition-colors "
                              onClick={() => {
                                handleJsonToYaml();
                                toggleConvert();
                              }}
                            >
                              <GiCardExchange className="h-5 w-5" />
                              JSON to YAML
                            </button>
                          ) : null}
                        </>
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
